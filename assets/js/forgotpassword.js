$( document ).ready(function() {

    $(document).ajaxStart(function(){
        $("#loading").css("display", "block");
    });

    $(document).ajaxComplete(function(){
        $("#loading").css("display", "none");
    });

    $('#resetEmail').keypress(function (e) {
        var key = e.which;
        if(key == 13)  // the enter key code
        {
            $('#resetPassword').click();
        }
    });

    $("#resetPassword").click(function () {
        $("#resetPassword").hide();
        var email = $('#resetEmail').val();
        $.post('functions/resetpassword.php', {email:email}, function (data) {
            if (data === ''){
                window.location.replace("verifyforgot");
            } else {
                $('#forgot-error').text(data);
                $("#resetPassword").show();
            }
        });
    });

});
