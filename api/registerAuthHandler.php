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
            // Getting the data from the front end
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Establishing a PDO connection
            $pdo = new PDO("mysql:host=$server;dbname=$db", $user, $password);
            
            // Check if email or contact number already exists
            $emailCheckStmt = $pdo->prepare("SELECT * FROM user WHERE email = :email");
            $emailCheckStmt->bindParam(':email', $data['user']['RegistrationData']['email']);
            $emailCheckStmt->execute();
            $emailExists = $emailCheckStmt->fetch();

            $contactCheckStmt = $pdo->prepare("SELECT * FROM user WHERE contact_number = :contact_number");
            $contactCheckStmt->bindParam(':contact_number', $data['user']['RegistrationData']['contact_number']);
            $contactCheckStmt->execute();
            $contactExists = $contactCheckStmt->fetch();

            if ($emailExists || $contactExists) {
                // Email or Contact number already in use
                echo json_encode(array("message" => "The email or contact number is already in use. Please try again."));
                http_response_code(400);
                exit();
            }
            
            // Step 1: Insert User Data
            $insertUserStmt = $pdo->prepare("INSERT INTO user (first_name, last_name, middle_name, address, city, barangay, province, email, contact_number, password, account_type, last_checkin_time, last_checkin_date) 
                                    VALUES (:first_name, :last_name, :middle_name, :address, :city, :barangay, :province, :email, :contact_number, :password, :account_type, :last_checkin_time, :last_checkin_date)");
            
            $insertUserStmt->bindParam(':first_name', $data['user']['RegistrationData']['first_name']);
            $insertUserStmt->bindParam(':last_name', $data['user']['RegistrationData']['last_name']);
            $insertUserStmt->bindParam(':middle_name', $data['user']['RegistrationData']['middle_name']);
            $insertUserStmt->bindParam(':address', $data['user']['RegistrationData']['address']);
            $insertUserStmt->bindParam(':city', $data['user']['RegistrationData']['city']);
            $insertUserStmt->bindParam(':barangay', $data['user']['RegistrationData']['barangay']);
            $insertUserStmt->bindParam(':province', $data['user']['RegistrationData']['province']);
            $insertUserStmt->bindParam(':email', $data['user']['RegistrationData']['email']);
            $insertUserStmt->bindParam(':contact_number', $data['user']['RegistrationData']['contact_number']);
            $password = md5($data['user']['RegistrationData']['password']);
            $insertUserStmt->bindParam(':password', $password);
            $insertUserStmt->bindValue(':account_type', "user");
            $insertUserStmt->bindParam(':last_checkin_time', $data['time_str_entered']);
            $last_checkin_date = $data["month_entered"] . ' ' . $data["day_entered"] . ', ' . $data["year_entered"];
            $insertUserStmt->bindParam(':last_checkin_date', $last_checkin_date);

            if (!$insertUserStmt->execute()) {
                echo json_encode(array("message" => "Error inserting user data."));
                http_response_code(500);
                exit();
            }

            // After inserting the user, we can retrieve the user's data with a query 
            $userStmt = $pdo->prepare("SELECT * FROM user WHERE email = :email");
            $userStmt->bindParam(':email', $data['user']['RegistrationData']['email']);
            $userStmt->execute();
            $user_information = $userStmt->fetch();


            // Step 2: Insert Attendance Data
            $attendanceStmt = $pdo->prepare("INSERT INTO attendance (user, day_entered, month_entered, year_entered, time_str_entered) 
                                    VALUES (:user, :day_entered, :month_entered, :year_entered, :time_str_entered)");
            $userJson = json_encode(array(
                "id" => $pdo->lastInsertId(), 
                "first_name" => $data['user']['RegistrationData']['first_name'],
                "last_name" => $data['user']['RegistrationData']['last_name'],
                "middle_name" => $data['user']['RegistrationData']['middle_name'],
                "address" => $data['user']['RegistrationData']['address'],
                "city" => $data['user']['RegistrationData']['city'],
                "barangay" => $data['user']['RegistrationData']['barangay'],
                "province" => $data['user']['RegistrationData']['province'],
                "email" => $data['user']['RegistrationData']['email'],
                "contact_number" => $data['user']['RegistrationData']['contact_number'],
                "account_type" => "user"
            ));
            $attendanceStmt->bindParam(':user', $userJson);
            $attendanceStmt->bindParam(':day_entered', $data['day_entered']);
            $attendanceStmt->bindParam(':month_entered', $data['month_entered']);
            $attendanceStmt->bindParam(':year_entered', $data['year_entered']);
            $attendanceStmt->bindParam(':time_str_entered', $data['time_str_entered']);

            if (!$attendanceStmt->execute()) {
                echo json_encode(array("message" => "Error inserting attendance data."));
                http_response_code(500);
                exit();
            }

            // Step 3: Insert checkin_id into user table
            $checkinIdStmt = $pdo->prepare("UPDATE user SET checkin_id = :checkin_id WHERE email = :email");
            $latestCheckinId = $pdo->lastInsertId();
            $checkinIdStmt->bindParam(':checkin_id', $latestCheckinId);
            $checkinIdStmt->bindParam(':email', $data['user']['RegistrationData']['email']);
            if (!$checkinIdStmt->execute()) {
                echo json_encode(array("message" => "Error updating checkin_id."));
                http_response_code(500);
                exit();
            }

            // Step 4: Return checkin_id and account_type
            echo json_encode(array("message" => "Registration successful", "checkin_id" => $latestCheckinId, "account_type" => "user", "user_id" => $user_information['id']));
            http_response_code(200);
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
