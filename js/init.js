$(document).ready(function(){
    if (localStorage.getItem('Token')!==null)
    {
        $('.wrapper').load('./views/menu.html',initMenu);
    }
    else
    {
        logOff();
    }
});