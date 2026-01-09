<?php
// Ultra-simple API proxy
error_reporting(E_ALL);
ini_set('display_errors', '1');

$path = $_GET['path'] ?? '';
$url = "http://127.0.0.1:4000/api/" . $path;

$method = $_SERVER['REQUEST_METHOD'];
$body = file_get_contents('php://input');

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$headers = ['Content-Type: application/json'];
if ($method !== 'GET' && strlen($body) > 0) {
  curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
  $headers[] = 'Content-Length: ' . strlen($body);
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
  http_response_code(502);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Gateway error', 'detail' => $error]);
  exit;
}

http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
