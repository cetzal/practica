CREATE OR REPLACE VIEW `view_users_login` AS
select
    `vu`.`id` AS `id`,
    `vu`.`name` AS `name`,
    `vu`.`last_name` AS `last_name`,
    `vu`.`email` AS `email`,
    `vu`.`password` AS `password`,
    `vu`.`picture` AS `picture`,
    `vu`.`is_active` AS `is_active`,
    `vu`.`role_id` AS `role_id`,
    `vu`.`role_name` AS `role_name`,
    `vu`.`user_parent_id` AS `user_parent_id`,
    `vu`.`user_parent_name` AS `user_parent_name`,
    `vu`.`created_at` AS `created_at`,
    `vu`.`updated_at` AS `updated_at`,
    `vu`.`deleted_at` AS `deleted_at`
from
    `view_users` `vu`
where
    (`vu`.`is_active` = true);