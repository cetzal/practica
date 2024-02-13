
CREATE OR REPLACE VIEW view_log_modules AS
    select
        lg.id,
        lg.module,
        lg.movement_type,
        lg.movement_date,
        lg.details,
        u.id as user_id
        u.name as user_name
    from
        log_modules lg
    inner join users u ON u.id = lg.user_id