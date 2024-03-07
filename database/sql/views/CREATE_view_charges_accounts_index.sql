CREATE OR REPLACE VIEW view_charges_accounts_index AS
SELECT DISTINCT vcd.account_id as id, vcd.account_name as name
FROM view_charges_detail vcd;