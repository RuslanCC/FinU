function initGroups()
{
    var Token = null;
    var UserId = null;
    local = false;
    if (localStorage.getItem('Token') !== null) {
        Token = localStorage.getItem('Token');
        UserId = localStorage.getItem('UserId');
        local = true;
    }
    if (sessionStorage.getItem('Token') !== null) {
        Token = sessionStorage.getItem('Token');
        UserId = sessionStorage.getItem('UserId');
    }
    if (Token !== null) {

        $.ajax({
            type: "POST",
            url: baseurl + 'mGosvpoAccount/Groups',
            data: {Id: UserId, Token: Token},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        if (local)
                            localStorage.setItem('Groups', JSON.stringify(response.Data));
                        else
                            sessionStorage.setItem('Groups', JSON.stringify(response.Data));
                        loadGroups();
                        break;
                    }
                    default:
                        parseError(response);
                }
            },
            error: function () {
                genAlert('Не удается установить соединение с сервером');
                logOff();
            },
            dataType: 'JSON'
        });
    }
    else {
        logOff();
    }
}

function loadGroups()
{
    var Token = null;
    var UserId = null;
    var Groups=null;
    local = false;
    if (localStorage.getItem('Token') !== null) {
        Token = localStorage.getItem('Token');
        UserId = localStorage.getItem('UserId');
        Groups=localStorage.getItem('Groups');
        local = true;
    }
    if (sessionStorage.getItem('Token') !== null) {
        Token = sessionStorage.getItem('Token');
        UserId = sessionStorage.getItem('UserId');
        Groups=sessionStorage.getItem('Groups');
    }
    if (Token !== null) {
        Groups=JSON.parse(Groups);
        if (Groups!=null)
        Groups.map(function(group){
            $.ajax({
                type: "POST",
                url: baseurl + 'mGosvpoGroup/Info',
                data: {Id: group.Id, Token: Token},
                success: function (response) {
                    switch (response.ResultCode) {
                        case 0: {
                            if (local)
                                localStorage.setItem('GroupInfo'+group.Id, JSON.stringify(response.Data));
                            else
                                sessionStorage.setItem('GroupInfo'+group.Id, JSON.stringify(response.Data));
                            break;
                        }
                        default:
                            parseError(response);
                    }
                },
                error: function () {
                    genAlert('Не удается установить соединение с сервером');
                    logOff();
                },
                dataType: 'JSON'
            });
        });
    }
    else {
        logOff();
    }
}