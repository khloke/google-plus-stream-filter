
/**
 * Created with IntelliJ IDEA.
 * User: khloke
 * Date: 26/01/13
 * Time: 1:15 AM
 */

function hidePosts() {
    chrome.runtime.sendMessage({action: 'getSettings'}, function(response) {
        if (response.response) {
            var first = true;
            var storageSettings = response.response;

            $("[id^=update]").each(function () {
                if (storageSettings) {
                    var settings = JSON.parse(storageSettings);
                    var showHide = settings.show;
                    var anyAll = settings.all;
                    var rules = settings.rules;
                    var ruleMatch = [];

                    for (var i = 0; i < rules.length; i++) {
                        var rule = rules[i];

                        switch (rule.option2) {
                            case 'time':
                                var timeRule = checkTimeRule($(this), rule);
                                ruleMatch.push(timeRule);
                                break;

                            case 'author':
                                var authorRule = checkAuthorRule($(this), rule);
                                ruleMatch.push(authorRule);
                                break;

                            case 'content':
                                var contentRule = checkContentRule($(this), rule);
                                ruleMatch.push(contentRule);
                                break;

                            case 'attachment':
                                var attachmentRule = checkAttachmentRule($(this), rule);
                                ruleMatch.push(attachmentRule);
                                break;

                            case 'moderator':
                                var moderatorRule = checkModeratorRule($(this));
                                ruleMatch.push(moderatorRule);
                                break;
                        }
                    }

                    var match = anyAll == 'all';
                    for (var j = 0; j < ruleMatch.length; j++) {
                        var thisRule = ruleMatch[j];

                        if (anyAll == 'all') {
                            match &= thisRule;
                        } else {
                            match |= thisRule;
                        }
                    }

                    if (match) {
                        if (showHide == 'hide') {
                            if (!first) {
                                $(this).remove();
                            } else {
                                $(this).hide();
                            }
                            first = false;
                        }
                    } else {
                        if (showHide == 'show') {
                            if (!first) {
                                $(this).remove();
                            } else {
                                $(this).hide();
                            }
                            first = false;
                        }
                    }
                }
            });
        }
    });
}

$(document).ready(function() {
    if (localStorage['hideNoModPosts'] == 'true') {
        hidePosts();

        $('.ow').bind('DOMNodeInserted', function() {
            hidePosts()
        });
    }
});

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

function checkTimeRule(post, rule) {
    var datetime = post.find('.ik.Bf').attr('title');
    var published = new Date(datetime);
    var conditionDatetime = rule.time;
    var condition = rule.option3;

    if (condition == 'is') {
        return published == conditionDatetime;
    } else if (condition == 'before') {
        return published < conditionDatetime;
    } else {
        return published > conditionDatetime;
    }
}

function checkAuthorRule(post, rule) {
    var authorName = post.find('a.Sg.Ob.Tc').text();
    var conditionalAuthor = rule.input;

    if (rule.option3 == 'is') {
        return authorName == conditionalAuthor;
    } else {
        return authorName.indexOf(conditionalAuthor) != -1;
    }
}

function checkContentRule(post, rule) {
    var content = post.find('.eE.Fp').text();
    var pureContent = getPureContent(content);

    if (rule.option3 == 'is') {
        return pureContent == rule.input;
    } else {
        return pureContent.indexOf(rule.input) != -1;
    }
}

function checkAttachmentRule(post, rule) {
    if (rule.attachment == 'image') {
        return post.find('.ev.aG').length > 0;
    } else if (rule.attachment == 'video') {
        return post.find('div[itemType="http://schema.org/VideoObject"]').length > 0;
    } else {
        return post.find('.Ry').length > 0;
    }
}

function checkModeratorRule(post) {
    var hasModTools = post.find('.hE');
    return hasModTools.length > 0;
}

function getPureContent(text) {
    return text.replace(/<[^>]*>/g, "");
}