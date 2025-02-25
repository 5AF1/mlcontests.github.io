
function make_href(url, text) {
    return '<a href="' + url + '" target="_blank">' + text + '</a>';
}

function days_until_deadline(deadline) {
    today = new Date();
    var deadline = new Date(deadline);
    var one_day = 1000 * 60 * 60 * 24;
    return Math.ceil((deadline.getTime() - today.getTime()) / (one_day));
}

function add_missing_fields(item) {
    // add nulls for any fields which aren't present

    item['conference'] = item['conference'] || null;
    item['conference-year'] = item['conference-year'] || null;
    item['launched'] = item['launched'] || null;
    item['test'] = item['test'] || null;

    return item
}

fetch('js/competitions.json')
    .then((response) => response.json())
    .then((res) => {
        data = res.data

        data = data.filter(contest => new Date(contest.deadline) >= (new Date().setHours(0, 0, 0, 0)))

        // add null values when certain fields are missing
        data.forEach(add_missing_fields)

        console.log(data.length)
        $.fn.dataTable.moment('D MMM YYYY')
        x = $('#contests').DataTable({
            "data": data,
            columns: [{
                data: 'name',
                "render": function (data, type, row, meta) {
                    return make_href(row.url, data);
                }
            }, {
                data: 'type'
            }, {
                data: 'deadline'
            }, {
                data: 'prize'
            }, {
                data: 'platform'
            }, {
                data: 'conference'
            }, {
                data: 'sponsor'
            }, {
                data: 'launched'
            }],
            paging: false,
            searching: false,
            info: false,
            responsive: {
                details: {
                    type: 'column',
                    target: 'tr'
                }
            },
            "order": [
                [2, "asc"],
                [3, "desc"]
            ]
        });

        // Create cards
        data.forEach(elt => {
            let card = document.createElement("div");
            card.className = 'card text-center mt-4';

            // card body
            let card_body = document.createElement('div');
            card_body.className = 'card-body';

            let card_title = document.createElement('h4');
            card_title.className = 'card-title';
            card_title.innerHTML = elt.name;

            let card_subtitle = document.createElement('h6');
            card_subtitle.className = 'card-subtitle';
            card_subtitle.innerHTML = elt.prize + ' prize pool';

            let card_text = document.createElement('p');
            card_text.className = 'card-text';
            card_text.innerHTML = elt.sponsor;

            let card_link = document.createElement('a');
            card_link.className = 'btn btn-link';
            card_link.href = elt.url;
            card_link.innerHTML = elt.platform;

            card_body.appendChild(card_title)
            card_body.appendChild(card_subtitle)
            card_body.appendChild(card_text)
            card_body.appendChild(card_link)

            // Card footer
            let footer = document.createElement('div');
            footer.className = 'card-footer text-muted';

            let footer_type = document.createElement('span');
            footer_type.innerHTML = elt.type;

            let footer_deadline_container = document.createElement('p');
            footer_deadline_container.className = 'card-text'
            let footer_deadline = document.createElement('small')
            footer_deadline.className = 'text-muted'
            footer_deadline.innerHTML = '⏱️ ' + days_until_deadline(elt.deadline) + ' days';
            footer_deadline_container.appendChild(footer_deadline)
            footer.appendChild(footer_type)
            footer.appendChild(footer_deadline_container)

            card.appendChild(card_body);
            card.appendChild(footer);
            document.getElementById('contests-cards').appendChild(card);
        });


    })


