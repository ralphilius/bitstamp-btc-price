var init_ui = function() {
  let html = '';
  for (var i = 0; i < pairs.length; i++) {
    html += '<div class="ticker__item">';
    html += insert_at(pairs[i].toUpperCase(), "/", pairs[i].length / 2);
    html += '=<span id="' + pairs[i] + '"></span>';
    html += '</div>';
  }

  document.getElementById('ticker-group').innerHTML = html;
}

var reload_bottom_ui = function() {
  let pairs_price = JSON.parse(get_stored_string("pairs_price"));
  for (var property in pairs_price) {
    if (pairs_price.hasOwnProperty(property)) {
      let price = pairs_price[property];
      document.getElementById(property).innerText = price;
    }
  }
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "reload_horitontal_ticker") {
      console.log("Reloading horitontal ticker");
      reload_bottom_ui();
      sendResponse({
        result: "OK"
      })
    }
  }
);

window.addEventListener("load", init_ui);
