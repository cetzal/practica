CREATE OR REPLACE VIEW view_taxes_active AS
	SELECT id, name
	FROM view_taxes
	WHERE is_active = 1;