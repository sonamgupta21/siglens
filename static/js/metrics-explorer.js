var queryIndex = 0;
var queries = {};

$(document).ready(function() {
    addQueryElement();
});

$('#add-query').on('click', addQueryElement);
$('#add-formula').on('click', function() {
    console.log(queries);
});

function addQueryElement() {
    // Clone the first query element if it exists, otherwise create a new one
    var queryElement;
    if (queryIndex === 0) {
        queryElement = $(`
    <div class="metrics-query">
        <div class="query-box">
            <div class="query-name">${String.fromCharCode(97 + queryIndex)}</div>
            <input type="text" class="metrics" placeholder="Select a metric">
            <div>from</div>
            <div class="tag-container">
                <input type="text" class="everywhere" placeholder="(everywhere)">
            </div>
            <input class="agg-function" value="avg by">
            <div class="value-container">
                <input class="everything" placeholder="(everything)">
            </div>
        </div>
        <div>
            <div class="remove-query">X</div>
        </div>
    </div>`);
    
    } else {
        queryElement = $('#metrics-queries').find('.metrics-query').last().clone();
        queryElement.find('.query-name').text(String.fromCharCode(97 + queryIndex));
    }
    
    $('#metrics-queries').append(queryElement);

    // Show or hide the close icon based on the number of queries
    updateCloseIconVisibility();
    console.log(queries[String.fromCharCode(97 + queryIndex - 1)]);
    // Initialize autocomplete with the details of the previous query if it exists
    initializeAutocomplete(queryElement, queryIndex > 0 ? queries[String.fromCharCode(97 + queryIndex - 1)] : undefined);

    queryIndex++;

    // Add click event handler for the remove button
    queryElement.find('.remove-query').on('click', function() {
        var queryName = queryElement.find('.query-name').text();
        delete queries[queryName];
        queryElement.remove();

        // Show or hide the close icon based on the number of queries
        updateCloseIconVisibility();
    });
}

function initializeAutocomplete(queryElement, previousQuery = {}) {
    var queryDetails = {
        metrics: '',
        everywhere: [],
        everything: [],
        aggFunction: 'avg by'
    };
    // Use details from the previous query if it exists
    if (!jQuery.isEmptyObject(previousQuery)) {
        queryDetails.metrics = previousQuery.metrics;
        queryDetails.everywhere = previousQuery.everywhere.slice();
        queryDetails.everything = previousQuery.everything.slice();
        queryDetails.aggFunction = previousQuery.aggFunction;
    }
    console.log(queryDetails);

    var availableMetrics = [
        "system.cpu.interrupt",
        "system.disk.used",
        "system.cpu.stolen",
        "system.cpu.num_cores",
        "system.cpu.stolen",
        "system.cpu.idle",
        "system.cpu.guest",
        "system.cpu.system",
    ];

    var availableEverywhere = [
        "disk space",
        "memory space",
        "cpu",
    ];

    var availableEverything = [
        "device",
        "device_name",
        "host",
    ];

    var availableOptions = ["max by", "min by", "avg by", "sum by"];

    queryElement.find('.metrics').autocomplete({
        source: availableMetrics,
        minLength: 0,
        select: function(event, ui) {
            console.log('Selected:', ui.item.value);
            queryDetails.metrics = ui.item.value;
        }
    }).on('click', function() {
        if ($(this).autocomplete('widget').is(':visible')) {
            $(this).autocomplete('close');
        } else {
            $(this).autocomplete('search', '');
        }
    }).on('click', function() {
        $(this).select();
    });

    queryElement.find('.everywhere').autocomplete({
        source: function(request, response) {
            var filtered = $.grep(availableEverywhere, function(item) {
                return item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1;
            });
            response(filtered);
        },
        minLength: 0,
        select: function(event, ui) {
            addTag(ui.item.value);
            queryDetails.everywhere.push(ui.item.value);
            var index = availableEverywhere.indexOf(ui.item.value);
            if (index !== -1) {
                availableEverywhere.splice(index, 1);
            }
            $(this).val('');
            return false;
        }
    }).on('click', function() {
        if ($(this).autocomplete('widget').is(':visible')) {
            $(this).autocomplete('close');
        } else {
            $(this).autocomplete('search', '');
        }
    });

    function addTag(value) {
        var tagContainer = queryElement.find('.everywhere');
        var tag = $('<span class="tag">' + value + '<span class="close">×</span></span>');
        tagContainer.before(tag);

        if (queryElement.find('.tag-container').find('.tag').length === 0) {
            tagContainer.attr('placeholder', '(everywhere)');
            tagContainer.css('width', '100%');
        } else {
            tagContainer.removeAttr('placeholder');
            tagContainer.css('width', '5px');
        }
    }
    // Close tag event handler
    queryElement.on('click', '.tag .close', function() {
        var tagContainer = queryElement.find('.everywhere');

        var tagValue = $(this).parent().contents().filter(function() {
            return this.nodeType === 3;
        }).text().trim();
        var index = queryDetails.everywhere.indexOf(tagValue);
        if (index !== -1) {
            queryDetails.everywhere.splice(index, 1);
        }
        availableEverywhere.push(tagValue);
        queryElement.find('.everywhere').autocomplete('option', 'source', availableEverywhere);

        $(this).parent().remove();

        if (queryElement.find('.tag-container').find('.tag').length === 0) {
            tagContainer.attr('placeholder', '(everywhere)');
            tagContainer.css('width', '100%');
        }
    });

    queryElement.find('.agg-function').autocomplete({
        source: availableOptions.sort(),
        minLength: 0,
        select: function(event, ui) {
            console.log('Selected:', ui.item.value);
            queryDetails.aggFunction = ui.item.value;
        }
    }).on('click', function() {
        if ($(this).autocomplete('widget').is(':visible')) {
            $(this).autocomplete('close');
        } else {
            $(this).autocomplete('search', '');
        }
    }).on('click', function() {
        $(this).select();
    });

    queryElement.find('.everything').autocomplete({
        source: function(request, response) {
            var filtered = $.grep(availableEverything, function(item) {
                return item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1;
            });
            response(filtered);
        },
        minLength: 0,
        select: function(event, ui) {
            addValue(ui.item.value);
            queryDetails.everything.push(ui.item.value);
            var index = availableEverything.indexOf(ui.item.value);
            if (index !== -1) {
                availableEverything.splice(index, 1);
            }
            $(this).val('');
            return false;
        }
    }).on('click', function() {
        if ($(this).autocomplete('widget').is(':visible')) {
            $(this).autocomplete('close');
        } else {
            $(this).autocomplete('search', '');
        }
    });

    function addValue(value) {
        var valueContainer = queryElement.find('.everything');
        var value = $('<span class="value">' + value + '<span class="close">×</span></span>');
        valueContainer.before(value);

        if (queryElement.find('.value-container').find('.value').length === 0) {
            valueContainer.attr('placeholder', '(everything)');
            valueContainer.css('width', '100%');
        } else {
            valueContainer.removeAttr('placeholder');
            valueContainer.css('width', '5px');
        }
    }

    // Close value event handler
    queryElement.on('click', '.value .close', function() {
        var valueContainer = queryElement.find('.everything');

        var value = $(this).parent().contents().filter(function() {
            return this.nodeType === 3;
        }).text().trim();
        var index = queryDetails.everything.indexOf(value);
        if (index !== -1) {
            queryDetails.everything.splice(index, 1);
        }
        availableEverything.push(value);

        queryElement.find('.everything').autocomplete('option', 'source', availableEverything);

        $(this).parent().remove();

        if (queryElement.find('.value-container').find('.value').length === 0) {
            valueContainer.attr('placeholder', '(everything)');
            valueContainer.css('width', '100%');
        }
    });

    queries[queryElement.find('.query-name').text()] = queryDetails;
    previousQuery = queryDetails;
}

function updateCloseIconVisibility() {
    var numQueries = $('#metrics-queries').children('.metrics-query').length;
    $('.remove-query').toggle(numQueries > 1);
}