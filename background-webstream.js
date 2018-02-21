var reload_badge = function(pair, data) {
  if (pair != get_currency_pair().toLowerCase()) {
    return;
  }
  var value = data.price ? parseFloat(data.price) : parseFloat(data.last),
    last_value = get_last_value() || value,
    badge_value = value * get_multiplier();
  //console.log(value);

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
var channels = {};
var open_webstream = function() {
  console.log("open_webstream()");
  if (!get_last_value() || get_currency_pair() != get_last_pair()) {
    $.getJSON("https://www.bitstamp.net/api/v2/ticker/" + get_currency_pair().toLowerCase() + "/", function(data) {
      if (!data && !data.last) {
        return;
      }
      reload_badge(get_currency_pair().toLowerCase(), data);
    });
  }

  function start_pusher() {
    if (pusher) {
      pusher.disconnect();
    }
    pusher = new Pusher('de504dc5763aeef9ff52', {
      disableStats: true
    });
    pairs.forEach(function(pair) {
      let subscribedChannel = pusher.subscribe(get_channel_name(pair));
      channels[pair] = subscribedChannel;
      subscribedChannel.bind("trade", function(data) {
        reload_badge(pair, data);
        let pairs_price = JSON.parse(get_stored_string("pairs_price"));
        pairs_price[pair] = data.price;
        store_string("pairs_price", JSON.stringify(pairs_price));

        chrome.extension.sendMessage({
          msg: "reload_horitontal_ticker"
        }, function(response) {
          // if (response.result = 'OK') {
          //
          // }
        });


      });
    });
  }

  function store_pairs_price(pairs_price) {
    store_string("pairs_price", JSON.stringify(pairs_price));
    console.log(get_stored_string("pairs_price"));
    console.log("Init Done!");
    start_pusher();
  }

  if (get_stored_string("pairs_price") === undefined) {
    var pairs_price = new Object();
    var itemsProcessed = 0;
    pairs.forEach(function(pair, index, array) {
      let url = "https://www.bitstamp.net/api/v2/ticker/" + pair + "/";
      $.getJSON(url, function(data) {
        console.log("Getting price first time: " + url);
        itemsProcessed++;
        pairs_price[pair] = 0;
        if (!data && !data.last) {
          return;
        }
        pairs_price[pair] = data.last;
        if (itemsProcessed === array.length) {
          store_pairs_price(pairs_price);
        }
      });

    });

  } else {
    start_pusher();
  }


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
