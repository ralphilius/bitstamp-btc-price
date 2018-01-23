function click(e) {
	var within = e.target.value;
	store_string('currency-pair', within);
	chrome.browserAction.setTitle({'title': ''});
	chrome.browserAction.setBadgeText({'text': ''});
	chrome.extension.sendMessage({ msg: "reload_badge" });
	window.close();
}
document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('input');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});

window.addEventListener("load", load_popup);
