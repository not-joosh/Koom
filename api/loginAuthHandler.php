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

        if (!isset($data['email']) || !isset($data['password']) ||
            !isset($data['day_entered']) || !isset($data['month_entered']) ||
            !isset($data['year_entered']) || !isset($data['time_str_entered'])) {
            echo json_encode(array("message" => "Incomplete data provided."));
            http_response_code(400); // Bad request
            exit();
        }

        try {
            // Establishing a PDO connection
            $pdo = new PDO("mysql:host=$server;dbname=$db", $user, $password);

            // Query the database for the user with the provided email
            $query = "SELECT id, first_name, last_name, middle_name, city, address, password, barangay, province, email, account_type, contact_number FROM user WHERE email = :email";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':email', $data['email']);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check if user exists
            if (!$user) {
                echo json_encode(array("message" => "User not found."));
                http_response_code(404); // Not found
                exit();
            }

            // Compare passwords
            $hashedPassword = md5($data['password']);
            if ($hashedPassword === $user['password']) {
                // Passwords match, authentication successful

                // Filter the user data
                $filteredUserData = array_diff_key($user, array_flip(['password']));
                // Create attendance record
                $attendanceData = array(
                    'user' => json_encode($filteredUserData),
                    'day_entered' => $data['day_entered'],
                    'month_entered' => $data['month_entered'],
                    'year_entered' => $data['year_entered'],
                    'time_str_entered' => $data['time_str_entered']
                );

                // Insert attendance record into database
                $insertQuery = "INSERT INTO attendance (user, day_entered, month_entered, year_entered, time_str_entered) 
                                VALUES (:user, :day_entered, :month_entered, :year_entered, :time_str_entered)";
                $stmt = $pdo->prepare($insertQuery);
                $stmt->bindParam(':user', $attendanceData['user']);
                $stmt->bindParam(':day_entered', $attendanceData['day_entered']);
                $stmt->bindParam(':month_entered', $attendanceData['month_entered']);
                $stmt->bindParam(':year_entered', $attendanceData['year_entered']);
                $stmt->bindParam(':time_str_entered', $attendanceData['time_str_entered']);
                $stmt->execute();

                $attendanceId = $pdo->lastInsertId();

                // Update user's checkin_id with attendance_id
                $updateQuery = "UPDATE user SET checkin_id = :attendance_id, last_checkin_time = :time_str_entered, last_checkin_date = CURDATE() WHERE id = :id";
                $stmt = $pdo->prepare($updateQuery);
                $stmt->bindParam(':attendance_id', $attendanceId);
                $stmt->bindParam(':time_str_entered', $attendanceData['time_str_entered']);
                $stmt->bindParam(':id', $user['id']);
                $stmt->execute();

                echo json_encode(array(
                    "message" => "Login successful",
                    "user" => $filteredUserData,
                    "attendance_id" => $attendanceId
                ));
                http_response_code(200); // OK
            } else {
                // Passwords don't match, authentication failed
                echo json_encode(array("message" => "Invalid credentials"));
                http_response_code(401); // Unauthorized
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
