CREATE OR REPLACE VIEW view_inventory_clients_list AS
SELECT vc.id, vc.name
FROM view_clients vc 
WHERE vc.id IN (SELECT vsd.client_id FROM view_sale_details vsd);