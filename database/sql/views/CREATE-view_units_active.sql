CREATE OR REPLACE VIEW view_units_active AS
	SELECT id, unit_name, base_unit
	FROM view_units
	WHERE is_active = 1;