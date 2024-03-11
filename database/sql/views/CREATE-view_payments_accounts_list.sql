CREATE OR REPLACE VIEW view_payments_accounts_list AS
SELECT DISTINCT vpd.account_id as id, vpd.account_name as name
FROM view_payments_detail vpd