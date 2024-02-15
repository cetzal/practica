ALTER TABLE categories
  ADD deleted_at TIMESTAMP NULL
    AFTER updated_at;
    