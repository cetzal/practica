CREATE OR REPLACE VIEW view_taxes AS
  	SELECT id, name, rate, is_active, created_at, updated_at
  	FROM taxes