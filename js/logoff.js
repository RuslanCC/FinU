function logOff()
{
    Token=null;
    if (localStorage.getItem('Token') !== null) {
        Token = localStorage.getItem('Token');
    }
    if (sessionStorage.getItem('Token') !== null) {
        Token = sessionStorage.getItem('Token');
    }
    $.ajax({
        type: "POST",
        url: baseurl + 'mCoreAccount/LogOff',
        data: {Token: Token},
        success: function (response) {
        },
        error: function () {
            genAlert('Не удается установить соединение с сервером');
        },
        dataType: 'JSON'
    });
    localStorage.removeItem('Token');
    localStorage.removeItem('UserId');
    sessionStorage.removeItem('Token');
    sessionStorage.removeItem('UserId');
    localStorage.removeItem('Functions');
    sessionStorage.removeItem('Functions');

    $('.wrapper').load('./views/login.html',initLogin);
}
