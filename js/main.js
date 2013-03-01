/**
 * Created with IntelliJ IDEA.
 * User: khloke
 * Date: 26/01/13
 * Time: 2:26 AM
 */
$(document).ready(function() {
    messageScript("currentStatus", function(response) {
        if (response.response == 'true') {
            $('#unpaused').show();
            $('#error').hide();
        } else {
            $('#paused').show();
            $('#error').hide();
        }
    });

    $('#unpauseBtn').click(function(){
        unpause();
    });

    $('#pauseBtn').click(function() {
        pause();
    });

});

function pause() {
    localStorage.setItem("hideNoModPosts", false);
    $('#paused').show();
    $('#unpaused').hide();
    messageScript('pause', function(){});
    chrome.tabs.reload();
}

function unpause() {
    localStorage.setItem("hideNoModPosts", true);
    $('#paused').hide();
    $('#unpaused').show();
    messageScript('unpause', function(){});
    chrome.tabs.reload();
}

function messageScript(action, callback) {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {action: action}, function(response) {
          callback(response);
      });
    });
}