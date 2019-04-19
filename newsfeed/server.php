<?php
// Get username/password parameter from URL
$username = $_REQUEST["username"];
$password = $_REQUEST["password"];

// Fetch the database
$database = file_get_contents('./user-database.json', true);
$database_arr = json_decode($database, true);

// Load the new credentials into the database
$new_user['username'] = $username;
$new_user['password'] = $password;
array_push($database_arr['users'], $new_user); //push contents to the decoded array i.e $database_arr
$json_database = json_encode($database_arr);

// Perform file write to database
$myfile = fopen("user-database.json", "w") or die("Unable to open file!");
fwrite($myfile, $json_database);
fclose($myfile);
?>
