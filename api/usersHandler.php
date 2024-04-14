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
            // Set PDO to throw exceptions
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Initialize an empty array for the query parameters
            $queryParams = [];

            // Check if queryContactNumber is set
            if(isset($_GET['queryContactNumber'])) {
                $query = "SELECT * FROM user WHERE contact_number = :contact_number";
                $queryParams['contact_number'] = $_GET['queryContactNumber'];
            } 
            // Check if queryEmail is set
            else if(isset($_GET['queryEmail'])) {
                $query = "SELECT * FROM user WHERE email = :email";
                $queryParams['email'] = $_GET['queryEmail'];
            } 
            // Check if queryID is set
            else if (isset($_GET['queryID'])) {
                $query = "SELECT * FROM user WHERE id = :id";
                $queryParams['id'] = $_GET['queryID'];
            } 
            // Check if queryUscID is set
            else if (isset($_GET['queryUscID'])) {
                $query = "SELECT * FROM user WHERE usc_id_num = :usc_id_num";
                $queryParams['usc_id_num'] = $_GET['queryUscID'];
            } 
            // Default query if no parameters are provided
            else {
                $query = "SELECT * FROM user";
            }

            // Prepare the SQL query
            $stmt = $pdo->prepare($query);

            // Bind parameters
            foreach ($queryParams as $param => $value) {
                $stmt->bindParam(':' . $param, $value);
            }

            // Execute the query
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
