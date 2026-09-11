<?php
/**
 * Contact form handler - jm2eng.com (IONOS Web Hosting)
 *
 * Replaces the Formspree placeholder. Same shape as the Southern Electric
 * handler, but IONOS - unlike GoDaddy - lets web hosting send mail, so this
 * uses PHP mail() through IONOS's own relay. No third-party service, no key.
 *
 * DELIVERABILITY NOTE: jm2eng.com's SPF record includes _spf-us.ionos.com and
 * _spf.perfora.net, which authorise IONOS's outbound relays. The From address
 * and the envelope sender (-f) MUST stay on @jm2eng.com for that to pass.
 * The visitor's address goes in Reply-To, never in From.
 */

declare(strict_types=1);

// ---------------------------------------------------------------- settings
// Everyone listed receives every inquiry. Add or remove entries freely.
const MAIL_TO = [
    'bdougan@jm2eng.com',
    'dwalton@jm2eng.com',
];
const MAIL_FROM      = 'website@jm2eng.com';
const SITE_NAME      = 'JM2 Associates';
const SUBMISSION_LOG = __DIR__ . '/submissions.log';  // .htaccess denies *.log
const MAX_PER_HOUR   = 8;                              // per IP
const FALLBACK_MSG   = 'Our web form is temporarily unavailable. Please call (731) 736-4441 or email bdougan@jm2eng.com.';

// ---------------------------------------------------------------- helpers
function respond(int $code, array $body): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body);
    exit;
}
/** Strip CR/LF so a submitted value can never inject mail headers. */
function clean(string $v, int $max = 500): string {
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);
    return trim(mb_substr($v, 0, $max));
}

// ---------------------------------------------------------------- guards
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// Honeypot: bots fill hidden fields. Report success so they don't retry.
if (trim((string)($_POST['_gotcha'] ?? '')) !== '') {
    respond(200, ['ok' => true]);
}

// Crude per-IP rate limit. Keeps a burst from turning into an inbox flood.
$ip   = preg_replace('/[^0-9a-f:.]/i', '', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$file = sys_get_temp_dir() . '/jm2_contact_' . md5($ip);
$hits = [];
if (is_readable($file)) {
    $hits = array_filter(
        (array)json_decode((string)file_get_contents($file), true),
        static fn($t) => is_int($t) && $t > time() - 3600
    );
}
if (count($hits) >= MAX_PER_HOUR) {
    respond(429, ['ok' => false, 'error' => 'Too many messages. Please call us at (731) 736-4441.']);
}

// ---------------------------------------------------------------- validate
$name    = clean((string)($_POST['name'] ?? ''), 120);
$email   = clean((string)($_POST['email'] ?? ''), 190);
$phone   = clean((string)($_POST['phone'] ?? ''), 60);
$subject = clean((string)($_POST['subject'] ?? ''), 160);
$message = trim((string)($_POST['message'] ?? ''));
$message = mb_substr(str_replace("\r\n", "\n", $message), 0, 8000);

if ($name === '' || $subject === '' || $message === '') {
    respond(422, ['ok' => false, 'error' => 'Please fill in every required field.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'That email address does not look right.']);
}

// ---------------------------------------------------------------- record
// Log every submission on the server BEFORE trying to send, so a message
// that gets filtered downstream is an inconvenience, not a lost lead.
// One JSON object per line; read it in the IONOS Webspace Explorer.
@file_put_contents(SUBMISSION_LOG, json_encode([
    'at'      => date('c'),
    'name'    => $name,
    'email'   => $email,
    'phone'   => $phone,
    'subject' => $subject,
    'message' => $message,
    'ip'      => $ip,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);

// ---------------------------------------------------------------- send
$body = "New message from the " . SITE_NAME . " website\n"
      . str_repeat('-', 52) . "\n\n"
      . "Name:    {$name}\n"
      . "Email:   {$email}\n"
      . "Phone:   " . ($phone !== '' ? $phone : '(not given)') . "\n"
      . "Subject: {$subject}\n\n"
      . "Message:\n{$message}\n\n"
      . str_repeat('-', 52) . "\n"
      . "Sent: " . date('Y-m-d H:i:s T') . "\n"
      . "IP:   {$ip}\n";

$headers = implode("\r\n", [
    'From: ' . mb_encode_mimeheader(SITE_NAME . ' Website', 'UTF-8') . ' <' . MAIL_FROM . '>',
    'Reply-To: ' . mb_encode_mimeheader($name, 'UTF-8') . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$sent = mail(
    implode(', ', MAIL_TO),
    mb_encode_mimeheader('[Website] ' . $subject, 'UTF-8'),
    $body,
    $headers,
    '-f' . MAIL_FROM   // envelope sender on our domain, so SPF passes
);

if (!$sent) {
    error_log('contact.php: mail() failed for ' . $email);
    respond(500, ['ok' => false, 'error' => FALLBACK_MSG]);
}

$hits[] = time();
@file_put_contents($file, json_encode(array_values($hits)));

respond(200, ['ok' => true]);
