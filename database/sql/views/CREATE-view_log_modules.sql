CREATE OR REPLACE VIEW view_log_modules AS
    SELECT
        lg.id,
        lg.details,
        lg.user_id,
        lg.modified_record_id,
        lg.movement_date,
        (SELECT CONCAT(u.name, ' ', u.last_name) FROM users u WHERE u.id = lg.user_id) AS user_name,
        lg.module_id,
        (SELECT m.name FROM modules m WHERE m.id = lg.module_id) AS module_name,
        lg.movement_type_id,
        (SELECT mt.name FROM movement_types mt WHERE mt.id = lg.movement_type_id) AS movement_type_name
    FROM
        log_modules lg;