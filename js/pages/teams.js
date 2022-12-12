$(document).ready(() => {
    const $table = $('#teams').DataTable({
        language: {
            url: '/dataTables.ru.json'
        },
        scrollX: true,
        pageLength: 10,
        lengthChange: false,
        info: false,
        serverSide: true,
        ajax: TEAMS_URL,
        order: [[8, 'desc']],
        search: {
            return: true,
        },
        paging: !MAIN,
        searching: false,
        dataSrc: 'data',
        columns: [
            //Порядковый
            {
                data: null,
                className: "align-middle rounded-start text-end",
                orderable: false,
                render: (data, type, full, meta) => {
                    return `<small class="text-muted">${meta.row + 1}</small>`;
                },
            },
            //Аватар
            {
                data: null,
                className: "align-middle",
                orderable: false,
                render: data => {
                    return `
                        <img class="rounded-circle"
                             style="height: 50px; width: 50px;"
                             src="${data.avatar}"
                             alt="${data.title }}"
                        />`;
                },
            },
            //Платформа
            {
                data: null,
                className: "align-middle",
                orderable: false,
                render: data => {
                    return `
                        <i class="fa-brands fa-${data.platform_id}"
                           style="color: ${TRNMNT_helpers.getPlatformColor(data.platform_id)}"
                        ></i>`;
                },
            },
            //Название
            {
                data: null,
                className: "align-middle title-row",
                orderable: false,
                render: data => {
                    return `
                        <a href="${data.link}" class="fw-bold me-2">${data.title}</a>
                        <a href="${data.link}" class="badge bg-secondary rounded-pill text-decoration-none" style="background: ${data.background} !important; color: ${data.color} !important; border: ${data.color} 1px solid">${data.short_title}</a>`;
                },
            },
            //Турниров
            {data: 'stats.tournaments', className: "align-middle text-end"},
            //Побед
            {data: 'stats.wins', className: "align-middle text-end"},
            //% побед
            {
                data: 'stats.wins_percent',
                className: "align-middle text-end",
                render: data => data + '%',
            },
            //Ассистов
            {data: 'stats.loses', className: "align-middle text-end"},
            //Кубков
            {data: 'stats.cups', className: "align-middle rounded-end text-end"},
        ],
        createdRow(row) {
            $(row).addClass("bg-dark");
        },
        initComplete: (settings, json) => {
            $('div.dataTables_filter input').addClass('form-control-dark');
        }
    });
});
