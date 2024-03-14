DELIMITER $$
DROP PROCEDURE IF EXISTS sp_delete_sale$$

CREATE PROCEDURE sp_delete_sale(
    IN param_sale_id INT
)
BEGIN
	
   	-- Declarar variables locales
    DECLARE done BOOLEAN DEFAULT FALSE;
    DECLARE var_now TIMESTAMP;
   	DECLARE var_sale_id INT;
    DECLARE var_sale_detail_id INT;
    DECLARE var_product_id INT;
    DECLARE var_product_quantity INT;
    DECLARE var_charge_id INT;
    DECLARE var_charge_detail_id INT;
    DECLARE count_charge_detail INT DEFAULT 0;
    DECLARE var_total_charged DECIMAL(10,2);
    DECLARE var_total_sale DECIMAL(10,2);
   
    DECLARE mysql_code CHAR(5) DEFAULT '00000';
    DECLARE mysql_msg TEXT;
   	
   	
    -- Declarar un cursor para la consulta
   	DECLARE cur CURSOR FOR
   		SELECT
        vsd.id,
        vsd.sale_detail_id,
        vsd.product_id,
        vsd.quantity,
        vcd.charge_id,
        vcd.id as charge_detail_id
      FROM
        view_sale_details vsd
      JOIN view_charges_detail vcd ON vcd.sale_id = vsd.id
      WHERE
        vsd.id = param_sale_id;
	

	
	DECLARE exit handler FOR SQLEXCEPTION
      BEGIN
        GET DIAGNOSTICS CONDITION 1
          mysql_code = RETURNED_SQLSTATE, mysql_msg = MESSAGE_TEXT;
         SELECT "error", CONCAT( " Error en la fila ", ". Codigo de error: ",mysql_code, " mensaje_mysql: ",mysql_msg);
        ROLLBACK;
        RESIGNAL;
      ROLLBACK;
    END;
   
   	-- Manejador para el final del cursor
   	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
   
    OPEN cur;
    
    START TRANSACTION;
   	
    -- Recorrer los detalles de la venta
	read_loop: LOOP
		
		FETCH cur INTO var_sale_id, var_sale_detail_id, var_product_id, var_product_quantity, var_charge_id, var_charge_detail_id;
	
		IF done THEN
			LEAVE read_loop;
		END IF;
	
   		-- SELECT var_sale_id, var_sale_detail_id, var_product_id, var_product_quantity, var_charge_id, var_charge_detail_id;
   		-- Obtiene la fecha y hora actual
        SET var_now = NOW();

        -- Una vez eliminada la venta se recupera los productos vendidos, agregando
        -- al stock del producto
        UPDATE products SET qty = qty + var_product_quantity WHERE id = var_product_id;
        

        UPDATE charges_detail SET deleted_at = var_now WHERE id = var_charge_detail_id;

        SELECT COUNT(cd.charge_id) INTO count_charge_detail 
        FROM charges_detail cd 
        WHERE cd.charge_id = var_charge_id AND cd.deleted_at IS NULL;

        IF count_charge_detail = 0 THEN
          UPDATE charges SET deleted_at = var_now WHERE id = var_charge_id;
        END IF;

        SELECT vs.total, vs.total_charged INTO var_total_sale, var_total_charged 
        FROM view_sales vs WHERE id = param_sale_id;
        
        IF var_total_charged < var_total_sale THEN
          UPDATE sales SET status_charge_id = 3 WHERE id = param_sale_id;
        END IF;
 
   	END LOOP;
   	
    CLOSE cur;
	-- Eliminar logicamente la venta
   	SET var_now = NOW();
    UPDATE sales SET deleted_at = var_now WHERE id = param_sale_id;
	UPDATE sale_details SET deleted_at = var_now  WHERE sale_id = param_sale_id;
	-- Retornar mensaje de existo
	
    -- Confirmar la transacción
  COMMIT;
	
  SELECT "La venta se ha eliminado correctamente." AS message;

END $$

DELIMITER ;