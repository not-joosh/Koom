

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


INSERT INTO `users`.`user` (`id`, `first_name`, `last_name`, `middle_name`, `city`, `barangay`, `province`, `email`, `contact_number`) VALUES ('20104272', 'Josh', 'Ratificar', 'Bobier', 'Chandler', 'Arizona', 'Gilbert', 'joshratificar@gmail.com', '480-277-9478');
INSERT INTO `users`.`user` (`id`, `first_name`, `last_name`, `middle_name`, `city`, `barangay`, `province`, `email`, `contact_number`) VALUES ('20104273', 'Mohan', 'Francis', 'Tortilla', 'UAE', 'Dubai', 'Bohol', 'moefr@gmail.com', '917-142-6857');
