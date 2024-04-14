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
        case 'POST':
            // Getting the data from the front end
            $data = json_decode(file_get_contents('php://input'), true);

            // Check if required fields are present
            if (!isset($data['email']) || !isset($data['password'])) {
                echo json_encode(array("message" => "Incomplete data provided."));
                http_response_code(400); // Bad request
                exit();
            }

            // Establishing a PDO connection
            $pdo = new PDO("mysql:host=$server;dbname=$db", $user, $password);

            // Query the database for the user with the provided email
            $query = "SELECT id, first_name, last_name, middle_name, city, usc_id_num, password, barangay, province, email, account_type, contact_number FROM user WHERE email = :email";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':email', $data['email']);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check if user exists
            if (!$user) {
                // echo json_encode(array("message" => "User not found."));
                // http_response_code(404); // Not found
                exit();
            }

            // Compare passwords
            $hashedPassword = md5($data['password']);
            if ($hashedPassword === $user['password']) {
                // Passwords match, authentication successful
                unset($user['password']); // Remove the password from the response
                echo json_encode(array("message" => "Login successful", "user" => $user));
                http_response_code(200); // OK
            } else {
                // Passwords don't match, authentication failed
                echo json_encode(array("message" => "Invalid credentials"));
                http_response_code(401); // Unauthorized
            }
            break;
        default:
            echo "Invalid request method";
            break;
    }
    /*
    /*
    {
        "city": "814 M.L. Quezon Ave., F-P Tudtud Cmpd., Brgy. Cabancalan, Mandaue City, Cebu 6014",
        "email": "20104272@usc.edu.ph",
        "address": "Cabancalan",
        "barangay": "Cebu",
        "province": "Mandaue City",
        "last_name": "Ratificar",
        "first_name": "Josh",
        "middle_name": "Bobier",
        "contact_number": "9171426857"
    }
    */
?>
