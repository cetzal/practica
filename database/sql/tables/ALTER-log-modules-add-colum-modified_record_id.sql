ALTER TABLE log_modules   
ADD COLUMN modified_record_id INT UNSIGNED NULL AFTER movement_date;

CREATE INDEX idx_modifie_record_id ON log_modules(modified_record_id);