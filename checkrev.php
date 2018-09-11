<?php

include_once("functions/db.php");

if(!empty($_GET['revcode'])) {
    $revcode = $_GET['revcode'];

    $stmt = $db->prepare('SELECT * FROM revisions WHERE revCode=?');
    $stmt->bind_param('s', $revcode); // 's' specifies the variable type => 'string'
    $stmt->execute();
    $result = $stmt->get_result();


    if ($result->num_rows > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $status = $row['status'];
            $revision = $row['revision'];
            $documentId = $row['documentId'];
            $stmt = $db->prepare('SELECT * FROM documents WHERE id=?');
            $stmt->bind_param('s', $documentId); // 's' specifies the variable type => 'string'
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $documentName = $row['docName'];
                    if($row['status'] == 'active'){
                        $warning = '';
                    } else {
                        $warning = 'This document has been archived. The information may not be current';
                    }
                }
            }
            if ($status == 'latest'){
                $template = 'templates/latest.php';
            } else {
                $template = 'templates/old.php';
            }
        }
    } else {
        $template = 'templates/notfound.php';
    }
}

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Check Rev</title>
    <link rel="stylesheet" href="https://revisioncheck.com/assets/css/bootstrap/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="assets/css/bootstrap/bootstrap.min.js"></script>
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="assets/css/checkrev.css">
    <script type="text/javascript" src="assets/js/jquery.qrcode.min.js"></script>
    <link rel="icon" href="assets/img/icon.png">

</head>
<body>

     <?php include_once($template); ?>


</body>
</html>

