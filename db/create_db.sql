
CREATE DATABASE IF NOT EXISTS `hbs_mysql` CHARACTER SET utf8 COLLATE utf8_general_ci;

USE hbs_mysql;

CREATE TABLE  `categories` (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`title` VARCHAR( 100 ) NOT NULL 
) ENGINE = INNODB;

CREATE TABLE  `products` (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`title` VARCHAR( 20 ) NOT NULL ,
`content` VARCHAR( 255 ) NOT NULL,
`price` INT NOT NULL,
`category` INT NOT NULL,
`cover` INT NOT NULL
) ENGINE = INNODB;

CREATE TABLE  `covers` (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`name` VARCHAR( 100 ) NOT NULL ,
`originalName` VARCHAR( 100 ) NOT NULL ,
`path` VARCHAR( 100 ) NOT NULL ,
`urlSharp` VARCHAR( 100 ) NOT NULL ,
`createAt` DATE NOT NULL
) ENGINE = INNODB;