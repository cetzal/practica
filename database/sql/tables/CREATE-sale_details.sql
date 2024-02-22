CREATE TABLE sale_details (
    id INT UNSIGNED AUTO_INCREMENT,
    sale_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED,
    unit_price DECIMAL(10,2),
    total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_sale_details_sale_id FOREIGN KEY (sale_id)
      REFERENCES sales(id)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_sale_details_product_id FOREIGN KEY (product_id)
      REFERENCES products(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
);