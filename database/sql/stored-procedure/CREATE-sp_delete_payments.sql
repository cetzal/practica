DELIMITER $$
DROP PROCEDURE IF EXISTS sp_delete_payments$$

CREATE PROCEDURE sp_delete_payments(IN param_payments_id INT)
BEGIN
	
    DECLARE mysql_code CHAR(5) DEFAULT '00000';
    DECLARE mysql_msg TEXT;
   	DECLARE done INT DEFAULT FALSE;
    DECLARE var_purchase_id INT;
    DECLARE var_amount DECIMAL(10,2);
   	DECLARE var_id INT;
	DECLARE payments_details CURSOR FOR SELECT id, purchase_id, amount FROM view_payments_detail_delete WHERE payments_id = param_payments_id;
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

        SET @total_amount_paid = 0;
        SET @total_amount = 0;
        SET @status_paid = 0;

	    OPEN payments_details;

            read_loop: LOOP
               
                FETCH payments_details INTO var_id, var_purchase_id, var_amount;
               	IF done THEN
		            LEAVE read_loop;
		        END IF;

                SET @total_amount_paid = (SELECT paid_amounts FROM view_purchases WHERE id = var_purchase_id);
                SET @total_amount = @total_amount_paid - var_amount;

                IF @total_amount <= 0 THEN
                    SET @status_paid = 0;
                ELSEIF @total_amount > 0 THEN
                    set @status_paid = 1;
                END IF;

                UPDATE purchases SET paid_amounts = @total_amount, status = @status_paid WHERE id = var_purchase_id;
            
            END LOOP;

        CLOSE payments_details;

        UPDATE payments SET deleted_at = CURDATE() WHERE id = param_payments_id;
        UPDATE payments_detail SET deleted_at = CURDATE() WHERE payments_id = param_payments_id;
	   

    COMMIT;
    SELECT 'El pago se elimino.' AS message;
END $$

DELIMITER ;