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
            
            $stmt = $pdo->prepare("INSERT INTO user (id, first_name, last_name, middle_name, city, barangay, province, email, contact_number, password, account_type, usc_id_num, last_checkin_time, last_checkin_date) VALUES (:id, :first_name, :last_name, :middle_name, :city, :barangay, :province, :email, :contact_number, :password, :account_type, :usc_id_num, :last_checkin_time, :last_checkin_date)");
            // The table will be users
            $id = 11111111; // Assuming your id starts from 0
            $first_name = $data['user']['RegistrationData']['first_name'];
            $last_name = $data['user']['RegistrationData']['last_name'];
            $middle_name = $data['user']['RegistrationData']['middle_name'];
            $city = $data['user']['RegistrationData']['city'];
            $barangay = $data['user']['RegistrationData']['barangay'];
            $province = $data['user']['RegistrationData']['province'];
            $email = $data['user']['RegistrationData']['email'];
            $contact_number = $data['user']['RegistrationData']['contact_number'];
            $password = md5($data['user']['RegistrationData']['password']);
            $account_type = "user";
            $usc_id_num = "";
            $last_checkin_time = $data['time_str_entered']; // this the front end string -> setTime(`${formattedHours}:${minutes} ${ampm}`);
            $last_checkin_date = $data["month_entered"] . ' ' . $data["day_entered"] . ', ' . $data["year_entered"]; // this is the front end string -> setDate(`${month} ${day}, ${year}`);
            $last_checkout_time = "";

            // Binding the parameters
            $stmt->bindParam(':id', $id);
            echo "\nSEEING IF THIS IS WHERE IT BREAKS\n";
            $stmt->bindParam(':first_name', $first_name);
            $stmt->bindParam(':last_name', $last_name);
            $stmt->bindParam(':middle_name', $middle_name);
            $stmt->bindParam(':city', $city);
            $stmt->bindParam(':barangay', $barangay);
            $stmt->bindParam(':province', $province);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':contact_number', $contact_number);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':account_type', $account_type);
            $stmt->bindParam(':usc_id_num', $usc_id_num);
            $stmt->bindParam(':last_checkin_time', $last_checkin_time);
            $stmt->bindParam(':last_checkin_date', $last_checkin_date);

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