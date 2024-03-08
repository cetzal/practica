CREATE OR REPLACE VIEW view_accounts_create_pyments_list AS
SELECT id, name,  '5000' as total_balance
FROM view_accounts_active;