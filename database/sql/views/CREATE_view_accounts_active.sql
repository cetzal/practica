CREATE OR REPLACE VIEW view_accounts_active AS
SELECT id, name, init_balance, is_active, created_by, created_at, updated_at
FROM view_accounts
WHERE is_active = 1;
