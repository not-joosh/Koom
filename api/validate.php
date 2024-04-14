<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$envFile = __DIR__ . '/_local.env';
if (file_exists($envFile)) {
    $envVars = parse_ini_file($envFile);
    $server = $envVars['DB_SERVER'];
    $user = $envVars['DB_USER'];
    $password = $envVars['DB_PASSWORD'];
    $db = $envVars['DB_NAME'];
} else {
    die("Local environment file not found.");
}

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['usc_id_num'])) {
            echo json_encode(array("message" => "Incomplete data provided."));
            http_response_code(400); // Bad request
            exit();
        }

        try {
            // Establishing a PDO connection
            $pdo = new PDO("mysql:host=$server;dbname=$db", $user, $password);

            // Query the database for the user with the provided USC ID number
            $query = "SELECT id, first_name, password, last_name, middle_name, city, address, barangay, province, email, account_type, contact_number FROM user WHERE id = :id";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':id', $data['usc_id_num']);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check if user exists
            if ($user) {
                // USC ID number is valid, user found
                echo json_encode(array(
                    "message" => "Valid USC ID number",
                    "user" => $user
                ));
                http_response_code(200); // OK
            } else {
                // USC ID number is not valid, user not found
                echo json_encode(array("message" => "Invalid USC ID number"));
                http_response_code(404); // Not found
            }
        } catch (PDOException $e) {
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
            http_response_code(500); // Internal Server Error
        }
        break;
    default:
        echo "Invalid request method";
        break;
}
?>
