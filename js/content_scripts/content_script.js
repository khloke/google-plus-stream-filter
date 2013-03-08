
/**
 * Created with IntelliJ IDEA.
 * User: khloke
 * Date: 26/01/13
 * Time: 1:15 AM
 */

function hidePosts() {
    var first = true;

    $("[id^=update]").each(function () {
        var hasModTools = $(this).find('.hE');
        if (hasModTools.length <= 0) {
            if (!first) {
                $(this).remove();
            } else {
                $(this).hide();
            }
            first = false;
        }
    });
}

if (localStorage['hideNoModPosts'] == 'true') {
    hidePosts();

    $('.ow').bind('DOMNodeInserted', function(event) {
        hidePosts()
    });
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == 'currentStatus') {
            sendResponse({response:localStorage['hideNoModPosts']});
        } else if (request.action == 'toggle') {
            if (localStorage['hideNoModPosts'] == 'true') {
                localStorage.setItem("hideNoModPosts", false);
            }  else {
                localStorage.setItem("hideNoModPosts", true);
            }
            sendResponse({response:localStorage['hideNoModPosts']});
        } else {
            sendResponse({response:"Unsupported Message Received"});
        }
    }
);