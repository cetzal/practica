DELIMITER $$
DROP PROCEDURE IF EXISTS sp_delete_payments_by_purchase$$

CREATE PROCEDURE sp_delete_payments_by_purchase(IN param_purchase_id INT)
BEGIN
	
    DECLARE mysql_code CHAR(5) DEFAULT '00000';
    DECLARE mysql_msg TEXT;

   	DECLARE done INT DEFAULT FALSE;
    DECLARE var_payments_id INT;
    DECLARE var_id INT;
   	DECLARE count_paid_purchase INT;
   

	DECLARE payments_list_id CURSOR FOR SELECT vpd.id, vpd.payments_id FROM view_payments_detail vpd WHERE vpd.purchase_id = param_purchase_id;
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

	    OPEN payments_list_id;

            read_loop: LOOP
               
                FETCH payments_list_id INTO var_id, var_payments_id;

               	IF done THEN
		            LEAVE read_loop;
		        END IF;

                SELECT COUNT(t.id) INTO count_paid_purchase FROM payments_detail as t WHERE t.payments_id = var_payments_id;
                
                IF count_paid_purchase = 1 THEN
                    UPDATE payments SET deleted_at = CURDATE() WHERE id = var_payments_id;
                    UPDATE payments_detail SET deleted_at = CURDATE() WHERE payments_id = var_payments_id;
                ELSEIF count_paid_purchase > 1 THEN
                    UPDATE payments_detail SET deleted_at = CURDATE() WHERE purchase_id = param_purchase_id AND payments_id  = var_payments_id;
                END IF;
            
            END LOOP;

        CLOSE payments_list_id;

    COMMIT;
    SELECT 'El compra se elimino.' AS message;
END $$

DELIMITER ;