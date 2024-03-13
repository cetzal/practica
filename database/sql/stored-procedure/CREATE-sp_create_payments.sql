DELIMITER $$
DROP PROCEDURE IF EXISTS sp_create_payments$$

CREATE PROCEDURE sp_create_payments(
    IN param_account_id INT,
    IN param_supplier_id INT,
    IN param_user_id INT,
    IN param_details JSON
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

    DECLARE exit handler for sqlstate '45000'
    BEGIN
        ROLLBACK;
        SELECT 'Error durante la compra. Se ha realizado un rollback.' AS message;
    END;

   

    START TRANSACTION;

	    -- Insertar la compra en la tabla purchases
	    INSERT INTO payments (paid_date, account_id, supplier_id, user_id)
	    VALUES (CURDATE() , param_account_id , param_supplier_id, param_user_id);
	
	    -- Obtener el ID de la compra insertada
	    SET @last_payment_id := LAST_INSERT_ID();
	
	    -- Iterar sobre los detalles de la compra
	    SET @idx = 0;
	    SET @purchase_id :=0;
	   	SET @amount :=0;

        SET @balance = 0;
        SET @total_purchase = 0;
        SET @status_paid = 0;
	  
	
	    WHILE JSON_CONTAINS_PATH(param_details, 'one', CONCAT('$[', @idx, ']')) DO
	        -- Obtener los detalles del producto de la compra
	        SET @purchase_id = JSON_UNQUOTE(JSON_EXTRACT(param_details, CONCAT('$[', @idx, '].purchase_id')));
	        SET @amount = JSON_UNQUOTE(JSON_EXTRACT(param_details, CONCAT('$[', @idx, '].amount')));
	       
	        -- Insertar el detalle de la compra en la tabla detalles_compra
	        INSERT INTO payments_detail  (payments_id, purchase_id, amount)
	        VALUES (@last_payment_id, @purchase_id, @amount);

            SET @total_purchase = (SELECT total FROM view_purchases WHERE id = @purchase_id);
            SET @balance = (SELECT SUM(amount) FROM payments_detail WHERE purchase_id = @purchase_id);

            -- actualizar em monto de pago de las compras y los status
            IF @balance < @total_purchase THEN
               SET @status_paid = 1;
            ELSEIF @balance >= @total_purchase THEN
                set @status_paid = 2;
            END IF;

            UPDATE purchases SET paid_amounts = @balance, status = @status_paid WHERE id = @purchase_id;

	        SET @idx = @idx + 1;
	    END WHILE;

    COMMIT;
    SELECT 'El pago se ha realizado exitosamente.' AS message;
END $$

DELIMITER ;