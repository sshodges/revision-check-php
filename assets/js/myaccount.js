$( document ).ready(function() {
    var token;
    if (localStorage.getItem("token") === null) {
      window.location.replace('../login')
    } else {
      token = localStorage.getItem("token");
    }
    $('#logout').click(function () {
      localStorage.removeItem('token');
      window.location.replace('../login');
    });

    $('.edit').click(function () {
        var value = $(this).attr('id');
        $('#'+value+'Modal').modal('show');
    });

    $('#nameModal').on('shown.bs.modal', function () {
        $('#firstName').focus();
    });

    $('#companyModal').on('shown.bs.modal', function () {
        $('#companyName').focus();
    });

    $('#passwordModal').on('shown.bs.modal', function () {
        $('#oldPassword').val('').focus();
    });

    $('#companyName').keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
        {
            $('#changeCompany').click();
        }
    });

    $('#lastName').keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
        {
            $('#changeName').click();
        }
    });

    $('#confirmPassword').keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
        {
            $('#changePassword').click();
        }
    });

    $("#changeName").click(function () {
        var attributes = {}
        attributes.firstName = $('#firstName').val();
        attributes.lastName = $('#lastName').val();
        changeCompany(attributes);
        $('#nameModal').modal('toggle');

    });

    $("#changeCompany").click(function () {
      var attributes = {}
      attributes.company = $('#companyName').val();
      changeCompany(attributes);
      $('#companyModal').modal('toggle');
    });

    changeCompany = function (attributes) {
      attributes = JSON.stringify(attributes);
      $.ajax({
          url: "http://localhost:3000/v1/users",
          method: "PUT",
          data: attributes,
          dataType: 'json',
          headers: { "Auth": token },
          contentType: "application/json",
           success: function(result,status,jqXHR ){
              console.log(result);
              getDetails();
           },
           error(jqXHR, textStatus, errorThrown){
             console.log(errorThrown);
           }
      });
    }

    getDetails = function () {
      $.ajax({
          url: "http://localhost:3000/v1/users",
          method: "GET",
          dataType: 'json',
          headers: { "Auth": token },
          contentType: "application/json",
           success: function(result,status,jqXHR ){
             if (result.firstName && result.lastName){
               $('#nameText').html(result.firstName + " " + result.lastName);
               $('#firstName').val(result.firstName);
               $('#lastName').val(result.lastName);

             } else {
               $('#nameText').html('');
               $('#firstName').val('');
               $('#lastName').val('');
             }
             if (result.company) {
               $('#companyText').html(result.company);
               $('#companyName').val(result.company);
             } else {
               $('#companyText').html('');
               $('#companyName').val('');
             }
           },
           error(jqXHR, textStatus, errorThrown){
             console.log(errorThrown);
           }
      });
    }
    getDetails();

    $("#changePassword").click(function () {
        var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var confirmPassword = $('#confirmPassword').val();

        if (newPassword.length > 6){
            if (newPassword === confirmPassword){
              attributes = {};
              attributes.oldPassword = oldPassword;
              attributes.newPassword = newPassword;
              attributes = JSON.stringify(attributes);
              $.ajax({
                  url: "http://localhost:3000/v1/users/change-password",
                  method: "PUT",
                  data: attributes,
                  dataType: 'json',
                  headers: { "Auth": token },
                  contentType: "application/json",
                   success: function(result,status,jqXHR ){
                     $('.alert').remove();
                      $('body').prepend('<div class="alert alert-success alert-dismissible">\
                          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
                      <strong>Success!</strong> Your password has been changed.\
                      </div>');

                      $(".alert").fadeTo(2000, 500).slideUp(500, function(){
                          $("#success-alert").slideUp(500);
                      });
                      $('#passwordModal').modal('toggle');
                      $('#oldPassword').val('');
                      $('#newPassword').val('');
                      $('#confirmPassword').val('');
                   },
                   error(jqXHR, textStatus, errorThrown){
                     if (errorThrown === 'Unauthorized'){
                       $("#change-error").text("Incorrect password");
                     }
                   }
              });

            } else {
                $("#change-error").text("Passwords don't match");
            }
        } else {
            $("#change-error").text("Passwords must be greater than 6 charaters long");
        }






    });


});
