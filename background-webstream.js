var reload_badge = function(data) {
    var value = data.price? parseFloat(data.price):parseFloat(data.last),
      last_value = get_last_value() || value,
      badge_value = value * get_multiplier();
      console.log(value);
    if (value === last_value) {
      chrome.browserAction.setBadgeBackgroundColor({
        color: [0, 0, 0, 150]
      });
    } else if (value > last_value) {
      chrome.browserAction.setBadgeBackgroundColor({
        color: [0, 150, 0, 150]
      });
    } else {
      chrome.browserAction.setBadgeBackgroundColor({
        color: [255, 0, 0, 255]
      });
    }
    var baseCurrency = get_currency_pair().substring(0, 3);
    var xchangeCurrency = get_currency_pair().substring(3, get_currency_pair().length);
    chrome.browserAction.setTitle({
      'title': '1 ' + baseCurrency + ' = ' + value + ' ' + xchangeCurrency
    });
    chrome.browserAction.setBadgeText({
      'text': _formatter(badge_value)
    });
    store_float('last-value', value);
  };

var pusher;
var open_webstream = function() {
  console.log("open_webstream()");
  if(!get_last_value() || get_currency_pair() != get_last_pair()){
    $.getJSON("https://www.bitstamp.net/api/v2/ticker/" + get_currency_pair().toLowerCase() + "/", function(data) {
      if (!data && !data.last) {
        return;
      }
      reload_badge(data);
    });
  }
  if (pusher){
    pusher.disconnect();
  }
  pusher = new Pusher('de504dc5763aeef9ff52',{
    disableStats: true
  }),
    channel = get_currency_pair().toLowerCase() === 'btcusd'? 'live_trades':'live_trades_' + get_currency_pair().toLowerCase(),
    tradesChannel = pusher.subscribe(channel);
    console.log(channel);
  tradesChannel.bind('trade', function(data) {
    //console.log(data);
    reload_badge(data)
  });
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "reload_badge") {
      open_webstream();
      sendResponse({
        result: "OK"
      })
    }
  }
);

open_webstream();
