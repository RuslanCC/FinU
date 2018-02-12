function initSearch()
{

    initMarks();
    initDate();
    $('#search').show();
    $('#results').show();
    $('#ummt').hide();
    var that=this;
    initSearchGroups(that);
    $('#select-group').on('change',function(){
        localStorage.setItem('GroupsState'+that,this.value);
        initSearchStages(this.value,that);
    });
    $('#select-stage').on('change',function(){
        localStorage.setItem('GroupInfoState'+that,this.value);
        searchResults();});

    $('#date').on('change',function(){
        localStorage.setItem('DateState',this.value);
        searchResults();});
}

function initDate()
{
    var DateState=null;
    DateState=localStorage.getItem('DateState');
    if (DateState!=null)
        $('#date').val(DateState);
    else
    {
        var a = moment(new Date);
        $('#date').val(a.format('Y-MM-DD'));

    }
}

function initSearchGroups(that)
{
    var Groups=null;
    var GroupsState=null;
    local = false;
    if (localStorage.getItem('Groups') !== null) {
        Groups=localStorage.getItem('Groups');
        GroupsState=localStorage.getItem('GroupsState'+that);
        local = true;
    }
    if (sessionStorage.getItem('Groups') !== null) {

        Groups=sessionStorage.getItem('Groups');
    }
    if (Groups !== null) {
        Groups = JSON.parse(Groups);
        var options='';
        if (Groups!=null)
        Groups.map(function(group){
            selected=group.Id==GroupsState?"selected":'';
            options+='<option '+selected+' value="'+group.Id+'">'+group.Name+'</option>';
        });
        $('#select-group').html(options);
        initSearchStages(Groups[0].Id,that);
    }
}

function initSearchStages(groupId,that)
{
    var GroupInfo=null;
    var GroupInfoState=null;
    const format='D.MM.Y';
    var today=new moment();
    local = false;
    if (localStorage.getItem('GroupInfo'+groupId) !== null) {
        GroupInfo=localStorage.getItem('GroupInfo'+groupId);
        GroupInfoState=localStorage.getItem('GroupInfoState'+that);
        local = true;
    }
    if (sessionStorage.getItem('GroupInfo'+groupId) !== null) {
        GroupInfo=sessionStorage.getItem('GroupInfo'+groupId);
    }
    if (GroupInfo!=null)
    {
        GroupInfo=JSON.parse(GroupInfo);
        localStorage.setItem('CurriculumId',GroupInfo.CurriculumId);
        var options='';
        if (GroupInfo!=null)
        GroupInfo.Stages.map(function(stage){
           if (GroupInfoState==null)
           {
               selected=today.isBetween(new moment(stage.DateBegin,format),new moment(stage.DateEnd,format))||today.isSame(today,new moment(stage.DateBegin,format))||today.isSame(today,new moment(stage.DateEnd,format))?'selected':'';
           }
           else
           {
               selected=stage.Number==GroupInfoState?'selected':'';
           }

           if (stage.Number==0)
               options+='<option '+selected+' value="'+stage.Number+'">Всё время</option>';
               else
            options+='<option '+selected+' value="'+stage.Number+'">'+stage.Number+' учебный период '+'[c '+stage.DateBegin+' по '+stage.DateEnd+'] </option>';
        });
        $('#select-stage').html(options);
        searchResults();
    }
}

function searchResults()
{
    route(window.searchMode);
    switch(window.searchMode)
    {
        case 'MOB_CURRICULUM_INFO':
            load_MOB_CURRICULUM_INFO();
            break;
        case 'MOB_FA_MARKS':
            load_MOB_FA_MARKS();
            break;
        case 'MOB_FA_DEBTS':
            load_MOB_FA_DEBTS();
            break;
        case 'MOB_FA_RETESTS':
            load_MOB_FA_RETESTS();
            break;
        case 'MOB_TIMETABLE_ACCOUNT':
            if ($('#date').val()=='') {
                var a = moment(new Date);
                $('#date').val(a.format('Y-MM-DD'));
            }
            load_MOB_TIMETABLE_ACCOUNT();
            break;
    }
}

function load_MOB_FA_MARKS()
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
    var GroupId=$('#select-group').val();
    var Stage=$('#select-stage').val()?$('#select-stage').val():0;
    if (Token !== null&&GroupId>0) {
        loading('#results');
        $.ajax({
            type: "POST",
            url: baseurl + 'mFaAccount/MarksByStage',
            data: {UserId: UserId, Token: Token,GroupId:GroupId,Stage:Stage},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        $('#results').load('./views/search-results-marks.html',render_MOB_FA_MARKS.bind(response.Data));
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

function render_MOB_FA_MARKS()
{
    localStorage.setItem('Marks',JSON.stringify(this));
    var data=this;
    var tbody='';
    var stage=null;
    data.map(function(d,i)
    {
        if (stage!=d.Stage)
        {
            stage=d.Stage;
            tbody+="<tr class='stage'><td colspan='3'>"+stage+" учебный период </td></tr>";
        }
        tbody+='<tr data-toggle="modal" data-target="#Marks" data-mode="Marks" data-index="'+i+'"><td>'+d.DisciplineName+'</td><td>'+d.Result_Summary +'<br/>'+'<span class="marksDate">['+d.DateSheet+']</span>'+'</td><td>'+d.Result_Diplom+'</td></tr>'
    });
    if (tbody=='') tbody='<h4>Ничего не найдено</h4>';
    $('.results-table').find('tbody').html(tbody);
}

function load_MOB_FA_DEBTS()
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
    var GroupId=$('#select-group').val();
    var Stage=$('#select-stage').val()?$('#select-stage').val():0;
    if (Token !== null&&GroupId>0) {
        loading('#results');
        $.ajax({
            type: "POST",
            url: baseurl + 'mFaAccount/DebtsByStage',
            data: {UserId: UserId, Token: Token,GroupId:GroupId,Stage:Stage},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        $('#results').load('./views/search-results-debts.html',render_MOB_FA_DEBTS.bind(response.Data));
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

function render_MOB_FA_DEBTS()
{
    var data=this;
    var tbody='';
    var stage=null;
    localStorage.setItem('Debts',JSON.stringify(this));
    data.map(function(d,i)
    {
        if (stage!=d.Stage)
        {
            stage=d.Stage;
            tbody+="<tr class='stage'><td colspan='3'>"+stage+" учебный период </td></tr>";
        }
        tbody+='<tr data-toggle="modal" data-target="#Marks" data-mode="Debts" data-index="'+i+'"><td>'+d.DisciplineName+'</td><td>'+d.DebtType +' ('+d.DebtMark+')</td></tr>'
    });
    if (tbody=='') tbody='<h4>Ничего не найдено</h4>';
    $('.results-table').find('tbody').html(tbody);
}


function load_MOB_FA_RETESTS()
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
    var GroupId=$('#select-group').val();
    var Stage=$('#select-stage').val()?$('#select-stage').val():0;
    if (Token !== null&&GroupId>0) {
        loading('#results');
        $.ajax({
            type: "POST",
            url: baseurl + 'mFaAccount/ReTestsByStage',
            data: {UserId: UserId, Token: Token,GroupId:GroupId,Stage:Stage},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        $('#results').load('./views/search-results-retests.html',render_MOB_FA_RETESTS.bind(response.Data));
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

function render_MOB_FA_RETESTS()
{
    var data=this;
    var tbody='';
    var stage=null;
    localStorage.setItem('Retests',JSON.stringify(this));
    data.map(function(d,i)
    {
        if (stage!=d.Stage)
        {
            stage=d.Stage;
            tbody+="<tr class='stage'><td colspan='3'>"+stage+" учебный период </td></tr>";
        }
        tbody+='<tr data-toggle="modal" data-target="#Marks" data-mode="Retests" data-index="'+i+'"><td>'+d.DisciplineName+'</td><td>'+d.Control +'</td><td>'+d.Mark+'</td></tr>';
    });
    if (tbody=='') tbody='<h4>Ничего не найдено</h4>';
    $('.results-table').find('tbody').html(tbody);
}


function load_MOB_TIMETABLE_ACCOUNT()
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
    var b=moment(localStorage.getItem('DateState'));
    if (!b.isValid()) b=new moment();
    var date=b.format('D.MM.Y');
    if (Token !== null) {
        loading('#results');
        $.ajax({
            type: "POST",
            url: baseurl + 'mGosvpoAccount/TimeTable',
            data: {UserId: UserId, Token: Token,Date:date},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        window.timetable=response;
                        $('#results').load('./views/search-results-timetable.html',render_MOB_TIMETABLE_ACCOUNT.bind(response.Data));
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

function render_MOB_TIMETABLE_ACCOUNT()
{
    var data=this;
    var tbody='';
    localStorage.setItem('Timetable',JSON.stringify(this));
    data.map(function(d,index0)
    {
        tbody+='<tr><td rowspan="'+d.Disciplines.length+'">'+d.TimeStart+'<br/>'+d.TimeEnd+'</td>';
        var disc='';
        if (typeof(d.Disciplines)=='array'||typeof(d.Disciplines)=='object')
        d.Disciplines.map(function(d1,index1)
        {

            if (disc!='') disc+='</tr><tr>';
            disc+='<td class="disc" data-toggle="modal" data-target="#Marks" data-mode="Timetable" data-index0="'+index0+'" data-index1="'+index1+'">';
            disc+=d1.Name;
            disc+='</td>';
            disc+='<td>';

            if (typeof(d1.Auditoriums)=='array'||typeof(d1.Auditoriums)=='object')
            d1.Auditoriums.map(function(a1,i1){
                if (typeof(a1.Tutors)=='array'||typeof(a1.Tutors)=='object')
                a1.Tutors.map(function(t1,i2){
                    if (i1>0||i2>0) disc+='<br/><br/>';
                    disc+=inspector(t1.Id,t1.Name,1)+'<span class="aud">'+a1.Name+'</span>';
                });
            });
            disc+='</td>';
        });
        disc+='</tr>';
        tbody+=disc;
    });
    if (tbody=='') tbody='<h4>Ничего не найдено</h4>';
    $('.results-table').find('tbody').html(tbody);
}

function initMarks()
{
    $('#Marks').on('hidden.bs.modal',function(){loading('.marks-body');
    });
    $('#Marks').on('show.bs.modal', function (event) {
        switch ($(event.relatedTarget).data('mode')){
            case 'Marks':
        if ($(event.relatedTarget).data('index') != null) {
            var data = JSON.parse(localStorage.getItem('Marks'));
            var d = data[$(event.relatedTarget).data('index')];
            $(this).find('.marks-header').html('УСПЕВАЕМОСТЬ');
            $(this).find('.marks-body').html(
                '<table class="marks-table"><tbody>' +
                '<tr><td>Дисциплина:</td><td>' + d.DisciplineName + '</td></tr>' +
                '<tr><td>Семестр:</td><td>' + d.Stage + '</td></tr>' +
                '<tr><td>Дата:</td><td>' + d.DateSheet + '</td></tr>' +
                '<tr><td>ТК:</td><td>' + d.Result_Att + '</td></tr>' +
                '<tr><td>РС:</td><td>' + d.Result_Stage + '</td></tr>' +
                '<tr><td>Зач/экз:</td><td>' + d.Result_Inspection + '</td></tr>' +
                '<tr><td>Преподаватели:</td><td>' + inspector(d.Inspector1, d.InspectorName1, 1) + inspector(d.Inspector2, d.InspectorName2, 2) + inspector(d.Inspector3, d.InspectorName3, 3) + '</td></tr>' +
                '<tr><td>Итого:</td><td>' + d.Result_Summary + '</td></tr>' +
                '<tr><td>Оценка:</td><td>' + d.Result_Diplom + '</td></tr>' +
                '</tbody></table>');
            }
                break;
            case 'Debts':
                var data = JSON.parse(localStorage.getItem('Debts'));
                var d = data[$(event.relatedTarget).data('index')];
                $(this).find('.marks-header').html('ЗАДОЛЖЕННОСТЬ');
                $(this).find('.marks-body').html(
                    '<table class="marks-table"><tbody>' +
                    '<tr><td>Дисциплина:</td><td>' + d.DisciplineName + '</td></tr>' +
                    '<tr><td>Семестр:</td><td>' + d.Stage + '</td></tr>' +
                    '<tr><td>Цикл:</td><td>' + d.CicleName + '</td></tr>' +
                    '<tr><td>Задолженность:</td><td>' + d.DebtType + '</td></tr>' +
                    '<tr><td>Раз:</td><td>' + d.DebtCount + '</td></tr>' +
                    '<tr><td>Контроль:</td><td>' + d.DebtMark + '</td></tr>' +
                    '</tbody></table>');
                break;
            case 'Retests':
                var data = JSON.parse(localStorage.getItem('Retests'));
                var d = data[$(event.relatedTarget).data('index')];
                $(this).find('.marks-header').html('ПЕРЕЗАЧЕТ');
                $(this).find('.marks-body').html(
                    '<table class="marks-table"><tbody>' +
                    '<tr><td>Дисциплина:</td><td>' + d.DisciplineName + '</td></tr>' +
                    '<tr><td>Семестр:</td><td>' + d.Stage + '</td></tr>' +
                    '<tr><td>Цикл:</td><td>' + d.CicleName + '</td></tr>' +
                    '<tr><td>Часов:</td><td>' + d.Hours + '</td></tr>' +
                    '<tr><td>Контроль:</td><td>' + d.Control + '</td></tr>' +
                    '<tr><td>Оценка:</td><td>' + d.Mark + '</td></tr>' +
                    '</tbody></table>');
                break;
            case 'Timetable':
                var data=JSON.parse(localStorage.getItem('Timetable'));
                var d = data[$(event.relatedTarget).data('index0')];
                $(this).find('.marks-header').html('РАСПИСАНИЕ');
                var html='';
                html='<table class="marks-table"><tbody>' +
                    '<tr><td>Время:</td><td>' + d.TimeStart+'  '+d.TimeEnd+ '</td></tr>';
                var groups='';
                d.Groups.map(function(g){
                    if (groups!='') groups+=', ';
                    groups+=g.Name;
                });
                html+= '<tr><td>Группы:</td><td>' +groups+ '</td></tr>';
                html+=  '<tr><td>Дисциплина:</td><td>' +d.Disciplines[$(event.relatedTarget).data('index1')].Name+ '</td></tr>'+
                        '<tr><td>Занятие:</td><td>' +d.LessonType+ '</td></tr>';

                html+= '<tr><td></td><td>Преподаватели</td></tr>';
                var d1=d.Disciplines[$(event.relatedTarget).data('index1')];
                {
                   d1.Auditoriums.map(function(a2)
                   {
                      a2.Tutors.map(function(t3)
                      {
                          html+= '<tr><td>ФИО:</td><td>'+inspector(t3.Id,t3.Name,1)+'</td></tr>';
                          html+= '<tr><td>Аудитория:</td><td>'+a2.Name+' ('+a2.Path+')</td></tr>';
                          if (t3.Comments!='')
                              html+= '<tr><td>Комментарии:</td><td>'+t3.Comments+'</td></tr>';

                      })
                   });
                }
                html+='</tbody></table>';

                $(this).find('.marks-body').html(html);

                break;
            default:
                break;
        }
    });
}

function inspector(id,name,index)
{
    var result='';
    if (id!=null && id!='null')
    {

        result+='<div class="inspector" data-toggle="modal" data-target="#UserInfo" data-id="'+id+'">'+name+'</div>';
    }
    return result;
}

function load_MOB_CURRICULUM_INFO()
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
    var GroupId=$('#select-group').val();
    var Stage=$('#select-stage').val()?$('#select-stage').val():0;
    if (Token !== null&&GroupId>0) {
        loading('#results');
        $.ajax({
            type: "POST",
            url: baseurl + '/mGosvpoGroup/CurriculumByStage',
            data: {Token: Token,Id:GroupId,Stage:Stage},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        $('#results').load('./views/search-results-education.html',render_MOB_CURRICULUM_INFO.bind(response.Data));
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

function render_MOB_CURRICULUM_INFO()
{
    var data=this;
    var tbody='';
    localStorage.setItem('Education',JSON.stringify(data));
    var CicleName='';
    var Hours_in_Head=false;
    var once=false;
    var isblock=false;
    if (typeof data.Items!='undefined')
    data.Items.map(function(d,i,arr)
    {
        Hours=d.TotalHours;
        if (CicleName!==d.CicleName) {
            CicleName = d.CicleName;
            tbody += '<tr class="ModuleHead"><td colspan="2">' + CicleName + '</td><td></td></tr>';
            Hours_in_Head = false;
            isblock=false;
        }
        if (d.Name.search(/блок/i)!==-1) {
                isblock=true;
                once=true;
                Hours_in_Head = true;
                for (var j = i; (j < arr.length - 1) && arr[j].CicleName === CicleName&&arr[j].Name.search(/блок/i)===-1; j++) {
                    if (Hours !== arr[j].TotalHours) {
                        Hours_in_Head = false;
                    }
                }
            }
        if (once) {
            once = false;
            if (Hours_in_Head)
                tbody += '<tr data-index="'+i+'" class="CicleHead"><td colspan="2">' + d.Name + '</td><td>' + Hours + '</td>';
            else
                tbody += '<tr data-index="'+i+'" class="CicleHead"><td colspan="2">' + d.Name + '</td><td></td>';
        }
        else
        if (isblock) {
            if (Hours_in_Head)
                tbody += '<tr data-index="'+i+'" class="Discipline"><td></td><td>' + d.Name + '</td><td></td>';
            else
                tbody += '<tr data-index="'+i+'" class="Discipline"><td></td><td>' + d.Name + '</td><td>' + Hours + '</td>';
        }
        else
            tbody += '<tr data-index="'+i+'" class="CicleHead"><td colspan="2">' + d.Name + '</td><td>' + Hours + '</td>';
    });
    if (tbody=='') tbody='<h4>Ничего не найдено</h4>';
    $('.results-table').find('tbody').html(tbody);
    $('.CicleHead,.Discipline').click(load_ummt);

}

function load_ummt()
{
    var index=$(this).data('index');
    var data=JSON.parse(localStorage.getItem('Education'));
    console.log(data);
    $('.curr-page').html('<span>УММТ по РУП</span>');
    route('UMMT');
    head='<div class="results-header"><span style="padding-left: 2px;">Учебная дисциплина "'+data.Items[index].Name+'"</span></div>' +
        '<div id="ummt-body"></div>';
    $('#ummt').html(head);
    loading('#ummt-body');
    CurriculumId=localStorage.getItem('CurriculumId');


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
    var GroupId=$('#select-group').val();
    var Stage=$('#select-stage').val()?$('#select-stage').val():0;
    if (Token !== null&&GroupId>0) {
        $.ajax({
            type: "POST",
            url: baseurl + '/mGosvpoGroup/UmmtByStage',
            data: {Token: Token,Id:CurriculumId, DisciplineId:data.Items[index].DisciplineId,GroupId:GroupId,Stage:Stage},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        $('#ummt-body').load('./views/ummt.html',render_UMMT.bind(response.Data));
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

function goback()
{
    route('back_UMMT');
}

function render_UMMT()
{
    var data=this;
    route('start_UMMT');
    var tbody='';
    CategoryName='';
    data.map (function(d,i)
    {
        if (CategoryName!==d.CategoryName)
        {
            CategoryName=d.CategoryName;
            tbody+='<tr class="CategoryName"><td colspan="2">'+CategoryName+'</td><td></td></tr>';
        }
        type=d.TypeName;
        if (d.Type=='049f8f4f-2e8d-4182-bb1b-1e56a3b3ba1a')
            type='video';
        tbody+='<tr><td ><div class="tdicon '+type+'"></div></td><td>'+d.Name+'</td><td></td>';
    }
    );

    $('#ummt-body').find('tbody').html(tbody);
}