$(document).ready(() => {
    let positionFilter = 'all';
    let gamesTypeFilter = 'all';

    const $table = $('#players').DataTable({
        language: {
            url: '/dataTables.ru.json'
        },
        scrollX: true,
        pageLength: 10,
        lengthChange: false,
        info: false,
        serverSide: true,
        ajax: {
            url: PLAYERS_URL,
            data: function (d) {
                if (positionFilter !== 'all') {
                    d.position = positionFilter;
                }
                if (TEAM_ID) {
                    d.team_id = TEAM_ID;
                }
                if (gamesTypeFilter !== 'all') {
                    d.games_type = gamesTypeFilter;
                }
            },
        },
        order: [[6, 'desc']],
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
            //Номер игрока
            {data: 'number', orderable: false, className: "align-middle text-end"},
            //Аватар
            {
                data: null,
                className: "align-middle",
                orderable: false,
                render: data => {
                    const country = data.country_id ?
                        ` <span class="fi fi-${data.country_id} fis rounded-circle position-absolute bottom-0 start-0"></span>`
                        : '';

                    return `
                        <div class="position-relative">
                            <a href="${data.link}"><img src="${data.avatar}"
                                class="rounded-circle border-gradient"
                                style="height: 66px; width: 66px;"
                                alt="${data.name}"
                            /></a>
                            ${country}
                        </div>`;
                },
            },
            //Платформа
            {
                data: null,
                className: "align-middle",
                orderable: false,
                render: data => {
                    return `<i class="fa-brands fa-${data.tag.platform_id}"
                               style="color: ${TRNMNT_helpers.getPlatformColor(data.tag.platform_id)}"
                            ></i>`;
                },
            },
            //Имя
            {
                data: null,
                className: "align-middle title-row",
                orderable: false,
                render: data => {
                    const team = typeof data.team === 'string'
                        ? `<span style="color: #ADB5BDFF;">${data.team}</span>`
                        : `
                            <a href="${data.team.link}" class="me-2 text-decoration-none">${data.team.title}
                            <span class="badge bg-secondary rounded-pill" style="background: ${data.team.background} !important; color: ${data.team.color} !important; border: ${data.team.color} 1px solid">${data.team.short_title}</span></a>`;

                    return `
                        <div>
                            <a href="${data.link}" class="fw-bold text-decoration-none">${data.tag.tag}</a>
                        </div>
                        <div class="small text-muted">${data.name}</div>
                        <div class="small">${team}</div>`;
                },
            },
            //Позиция
            {
                data: null,
                className: "align-middle text-end",
                orderable: false,
                render: data => {
                    let positions = '';
                    for (let position of data.positions) {
                        positions += `
                            <img src="/images/positions/${position.short_title}.svg"
                                alt="${position.title}"
                                style="height: 1.4rem;"
                                class="me-2"
                            >`;
                    }

                    return positions;
                },
            },
            //Очков
            {data: 'stats.points', className: "align-middle text-end"},
            //Голов
            {data: 'stats.goals', className: "align-middle text-end"},
            //Ассистов
            {data: 'stats.assists', className: "align-middle text-end"},
            //% бросков
            {
                data: 'stats.shots_percent',
                className: "align-middle text-end",
                render: data => data + '%',
            },
            //Побед
            {data: 'stats.wins', visible: false, className: "align-middle text-end"},
            //% спасений
            {
                data: 'stats.saves_percent',
                visible: false,
                className: "align-middle text-end",
                render: data => data + '%',
            },
            //Пр. голов за игру
            {data: 'stats.goal_against_per_game', visible: false, className: "align-middle text-end"},
            //На ноль
            {data: 'stats.shootouts', visible: false, className: "align-middle text-end"},
            //Турниров
            {data: 'stats.tournaments', className: "align-middle text-end"},
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

    $('#playerPositionFilter li').on('click', event => {
        event.preventDefault();
        positionFilter = $(event.target).data('position');
        const isGoalie = positionFilter === 'goalie';

        $table.column(6).visible(!isGoalie);
        $table.column(7).visible(!isGoalie);
        $table.column(8).visible(!isGoalie);
        $table.column(9).visible(!isGoalie);
        $table.column(10).visible(isGoalie);
        $table.column(11).visible(isGoalie);
        $table.column(12).visible(isGoalie);
        $table.column(13).visible(isGoalie);
        $table.order([[isGoalie ? 10 : 6, 'desc']]).draw();
    });

    $('#gameTypeFilter').on('change', event => {
        event.preventDefault();
        gamesTypeFilter = $(event.target).val();

        $table.draw();
    });
});
