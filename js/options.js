/**
 * Created with IntelliJ IDEA.
 * User: khloke
 * Date: 13/04/13
 * Time: 2:47 PM
 */

$(document).ready(function() {
    $('#newRuleBtn').click(function() {newRule();});
    $('#saveBtn').click(function() {saveRules();});
    loadRules();
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
    $('.icon-remove').click(function() {
        var parent = $(this).parent('li');
        parent.remove();
    })
}

function updateOptions(option2) {
    option2.siblings("* ~ .option").hide();
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

function newRule(index) {
    var id;
    if (index != undefined) {
        id = 'id="rule-' + index + '" ';
    } else {
        id = '';
    }
    var ruleList = $('#ruleList');
    ruleList.append(
            '<li ' + id + 'class="ruleInputs" style="margin-bottom:10px;">' +
                '<select class="input-medium option option-2">' +
                    '<option value="time">Publish time</option>' +
                    '<option value="author">Author</option>' +
                    '<option value="content">Content</option>' +
                    '<option value="attachment">Attachment</option>' +
                    '<option value="moderator">Is moderator only</option>' +
                '</select>&#32;' +
                '<select class="input-medium option option-3"></select>&#32;' +
                '<select class="input-medium option attachment-select" style="display: none;">' +
                    '<option value="image">an image</option>' +
                    '<option value="video">a video</option>' +
                    '<option value="link">a link</option>' +
                '</select>&#32;' +
                '<input type="text" class="input-medium option text-input" style="display: none; margin-bottom:0;"/>&#32;' +
                '<input type="datetime-local" class="option time-input" style="display: none; margin-bottom:0;"/>&#32;' +
                '<i class="icon-remove" style="cursor: pointer;"/>' +
            '</li>'
    );
    bindEvents();
    $('.option-2').change();
}

function saveRules() {
    var rules = [];

    $('#ruleList').children().each(function() {
        var rule = {
            option2:    $(this).find('.option-2').val(),
            option3:    $(this).find('.option-3').val(),
            attachment: $(this).find('.attachment-select').val(),
            input:      $(this).find('.text-input').val(),
            time:       $(this).find('.time-input').val()
        };

        rules.push(rule);
    });

    var settings = {
        show: $('#showHideSelect').val(),
        all: $('#allAnySelect').val(),
        rules: rules
    };

    localStorage.setItem('settings', JSON.stringify(settings));
}

function loadRules() {
    var storageSettings = localStorage['settings'];

    if (storageSettings) {
        var settings = JSON.parse(storageSettings);
        var rules = settings.rules;

        $('#showHideSelect').val(settings.show);
        $('#allAnySelect').val(settings.all);

        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            newRule(i);
            var ruleElement = $('#rule-' + i);
            ruleElement.find('.option-2').val(rule.option2);
            if (rule.option3) {
                ruleElement.find('.option-3').val(rule.option3);
            }
            if (rule.attachment) {
                ruleElement.find('.attachment-select').val(rule.attachment);
            }
            if (rule.input) {
                ruleElement.find('.text-input').val(rule.input);
            }
            if (rule.time) {
                ruleElement.find('.time-input').val(rule.time);
            }
            ruleElement.find('.option-2').change();
        }
    } else {
        newRule();
        updateOptions($('.option-2'));
    }
}