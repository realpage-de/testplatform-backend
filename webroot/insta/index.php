<?php
require_once 'config.php';

require_once 'TokenFile.php';

require_once 'InstagramBasicDisplay.php';
require_once 'InstagramBasicDisplayException.php';

$mode = 'carina';

if (isset($_GET['logout'])) {
	TokenFile::save('');
	header('Location: ' . dirname($_SERVER['PHP_SELF']) . '/');
}

// login
if (isset($_GET['code'])) {
	$instagram = new InstagramBasicDisplay([
		'appId' => $config[$mode]['appId'],
		'appSecret' => $config[$mode]['appSecret'],
		'redirectUri' => $config[$mode]['redirectUri']
	]);

	// get the short lived access token (valid for 1 hour)
	$token = $instagram->getOAuthToken($_GET['code'], true);

	// exchange this token for a long lived token (valid for 60 days)
	$token = $instagram->getLongLivedToken($token, true);
	TokenFile::save($token);
	header('Location: ' . dirname($_SERVER['PHP_SELF']) . '/');
}

$token = TokenFile::read();
$instagram = new InstagramBasicDisplay($token);
$accessToken = $instagram->getAccessToken();
if (!$accessToken || $accessToken->error) {
	$hasAccess = false;
	$instagram = new InstagramBasicDisplay([
		'appId' => $config[$mode]['appId'],
		'appSecret' => $config[$mode]['appSecret'],
		'redirectUri' => $config[$mode]['redirectUri']
	]);
} else {
	$hasAccess = true;
}

if ($hasAccess) {
	$user = $instagram->getUserProfile();

	echo '<p>eingeloggt als: <strong>' . $user->username . '</strong></p>';
	echo '<p><a href="?logout">Logout</a></p>';
} else {
	echo '<p><a href="' . $instagram->getLoginUrl() . '">Instagram-Login</a></p>';
}