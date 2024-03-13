DELIMITER $$
DROP PROCEDURE IF EXISTS sp_delete_charge$$

CREATE PROCEDURE sp_delete_charge(
    IN param_charge_id INT
)
BEGIN
	
  -- Declarar variables locales
  DECLARE done INT DEFAULT FALSE;
  DECLARE var_sale_id INT;
  DECLARE var_quantity INT;
  DECLARE var_charge_amount DECIMAL(10,2);
  DECLARE var_total_charged DECIMAL(10,2);
  DECLARE var_total_sale DECIMAL(10,2);
  DECLARE mysql_code CHAR(5) DEFAULT '00000';
  DECLARE mysql_msg TEXT;
  
  
  -- Declarar un cursor para la consulta
  DECLARE cur CURSOR FOR
    SELECT vcd.sale_id, vcd.amount as charge_amount, (SELECT vs.total FROM view_sales vs WHERE vcd.sale_id = vs.id) AS total_sale
    FROM view_charges_detail vcd
    WHERE vcd.charge_id = param_charge_id AND vcd.deleted_at IS NULL;
	
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
  
  
  
  START TRANSACTION;
  
  OPEN cur;
  FETCH cur INTO var_sale_id, var_charge_amount, var_total_sale;

  -- Recorrer los detalles de la venta
  WHILE NOT done DO
    -- Fetch cursor en las variables
    
    -- SELECT var_sale_id as sale_id, var_charge_amount as amount;
    UPDATE sales SET total_charged = total_charged - var_charge_amount WHERE id = var_sale_id;
    SELECT total_charged INTO var_total_charged FROM sales WHERE id = var_sale_id;
    IF var_total_charged = 0 THEN
      UPDATE sales SET status = 'Pendiente' WHERE id = var_sale_id;
    ELSEIF var_total_charged < var_total_sale THEN
      UPDATE sales SET status = 'Abonado';
    END IF;

    UPDATE charges SET deleted_at = NOW() WHERE id = param_charge_id;
    UPDATE charges_detail SET deleted_at = NOW() WHERE charge_id = param_charge_id;

    FETCH cur INTO var_sale_id, var_charge_amount, var_total_sale;
  END WHILE;

  CLOSE cur;
 
  COMMIT;

  SELECT "El cobro se ha eliminado correctamente." AS message;

END $$

DELIMITER ;