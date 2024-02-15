CREATE OR REPLACE 
VIEW view_brands AS
SELECT
  b.id,
  b.name,
  b.description,
  b.is_active,
  u.id AS user_id,
  CONCAT(u.name, ' ', u.last_name) AS created_by,
  b.created_at,
  b.updated_at
FROM
   brands AS b
INNER JOIN users AS u ON u.id = b.created_by
WHERE b.deleted_at IS NULL;