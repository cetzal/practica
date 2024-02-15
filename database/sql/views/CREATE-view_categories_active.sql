CREATE OR REPLACE VIEW view_categories_active AS
	SELECT id, name
	FROM view_categories
	WHERE is_active = 1;