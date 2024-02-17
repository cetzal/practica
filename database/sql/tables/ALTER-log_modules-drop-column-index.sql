ALTER TABLE log_modules
 DROP COLUMN module,
 DROP COLUMN movement_type,
 DROP INDEX module,
 DROP INDEX movement_type;