ALTER TABLE brands
ADD COLUMN supplier_id INT UNSIGNED NULL DEFAULT NULL AFTER created_by;