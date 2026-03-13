CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE roles (
    role_id BIGSERIAL PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE audit_events (
    event_id BIGSERIAL PRIMARY KEY,
    event_name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    event_id BIGINT REFERENCES audit_events(event_id),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);