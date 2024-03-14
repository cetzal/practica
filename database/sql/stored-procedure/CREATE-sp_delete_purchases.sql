DELIMITER $$
DROP PROCEDURE IF EXISTS sp_delete_purchases$$

CREATE PROCEDURE sp_delete_purchases(IN param_purchase_id INT)
BEGIN
	
    DECLARE mysql_code CHAR(5) DEFAULT '00000';
    DECLARE mysql_msg TEXT;

   	DECLARE done INT DEFAULT FALSE;
    DECLARE var_product_id INT;
    DECLARE var_product_qty DECIMAL(10,2);
   	DECLARE var_id INT;

	DECLARE purchase_details CURSOR FOR SELECT vpd.id, vpd.product_id, vpd.qty FROM view_purchase_details vpd WHERE vpd.purchase_id = param_purchase_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
   
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

        SET @current_qty = 0;
        SET @total_qty = 0;

	    OPEN purchase_details;

            read_loop: LOOP
               
                FETCH purchase_details INTO var_id, var_product_id, var_product_qty;
               	IF done THEN
		            LEAVE read_loop;
		        END IF;

                SET @current_qty = (SELECT qty FROM view_products WHERE id = var_product_id);
                SET @total_qty = @current_qty - var_product_qty;

                UPDATE products SET qty = @total_qty WHERE id = var_product_id;
            
            END LOOP;

        CLOSE purchase_details;

        UPDATE purchases SET deleted_at = CURDATE() WHERE id = param_purchase_id;
        CALL sp_delete_payments_by_purchase(param_purchase_id);
        -- eliminar abonos o pagados
        -- UPDATE payments_detail SET deleted_at = CURDATE() WHERE purchase_id = param_purchase_id;

    COMMIT;
    SELECT 'El compra se elimino.' AS message;
END $$

DELIMITER ;