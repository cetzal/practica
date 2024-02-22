CREATE TABLE purchases(
    id INT NOT NULL AUTO_INCREMENT,
    reference_no VARCHAR(250) NULL,
    supplier_id INT,
    item INT DEFAULT 0,
    total_qty INT DEFAULT 0,
    total_discount DECIMAL(10,2) DEFAULT 0,
    total_tax DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) DEFAULT 0,
    order_tax_rate DECIMAL(10,2) DEFAULT 0,
    order_tax DECIMAL(10,2) DEFAULT 0,
    order_discount DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    status INT DEFAULT 1,
    payment_status INT DEFAULT 1,
    note VARCHAR(250),
    CONSTRAINT purchases_pk PRIMARY KEY (id)
)