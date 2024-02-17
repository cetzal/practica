CREATE OR REPLACE 
VIEW view_brands AS
SELECT
  b.id,
  b.name,
  b.description,
  b.is_active,
  b.user_id,
  (SELECT CONCAT(u.name, ' ', u.last_name) FROM users u WHERE u.id = b.user_id) AS created_by,
  b.created_at,
  b.updated_at,
  b.deleted_at
FROM
   brands AS b
WHERE b.deleted_at IS NULL;