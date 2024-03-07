CREATE TABLE charges_detail(
	id INT NOT NULL AUTO_INCREMENT,
	charge_id INT NOT NULL,
	sale_id INT UNSIGNED NOT NULL,
	amount DECIMAL(10,2) DEFAULT 0,
	PRIMARY KEY(id),
	CONSTRAINT fk_charges_detail_charge_id FOREIGN KEY (charge_id)
      REFERENCES charges(id)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_charges_detail_sale_id FOREIGN KEY (sale_id)
      REFERENCES sales(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
);