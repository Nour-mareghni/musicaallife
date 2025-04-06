<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "musicalLife";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

if ($action === 'login') {
    // Login Logic
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $conn->prepare("SELECT id, name, email, password, bio, age FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            unset($user['password']); // Remove password before sending back
            echo json_encode([
                "success" => true,
                "user" => $user,
                "message" => "Login successful"
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
    }
} 
elseif ($action === 'register') {
    // Registration Logic
    $required = ['name', 'email', 'password', 'age'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["error" => "$field is required"]);
            exit;
        }
    }

    $name = $data['name'];
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $bio = $data['bio'] ?? '';
    $age = (int)$data['age'];

    // Check if email exists
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    
    if ($check->get_result()->num_rows > 0) {
        http_response_code(409);
        echo json_encode(["error" => "Email already exists"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, bio, age) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $name, $email, $password, $bio, $age);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "user" => [
                "name" => $name,
                "email" => $email,
                "bio" => $bio,
                "age" => $age
            ],
            "message" => "Registration successful"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Registration failed: " . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid action"]);
}

$conn->close();
?>