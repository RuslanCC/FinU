function initMenu() {
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
        initUserInfo();
        initGroups();
        loading('#mainmenu');
        $.ajax({
            type: "POST",
            url: baseurl + '/mCoreAccount/Funct',
            data: {Id: UserId, Token: Token},
            success: function (response) {
                switch (response.ResultCode) {
                    case 0: {
                        if (local)
                            localStorage.setItem('Functions', JSON.stringify(response.Data.Functions));
                        else
                            sessionStorage.setItem('Functions', JSON.stringify(response.Data.Functions));
                        renderMenu(response.Data.Functions);
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

function renderMenu(functions) {
    menu = '';
    var close = false;
    if (typeof(functions)!='undefined')
    {functions.forEach(
        function (key) {
            switch (key) {
                case 'MOB_TIMETABLE_ACCOUNT':
                    if (close) {
                        menu += ('</ul>');
                        close = false;
                    }
                    menu += ('<li class="sheduler"><a id="MOB_TIMETABLE_ACCOUNT" href="#">Расписание занятий</a></li>');
                    if (true) menu += ('<li class="education"><a id="MOB_CURRICULUM_INFO" href="#">Обучение</a></li>');
                    break;
                case 'CURRICULUM':
                    if (close) {
                        menu += ('</ul>');
                        close = false;
                    }
                    menu += ('<li class="learn"><a id="CURRICULUM" href="#">Обучение</a></li>');
                    break;
                case 'MOB_FA_MARKS':
                    if (!close) {
                        menu += ('<li class="doc" data-toggle="collapse" data-target=".child-list"><a href="#">Электронная зачетка</a></li><ul class="collapse in child-list">');
                        close = true;
                    }
                    menu += ('<li class="one-item"><a id="MOB_FA_MARKS" href="#">успеваемость</a></li>');
                    break;
                case 'MOB_FA_DEBTS':
                    if (!close) {
                        menu += ('<li class="doc" data-toggle="collapse" data-target=".child-list"><a href="#">Электронная зачетка</a></li><ul class="collapse in child-list">');
                        close = true;
                    }
                    menu += ('<li class="two-item"><a id="MOB_FA_DEBTS" href="#">задолженности</a></li>');
                    break;
                case 'MOB_FA_RETESTS':
                    if (!close) {
                        menu += ('<li class="doc" data-toggle="collapse" data-target=".child-list"><a href="#">Электронная зачетка</a></li><ul class="collapse in child-list">');
                        close = true;
                    }
                    menu += ('<li class="three-item"><a id="MOB_FA_RETESTS" href="#">перезачеты</a></li>');
                    break;
            }
        }
    );
    if (close) {
        menu += ('</ul>');
        close = false;
    }


        menu += ('<li class="messages"><a id="messageButton" href="#">Сообщения</a></li>');
    if (false) menu += ('<li class="options"><a href="#">Настройки</a></li>');
    menu += ('<li class="exit"><a href="#">Выход</a></li>');
    $('#mainmenu').html(menu);
        $('#messageButton').on('click',function(){
            $('.aside').asidebar('close');
            getMessages();
        });

        $('#MOB_CURRICULUM_INFO').on('click',function(){
            $('.aside').asidebar('close');
            window.searchMode='MOB_CURRICULUM_INFO';
            $('.curr-page').html('<span>Обучение</span>');

            $('#search').load('./views/search-header.html',initSearch.bind('MOB_CURRICULUM_INFO'));
        });


    $('#MOB_FA_MARKS').on('click',function(){
        $('.aside').asidebar('close');
        window.searchMode='MOB_FA_MARKS';
        $('.curr-page').html('<span>Успеваемость</span>');

        $('#search').load('./views/search-header.html',initSearch.bind('MOB_FA_MARKS'));
    });

    $('#MOB_FA_DEBTS').on('click',function(){
        $('.aside').asidebar('close');
        window.searchMode='MOB_FA_DEBTS';
        $('.curr-page').html('<span>Задолженности</span>');

        $('#search').load('./views/search-header.html',initSearch.bind('MOB_FA_DEBTS'));
    });

    $('#MOB_FA_RETESTS').on('click',function(){
        $('.aside').asidebar('close');
        window.searchMode='MOB_FA_RETESTS';
        $('.curr-page').html('<span>Перезачеты</span>');

        $('#search').load('./views/search-header.html',initSearch.bind('MOB_FA_RETESTS'));
    });

    $('#MOB_TIMETABLE_ACCOUNT').on('click',function(){
        $('.aside').asidebar('close');
        window.searchMode='MOB_TIMETABLE_ACCOUNT';
        $('.curr-page').html('<span>Расписание</span>');
        $('#search').load('./views/search-header.html',initSearch.bind('MOB_TIMETABLE_ACCOUNT'));
    });

    $('#MOB_TIMETABLE_ACCOUNT_').on('click',function(){
        $('.aside').asidebar('close');
        window.searchMode='MOB_TIMETABLE_ACCOUNT';
        $('.curr-page').html('<span>Расписание</span>');
        $('#search').load('./views/search-header.html',initSearch.bind('MOB_TIMETABLE_ACCOUNT'));
    });


    $('.exit').on('click', logOff);

    $('#'+functions[0]).click();
    }
}