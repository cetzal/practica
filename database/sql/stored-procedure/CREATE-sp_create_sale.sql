DROP PROCEDURE IF EXISTS create_sale;
DROP PROCEDURE IF EXISTS sp_create_sale;

DELIMITER $$

CREATE PROCEDURE sp_create_sale(
	IN param_client_id INT,
    IN param_date DATE,
    IN param_comments TEXT,
    IN param_details JSON
)
BEGIN
	
   
    -- Inicio del bloque para manejar errores

	-- Declarar variables locales
	DECLARE sale_id INT;
	DECLARE count_json INT UNSIGNED
        DEFAULT JSON_LENGTH(param_details);
    DECLARE current_item LONGTEXT
        DEFAULT NULL;
    DECLARE i INT UNSIGNED DEFAULT 0;
	
    DECLARE mysql_code CHAR(5) DEFAULT '00000';
    DECLARE mysql_msg TEXT;
   
    -- Declarar variales el item de json
   	DECLARE item_product_id INT DEFAULT 0;
    DECLARE item_quantity INT DEFAULT 0;
    DECLARE item_unit_price DECIMAL DEFAULT 0;
    DECLARE item_total DECIMAL DEFAULT 0;
    
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
    INSERT INTO sales (client_id, date, comments) VALUES (param_client_id, param_date, param_comments);
    SET sale_id = LAST_INSERT_ID();
   
   	-- Variables para insertar el detalle de la venta
    -- SET @product_id := 0;
    -- SET @quantity := 0;
    -- SET @unit_price := 0;
    -- SET @total := 0;

   	-- Variabla para armar los multiples update para productos
	SET @sql_product_update = '';

    -- Recorrer los detalles de la venta
   	WHILE i < count_json DO
   	
  		SET current_item := JSON_EXTRACT(param_details, CONCAT('$[', i, ']'));
  		SELECT REPLACE(current_item,'\\','') into current_item;
        SELECT REPLACE(current_item,'"{','{') into current_item;
        SELECT REPLACE(current_item,'}"','}') into current_item;
       

       	-- SELECT current_item;
        SET item_product_id = JSON_UNQUOTE(JSON_EXTRACT(current_item, '$.product_id'));
        SET item_quantity = JSON_UNQUOTE(JSON_EXTRACT(current_item, '$.quantity'));
        SET item_unit_price = CONVERT(JSON_EXTRACT(current_item, '$.unit_price'), DECIMAL(10,2));
		SET item_total = CONVERT(JSON_EXTRACT(current_item, '$.total'), DECIMAL(10,2));
   		
		INSERT INTO sale_details (sale_id, product_id, quantity, unit_price, total)
        VALUES (sale_id, item_product_id, item_quantity, item_unit_price, item_total);
       

       	-- Construir las consultas update para productos
        UPDATE products SET qty = qty - item_quantity WHERE id = item_product_id AND qty > 0;
       
       SET i := i + 1;
    END WHILE;
   
    -- SELECT @sql_product_update;
   
   -- Validar  @sql_product_updat es difente a ''
    /* IF @sql_product_update <> '' THEN
	   	PREPARE stmt FROM @sql_product_update;
	    EXECUTE stmt;
	    DEALLOCATE PREPARE stmt;
	END IF; */
	
	-- Retornar mensaje de existo
	
	SELECT "La venta se ha registrado correctamente." AS message;
    -- Confirmar la transacción
    COMMIT;

END $$

DELIMITER ;