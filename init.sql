CREATE TABLE IF NOT EXISTS `channels` (`channel_name` varchar(255) NOT NULL, PRIMARY KEY (`channel_name`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1
CREATE TABLE IF NOT EXISTS `error_logs` (`error_id` int(11) NOT NULL AUTO_INCREMENT, `error_message` text NOT NULL, `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`error_id`) ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1
CREATE TABLE IF NOT EXISTS `tokens` (`user_id` int(11) NOT NULL, `access_token` text, `login_name` text, `refresh_token` text, `scope` text, PRIMARY KEY (`user_id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1
CREATE TABLE IF NOT EXISTS `stats` (`where_placeholder` int(1) NOT NULL, `commandsHandled` int(11) NOT NULL, PRIMARY KEY (`where_placeholder`), UNIQUE KEY `where_placeholder_UNIQUE` (`where_placeholder`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1
CREATE TABLE IF NOT EXISTS `commands` (`id` int(11) NOT NULL AUTO_INCREMENT, `name` text NOT NULL, `description` text NOT NULL, `perm` int(11) NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Essentially all commands'