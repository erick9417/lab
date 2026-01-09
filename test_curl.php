<?php
// Test if curl can reach backend
header('Content-Type: text/plain');

$url = "http://127.0.0.1:4000/health";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$error = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Target: $url\n";
echo "HTTP Code: $httpCode\n";
echo "Error: " . ($error ?: "none") . "\n";
echo "Response: $response\n";
