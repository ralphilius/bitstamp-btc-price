var popup_click = function(e) {
    var within = e.target.textContent;
    console.log(e.target.textContent);
    store_string('last-pair',get_currency_pair());
    store_string('currency-pair', within.replace("/", ""));
    chrome.browserAction.setTitle({
      'title': ''
    });
    chrome.browserAction.setBadgeText({
      'text': ''
    });
    chrome.extension.sendMessage({
      msg: "reload_badge"
    }, function(response) {
      if (response.result = 'OK') {
        reload_popup_ui();
      }
    });
    window.close();
  },
  reload_popup_ui = function() {
    /* var pairsDivs = document.getElementsByClassName('pair');
    for (var i = 0; i < pairsDivs.length; i++) {
      pairsDivs[i].addEventListener('click', popup_click);
      if(get_currency_pair() === pairsDivs[i].textContent){
        console.log(pairsDivs[i].textContent);
        pairsDivs[i].className += ' active';
      }
    } */
    console.log("Reloading UI");
    $('#checked-pair-icon').remove();
    $('.pair').each(function() {
      $(this).click(popup_click);
      $(this).removeClass('red inverted active');
      if (get_currency_pair() === this.textContent.replace("/", "")) {
        $(this).addClass('red inverted active');
        $(this).append('<i class="check circle middle aligned icon fitted green pl-xs" id="checked-pair-icon"></i>');
      }
    });

  },
  load_popup = function() {
    var html = '<div class="ui middle aligned selection animated list">';
    for (var i = 0; i < pairs.length; i++) {
      var baseCurrency = pairs[i].substring(0, 3);
      html += '<div class="item pair">';
      //html += '<img class="ui avatar image" src="https://coincodex.com/en/resources/images/admin/coins/fucktoken.png:resizebox?56x56">';
      html += '<i class="cc ' + baseCurrency.toUpperCase() + ' large icon"></i>';
      html += '<div class="content">';
      html += '<div class="header">' + insert_at(pairs[i].toUpperCase(), "/", pairs[i].length / 2) + '</div>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';
    document.getElementById('pair-list').innerHTML = html;

    /* $('input[type=radio]').each(function () {
        var elem = $(this),
            id = elem.attr('id'),
            checked = get_currency_pair() === elem.attr('value');
        elem.prop('checked', checked);
    }); */

    reload_popup_ui();
  };

document.addEventListener('DOMContentLoaded', function() {
  var divs = document.querySelectorAll('input');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', popup_click);
  }

});

window.addEventListener("load", load_popup);
