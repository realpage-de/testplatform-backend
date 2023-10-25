/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

DELETE FROM `admin_users`;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` (`id`, `email`, `password`, `created`, `modified`) VALUES
	(1, 'st.hofheinz@googlemail.com', '$2y$12$BPM3fg2fus65HdDnADAzOuC7TSsxoX4wCX8k2CLLvPJ6mbXsx/bOK', '2020-08-11 16:37:46', '2020-08-11 16:37:46');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

DELETE FROM `categories`;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `status`, `name`) VALUES
	(4, 1, 'Kategorie 1'),
	(5, 0, 'Kategorie 2'),
	(6, 0, 'Kategorie 3');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

DELETE FROM `countries`;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` (`id`, `status`, `name`) VALUES
	(4, 1, 'Deutschland');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `logo` mediumtext NOT NULL,
  `website` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

DELETE FROM `customers`;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` (`id`, `status`, `name`, `logo`, `website`) VALUES
	(1, 1, 'Kunde 1', '', ''),
	(4, 0, 'Kunde 2', '', NULL),
	(5, 1, 'Kunde 3', '', NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;

DROP TABLE IF EXISTS `genders`;
CREATE TABLE IF NOT EXISTS `genders` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) unsigned NOT NULL,
  `title` varchar(50) NOT NULL,
  `gender` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

DELETE FROM `genders`;
/*!40000 ALTER TABLE `genders` DISABLE KEYS */;
INSERT INTO `genders` (`id`, `status`, `title`, `gender`) VALUES
	(3, 1, 'Herr', 'männlich'),
	(4, 2, 'Frau', 'weiblich');
/*!40000 ALTER TABLE `genders` ENABLE KEYS */;

DROP TABLE IF EXISTS `pages`;
CREATE TABLE IF NOT EXISTS `pages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) unsigned NOT NULL,
  `name` text NOT NULL,
  `path` text NOT NULL,
  `content` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

DELETE FROM `pages`;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` (`id`, `status`, `name`, `path`, `content`) VALUES
	(1, 1, 'Home', '', '[{"type":"heading","fields":[{"type":"heading","name":"text","settings":{"level":1},"data":"\\u00dcberschrift"}]},{"type":"paragraph","fields":[{"type":"text","name":"text","data":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."}]},{"type":"list","fields":[{"type":"list","name":"list","data":["asd 1","asd 2","asd 3","asd 4"]}]},{"type":"table","fields":[{"type":"table","name":"data","settings":{"hasHeaderRow":false},"data":[["sdfsadf","sdfsdf<br>"],["fghfgh","ghjghj"]]}]},{"type":"code","fields":[{"type":"code","name":"code","data":"&lt;div class=\\"form-group\\"&gt;\\n\\t&lt;label for=\\"exampleInputFile\\"&gt;File input&lt;\\/label&gt;\\n\\t&lt;div class=\\"input-group\\"&gt;\\n\\t\\t&lt;div class=\\"custom-file\\"&gt;\\n\\t\\t\\t&lt;input type=\\"file\\" class=\\"custom-file-input\\" id=\\"exampleInputFile\\"&gt;\\n\\t\\t\\t&lt;label class=\\"custom-file-label\\" for=\\"exampleInputFile\\"&gt;Choose file&lt;\\/label&gt;\\n\\t\\t&lt;\\/div&gt;\\n \\t\\t&lt;div class=\\"input-group-append\\"&gt;\\n\\t\\t\\t&lt;span class=\\"input-group-text\\" id=\\"\\"&gt;Upload&lt;\\/span&gt;\\n\\t\\t&lt;\\/div&gt;\\n\\t&lt;\\/div&gt;\\n&lt;\\/div&gt;\\n"}]}]'),
	(12, 0, 'Karriere > Jobs', 'karriere/jobs', '[{"type":"paragraph","fields":[{"type":"text","name":"text","data":"sadfsdf"}]}]'),
	(13, 0, 'Karriere', 'karriere', '"\'\'"'),
	(14, 0, 'dsfasdf', 'sdafasdfasdf', '"\'\'"');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;

DROP TABLE IF EXISTS `producttests`;
CREATE TABLE IF NOT EXISTS `producttests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) unsigned NOT NULL,
  `name` text NOT NULL,
  `image` text NOT NULL,
  `category_id` int(3) unsigned DEFAULT NULL,
  `customer_id` int(5) unsigned DEFAULT NULL,
  `content` longtext NOT NULL,
  `seal_image` text NOT NULL,
  `phase_1_date_start` date DEFAULT NULL,
  `phase_1_date_end` date DEFAULT NULL,
  `phase_1_content` longtext NOT NULL,
  `phase_2_date_start` date DEFAULT NULL,
  `phase_2_date_end` date DEFAULT NULL,
  `phase_2_content` longtext NOT NULL,
  `phase_3_date_start` date DEFAULT NULL,
  `phase_3_date_end` date DEFAULT NULL,
  `phase_3_content` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_producttests_interests` (`category_id`) USING BTREE,
  KEY `FK_producttests_customers` (`customer_id`),
  CONSTRAINT `FK_producttests_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_producttests_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

DELETE FROM `producttests`;
/*!40000 ALTER TABLE `producttests` DISABLE KEYS */;
INSERT INTO `producttests` (`id`, `status`, `name`, `image`, `category_id`, `customer_id`, `content`, `seal_image`, `phase_1_date_start`, `phase_1_date_end`, `phase_1_content`, `phase_2_date_start`, `phase_2_date_end`, `phase_2_content`, `phase_3_date_start`, `phase_3_date_end`, `phase_3_content`) VALUES
	(1, 0, '', 'aad7a42f29ed0c3a2c8ba2ac13_ciAyMzUDMWRhNzI5MGE4MjE=.jpg', NULL, NULL, '[{"type":"heading","fields":[{"type":"heading","name":"text","settings":{"level":1},"data":"\\u00dcberschrift"}]},{"type":"paragraph","fields":[{"type":"text","name":"text","data":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."}]},{"type":"list","fields":[{"type":"list","name":"list","data":["asd 1","asd 2","asd 3","asd 4"]}]},{"type":"table","fields":[{"type":"table","name":"data","settings":{"hasHeaderRow":false},"data":[["sdfsadf","sdfsdf<br>"],["fghfgh","ghjghj"]]}]}]', 'seal_desired_new.png', '2020-09-12', '2018-07-13', '"\'\'"', '2020-08-13', '2020-08-12', '""', NULL, NULL, '[{"type":"columns-2","fields":[{"type":"container","name":"column1","data":[{"type":"heading","fields":[{"type":"heading","name":"text","settings":{"level":1},"data":""}]},{"type":"paragraph","fields":[{"type":"text","name":"text","data":""}]}]},{"type":"container","name":"column2","data":[{"type":"paragraph","fields":[{"type":"text","name":"text","data":"sdfsdfsadfsadf"}]},{"type":"columns-2","fields":[{"type":"container","name":"column1","data":[]},{"type":"container","name":"column2","data":[]}]}]}]},{"type":"columns-3","fields":[{"type":"container","name":"column1","data":[]},{"type":"container","name":"column2","data":[]},{"type":"container","name":"column3","data":[{"type":"columns-2","fields":[{"type":"container","name":"column1","data":[]},{"type":"container","name":"column2","data":[]}]}]}]}]');
/*!40000 ALTER TABLE `producttests` ENABLE KEYS */;

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `status` int(1) unsigned NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(100) NOT NULL,
  `newsletter` tinyint(1) unsigned NOT NULL,
  `created` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `status`, `username`, `email`, `password`, `newsletter`, `created`, `last_login`) VALUES
	(1, 1, 'username', 'asdfasasf@asdasd.de', '123456', 1, '2020-08-15 18:51:02', '2020-08-15 18:51:03');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

DROP TABLE IF EXISTS `users_children`;
CREATE TABLE IF NOT EXISTS `users_children` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `gender_id` int(3) unsigned NOT NULL,
  `date_of_birth_year` int(4) unsigned NOT NULL,
  `date_of_birth_month` int(2) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_users_interests_users` (`user_id`) USING BTREE,
  KEY `FK_users_children_genders` (`gender_id`),
  CONSTRAINT `FK_users_children_genders` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_users_children_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

DELETE FROM `users_children`;
/*!40000 ALTER TABLE `users_children` DISABLE KEYS */;
INSERT INTO `users_children` (`id`, `user_id`, `gender_id`, `date_of_birth_year`, `date_of_birth_month`) VALUES
	(1, 1, 3, 2014, 5),
	(2, 1, 4, 2018, 2);
/*!40000 ALTER TABLE `users_children` ENABLE KEYS */;

DROP TABLE IF EXISTS `users_interests`;
CREATE TABLE IF NOT EXISTS `users_interests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `category_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_users_interests_users` (`user_id`),
  KEY `FK_users_interests_interests` (`category_id`) USING BTREE,
  CONSTRAINT `FK_users_interests_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_users_interests_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

DELETE FROM `users_interests`;
/*!40000 ALTER TABLE `users_interests` DISABLE KEYS */;
INSERT INTO `users_interests` (`id`, `user_id`, `category_id`) VALUES
	(4, 1, 4),
	(7, 1, 6);
/*!40000 ALTER TABLE `users_interests` ENABLE KEYS */;

DROP TABLE IF EXISTS `users_person`;
CREATE TABLE IF NOT EXISTS `users_person` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_users_person_users` (`user_id`),
  CONSTRAINT `FK_users_person_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `users_person`;
/*!40000 ALTER TABLE `users_person` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_person` ENABLE KEYS */;

DROP TABLE IF EXISTS `users_producttests`;
CREATE TABLE IF NOT EXISTS `users_producttests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `total_feedbacks` int(5) DEFAULT NULL,
  `total_no_feedbacks` int(5) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_users_person_users` (`user_id`) USING BTREE,
  CONSTRAINT `FK_users_producttests_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `users_producttests`;
/*!40000 ALTER TABLE `users_producttests` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_producttests` ENABLE KEYS */;

DROP TABLE IF EXISTS `users_profile`;
CREATE TABLE IF NOT EXISTS `users_profile` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `gender_id` int(3) unsigned NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `street` varchar(50) NOT NULL,
  `street_number` varchar(10) NOT NULL,
  `address_extra` varchar(50) DEFAULT NULL,
  `zip` int(10) unsigned NOT NULL,
  `city` varchar(50) NOT NULL,
  `country_id` int(3) unsigned NOT NULL,
  `date_of_birth` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__users` (`user_id`),
  KEY `FK_users_profile_countries` (`country_id`),
  KEY `FK_users_profile_genders` (`gender_id`),
  CONSTRAINT `FK__users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_users_profile_countries` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_users_profile_genders` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

DELETE FROM `users_profile`;
/*!40000 ALTER TABLE `users_profile` DISABLE KEYS */;
INSERT INTO `users_profile` (`id`, `user_id`, `gender_id`, `first_name`, `last_name`, `street`, `street_number`, `address_extra`, `zip`, `city`, `country_id`, `date_of_birth`) VALUES
	(6, 1, 3, 'Vorname2', 'Nachname3', 'sdfsaf', 'sadfsdf', '', 23478, 'asdads', 4, '2020-08-15');
/*!40000 ALTER TABLE `users_profile` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
