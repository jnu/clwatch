var INTERVAL = 30000;
var _interval = null;
var currentData = [];


function reload(id) {
    chrome.tabs.reload(id, {}, function() {
        chrome.tabs.executeScript(id, { file: 'js/sentry.js' });
    });
}


function watchPage(tab) {
    if (_interval) {
        _interval = clearInterval(_interval);
    } else {
        _interval = setInterval(reload.bind(null, tab.id), INTERVAL);
        reload(tab.id);
    }
}


function findByTitle(haystack, needle) {
    var title = needle.title;
    for (var i = haystack.length; --i > -1;) {
        if (haystack[i].title === title) {
            break;
        }
    }
    return i;
}

function processData(data) {
    var finder = findByTitle.bind(null, currentData);
    var newData = [];
    data.forEach(function(datum) {
        var oldIdx = finder(datum);
        if (oldIdx === - 1) {
            newData.push(datum);
        }
    });
    currentData = newData.concat(currentData);

    return newData;
}

function notify(newData) {
    newData.forEach(function(datum, i) {
        var n = chrome.notifications.create('', {
            title: 'Craigslist Alert',
            message: datum.title,
            type: 'basic',
            iconUrl: ''
        }, function(id) {});
    });
}


function messageBus(req, sender, answer) {
    switch (req.flag) {
        case 'data':
            var newData = processData(req.data);
            notify(newData);
            break;
        default:
            break;
    }
}




chrome.browserAction.onClicked.addListener(watchPage);

chrome.runtime.onMessage.addListener(messageBus);