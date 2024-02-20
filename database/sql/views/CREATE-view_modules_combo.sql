CREATE OR REPLACE VIEW view_modules_combo AS
	SELECT id, name
	FROM modules
	WHERE id <> 4;