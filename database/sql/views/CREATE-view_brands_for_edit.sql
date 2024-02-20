CREATE OR REPLACE VIEW view_brands_for_edit AS 
	SELECT id, name, supplier_id
	FROM brands
	WHERE is_active = 1 OR deleted_at IS NOT NULL;