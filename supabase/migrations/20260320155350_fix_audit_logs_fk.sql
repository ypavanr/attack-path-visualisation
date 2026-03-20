-- Drop existing FK safely
ALTER TABLE audit_logs
DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;

-- Ensure column allows NULL
ALTER TABLE audit_logs
ALTER COLUMN user_id DROP NOT NULL;

-- Recreate FK with ON DELETE SET NULL
ALTER TABLE audit_logs
ADD CONSTRAINT audit_logs_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE SET NULL;

-- Indexes (safe)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id
ON user_roles(user_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_role_id
ON user_roles(role_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
ON audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event_id
ON audit_logs(event_id);