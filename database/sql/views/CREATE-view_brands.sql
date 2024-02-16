CREATE OR REPLACE VIEW view_brands AS
SELECT
  b.id,
  b.name,
  b.description,
  b.is_active,
  b.created_by AS user_id,
  b.supplier_id,
  (SELECT name FROM suppliers AS s WHERE s.id = b.supplier_id) as supplier_name,
  (SELECT CONCAT(u.name, ' ', u.last_name) FROM users AS u WHERE u.id = b.created_by) AS created_by,
  b.created_at,
  b.updated_at
FROM
   brands AS b
WHERE b.deleted_at IS NULL;