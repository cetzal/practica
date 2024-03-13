CREATE OR REPLACE VIEW view_charges_clients_index AS
SELECT DISTINCT vcd.client_id AS id, vcd.client_name AS name 
FROM view_charges_detail vcd;