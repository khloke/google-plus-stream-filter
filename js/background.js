/**
 * Created with IntelliJ IDEA.
 * User: khloke
 * Date: 7/03/13
 * Time: 9:44 PM
 */
chrome.tabs.onActivated.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.tabId, {action: 'currentStatus'}, function(response) {
        if (response) {
            if (response.response == 'true') {
                chrome.browserAction.setIcon({path: '/img/icon48.png'});
                return;
            }
        }
        chrome.browserAction.setIcon({path: '/img/icon48_disabled.png'});
    });
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {action: 'toggle'}, function(response) {
        if (response.response == 'true') {
            chrome.browserAction.setIcon({path:'/img/icon48.png'});
        } else {
            chrome.browserAction.setIcon({path:'/img/icon48_disabled.png'});
        }
        chrome.tabs.reload(tab.id);
    });
});

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == 'getRules') {
            sendResponse({response:localStorage['rules']});
        } else {
            sendResponse({response:"Unsupported Message Received"});
        }
    }
);