
/**
 * Created with IntelliJ IDEA.
 * User: khloke
 * Date: 26/01/13
 * Time: 1:15 AM
 */

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == 'pause') {
            localStorage.setItem("hideNoModPosts", false);
            sendResponse({response:"ok"});
        } else if (request.action == 'unpause') {
            localStorage.setItem("hideNoModPosts", true);
            sendResponse({response:"ok"});
        } else if (request.action == 'currentStatus') {
            sendResponse({response:localStorage['hideNoModPosts']});
        } else {
            sendResponse({response:"fail"});
        }
    }
);

if (localStorage['hideNoModPosts'] == 'true') {
    hideNoModPosts();

    $('.ow').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
        hideNoModPosts()
    });
}

function hideNoModPosts() {
    $('.ow .Tg').each(function () {
        var hasModTools = $(this).find('.hE');

        if (hasModTools.length <= 0) {
            $(this).hide();
        }
    });
}