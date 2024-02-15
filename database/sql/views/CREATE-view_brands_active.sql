CREATE OR REPLACE VIEW view_brands_active AS
	SELECT id, name
	FROM view_brands
	WHERE is_active = 1;