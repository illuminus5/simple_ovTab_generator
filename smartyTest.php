<?php
// load Smarty library

session_start();

require_once('/libs/Factory.php');
$smarty =& Factory::getSmarty();

// Testing this
$smarty->display('index.tpl');