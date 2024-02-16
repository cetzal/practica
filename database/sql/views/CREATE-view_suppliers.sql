CREATE OR REPLACE VIEW view_suppliers AS
SELECT 
	s.id,
	s.name,
	s.is_active,
	(SELECT CONCAT(u.name, ' ', u.last_name) FROM users AS u WHERE u.id = s.user_id) as created_by,
	(SELECT COUNT(id) FROM brands_suppliers bs WHERE bs.supplier_id = s.id) as total_brands,
	s.created_at,
	s.updated_at,
	s.deleted_at
FROM suppliers as s
WHERE  s.deleted_at IS NULL;