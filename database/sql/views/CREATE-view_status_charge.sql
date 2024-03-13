CREATE OR REPLACE VIEW view_status_charge AS
SELECT
	id,
	name,
	created_at,
	updated_at,
	deleted_at
FROM status_charge;