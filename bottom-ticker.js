chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "reload_horitontal_ticker") {
      console.log("Reloading horitontal ticker");
      sendResponse({
        result: "OK"
      })
    }
  }
);
