function initLogin()
{
    getConfig();

    $('#InputLogin + .glyphicon').on('click', function() {
        $('#FormLogin').trigger('reset');
    });

    $('#InputPassword + .glyphicon').on('click', function() {
        $(this).toggleClass('glyphicon-eye-close').toggleClass('glyphicon-eye-open');
        $('#InputPassword').hideShowPassword('toggle');
    });

    $('#ButtonLogin').on('click', function (e) {
        e.preventDefault();
        $("#FormLogin").submit();
    });

    $("#FormLogin").on('submit',function(e)
    {
        loading('.wrapper');
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: baseurl+'mCoreAccount/Auth',
            data: $( "#FormLogin" ).serialize(),
            success: function(response){
                switch (response.ResultCode)
                {
                    case 0:
                    {
                        console.log(response.Data);
                       if (true)//($('#remember').is(':checked'))
                       {
                           localStorage.setItem('Token',response.Data.Token);
                           localStorage.setItem('UserId',response.Data.Id);
                       }
                       else
                       {
                           sessionStorage.setItem('Token',response.Data.Token);
                           sessionStorage.setItem('UserId',response.Data.Id);
                       }
                        $('.wrapper').load('./views/menu.html',initMenu);
                        break;
                    }
                    default:
                        parseError(response);
                }},
            error: function(){
                genAlert('Не удается установить соединение с сервером');
            },
            dataType: 'JSON'
        });
    });

    $("#FormLogin").validate({
        rules: {
            Login: {
                required: true,
                minlength: 4
            },
            Pwd: {
                required: true,
                minlength: 4
            }
        },
        messages: {
            Login: {
                required: "Пожалуйста введите ваш логин",
                minlength: ""
            },
            Pwd: {
                required: "Пожалуйста, введите ваш пароль",
                minlength: "Пароль должен быть длиннее {0} символов"
            }
        },
        errorClass:'has-error help-block',
        errorPlacement:function(error,el){$(el).parent().after(error);}
    });
}