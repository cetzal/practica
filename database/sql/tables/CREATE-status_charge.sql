CREATE TABLE status_charge (
	id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
	name VARCHAR(50),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP DEFAULT NULL,
	PRIMARY KEY (id)
);

ALTER TABLE sales   
ADD COLUMN status_charge_id TINYINT UNSIGNED DEFAULT 2 AFTER comments;

ALTER TABLE sales 
ADD FOREIGN KEY (status_charge_id) REFERENCES status_charge(id) ON UPDATE CASCADE ON DELETE RESTRICT;

INSERT INTO status_charge(name) VALUES('Cobrado'), ('No Cobrado'), ('Abonado');

UPDATE sales s SET s.status_charge_id = (SELECT sc.id FROM status_charge sc WHERE sc.name = s.status);

ALTER TABLE sales DROP COLUMN status;