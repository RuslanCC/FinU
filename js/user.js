function initUserInfo() {
    $('#UserInfo').on('hidden.bs.modal',function(){loading('.user-body');
    });
    $('#UserInfo').on('show.bs.modal', function (event) {
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
        if ($(event.relatedTarget).data('id')!=null) UserId=$(event.relatedTarget).data('id');
        var modal = $(this);
        if (Token !== null) {
            loading('.user-body');
            $.ajax({
                type: "POST",
                url: baseurl + 'mCore/UserInfo',
                data: {Id: UserId, Token: Token},
                success: function (response) {
                    switch (response.ResultCode) {
                        case 0: {
                            var img=baseurl+'mCore/UserImg?Token='+encodeURIComponent(Token)+'&Id='+encodeURIComponent(UserId);
                            loadUser(modal, response.Data,img);
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
    });
}

function getUserImg(id)
{
    if (sessionStorage.getItem('UsrImg'+id)!==null)
    {
        return sessionStorage.getItem('UsrImg'+id);
    }
    else {
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
        if ($(event.relatedTarget).data('id') != null) UserId = $(event.relatedTarget).data('id');
        var modal = $(this);
        if (Token !== null) {
            loading('.user-body');
            $.ajax({
                type: "POST",
                url: baseurl + 'mCore/UserInfo',
                data: {Id: UserId, Token: Token},
                success: function (response) {
                    switch (response.ResultCode) {
                        case 0: {
                            var img = baseurl + 'mCore/UserImg?Token=' + encodeURIComponent(Token) + '&Id=' + encodeURIComponent(UserId);
                            sessionStorage.setItem('UsrImg'+id,img);
                            return img;
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
}

function loadUser(modal,data,img)
{
    modal.find('.user-body').html(
        '<img class="user-img" src="'+img+'"/><table class="user-table"><tbody>' +
        '<tr><td>Фамилия</td><td>'+data.SurName+'</td></tr>' +
        '<tr><td>Имя</td><td>'+data.FirstName+'</td></tr>' +
        '<tr><td>Отчество</td><td>'+data.ParentName+'</td></tr>' +
        '<tr><td>Дата рождения</td><td>'+data.Birthday+'</td></tr>' +
        '<tr><td>Email</td><td>'+data.Email+'</td></tr>' +
        '<tr><td>'+data.StructureType+'</td><td>'+data.StructureName+'</td></tr>' +
        '</tbody></table>'
    );
}