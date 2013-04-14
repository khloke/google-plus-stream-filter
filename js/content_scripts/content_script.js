
/**
 * Created with IntelliJ IDEA.
 * User: khloke
 * Date: 26/01/13
 * Time: 1:15 AM
 */

function hidePosts() {
    chrome.runtime.sendMessage({action: 'getRules'}, function(response) {
        if (response.response) {
            var first = true;
            var storageRules = response.response;

            $("[id^=update]").each(function () {
                if (storageRules) {
                    var rules = JSON.parse(storageRules);
                    var matches = true;
                    var ruleMatch = [];

                    for (var i = 0; i < rules.length; i++) {
                        var rule = rules[i];
        //                var show = rule.showPost == 'true';

                        switch (rule.option2) {
                            case 'time':
                                var timeRule = checkTimeRule(rule);
                                matches &= timeRule;
                                ruleMatch.push(timeRule);
//                                var datetime = $(this).find('.ik .Bf').attr('title');
//                                var published = new Date(datetime);
//                                var conditionDatetime = rule.time;
//                                var condition = rule.option3;
//
//                                if (condition == 'is') {
//                                    matches &= published == conditionDatetime;
//                                    ruleMatch.push(published == conditionDatetime);
//                                } else if (condition == 'before') {
//                                    matches &= published < conditionDatetime;
//                                    ruleMatch.push(published < conditionDatetime);
//                                } else {
//                                    matches &= published > conditionDatetime;
//                                    ruleMatch.push(published > conditionDatetime);
//                                }
                                break;

                            case 'author':
                                var authorName = $(this).find('a.Sg.Ob.Tc').text();
                                var conditionalAuthor = rule.input;

                                if (rule.option3 == 'is') {
                                    matches &= authorName == conditionalAuthor;
                                    ruleMatch.push(authorName == conditionalAuthor);
                                } else {
                                    matches &= authorName.indexOf(conditionalAuthor) != -1;
                                    ruleMatch.push(authorName.indexOf(conditionalAuthor) != -1);
                                }

                                break;

                            case 'content':
                                //TODO: Filter by content
                                break;

                            case 'attachment':
                                if (rule.attachment == 'image') {
                                    matches &= $(this).find('.dv.Mm.Zf').length > 0;
                                    ruleMatch.push($(this).find('.dv.Mm.Zf').length > 0);
                                } else if (rule.attachment == 'video') {
                                    matches &= $(this).find('.dv.Mm').length > 0;
                                    ruleMatch.push($(this).find('.dv.Mm').length > 0);
                                } else {
                                    matches &= $(this).find('.Ry').length > 0;
                                    ruleMatch.push($(this).find('.Ry').length > 0);
                                }
                                break;

                            case 'moderator':
                                var hasModTools = $(this).find('.hE');
                                matches &= hasModTools.length > 0;
                                ruleMatch.push(hasModTools.length > 0)
                                break;
                        }
                    }

                    if (matches) {
                        if (!first) {
                            $(this).remove();
                        } else {
                            $(this).hide();
                        }
                        first = false;
                    }
                }


            });
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

function checkTimeRule(rule) {
    var datetime = $(this).find('.ik .Bf').attr('title');
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