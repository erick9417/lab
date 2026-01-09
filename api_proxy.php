<?php
// Simple reverse proxy to Node.js backend on localhost:4000
// Routes: /api/* -> http://127.0.0.1:4000/api/*

$path = isset($_GET['path']) ? $_GET['path'] : '';
$target = "http://127.0.0.1:4000/api/" . $path;

$method = $_SERVER['REQUEST_METHOD'];
$body   = file_get_contents('php://input');
$headers = function_exists('getallheaders') ? getallheaders() : [];

// Build headers to forward
$forwardHeaders = [];
foreach ($headers as $k => $v) {
  $kLower = strtolower($k);
  // forward common headers
  if (in_array($kLower, ['content-type','authorization','cache-control','pragma','expires'])) {
    $forwardHeaders[] = $k . ': ' . $v;
  }
}

$ch = curl_init($target);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
if ($body !== false && strlen($body) > 0) {
  curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);
if ($response === false) {
  http_response_code(502);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Bad Gateway', 'detail' => curl_error($ch)]);
  curl_close($ch);
  exit;
}

$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header_str  = substr($response, 0, $header_size);
$body_str    = substr($response, $header_size);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Forward status code
http_response_code($status_code);

// Forward content-type
$contentType = 'application/json; charset=utf-8';
foreach (explode("\r\n", $header_str) as $hline) {
  if (stripos($hline, 'Content-Type:') === 0) {
    $contentType = trim(substr($hline, strlen('Content-Type:')));
    break;
  }
}
header('Content-Type: ' . $contentType);

// Output body
echo $body_str;

curl_close($ch);
