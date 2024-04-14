<?php
// Using PDO to establish a connection to the database
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
// Handling the method
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        // Create a PDO instance
        $pdo = new PDO("mysql:host=$server;dbname=$db", $user, $password);
        // Set PDO to throw exceptions
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        try {
            // Query to fetch all attendance logs
            $query = "SELECT * FROM attendance";
            $stmt = $pdo->query($query);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Loop through rows and decode 'user' field from JSON
            foreach ($rows as &$row) {
                $row['user'] = json_decode($row['user'], true);
            }

            // Return the JSON response
            header('Content-Type: application/json');
            echo json_encode($rows);
        } catch (PDOException $e) {
            // Handle database errors
            echo json_encode(array("error" => "Database Error: " . $e->getMessage()));
        }
        break;
    case 'POST':
        echo "POST";
        break;
    case 'PUT':
        echo "PUT";
        break;
    case 'DELETE':
        echo "DELETE";
        break;
    default:
        echo "Invalid request method";
        break;
}
?>