DELIMITER $$
DROP PROCEDURE IF EXISTS sp_delete_sale$$

CREATE PROCEDURE sp_delete_sale(
    IN param_sale_id INT
)
BEGIN
	
   	-- Declarar variables locales
    DECLARE done INT DEFAULT FALSE;
   	DECLARE var_sale_id INT;
    DECLARE var_sale_detail_id INT;
    DECLARE var_product_id INT;
    DECLARE var_product_quantity INT;
    DECLARE var_now TIMESTAMP;
    DECLARE var_charge_id INT;
    DECLARE var_list_charge_detail_id VARCHAR(255);

   
    DECLARE mysql_code CHAR(5) DEFAULT '00000';
    DECLARE mysql_msg TEXT;
   	
   	
    -- Declarar un cursor para la consulta
   	DECLARE cur CURSOR FOR
   		SELECT
        vsd.id,
        vsd.sale_detail_id,
        vsd.product_id,
        vsd.quantity
      FROM
        view_sale_details vsd
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
    FETCH cur INTO var_sale_id, var_sale_detail_id, var_product_id, var_product_quantity;
   	
    START TRANSACTION;

   	
    -- Recorrer los detalles de la venta
   	WHILE NOT done DO
        -- Obtiene la fecha y hora actual
        SET var_now = NOW();

        -- Obtiene el account_id
        SELECT DISTINCT vcd.charge_id INTO var_charge_id
        FROM view_charges_detail vcd 
        WHERE vcd.sale_id = param_sale_id;

        -- Obtiene por el id venta el listado de ids del cobro detalle
        SELECT GROUP_CONCAT( 
            (
                SELECT vcd.id
                FROM view_charges_detail vcd
                WHERE vcd.sale_id = 4
            )
            SEPARATOR ','
        ) INTO var_list_charge_detail_id;

        -- Eliminar logicamente la venta
        UPDATE sales SET deleted_at = var_now  WHERE id = param_sale_id;

        -- Una vez eliminada la venta se recupera los productos vendidos, agregando
        -- al stock del producto
        UPDATE products SET qty = qty + var_product_quantity WHERE id = var_product_id;
        UPDATE sale_details SET deleted_at = var_now  WHERE sale_id = param_sale_id;

        -- Eliminar logicamente los cobros realizados
        UPDATE charges SET deleted_at = var_now 
        WHERE id = var_charge_id;
            
        -- Eliminar logicamente el detalle de cobros realizados
        UPDATE charges_detail SET deleted_at = var_now 
        WHERE id IN (var_list_charge_detail_id);

        FETCH cur INTO var_sale_id, var_sale_detail_id, var_product_id, var_product_quantity;
  		
    END WHILE;
	
	-- Retornar mensaje de existo
	
    -- Confirmar la transacción
  COMMIT;
	
  SELECT "La venta se ha eliminado correctamente." AS message;

END $$

DELIMITER ;