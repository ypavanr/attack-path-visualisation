import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

edge_list=[(1,2),(2,3),(3,4),(3,5),(4,6),(6,7)]

#G=nx.from_edgelist(edge_list)
G=nx.Graph()
G.add_edges_from(edge_list)

nx.draw_spring(G, with_labels=True)
plt.show()
