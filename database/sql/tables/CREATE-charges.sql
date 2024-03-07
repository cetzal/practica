CREATE TABLE charges(
	id INT NOT NULL AUTO_INCREMENT,
	account_id INT NOT NULL,
	charge_date DATE DEFAULT NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_charges_account_id FOREIGN KEY (account_id)
      REFERENCES accounts(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
);