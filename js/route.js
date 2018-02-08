function route(path)
{
    $('#search').hide();
    $('#results').hide();
    $('#ummt').hide();
    $('#stage-group').hide();
    $('#group-group').hide();
    $('#date-group').hide();
    $('.msg').hide();
    $('.cont').hide();

    switch (path)
    {
        case 'MOB_CURRICULUM_INFO':
            $('#search').show();
            $('#results').show();
            $('#group-group').show();
            $('#stage-group').show();
            break;
        case 'MOB_FA_MARKS':
            $('#search').show();
            $('#results').show();
            $('#stage-group').show();
            break;
        case 'MOB_FA_DEBTS':
            $('#search').show();
            $('#results').show();
            $('#group-group').show();
            $('#stage-group').show();
            break;
        case 'MOB_FA_RETESTS':
            $('#search').show();
            $('#results').show();
            $('#group-group').show();
            $('#stage-group').show();
            break;
        case 'MOB_TIMETABLE_ACCOUNT':
            $('#search').show();
            $('#results').show();
            $('#date-group').show();
            break;
        case 'start_UMMT':
            $('#ummt').show();
            break;

        case 'back_UMMT':
            $('.btn-menu').show();
            $('#MOB_TIMETABLE_ACCOUNT_').show();
            $('.back').hide();
            $('#search').show();
            $('#results').show();
            $('#ummt').hide();
            break;
        case 'start_UMMT':
            $('.btn-menu').hide();
            $('#MOB_TIMETABLE_ACCOUNT_').hide();
            $('.back').show();
            break;
        case 'new_Message':
            $('#messages').show();
            $('#New_Message').show();
            break;
        case 'read_Message':
            $('#messages').show();
            $('#Read_message').show();
            break;
        case 'get_Messages':
            $('#messages').show();
            $('#All_messages').show();
            break;
        case 'render_Message':
            $('#messages').show();
            $('#Read_message').show();
            $('.btn-menu').hide();
            $('#MOB_TIMETABLE_ACCOUNT_').hide();
            $('.back2').show();
            break;
        case 'render_MessagesAll':
            $('#messages').show();
            $('#All_messages').show();
            $('.btn-menu').hide();
            $('#MOB_TIMETABLE_ACCOUNT_').hide();
            $('.back2').show();
            break;
        case 'back2':
            $('.btn-menu').show();
            $('#MOB_TIMETABLE_ACCOUNT_').show();
            $('.back2').hide();
            $('.cont').show();$('#messages').hide();
            break;
        default:
            console.log('Something went wrong:' +path);
    }

}