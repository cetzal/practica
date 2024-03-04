CREATE OR REPLACE VIEW view_suppliers AS
SELECT 
	s.id,
	s.name,
	s.is_active,
	(SELECT CONCAT(vu.name, ' ', vu.last_name) FROM view_users AS vu WHERE vu.id = s.user_id) as created_by,
	(SELECT COUNT(vb.id) FROM view_brands AS vb WHERE vb.supplier_id = s.id) as total_brands,
	s.created_at,
	s.updated_at,
	s.deleted_at
FROM suppliers as s
WHERE  s.deleted_at IS NULL;