$( document ).ready(function() {

    $('.edit').click(function () {
        var value = $(this).attr('id');
        $('#'+value+'Modal').modal('show');
    });

    $('#nameModal').on('shown.bs.modal', function () {
        $('#firstName').val('').focus();
    });

    $('#companyModal').on('shown.bs.modal', function () {
        $('#companyName').val('').focus();
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
        var first = $('#firstName').val();
        var last = $('#lastName').val();

        $.post('functions/myaccount/changeName.php', {first: first, last:last, userId: userId}, function (data) {
            window.location.replace("myaccount");
        });
    });

    $("#changeCompany").click(function () {
        var company = $('#companyName').val();
        $.post('functions/myaccount/changeCompany.php', {company: company, userId: userId}, function (data) {
            location.reload()
        });
    });

    $("#changePassword").click(function () {
        var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var confirmPassword = $('#confirmPassword').val();

        if (newPassword.length > 6){
            if (newPassword === confirmPassword){
                $.post('functions/myaccount/changePassword.php', {userId: userId, oldPassword:oldPassword, newPassword:newPassword}, function (data) {

                    if (data === ''){
                        $('#oldPassword').val('');
                        $('#newPassword').val('');
                        $('#confirmPassword').val('');
                        $('#passwordModal').modal('toggle');
                        $('body').prepend('<div class="alert alert-success alert-dismissible">\
                            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
                        <strong>Success!</strong> Your password has been changed.\
                        </div>');
                    } else {
                        $("#change-error").text(data);
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
