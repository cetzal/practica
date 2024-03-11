CREATE OR REPLACE VIEW view_accounts_active AS
SELECT va.id, va.name, va.init_balance, va.is_active, va.created_by, va.revenue, va.egress, va.balance, va.created_at, va.updated_at
FROM view_accounts AS va
WHERE va.is_active = 1;
