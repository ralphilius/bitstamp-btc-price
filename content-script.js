var iframe = document.createElement('iframe');
iframe.setAttribute("style", "border:none; width:100%; bottom: 0; position: fixed;");
iframe.setAttribute("scrolling", "no");
iframe.setAttribute("frameborder", "0");
iframe.setAttribute("src", chrome.extension.getURL("bottom-ticker.html"));

document.body.appendChild(iframe);
