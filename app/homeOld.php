<?php
include_once("../functions/db.php");

session_start();

$url = (explode("/",$_SERVER['REQUEST_URI']));
// Go to home if
if($url[0] != "" || $url[1] != "app" || $url[2] != "home" && $url[3] != ""){
    header("Location: home");
} else if ($url[0] != "" || $url[1] != "app" || $url[2] != "home" && $url[3] == ""){
    header("Location: home");
}

// Get rid of blank array item if url ends in /
if ($url[sizeof($url)-1] == ""){
    array_pop($url);
}

// Get Back URL
$backURLArray = $url;

array_pop($backURLArray);
$backURL = join('/', $backURLArray);
$cleanURL = join('/', ($url));

// Show Revision/Document Stuff - Defaults
$displayRev = 'none';
$displayDoc = 'show';


$parent = 0;
$dirs = array_slice($url,4);
$table = 'documents';

if (empty($dirs) || $dirs[0] != 'Archive'){
    foreach ($dirs as $dir){
        $cleanDir = urldecode($dir);
        $result2 = $db->query("SELECT * FROM documents WHERE docName='$cleanDir' AND parent='$parent'");
        if ($result2->num_rows > 0) {
            while ($row = mysqli_fetch_assoc($result2)) {
                $parent = $row['id'];
                $docType = $row['docType'];
                if ($docType == "document"){
                    $table = "revisions";
                    $displayRev = 'show';
                    $displayDoc = 'none';
                }
            }
        } else {
            header("Location: 404");
        }

    }
} else {
    $table = 'archive';
}



if(!isset($_SESSION['idd'])){
    header("Location: /login");
} else {
    $userId = $_SESSION['idd'];
}

$currentFolder = '';
$previousFolder = '';
$previousId = '';

$oldParent = '0';
$previousId = '0';
$previousFolder = 'Home';
$currentFolder = 'Home';
$result2 = $db->query("SELECT * FROM documents WHERE userId='$userId' AND id='$parent'");
if ($result2->num_rows > 0) {
    while ($row = mysqli_fetch_assoc($result2)) {
        $currentFolder = $row['docName'];
        $oldParent = $row['parent'];
    }
}

$result2 = $db->query("SELECT * FROM documents WHERE userId='$userId' AND id='$oldParent'");
if ($result2->num_rows > 0) {
    while ($row = mysqli_fetch_assoc($result2)) {
        $previousId = $oldParent;
        if ($previousId == 0){
            $previousFolder = 'Home';
        } else {
            $previousFolder = $row['docName'];

        }
    }
}

if ($currentFolder == 'Home'){
    $previousFolder = '';
}

if($table == 'archive') {
    $previousId = '0';
    $previousFolder = 'Home';
    $currentFolder = 'Archive';
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
    <link rel="stylesheet" href="https://revisioncheck.com/assets/css/workspace.css">
    <script type="text/javascript" src="https://revisioncheck.com/assets/js/jquery.qrcode.min.js"></script>
    <link rel="icon" href="/assets/img/icon.png">

</head>
<body>
<div id="alert"></div>
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a id="brand" class="navbar-brand"><img src="/assets/img/logo.png" class="logo"></a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">My Account <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="../myaccount">Account Details</a></li>
                        <li><a href="../logout">Logout</a></li>
                    </ul>
                </li>
            </ul>
            <div class="navbar-form navbar-right">
                <div class="form-group">
                    <input type="text" class="form-control" id="searchText" placeholder="Enter document name">
                </div>
                <button class="btn btn-primary" id="searchButton">Search</button>
            </div>

        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>

<div class="container">

    <div class="row">
        <div class="col-md-6 col-md-push-2">
            <ul class="nav nav-pills" id="top-bar">
                <li role="presentation" id="newFolder" class="document-pill launch-modal" data-toggle="modal" data-target="#folderModal" holder="#folderModal" style="display: <?php echo $displayDoc; ?>"><a>New Folder</a></li>
                <li role="presentation" id="newDocument" class="document-pill launch-modal" data-toggle="modal" data-target="#documentModal" holder="#documentModal" style="display: <?php echo $displayDoc; ?>"><a>New Document</a></li>
                <li role="presentation" id="newRevision" class="revision-pill launch-modal" data-toggle="modal" data-target="#revisionModal" holder="#revisionModal" style="display: <?php echo $displayRev; ?>"><a>New Revision</a></li>
            </ul>
        </div>
        <div class="col-md-4">
            <ul class="nav nav-pills" id="editDocument" style="display: none; float: right">
                <li role="presentation" id="renameButton" class="document-pill"><a>Rename</a></li>
                <li role="presentation" id="deleteButton" class="document-pill"><a>Delete</a></li>
            </ul>
            <ul class="nav nav-pills" id="activateDocument" style="display: none; float: right">
                <li role="presentation" id="activateButton" class="document-pill"><a>Activate</a></li>
            </ul>
        </div>
    </div>

    <div class="row" id="back">
        <ol class="breadcrumb">
            <li class="breadcrumb-item" id="previousBread"><a href="<?php echo $backURL; ?>" class="sad"><?php echo $previousFolder; ?></a></li>
            <li class="breadcrumb-item active" id="currentBread"><?php echo $currentFolder; ?></li>
        </ol>
    </div>
    <div class="row">


        <?php

        if ($table == "documents") {
            //Check if archived Items

            echo '<div class="col-md-8 col-md-push-2" id="documentbar">';


            $result = $db->query("SELECT * FROM documents WHERE userId='$userId' AND status='inactive'");
            $archivedItems = false;
            if ($result->num_rows > 0){
                $archivedItems = true;
            }

            if ($archivedItems){
                $result = $db->query("SELECT * FROM documents WHERE userId='$userId' AND parent='$parent' AND status='active' ORDER BY docName ASC");
            } else {
                $result = $db->query("SELECT * FROM documents WHERE userId='$userId' AND parent='$parent' AND status='active' AND docType <> 'archive' ORDER BY docName ASC");
            }

            if ($result->num_rows > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    if ($row['docType'] == 'archive'){
                        $text = '<div class="row item sortable"><a href="%s">
                        <div class="col checkbox">
                        </div>
                        <div class="item-row" id="%s" row-type="%s">
                            <img class="img-responsive icon" src="/assets/img/%s.png">
                            %s</div>
                         </a></div>';
                    }else {
                        $text = '<div class="row item sortable">
                                        <a href="%s">
                                        <div class="col checkbox">
                                            <input type="checkbox" class="form-check-input" style="display: none;">
                                        </div>
                                        <div class="item-row" id="%s" row-type="%s">
                                            <img class="img-responsive icon" src="/assets/img/%s.png">
                                            %s</div>
                                         </a>
                                     </div>';

                    }
                    $text = sprintf($text, $cleanURL . "/" . rawurlencode($row['docName']), $row['id'], $row['docType'], $row['docType'], $row['docName']);

                    echo $text;
                }
            }
        }
        else if ($table == "revisions") {
            echo '<div  class="col-md-8 col-md-push-2" id="revisionHeading">
            <div class="col-md-12">
                <div class="col-sm-6">Revision</div>
                <div class="col-sm-3">Rev Code</div>
                <div class="col-sm-3">QR Code</div>
            </div>
        </div><div class="col-md-8 col-md-push-2" id="documentbar">';
            $result = $db->query("SELECT * FROM revisions WHERE userId='$userId' AND documentId='$parent' ORDER BY id DESC");
            if ($result->num_rows > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $text = '       <div class="row sortable" id="%s">
                                 <div class="col-sm-12 item">
                                     <div class="col-md-2">
                                        <img class="img-responsive icon" src="/assets/img/%s.png">
                                     </div>
                                     <div class="col-md-4">
                                        <p class="textItem">%s</p>
                                     </div>
                                     <div class="col-md-3">
                                        <p class="textItem">%s</p>
                                     </div>
                                     <div class="col-md-3">
                                        <div class="btn btn-default downloadQR" id="%s">View</div>
                                     </div>
                                 </div>
                             </div>';
                    $text = sprintf($text, $row['id'], $row['status'], $row['revision'], $row['revCode'], $row['revCode']);
                    echo $text;
                }

            } else {

            }
        }
        else if ($table == "archive"){
            echo '<div class="col-md-8 col-md-push-2" id="documentbar">';
            $result = $db->query("SELECT * FROM documents WHERE userId='$userId' AND status='inactive' ORDER BY docName ASC");
            if ($result->num_rows > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $text = '<div class="row item sortable">
                        <div class="col checkbox">
                            <input type="checkbox" class="form-check-input archiveChecks" style="display: none;">
                        </div>
                        <div class="" id="%s" row-type="%s">
                            <img class="img-responsive icon" src="/assets/img/%s.png">
                            %s</div>
                         </div>';
                    $text = sprintf($text, $row['id'], $row['docType'], $row['docType'], $row['docName']);
                    echo $text;
                }

            }
        }


        ?>

    </div>

</div>

<!-- Modal -->
<div id="folderModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Add Folder</h4>
            </div>
            <div class="modal-body">
                <input id="folderName" placeholder="Folder Name" class="form-control modal-text" autofocus>
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal" onclick="addDocument('folder')" id="folderNameButton">Add</button>
            </div>
        </div>

    </div>
</div>

<div id="documentModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Add Document</h4>
            </div>
            <div class="modal-body">
                <input id="documentName" placeholder="Folder Name" class="form-control modal-text" autofocus>
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal" onclick="addDocument('document')" id="documentNameButton">Add</button>
            </div>
        </div>

    </div>
</div>

<div id="renameModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title" id="renameTitle">Rename</h4>
            </div>
            <div class="modal-body">
                <input id="renameName" placeholder="Folder Name" class="form-control modal-text" autofocus>
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal" onclick="renameDocuments()" id="renameNameButton">Rename</button>
            </div>
        </div>

    </div>
</div>

<div id="deleteModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title" id="deleteTitle"></h4>
            </div>
            <div class="modal-body">
                <p id="folderWarning">
                    <br>Deleting this folder will delete all sub-folders and move all documents to the home directory.
                </p>
                <p id="documentWarning">Documents cannot be permanently deleted.<br><br>
                    Pressing delete will move this document to the archive folder. You can reactivate a document at any time.
                </p>
                <br>
                <h4 id="delete"></h4>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" data-dismiss="modal" onclick="deleteDocuments()" id="deleteButton">Delete</button>
            </div>
        </div>

    </div>
</div>

<div id="revisionModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title" id="revisionTitle">Add Revision</h4>
            </div>
            <div class="modal-body">
                <input id="revisionName" placeholder="Revision Name" class="form-control modal-text" autofocus>
            </div>
            <div class="modal-footer">
                <button class="btn btn-success" data-dismiss="modal" onclick="addRevision()" id="revisionNameButton">Add</button>
            </div>
        </div>

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

<!--   Right Click Menu   -->
<ul class='custom-menu'>
    <li data-action="rename">Rename</li>
    <li data-action="delete">Delete</li>
</ul>


</div>
<script type="application/javascript">
    <?php
    echo 'var hash='.$userId . ';';
    echo 'var parent='.$parent . ';';
    ?>
</script>
<script src="/assets/js/workspace.js"></script>


</body>
</html>
