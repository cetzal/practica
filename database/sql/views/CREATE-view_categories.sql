CREATE OR REPLACE VIEW view_categories AS
  	SELECT id, name, description, is_active, created_at, updated_at
  	FROM categories
  	WHERE deleted_at IS NULL;