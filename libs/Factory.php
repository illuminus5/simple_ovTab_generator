<?php

require_once('Smarty.class.php');

date_default_timezone_set('America/Los_Angeles');

/**
 * Factory class
 *
 * @static
 */
class Factory
{

  private static $smarty_instance;


 /**
	 * Get our smarty object
	 *
	 * Returns a reference to a static smarty object, only creating it
	 * if it doesn't already exist. Basically a singleton design pattern.
	 *
	 * @return object reference Smarty
	 */
	  public static function &getSmarty()
	  {

		if (!isset(self::$smarty_instance) )
		{
		  self::$smarty_instance = new Smarty();

		  self::$smarty_instance->template_dir  = 'C:\Users\1000081983\Documents\GitHub\simple_ovTab_generator\smarty\templates';
		  self::$smarty_instance->config_dir    = 'C:\Users\1000081983\Documents\GitHub\simple_ovTab_generator\smarty\configs';
		  self::$smarty_instance->cache_dir     = 'c:/smarty/templates/cache';
		  self::$smarty_instance->compile_dir   = 'c:/smarty/templates/templates_c';
		}

			return self::$smarty_instance;
	  }

	/**
	 * Get a database object
	 *
	 * Returns a reference to the static Database object, only creating it
	 * if it doesn't already exist. Basically a singleton design pattern.
	 *
	 * @return object reference Database
	 */
	static function &getDBO()
	{
		static $instance;

		if (!is_object($instance))
		{
			$instance = Factory::_createDBO();
		}

		return $instance;
	}


	/**
	 * Create an database object
	 *
	 * @access private
	 * @return object reference Database
	 * @since 1.0
	 */

	static function &_createDBO()
	{
		//$host 		= "209.216.213.109";
		$host = "localhost";
		$user 		= "username";
		$password = "password";
		$database	= "dbname";

		// connect to the server
		if (!($db = @mysqli_connect( $host, $user, $password, $database))) {
			die("There was an error #234: " . mysqli_connect_error());
			return;
		}

		return $db;
	}



}
