
CREATE OR REPLACE VIEW view_log_modules AS
SELECT
    lg.id,
    lg.module,
    lg.movement_type,
    lg.movement_date,
    lg.details,
    u.id AS user_id
    CONCAT(u2.name, ' ', u2.last_name) AS user_name
FROM
    log_modules lg
INNER JOIN users AS u ON u.id = lg.user_id