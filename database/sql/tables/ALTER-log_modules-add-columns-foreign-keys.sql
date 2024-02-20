ALTER TABLE log_modules   
ADD COLUMN module_id INT UNSIGNED NULL AFTER user_id,  
ADD COLUMN movement_type_id INT UNSIGNED NULL AFTER module_id;  

ALTER TABLE log_modules 
ADD FOREIGN KEY (module_id) REFERENCES modules(id) ON UPDATE CASCADE ON DELETE RESTRICT,
ADD FOREIGN KEY (movement_type_id) REFERENCES movement_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE log_modules   
ADD COLUMN modified_record_id INT UNSIGNED NULL AFTER movement_date;
CREATE INDEX idx_modifie_record_id ON log_modules(modified_record_id);