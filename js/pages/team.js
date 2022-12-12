$(document).ready(() => {
    if (TEAM_QUIT_URL) {
        TRNMNT_deleteData({
            selector: '#teamQuitButton',
            url: TEAM_QUIT_URL,
            success: function () {
                window.location.href = TEAM_SUCCESS_ROUTE;
            }
        });
    }

    if (TEAM_APPLICATION_URL) {
        $('#applicationSelector a').on('click', event => {
            event.preventDefault();
            const position_id = +$(event.target).data('position');

            TRNMNT_helpers.disableButtons();
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'post',
                url: TEAM_APPLICATION_URL,
                data: JSON.stringify({position_id: position_id}),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                processData: false,
                success: () => {
                    TRNMNT_helpers.enableButtons();
                    window.location.href = TEAM_SUCCESS_ROUTE;
                },
                error: TRNMNT_helpers.onErrorAjax,
                context: TRNMNT_helpers
            });
        });

        TRNMNT_deleteData({
            selector: '#applicationReject',
            url: TEAM_APPLICATION_URL,
            success: function () {
                window.location.href = TEAM_SUCCESS_ROUTE;
            }
        });
    }
});
