function getConfig()
{
    if (typeof window.localStorage==='object') {
        if (localStorage.getItem('css')!==null)
        {
            $("<style></style>").appendTo("head").html(localStorage.getItem('css'));
        }
        else
        $.ajax({
            type: "POST",
            url: baseurl + 'mCore/Config',
            success: function (response) {
              switch (response.ResultCode)
              {
                  case 0:
                  {
                      $.ajax({
                          url: baseurl+response.Data.CSS.slice(2),
                          dataType: 'text',
                          success: function(data) {
                              localStorage.setItem('css',data);
                              $("<style></style>").appendTo("head").html(data);
                          },
                          error: function() {console.error('Не удалось загрузить css');}
                      });
                      break;
                  }
                  default:
                      parseError(response);
              }
            },
            error: function () {
                genAlert('Не удается установить соединение с сервером');
            },
            dataType: 'JSON'
        });
    }
}

