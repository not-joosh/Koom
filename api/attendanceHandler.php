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
            // echo "THIS IS THE DATA ON BACKEND OF ATTENDANCE:";
            // echo json_encode($data);
            // echo "\n\n\n\n\n\n";

            // Establishing a PDO connection
            $pdo = new PDO("mysql:host=$server;dbname=$db", $user, $password);
            
            $stmt = $pdo->prepare("INSERT INTO attendance (attendance_id, user, day_entered, month_entered, year_entered, time_str_entered) VALUES (:attendance_id, :user, :day_entered, :month_entered, :year_entered, :time_str_entered)");

            if (isset($_GET['attendanceCheckout'])) {
                // The data will contain "id" to query the attendance table. That is the table we will update,
                // The data will also contain the time_str_exit, which we will go ahead and uapte this portion of the table.
                // Update the time_str_exit for the given attendance_id
                echo "attendanceCheckout";
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

            // now we will clear the checkin_id of the user
            $stmt = $pdo->prepare("UPDATE user SET checkin_id = NULL WHERE id = :id");
            $stmt->bindParam(':id', $data['user']['id']);
            $stmt->execute();
            
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