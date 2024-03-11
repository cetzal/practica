CREATE OR REPLACE VIEW view_accounts_create_pyments_list AS
SELECT vaa.id, vaa.name,  vaa.balance as total_balance
FROM view_accounts_active AS vaa;