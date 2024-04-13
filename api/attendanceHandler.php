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
            // Getting the data from the front end and echo it
            $data = json_decode(file_get_contents('php://input'), true);
            // echo json_encode($data);

            // Establishing a PDO connection
            $pdo = new PDO("mysql:host=$server;dbname=$db", $user, $password);
            
            $stmt = $pdo->prepare("INSERT INTO attendance (attendance_id, user, day_entered, month_entered, year_entered, time_str_entered) VALUES (:attendance_id, :user, :day_entered, :month_entered, :year_entered, :time_str_entered)");

            if(isset($_GET['attendanceInitialize'])) {
                // Transferring intial items into attendance 
                // Binding the parameters
                $attendance_id = 11111111; 
                $stmt->bindParam(':attendance_id', $attendance_id);
                
                // removing the password and confirmPassword
                $filtered_user = json_encode([
                    "first_name" => $data['user']['RegistrationData']['first_name'],
                    "middle_name" => $data['user']['RegistrationData']['middle_name'],
                    "last_name" => $data['user']['RegistrationData']['last_name'],
                    "email" => $data['user']['RegistrationData']['email'],
                    "contact_number" => $data['user']['RegistrationData']['contact_number'],
                    "address" => $data['user']['RegistrationData']['address'],
                    "city" => $data['user']['RegistrationData']['city'],
                    "barangay" => $data['user']['RegistrationData']['barangay'],
                    "province" => $data['user']['RegistrationData']['province']
                ]);
    
                $stmt->bindParam(':user', $filtered_user);
                $stmt->bindParam(':day_entered', $data['day_entered']);
                $stmt->bindParam(':month_entered', $data['month_entered']);
                $stmt->bindParam(':year_entered', $data['year_entered']);
                $stmt->bindParam(':time_str_entered', $data['time_str_entered']);
            } else if (isset($_GET['attendanceCheckout'])) {
                // The data will contain "id" to query the attendance table. That is the table we will update,
                // The data will also contain the time_str_exit, which we will go ahead and uapte this portion of the table.
                // Update the time_str_exit for the given attendance_id
                $stmt = $pdo->prepare("UPDATE attendance SET time_str_exit = :time_str_exit WHERE attendance_id = :attendance_id");
                
                $attendance_id = $data['id']; // Assuming the data contains the attendance_id to update
                $time_str_exit = $data['time_str_exit'];
    
                $stmt->bindParam(':attendance_id', $attendance_id);
                $stmt->bindParam(':time_str_exit', $time_str_exit);
            }

            // Executing the statement
            if ($stmt->execute()) {
                echo "success";
            } else {
                echo "error";
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