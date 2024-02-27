DROP PROCEDURE IF EXISTS create_purchases;

DELIMITER $$

CREATE PROCEDURE create_purchases (
    IN param_purchase_date DATE,
    IN param_reference_no VARCHAR(250),
    IN param_supplier_id INT,
    IN param_note VARCHAR(250),
    IN param_user_id INT,
    IN param_detalles JSON
)
BEGIN
	
	DECLARE mysql_code CHAR(5) DEFAULT '00000';
    DECLARE mysql_msg TEXT;
   
   	DECLARE exit handler FOR SQLEXCEPTION
      BEGIN
        GET DIAGNOSTICS CONDITION 1
          mysql_code = RETURNED_SQLSTATE, mysql_msg = MESSAGE_TEXT;
         SELECT "error", CONCAT( " Error en la fila ", ". Codigo de error: ",mysql_code, " mensaje_mysql: ",mysql_msg);
        ROLLBACK;
        RESIGNAL;
      ROLLBACK;
    END;
   
    /*DECLARE exit handler for sqlexception, sqlwarning
    BEGIN
        ROLLBACK;
        SELECT 'Error durante la compra. Se ha realizado un rollback 1.' AS mensaje;
    END;*/

    DECLARE exit handler for sqlstate '45000'
    BEGIN
        ROLLBACK;
        SELECT 'Error durante la compra. Se ha realizado un rollback 2.' AS message;
    END;

    START TRANSACTION;

	    -- Insertar la compra en la tabla purchases
	    INSERT INTO purchases (purchase_date, reference_no, supplier_id, note, user_id)
	    VALUES (param_purchase_date , param_reference_no , param_supplier_id, param_note, param_user_id);
	
	    -- Obtener el ID de la compra insertada
	    SET @last_purchase_id := LAST_INSERT_ID();
	
	    -- Iterar sobre los detalles de la compra
	    SET @idx = 0;
	    SET @product_id :=0;
	   	SET @product_code :=0;
	    SET @qty :=0;
	    SET @unit_price :=0;
	   	SET @subtotal :=0;
	
	    WHILE JSON_CONTAINS_PATH(param_detalles, 'one', CONCAT('$[', @idx, ']')) DO
	        -- Obtener los detalles del producto de la compra
	        SET @product_id = JSON_UNQUOTE(JSON_EXTRACT(param_detalles, CONCAT('$[', @idx, '].product_id')));
	        SET @qty = JSON_UNQUOTE(JSON_EXTRACT(param_detalles, CONCAT('$[', @idx, '].product_qty')));
	        SET @unit_price= JSON_UNQUOTE(JSON_EXTRACT(param_detalles, CONCAT('$[', @idx, '].product_unit_price')));
	       	SET @subtotal = JSON_UNQUOTE(JSON_EXTRACT(param_detalles, CONCAT('$[', @idx, '].product_subtotal')));
	
	        -- Insertar el detalle de la compra en la tabla detalles_compra
	        INSERT INTO purchases_detail  (purchase_id, product_id, qty, unit_price,total)
	        VALUES (@last_purchase_id, @product_id, @qty, @unit_price, @subtotal);
	       
	       	UPDATE products SET qty=(qty+@qty) WHERE id = @product_id;
	
	        SET @idx = @idx + 1;
	    END WHILE;

    COMMIT;
    SELECT 'Compra realizada exitosamente.' AS message;
END $$

DELIMITER ;