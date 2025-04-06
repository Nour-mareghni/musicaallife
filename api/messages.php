<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function getCurrentUserId() {
    
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    try {
        
        $decoded = JWT::decode($token, 'your_secret_key', ['HS256']);
        return $decoded->userId;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
}

// GET messages for a conversation
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['recipientId'])) {
    try {
        $currentUserId = getCurrentUserId();
        $recipientId = filter_var($_GET['recipientId'], FILTER_VALIDATE_INT);
        
        if ($recipientId === false) {
            throw new Exception("Invalid recipient ID");
        }
        
        $stmt = $conn->prepare("
            SELECT * FROM messages 
            WHERE (sender_id = ? AND recipient_id = ?)
            OR (sender_id = ? AND recipient_id = ?)
            ORDER BY timestamp ASC
        ");
        $stmt->bind_param("iiii", $currentUserId, $recipientId, $recipientId, $currentUserId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $messages = [];
        while ($row = $result->fetch_assoc()) {
            $messages[] = $row;
        }
        
        echo json_encode(['messages' => $messages]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// POST a new message
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $currentUserId = getCurrentUserId();
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['recipientId']) || !isset($data['content'])) {
            throw new Exception("Missing required fields");
        }
        
        $recipientId = filter_var($data['recipientId'], FILTER_VALIDATE_INT);
        $content = trim($data['content']);
        
        if ($recipientId === false) {
            throw new Exception("Invalid recipient ID");
        }
        
        if (empty($content)) {
            throw new Exception("Message content cannot be empty");
        }
        
        $stmt = $conn->prepare("
            INSERT INTO messages (sender_id, recipient_id, content)
            VALUES (?, ?, ?)
        ");
        $stmt->bind_param("iis", $currentUserId, $recipientId, $content);
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to send message");
        }
        
        $messageId = $stmt->insert_id;
        $stmt = $conn->prepare("SELECT * FROM messages WHERE id = ?");
        $stmt->bind_param("i", $messageId);
        $stmt->execute();
        $message = $stmt->get_result()->fetch_assoc();
        
        echo json_encode(['message' => $message]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
?>