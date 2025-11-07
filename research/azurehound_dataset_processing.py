#this script is processing the azurehound_example.json dataset that was taken from bloodhound and storing it in neo4j database as a graph.



import json
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv
load_dotenv()
uri =os.getenv('URI')
username = os.getenv('USERNAME')
password = os.getenv('PASSWORD')
if not uri:
    raise ValueError("Missing 'URI' environment variable. Please check your .env file.")
if not username:
    raise ValueError("Missing 'USERNAME' environment variable. Please check your .env file.")
if not password:
    raise ValueError("Missing 'PASSWORD' environment variable. Please check your .env file.")

print(uri)
print(username)
print(password)
driver = GraphDatabase.driver(uri, auth=(username, password))

with open("datasets/azurehound_example.json", "r") as f:
    data = json.load(f)["data"]

def create_graph(tx, record):
    kind = record["kind"]
    obj = record["data"]

    if kind == "AZTenant":
        tx.run("""
            MERGE (t:Tenant {tenantId:$tenantId})
            SET t.name = $displayName,
                t.country = $countryCode,
                t.domains = $domains,
                t.tenantType = $tenantType
            """, tenantId=obj["tenantId"],
                 displayName=obj["displayName"],
                 countryCode=obj.get("countryCode", "Unknown"),
                 domains=obj.get("domains", []),
                 tenantType=obj.get("tenantType", "Unknown")
        )

    elif kind == "AZDevice":
        tx.run("""
            MERGE (d:Device {deviceId:$deviceId})
            SET d.hostname = $displayName,
                d.os = $operatingSystem,
                d.version = $operatingSystemVersion,
                d.model = $model,
                d.manufacturer = $manufacturer,
                d.isManaged = coalesce($isManaged, false),
                d.trustType = $trustType,
                d.lastSignIn = $lastSignIn
            """,
            deviceId=obj["deviceId"],
            displayName=obj["displayName"],
            operatingSystem=obj.get("operatingSystem"),
            operatingSystemVersion=obj.get("operatingSystemVersion"),
            model=obj.get("model"),
            manufacturer=obj.get("manufacturer"),
            isManaged=obj.get("isManaged"),
            trustType=obj.get("trustType"),
            lastSignIn=obj.get("approximateLastSignInDateTime")
        )

        tx.run("""
            MATCH (d:Device {deviceId:$deviceId})
            MATCH (t:Tenant {tenantId:$tenantId})
            MERGE (d)-[:BELONGS_TO]->(t)
            """, deviceId=obj["deviceId"], tenantId=obj["tenantId"])

        if obj.get("trustType") == "Workplace" or not obj.get("isManaged"):
            tx.run("MATCH (d:Device {deviceId:$id}) SET d.foothold = true", id=obj["deviceId"])
        if obj.get("trustType") == "AzureAd" and obj.get("isManaged", False):
            tx.run("MATCH (d:Device {deviceId:$id}) SET d.crown_jewel = true", id=obj["deviceId"])

with driver.session() as session:
    session.run("MATCH (n) DETACH DELETE n")  
    for rec in data:
        session.execute_write(create_graph, rec)

print(" Import complete. Open Neo4j Desktop and visualize your graph!")

driver.close()




'''
relevant cypher queries to visualise the nodes in the graph:

View all devices and tenant
MATCH (d:Device)-[:BELONGS_TO]->(t:Tenant)
RETURN d, t

Show footholds
MATCH (d:Device {foothold:true})
RETURN d

Show crown jewels
MATCH (d:Device {crown_jewel:true})
RETURN d

Highlight attack paths (foothold → tenant)
MATCH (src:Device {foothold:true})-[:BELONGS_TO*1..2]->(target:Tenant)
RETURN src, target
'''
