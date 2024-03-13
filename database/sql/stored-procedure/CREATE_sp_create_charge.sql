DELIMITER $$
DROP PROCEDURE IF EXISTS sp_create_charge$$

CREATE PROCEDURE sp_create_charge(
    IN param_account_id INT,
    IN param_details JSON
)
BEGIN
	
   
    -- Inicio del bloque para manejar errores

	-- Declarar variables locales
	DECLARE last_charge_id INT;
	DECLARE count_json INT UNSIGNED
        DEFAULT JSON_LENGTH(param_details);
    DECLARE current_item LONGTEXT
        DEFAULT NULL;
    DECLARE i INT UNSIGNED DEFAULT 0;
    DECLARE balance DECIMAL(10,0);
    DECLARE total_sale DECIMAL(10,0);
    DECLARE current_total_charged DECIMAL(10,0);
	
    DECLARE mysql_code CHAR(5) DEFAULT '00000';
    DECLARE mysql_msg TEXT;
   
    -- Declarar variales el item de json
   	DECLARE item_sale_id INT DEFAULT 0;
    DECLARE item_amount INT DEFAULT 0;
    
   	DECLARE exit handler FOR SQLEXCEPTION
      BEGIN
        GET DIAGNOSTICS CONDITION 1
          mysql_code = RETURNED_SQLSTATE, mysql_msg = MESSAGE_TEXT;
         SELECT "error", CONCAT( " Error en la fila ", ". Codigo de error: ",mysql_code, " mensaje_mysql: ",mysql_msg);
        ROLLBACK;
        RESIGNAL;
      ROLLBACK;
    END;
   
    START TRANSACTION;
   
   	 -- Insertar la venta
    INSERT INTO charges (account_id, charge_date) VALUES (param_account_id, CURDATE());
    SET last_charge_id = LAST_INSERT_ID();
   

    -- Recorrer los detalles de la venta
   	WHILE i < count_json DO
   	
  		SET current_item = JSON_EXTRACT(param_details, CONCAT('$[', i, ']'));
  		SELECT REPLACE(current_item,'\\','') into current_item;
        SELECT REPLACE(current_item,'"{','{') into current_item;
        SELECT REPLACE(current_item,'}"','}') into current_item;
       

       	-- SELECT current_item;
        SET item_sale_id = JSON_UNQUOTE(JSON_EXTRACT(current_item, '$.sale_id'));
        SET item_amount = JSON_UNQUOTE(JSON_EXTRACT(current_item, '$.amount'));
   		
		INSERT INTO charges_detail (charge_id, sale_id, amount)
        	VALUES (last_charge_id, item_sale_id, item_amount);

        SELECT total INTO total_sale FROM view_sales WHERE id = item_sale_id;
        SELECT SUM(amount) INTO balance FROM charges_detail WHERE sale_id = item_sale_id AND deleted_at IS NULL;
        

        -- Actualiza el estatus de la venta
        IF balance < total_sale THEN
            UPDATE sales SET status = 'Abonado' WHERE id = item_sale_id;
        ELSEIF balance = total_sale THEN
            UPDATE sales SET status = 'Cobrado' WHERE id = item_sale_id;
        END IF;

        UPDATE sales set total_charged = balance WHERE id = item_sale_id;
       
        SET i = i + 1;
    END WHILE;
	
	-- Retornar mensaje de existo
	
	SELECT "El cobro se ha registrado correctamente." AS message;
    -- Confirmar la transacción
    COMMIT;

END $$

DELIMITER ;