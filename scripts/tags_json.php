<?php
require 'tmhOAuth.php';

$connection = new tmhOAuth(array(
	'consumer_key' => 'Eun1ZnisMpBKd59d2MeLyIRQc',
	'consumer_secret' => 'qwKfyBLT013OS6MccpJIHEWcVTehijBH5aneaRMSw0p24t0y0s',
	'user_token' => '14686937-qXglkrN3opX0lXrxssY9M1FeEEQYy8dfNMu8MFBTW', //access token
	'user_secret' => 'oyZkpiVtIU7DKX2kbKvCU3GmHDCCadZBxN3iGUEBFQiz5' //access token secret
));

// set up parameters to pass
$parameters = array();

if ($_GET['count']) {
	$parameters['count'] = strip_tags($_GET['count']);
}

if ($_GET['q']) {
	$parameters['q'] = strip_tags($_GET['q']);
}

if ($_GET['twitter_path']) { $twitter_path = $_GET['twitter_path']; }  else {
	$twitter_path = '1.1/search/tweets.json';
}


$http_code = $connection->request('GET', $connection->url($twitter_path), $parameters );

if ($http_code === 200) { // if everything's good
	$response = strip_tags($connection->response['response']);

	if ($_GET['callback']) { // if we ask for a jsonp callback function
		echo $_GET['callback'],'(', $response,');';
	} else {
		echo $response;	
	}
} else {
	echo "Error ID: ",$http_code, "<br>\n";
	echo "Error: ",$connection->response['error'], "<br>\n";
}
