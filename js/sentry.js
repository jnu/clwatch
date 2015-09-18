(function() {

    var main = document.getElementsByClassName('content')[0];

    var rows = main.getElementsByClassName('row');
    var data = Array.prototype.map.call(rows, function(row) {
        var pid = row.attributes['data-pid'].value;

        var pl = row.getElementsByClassName('pl')[0];
        var date = pl && pl.getElementsByClassName('date')[0];
        var title = pl && pl.getElementsByTagName('a')[0];

        var l2 = row.getElementsByClassName('l2')[0];
        var price = l2 && l2.getElementsByClassName('price')[0];
        var hood = l2 && l2.getElementsByTagName('small')[0];

        return {
            title: title && title.innerText,
            date: date && date.innerText,
            price: price && price.innerText,
            hood: hood && hood.innerText,
            body: title && title.innerText
        };
    });

    chrome.runtime.sendMessage({
        flag: 'data',
        data: data
    });

}());