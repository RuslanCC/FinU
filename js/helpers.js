var baseurl="https://portal.fa.ru/";
baseurl="http://proxy.uniar.ru:8090/FMOB/";
function parseError(r)
{
    switch(r.ResultCode)
    {
        case 0:
            //NO ERROR
            break;
        case -1:
            logOff();
            break;
        case -2:
            genAlert("У вас нет доступа");
            break;
        case -100:
            if (typeof r.ErrorMessage==undefined || r.ErrorMessage==null || r.ErrorMessage.length==0)
                logOff();

            genAlert(r.ErrorMessage);
            break;
        default:
            logOff();
    }
}

function genAlert(message)
{
        $('#alert').html('<div class="alert alert-danger alert-dismissable" id="Alert">'+message+'<a href="#" class="close" data-dismiss="alert" aria-label="close">×</a></div>');
}

function loading(div)
{
    $(div).load('./views/loading.html');
}

