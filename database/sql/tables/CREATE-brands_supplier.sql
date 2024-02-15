CREATE TABLE brands_suppliers (
    id INT auto_increment NOT NULL,
	brands_id INT NULL,
	supplier_id INT NULL,
	CONSTRAINT brands_suppliers_pk PRIMARY KEY (id)
);