CREATE OR REPLACE VIEW view_clients_active AS
SELECT vc.id, vc.name
FROM view_clients vc 
WHERE vc.is_active = 1;
