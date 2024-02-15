CREATE OR REPLACE VIEW view_units AS
SELECT
	id,
	unit_code,
	unit_name,
	base_unit,
	operator,
	operation_value,
	is_active,
	created_at,
	updated_at
FROM units