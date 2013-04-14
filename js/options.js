/**
 * Created with IntelliJ IDEA.
 * User: khloke
 * Date: 13/04/13
 * Time: 2:47 PM
 */

$(document).ready(function() {
    $('#newRuleBtn').click(function() {newRule();});
    $('#saveBtn').click(function() {saveRules();});
    newRule();
    updateOptions($('.option-2'));
});

var choices = {
    time: {
        option3: ["is","before", "after"],
        showElements: [".option-1", ".option-2", ".option-3", ".time-input"]
    },
    author: {
        option3: ["is", "contains"],
        showElements: [".option-1", ".option-2", ".option-3", ".text-input"]
    },
    content: {
        option3: ["is", "contains"],
        showElements: [".option-1", ".option-2", ".option-3", ".text-input"]
    },
    attachment: {
        option3: ["is", "not"],
        showElements: [".option-1", ".option-2", ".option-3", ".attachment-select"]
    },
    moderator: {
        option3: []
    }
};

function bindEvents() {
    var option2 = $('.option-2');
    option2.change(function() {
        updateOptions($(this));
    });
}

function updateOptions(option2) {
    option2.siblings(".option-1 ~ .option").hide();
    var selected = option2.val();
    var availChoices = choices[selected].option3;
    var showElements = choices[selected].showElements;
    var option3 = option2.next();

    if (availChoices && availChoices.length > 0) {
        option3.show();
        option3.html('');

        for (var i = 0; i < availChoices.length; i++) {
            var choice = availChoices[i];
            option3.append('<option value="' + choice + '">' + choice + '</option>');
        }

        for (var j = 0; j < showElements.length; j++) {
            var elementClass = showElements[j];
            option2.siblings(elementClass).show();
        }
    } else {
        option3.hide();
    }
}

function newRule() {
    var ruleList = $('#ruleList');
    ruleList.append(
            '<div class="ruleInputs">' +
                '<select class="input-medium option option-1">' +
                    '<option value="false">Do not show</option>' +
                    '<option value="true">Show</option>' +
                '</select>' +
                '<span style="margin-botton:10px;">&#32;if post&#32;</span>' +
                '<select class="input-medium option option-2">' +
                    '<option value="time">time</option>' +
                    '<option value="author">author</option>' +
                    '<option value="content">content</option>' +
                    '<option value="attachment">attachment</option>' +
                    '<option value="moderator">is moderator only</option>' +
                '</select>&#32;' +
                '<select class="input-medium option option-3"></select>&#32;' +
                '<select class="input-medium option attachment-select" style="display: none;">' +
                    '<option value="image">an image</option>' +
                    '<option value="video">a video</option>' +
                    '<option value="link">a link</option>' +
                '</select>&#32;' +
                '<input type="text" class="input-medium option text-input" style="display: none"/>&#32;' +
                '<input type="datetime-local" class="option time-input" style="display: none"/>&#32;' +
            '</div>'
    );
    bindEvents();
    $('.option-2').change();
}

function saveRules() {
    var rules = [];

    $('#ruleList').children().each(function() {
        var rule = {
            showPost:   $(this).find('.option-1').val(),
            option2:    $(this).find('.option-2').val(),
            option3:    $(this).find('.option-3').val(),
            attachment: $(this).find('.attachment-select').val(),
            input:      $(this).find('.text-input').val(),
            time:       $(this).find('.time-input').val()
        };

        rules.push(rule);
    });

    localStorage.setItem('rules', JSON.stringify(rules));
}