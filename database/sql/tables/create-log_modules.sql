CREATE TABLE log_modules (
	id BIGINT NOT NULL AUTO_INCREMENT,
	module VARCHAR(30) NOT NULL,
	user_id int UNSIGNED,
	movement_type VARCHAR(30) NOT NULL,
	details JSON NOT NULL,
	movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY (id),
	INDEX (module),
	INDEX (movement_type),
	INDEX (movement_date),
	FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;