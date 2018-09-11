$( document ).ready(function() {



    $("#resetPassword").click(function () {
        var password = $('#newPassword').val();
        $('#resetPassword').hide();
        var confirmpassword = $('#confirmPassword').val();
        if (password === confirmpassword){
            $.post('functions/updatePassword.php', {password:password, userId:userId}, function (data) {
                if (data === ''){
                    window.location.replace("login");
                } else {
                    $('#reset-error').text(data);
                }
            });
        } else {
            $('#reset-error').text("Passwords don't match");
        }

    });

});
