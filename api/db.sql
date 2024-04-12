

CREATE TABLE `users`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `middle_name` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `barangay` VARCHAR(45) NOT NULL,
  `province` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `contact_number` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
ALTER TABLE `users`.`user` 
CHANGE COLUMN `first_name` `first_name` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `last_name` `last_name` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `middle_name` `middle_name` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `city` `city` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `barangay` `barangay` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `province` `province` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `email` `email` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `contact_number` `contact_number` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `password` `password` VARCHAR(255) NULL DEFAULT NULL ,
CHANGE COLUMN `account_type` `account_type` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `usc_id_num` `usc_id_num` VARCHAR(255) NULL DEFAULT NULL ;


INSERT INTO `users`.`user` (`id`, `first_name`, `last_name`, `middle_name`, `city`, `barangay`, `province`, `email`, `contact_number`) VALUES ('20104272', 'Josh', 'Ratificar', 'Bobier', 'Chandler', 'Arizona', 'Gilbert', 'joshratificar@gmail.com', '480-277-9478');
INSERT INTO `users`.`user` (`id`, `first_name`, `last_name`, `middle_name`, `city`, `barangay`, `province`, `email`, `contact_number`) VALUES ('20104273', 'Mohan', 'Francis', 'Tortilla', 'UAE', 'Dubai', 'Bohol', 'moefr@gmail.com', '917-142-6857');
DELETE FROM `users`.`user` WHERE (`id` = '20241234');
DELETE FROM `users`.`user` WHERE (`id` = '20241235');
ALTER TABLE `users`.`user` 
DROP INDEX `usc_id_num_UNIQUE` ;
;
