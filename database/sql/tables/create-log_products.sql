CREATE TABLE log_products (
	id BIGINT NOT NULL AUTO_INCREMENT,
	user_id int UNSIGNED,
	movement_type VARCHAR(30) NOT NULL,
	details JSON NOT NULL,
	movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY (id),
	INDEX (movement_type),
	INDEX (movement_date),
	FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;