$(document).ready(function() {
    var token;
    if (localStorage.getItem("token") === null) {
      window.location.replace('../login')
    } else {
      token = localStorage.getItem("token");

    }

    //VARIABLES
        //Variables to hold when right clicking on row
        var clickedId;
        var clickedRow;
        var clickedRowType;
        var revCode;
        var parent = 0;

        //type of folder user is in
        var docType = 'folder';

    //TOP MENU


        //When clicking on logo take back to beginning
        $('#brand').click(function () {
           parent = 0;
           getDocuments();
        });

        //Focus on Open Modals
        $('#folderModal').on('shown.bs.modal', function () {
            $('#folderName').val('').focus();
        });

        $('#documentModal').on('shown.bs.modal', function () {
            $('#documentName').val('').focus();
        });

        $('#revisionModal').on('shown.bs.modal', function () {
            $('#revisionName').val('').focus();
        });

        $('#renameModal').on('shown.bs.modal', function () {
            $('#renameName').focus();
        });


        //Execute function when Enter key hit
        $('.modal-text').keypress(function (e) {
            var modal = ($(this).attr('id'));
            var key = e.which;
            if(key == 13)  // the enter key code
            {
                $('#' + modal + 'Button').click();
                return false;
            }
        });

        $('#searchText').focus(function()
        {
            /*to make this flexible, I'm storing the current width in an attribute*/
            $(this).attr('data-default', $(this).width());
            $(this).attr("placeholder", "Enter Document Number");
            $(this).animate({ width: 250 }, 'slow');
        }).blur(function()
        {
            /* lookup the original width */
            var w = $(this).attr('data-default');
            $(this).attr("placeholder", "Search");

            $(this).animate({ width: 100 }, 'slow');
        });

    $('#searchText').keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
        {


        }
    });

    //EDIT DOCUMENT

        // Disable all checkboxes
        disableCheckboxes = function (){
            $('.checkbox .form-check-input').prop('checked', false);
        }

        // Show Checkbox on hover
        $('body').on("mouseover",'.item', function(){
            $("input:checkbox:not(:checked)").hide();
            $($(this).find(':input')).show();
        });

        $('body').on("click",'.checkbox .form-check-input', function(){
            if ($(this).is(":checked")){
                if ($(this).hasClass('archiveChecks')){
                    $('#activateDocument').show();
                } else {

                    disableCheckboxes();
                    $(this).prop('checked', true);
                    $("input:checkbox:not(:checked)").hide();
                    $('#editDocument').fadeIn();

                    clickedId = $(this).parent().next().attr('id');
                    clickedRow = $(this).parent().next().text();
                    clickedRow = $.trim(clickedRow);
                    clickedRowType = $(this).parent().next().attr('row-type');
                }

            } else {
                if ($(this).hasClass('archiveChecks')){
                    $('#activateDocument').hide();
                } else {
                    $('#editDocument').hide();
                    disableCheckboxes();
                }
            }
        });

        $('body').on("click",'.item-row', function(){
            parent = $(this).attr('id');
            var type = $(this).attr('row-type')
            if (type === 'folder'){
              getDocuments();
            } else {
              getRevisions();
            }

        });

        $('#renameButton').click(function () {
            $('#renameTitle').text('Rename '+ clickedRowType);
            $('#renameModal').modal('show');
            $('#renameName').val(clickedRow);
            $('#editDocument').hide();
        });

        $('#deleteButton').click(function () {
            $('#deleteTitle').text('Are you sure you want to delete: ' + clickedRow + '?');
            $('#deleteModal p').hide();
            $('#'+clickedRowType + 'Warning').show();
            $('#deleteModal').modal('show');
            $('#editDocument').hide();
        });

        $('#activateButton').click(function () {
            var checks = $('.archiveChecks:checkbox:checked');
            if (checks.length > 0){
                for (i=0; i<checks.length;i++){
                    var id = $(checks[i]).parent().next().attr('id');
                    $.post('/revisioncheck2/functions/workspace/activateDocument', {hash: hash, id:id}, function (data) {
                        location.reload();
                    });
                }

            } else {
                $('#alert').html('<div class="alert alert-danger alert-dismissable">' +
                    '<a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>' +
                    '<strong>No Document Selected:</strong> Please check the boxes of the documents you want to activate' +
                    '</div>')
            }



        });

        $('#searchButton').click(function () {
            var searchText = $('#searchText').val();
            $('#searchText').val('');
            if (searchText !== ''){
                getDocuments(searchText)
            }
        });

    //FUNCTIONS

        addDocument = function () {
            var body = {}
            body.name = $('#documentName').val();
            body.parent = parent;
            body = JSON.stringify(body);

            $('#documentName').val('');

            $.ajax({
                url: "http://localhost:3000/v1/documents",
                method: "POST",
                data: body,
                dataType: 'json',
                headers: { "Auth": token },
                contentType: "application/json",
                 success: function(result,status,jqXHR ){
                      getDocuments();
                 },
                 error(jqXHR, textStatus, errorThrown){
                     console.log(errorThrown);
                 }
            });
        };
        addFolder = function () {
            var body = {}
            body.name = $('#folderName').val();
            body.parent = parent;
            body = JSON.stringify(body);

            $('#folderName').val('');

            $.ajax({
                url: "http://localhost:3000/v1/folders",
                method: "POST",
                data: body,
                dataType: 'json',
                headers: { "Auth": token },
                contentType: "application/json",
                 success: function(result,status,jqXHR ){
                      getDocuments();
                 },
                 error(jqXHR, textStatus, errorThrown){
                     console.log(errorThrown);
                 }
            });
        };

        addRevision = function () {

            var body = {}
            body.name = $('#revisionName').val().toString();
            $('#revisionName').val('');
            console.log(body);
            body = JSON.stringify(body);
            $.ajax({
                url: "http://localhost:3000/v1/revisions/"+parent,
                method: "POST",
                data: body,
                dataType: 'json',
                headers: { "Auth": token},
                contentType: "application/json",
                 success: function(result,status,jqXHR ){
                      if (jqXHR.getResponseHeader('Auth')) {
                        localStorage.setItem('token', jqXHR.getResponseHeader('Auth'));
                        window.location.replace('app/home');
                      }
                 },
                 error(jqXHR, textStatus, errorThrown) {
                     $("#login-error").text('Incorrect email or password');
                 }
            });
            getRevisions();
        };

        getDocuments = function (){
            $('#revisionHeading').hide();
            $('.document-pill').show();
            $('.revision-pill').hide();
            var rows = '<div class="col-xs-12" id="documentbar">';
            $.ajax({
                url: "http://localhost:3000/v1/folders/parent/"+parent,
                method: "GET",
                dataType: 'json',
                headers: { "Auth": token },
                contentType: "application/json",
                 success: function(result,status,jqXHR ){
                      result.forEach(function (folder) {
                        rows += '<div class="row item sortable">\
                                <div class="col checkbox">\
                                    <input type="checkbox" class="form-check-input" style="display: none;">\
                                </div>\
                                <div class="item-row" id="'+folder.id+'" row-type="folder">\
                                    <img class="img-responsive icon" src="/revisioncheck2/assets/img/folder.png">\
                                    '+folder.name+'</div>\
                                 </div>';
                      });

                 },
                 error(jqXHR, textStatus, errorThrown){
                   console.log(errorThrown);
                 }
            });

            $.ajax({
                url: "http://localhost:3000/v1/documents/parent/"+parent,
                method: "GET",
                dataType: 'json',
                headers: { "Auth": token },
                contentType: "application/json",
                 success: function(result,status,jqXHR ){
                     result.forEach(function (documents) {
                       rows += '<div class="row item sortable">\
                               <div class="col checkbox">\
                                   <input type="checkbox" class="form-check-input" style="display: none;">\
                               </div>\
                               <div class="item-row" id="'+documents.id+'" row-type="document">\
                                   <img class="img-responsive icon" src="/revisioncheck2/assets/img/document.png">\
                                   '+documents.name+'</div>\
                                </div>';
                     });
                     rows += '</div>';
                     $('#documentrow').html(rows);


                 },
                 error(jqXHR, textStatus, errorThrown){
                   console.log(errorThrown);
                 }
            });

        };
        getDocuments();

        getRevisions = function () {
            var rows = '<div class="col-xs-12" id="documentbar">\
            <div class="row">\
                <div class="col-xs-12" id="revisionHeading">\
                    <div class="col-xs-5">Revision</div>\
                    <div class="col-xs-3" style="text-align: center">Rev Code</div>\
                    <div class="col-xs-3" style="text-align: center">QR Code</div>\
                    <div class="col-xs-1" style="text-align: center">Status</div>\
                </div>\
            </div>';
            $('#revisionHeading').show();
            $('#documentHeading').hide();

            $('.document-pill').hide();
            $('.revision-pill').show();
          $.ajax({
              url: "http://localhost:3000/v1/revisions/"+parent,
              method: "GET",
              dataType: 'json',
              headers: { "Auth": token },
              contentType: "application/json",
               success: function(result,status,jqXHR ){
                   result.forEach(function (revision) {
                     var latest = 'old';
                     if (revision.latest === true) {
                       latest = 'latest';
                     }
                     rows += '        <div class="row sortable" id="%s">\
                                       <div class="col-xs-12 rev-item">\
                                           <div class="col-xs-5">\
                                              <p class="textItem revisionText">'+revision.name+'</p>\
                                           </div>\
                                           <div class="col-xs-3">\
                                              <p class="textItem" style="text-align: center">'+revision.uniqueCode+'</p>\
                                           </div>\
                                           <div class="col-xs-3">\
                                              <p class="textItem downloadQR" id="'+revision.id+'" style="text-align: center">View</p>\
                                           </div>\
                                           <div class="col-xs-1">\
                                              <img class="img-responsive rev-icon" src="https://revisioncheck.com/assets/img/'+latest+'.png">\
                                           </div>\
                                       </div>\
                                   </div>';
                   });
                   rows += '</div>';
                   $('#documentrow').html(rows);
                   $('#revisionHeading').show();
                   $('#documentHeading').hide();

                   $('.document-pill').hide();
                   $('.revision-pill').show();


               },
               error(jqXHR, textStatus, errorThrown){
                 console.log(errorThrown);
               }
          });

        };

        getArchives = function (){
            $.post('/revisioncheck2/functions/workspace/getArchives', {hash: hash,}, function (data) {
                $('#documentbar').html(data);
            });
        };


        renameDocuments = function (){
            var name = $('#renameName').val();
            $.post('/revisioncheck2/functions/workspace/renameDocument', {hash: hash, id:clickedId, name:name, parent:parent, type:clickedRowType}, function (data) {
                if (data === 'name already exists'){
                    $('#alert').hide.html('<div class="alert alert-danger alert-dismissable">' +
                        '<a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>' +
                        '<strong>Cannot Rename Document:</strong> A document with this name alreaady exists' +
                        '</div>').slideDown('slow');
                    $('#editDocument').show();
                    // $('#renameModal').toggle();
                } else {
                    location.reload();
                }
            });
        };

        deleteDocuments = function (){
            $.post('/revisioncheck2/functions/workspace/deleteDocument', {hash: hash, id:clickedId, parent:parent, type:clickedRowType}, function (data) {
                location.reload();
            });
        };



    //DIPLAYED SERVER CONTENT

        //Make list items draggable and droppable, even if from AJAX request
        makeDroppable = function () {
            $(".item-row").droppable({
                over: function(event, ui) {
                    $(this).addClass("highlighter_focus_in");
                },
                out: function(event, ui) {
                    $(this).removeClass("highlighter_focus_in");
                },
                drop: function( event, ui ) {
                    var drag = $(ui.draggable).attr("id");
                    var drop = $(this).attr("id");
                    $.post("/revisioncheck2/functions/workspace/dropDocument", {drag:drag, drop:drop, hash:hash}, function (data) {
                        location.reload()
                    });

                }
            }).draggable({
                revert: true,
                zIndex: 2500,
                distance: 10,
                revertDuration: 200,
                delay: 200
            });
        };
        //Run when page is first loaded
        makeDroppable();

        //Allow user to drag item into breadcrumb to move back a folder
        $("#back").droppable({
            over: function(event, ui) {
                $(this).addClass("highlighter_focus_in");
            },
            out: function(event, ui) {
                $(this).removeClass("highlighter_focus_in");
            },
            drop: function( event, ui ) {
                var drag = $(ui.draggable).attr("id");
                var drop = $('#previousBread').find('a').attr('id');
                $(this).removeClass("highlighter_focus_in");
                $.post("/revisioncheck2/functions/workspace/dropDocument", {drag:drag, drop:drop, hash:hash}, function (data) {
                    location.reload()

                });
            }

        });

        //Navigate to new parent on row click

        //View QR
        $('body').on("click",'.downloadQR', function(){
            revCode = $(this).attr('id');
            $('#qrHeading').text('Rev Code: ' + revCode);
            $('#qrcode').html('').qrcode(revCode);
            $('#qrModal').modal();

        //     console.log(revCode);
        // $.post('functions/workspace/getQR.php', {revCode: revCode}, function (data) {
        //     console.log(data)
        //
        // });

    });

    //QR Code



        //Download QR Code Button

        function downloadCanvas(link, canvasId, filename) {
            link.href = document.getElementById(canvasId).toDataURL();
            link.download = filename;

        }

        /**
         * The event handler for the link's onclick event. We give THIS as a
         * parameter (=the link element), ID of the canvas and a filename.
         */
        document.getElementById('qrButton').addEventListener('click', function() {
            downloadCanvas(this, 'qrCanvas', revCode + '.png');
        }, false);


    (function($) {
        var $window = $(window),
            $html = $('#search-bar nav');

        function resize() {
            if ($window.width() > 787) {
                $('#search-bar').show()
            } else {
                $('#search-bar').hide()

            }
        }

        $window
            .resize(resize)
            .trigger('resize');
    })(jQuery);

    $('.active').addClass('blue')



});
