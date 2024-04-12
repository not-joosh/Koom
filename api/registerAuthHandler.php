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
            echo "GET";
            
            break;
        case 'POST':
            echo "POST";
            // Getting the data from the front end and echo it
            $data = json_decode(file_get_contents('php://input'), true);
            // echo json_encode($data);
            // Establishing a PDO connection
            $pdo = new PDO("mysql:host=$server;dbname=$db", $user, $password);
            
            // Preparing the SQL statement
            $stmt = $pdo->prepare("INSERT INTO user (id, first_name, last_name, middle_name, city, barangay, province, email, contact_number, password, user_type, usc_id_num) VALUES (:id, :first_name, :last_name, :middle_name, :city, :barangay, :province, :email, :contact_number, :password, :account_type, :usc_id_num)");
            
            // Binding the parameters
            // The ID is auto-incremented so we don't need to bind it, the $data doesnt have the ID as well
            // just increment the ID on the database
            $id = 0;
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':first_name', $data['first_name']);
            $stmt->bindParam(':last_name', $data['last_name']);
            $stmt->bindParam(':middle_name', $data['middle_name']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':barangay', $data['barangay']);
            $stmt->bindParam(':province', $data['province']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':contact_number', $data['contact_number']);
            $passwordHash = md5($data['password']);
            $stmt->bindParam(':password', $passwordHash);
            $user_type = "user";
            $stmt->bindParam(':account_type', $user_type);
            
            // Executing the statement
            if ($stmt->execute()) {
                echo "Data inserted successfully";
            } else {
                echo "Error inserting data";
            }

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