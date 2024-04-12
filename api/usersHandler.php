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

    // Handing the method
    $method = $_SERVER['REQUEST_METHOD'];
    switch($method) {
        case 'GET':
            // Create a PDO instance
            $pdo = new PDO("mysql:host=$server;dbname=$db", $user, $password);
            // Prepare and execute the query
            $query = "SELECT * FROM user";
            $stmt = $pdo->prepare($query);
            $stmt->execute();

            // Fetch all rows as an associative array
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Return the JSON response
            header('Content-Type: application/json');
            echo json_encode($rows);
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