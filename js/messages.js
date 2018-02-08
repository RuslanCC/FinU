function newmessage()
{
    $('.back2').click(getMessages);
    route('new_Message');

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
            url: baseurl + '/mGosvpoMessage/Receivers',
            data: {Token: Token,UserId:UserId},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        console.log(response.Data);
                        $('#New_Message').load('./views/new_message.html',render_new_message.bind(response.Data));

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
    else logOff();

}
function render_new_message()
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

    const list=this;
    var tbody='';
    tbody+="<tr><td>";
    tbody+='<input type="hidden" name="Token" value="'+Token+'"/> <input type="hidden" name="UserId" value="'+UserId+'"/>';
    tbody+='<select name="Receivers" class="selectpicker show-menu-arrow selectReceiver" title="Кому" data-width="100%">';
    var groupped=[];
    list.forEach(function(item){
        if (typeof groupped[item.Type]=='undefined') groupped[item.Type]=[];
        groupped[item.Type].push(item);
    });
    groupped.forEach(function(itemArr)
    {
        tbody+='<optgroup label="'+itemArr[0].TypeName+'">';
        itemArr.forEach(function(item){
            tbody+='<option value="'+item.Id+'">'+item.FullName+'</option>';
        });
        tbody+='</optgroup>';
    })
    tbody+='</select>';
    ;"</td></tr>";
    tbody+='<tr><td> <input name="Subject" type="text" class="form-control Theme" placeholder="Тема" id="theme"/></td></tr>';
    tbody+='<tr><td> <textarea name="Text" class="form-control Text" id="Text" rows="10" placeholder="Напишите сообщение"></textarea></td></tr>';


    $('#New_Message').find('tbody').html(tbody);
    $('.selectpicker').selectpicker();
    $("form#data").submit(function(e) {
        e.preventDefault();
        var formData = new FormData(this);

        $.ajax({
            url: baseurl + 'mCoreMessage/Send',
            type: 'POST',
            data: formData,
            success: function (data) {
            getMessages();
},
            cache: false,
            contentType: false,
            processData: false
        });
    });
}

function getMessage()
{
    route('read_Message');
    loading('#Read_message');

    const id=$(this).data('id');
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
            url: baseurl + '/mCoreMessage/Get',
            data: {Token: Token,UserId:UserId, Id:id},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        console.log(response.Data);
                        $('#Read_message').load('./views/messages.html',render_message.bind(response.Data));

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
    else logOff();
}

function getMessages()
{

    $('.curr-page').html('<span>Сообщения</span>');
    //head='<div class="results-header"><span style="padding-left: 2px;">Учебная дисциплина "'+data.Items[index].Name+'"</span></div>' +
    $('#messages').html("<div id='All_messages' class='msg'></div><div id='New_Message'  class='msg'></div><div id='Read_message'  class='msg'></div>");
    route('get_Messages');

    loading('#All_messages');

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

    const format='DD/MM/Y';
    var today=new moment();
    var DateEnd=today.format(format);
    var DateBegin=(today.subtract(1, 'months')).format(format);

    if (Token !== null) {
        $.ajax({
            type: "POST",
            url: baseurl + '/mCoreMessage/Inbox',
            data: {Token: Token,UserId:UserId,DateBegin:DateBegin,DateEnd:DateEnd},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        $('#All_messages').load('./views/messages.html',render_messagesAll.bind(response.Data));
                        total = response.Data.length;
                        if (total < 30)
                            getMoreMesages(DateBegin, total);
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
    else logOff();
}

function render_message()
{
    $('.back2').click(getMessages);
    const d=this;
    const months=[0,'янв.','февр.','март','апр.','май','июнь','июль','авг.','сент.','окт.','нояб.','дек.'];
    route('render_Message');
    sendtime=new moment (d.SenderDT,'DD.MM.Y HH:mm:ss');
    sendstr=sendtime.format('DD')+' '+months[parseInt(sendtime.format('M'))];
    var tbody='';
    tbody+='<tr><td colspan="2">'+"<div class='MessageHeader'>"+d.Subject+"</div>"+'</td><td>'+(d.AttachmenName!=''?"<i class='glyphicon glyphicon-paperclip smicon addatachment' data-name='"+d.AttachmenName+"' data-id='"+d.Id+"'/>":"")+'</td></tr>';
    tbody+='<tr><td><img class="img-circle usr-img" data-id='+d.SenderId+'></td><td>'+"<div class='MessageSender'>"+d.SenderName+"</div>"+'<div class="MessageRecepient">кому: мне</div></td><td>'+"<div class='SendTime'>"+sendstr+"</div>"+'</td></tr>';
    tbody+="<tr><td colspan='3'>"+d.Text+"</td></tr>";
    tbody+="<tr><td colspan='3'><div id='att'></div></td></tr>";

    $('#Read_message').find('tbody').html(tbody);
    populate_images();
    $('.addatachment').each(function(){ populate_attachment($(this).data('id'),$(this).data('name'));});
}

function populate_attachment(id,name)
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

        var xhr = new XMLHttpRequest();
        xhr.open("POST", baseurl + '/mCoreMessage/Attach', true);
        xhr.responseType = "blob";
        var formData = new FormData();
        formData.append('Token',Token);
        formData.append('UserId',UserId);
        formData.append('Id',id);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                save_file(name,xhr.response);
            }
        };
        xhr.send(formData);
    }
    else logOff();

}

function save_file(FILE_NAME, FILE_DATA)
{
    var storageLocation = "";
    console.log(device.platform);
    switch (device.platform) {

        case "Android":
            storageLocation = 'file:///storage/emulated/0/';
            break;
        case "iOS":
            storageLocation = cordova.file.documentsDirectory;
            break;
    }

    var errorCallback = function(e) {
        console.log("Error: " + e)
    };

    window.resolveLocalFileSystemURL(storageLocation,
        function (fileSystem) {
            fileSystem.getDirectory('Download', {
                    create: true,
                    exclusive: false
                },
                function (directory) {
                    directory.getFile(FILE_NAME, {
                            create: true,
                            exclusive: false
                        },
                        function (fileEntry) {
                            fileEntry.createWriter(function (writer) {
                                writer.onwriteend = function () {
                                    console.log("Сохранено");
                                    console.log(fileEntry.toURL());
                                    var a = window.document.createElement('a');
                                    a.text=name;
                                    a.href = fileEntry.toURL();//window.URL.createObjectURL(xhr.response);
                                    a.download = name;
                                    $('#att').append(a);

                                };
                                writer.seek(0);
                                writer.write(FILE_DATA);
                            }, errorCallback);
                        }, errorCallback);
                }, errorCallback);
        }, errorCallback);
}

function render_messagesAll()
{
    var data=this;
    const months=[0,'янв.','февр.','март','апр.','май','июнь','июль','авг.','сент.','окт.','нояб.','дек.'];
    route('render_MessagesAll');
    var tbody=$('#All_messages').find('tbody').html();
    data.map (function(d,i)
        {
            sendtime=new moment (d.SenderDT,'DD.MM.Y HH:mm:ss');
            sendstr=sendtime.format('DD')+' '+months[parseInt(sendtime.format('M'))];
            tbody+="<tr class='Message "+(d.Status==0?"unread":'')+"' data-id="+d.Id+"><td><img class='img-circle usr-img' data-id="+d.SenderId+"></td><td><div class='MessageSender'>"+d.SenderName+"</div><div class='MessageHeader'>"+d.Subject+"</div></td><td><div class='SendTime'>"+sendstr+"</div>"+(d.Attach?"<i class='glyphicon glyphicon-paperclip bigicon'/>":"")+"</td></tr>";
        }
    );

    $('#All_messages').find('tbody').html(tbody);
    populate_images();
    $('.Message').click(getMessage);
}

function getMoreMesages(start,total)
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

    const format='DD/MM/Y';
    var today=new moment();
    var realstart=new moment(start,format);
    if (today.diff(realstart,'years',true)<1) {
        var DateEnd = start;
        var DateBegin = (realstart.subtract(1, 'months')).format(format);

        if (Token !== null) {
            $.ajax({
                type: "POST",
                url: baseurl + '/mCoreMessage/Inbox',
                data: {Token: Token, UserId: UserId, DateBegin: DateBegin, DateEnd: DateEnd},
                success: function (response) {
                    switch (response.ResultCode) {
                        case 0: {
                         render_messagesAll.bind(response.Data)();
                            total += response.Data.length;
                            if (total < 30)
                                getMoreMesages(DateBegin, total);
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
        else logOff();
    }
}

function populate_images()
{
    $('.usr-img').each(function(){
        id=$(this).data('id');
        if (typeof $(this).attr('src')=='undefined')
        $(this).attr('src',getUserImg(id));
    })
}

function goback2()
{
   route('back2');
}