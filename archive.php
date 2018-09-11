<?php
include_once("functions/db.php");

session_start();

if(!isset($_SESSION['idd'])){
    header("Location: ../login");
} else {
    $userId = $_SESSION['idd'];
}


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Workspace - THW</title>
    <link rel="stylesheet" href="https://revisioncheck.com/assets/css/bootstrap/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="https://revisioncheck.com/assets/css/bootstrap/bootstrap.js"></script>
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="/revisioncheck2/assets/css/app.css">
    <link rel="stylesheet" href="/revisioncheck2/assets/css/font-awesome-4.7.0/css/font-awesome.min.css">
    <script type="text/javascript" src="https://revisioncheck.com/assets/js/jquery.qrcode.min.js"></script>
</head>
<body>
<div id="alert"></div>

<div id="left-bar" class="col-sm-3">
    <a id="brand"><img src="/revisioncheck2/assets/img/logo.png" class="logo"></a>
    <ul class="" id="left-nav">
        <li><a href="app/home">Home</a></li>
        <li><a class="active" href="archive">Archive</a></li>
        <li><a href="myaccount">My Account</a></li>
        <li id="logout" class=""><a href="logout">Logout</a></li>
    </ul>
</div>
<div id="right-bar" class="col-sm-9">

    <div id="content-bar" class="row">
        <div id="main-bar" class="col-md-10">


            <div class="row" id="documentrow">

                <?php
                    echo '<div class="col-md-12" id="documentbar">';

                    $stmt = $db->prepare("SELECT * FROM documents WHERE userId=? AND status='inactive' ORDER BY docName ASC");
                    $stmt->bind_param('s', $userId); // 's' specifies the variable type => 'string'
                    $stmt->execute();
                    $result = $stmt->get_result();

                    if ($result->num_rows > 0) {
                        while ($row = mysqli_fetch_assoc($result)) {
                            $text = '<div class="row item sortable">
                        <div class="col checkbox">
                            <input type="checkbox" class="form-check-input archiveChecks" style="display: none;">
                        </div>
                        <div class="" id="%s" row-type="%s">
                            <img class="img-responsive icon" src="/revisioncheck2/assets/img/%s.png">
                            %s</div>
                         </div>';
                            $text = sprintf($text, $row['id'], $row['docType'], $row['docType'], $row['docName']);
                            echo $text;
                        }
                    }

                ?>
            </div>
        </div>

    </div>
    <div id="add-bar" class="col-sm-2">
        <ul class="addButtons" id="activateDocument" style="display: none">
            <li role="presentation" id="activateButton" class="document-pill"><a>Activate</a></li>
        </ul>
    </div>
</div>

<div id="qrModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title" id="qrHeading"></h4>
            </div>
            <div class="modal-body">
                <div id="qrcode"></div>
            </div>
            <a class="btn btn-success" id="qrButton">Download</a>
        </div>

    </div>
</div>



<script type="application/javascript">
    <?php
    echo 'var hash='.$userId . ';';
    ?>
</script>
<script src="/revisioncheck2/assets/js/workspace.js"></script>


</body>
</html>
