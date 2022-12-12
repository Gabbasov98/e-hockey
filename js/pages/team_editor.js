$(document).ready(() => {
    if (TEAM_SEND_AVATAR_URL) {
        const uploader = new ImageUploader({
            url: TEAM_SEND_AVATAR_URL,
            height: 400,
            width: 400,
            selector: '#teamAvatar',
        });
    }

    if (TEAM_SEND_BANNER_URL) {
        const uploader = new ImageUploader({
            url: TEAM_SEND_BANNER_URL,
            height: 250,
            width: 1000,
            selector: '#teamBanner',
        });
    }

    if (TEAM_SEND_DATA_URL) {
        TRNMNT_sendData({
            selector: '#teamForm',
            method: 'post',
            url: TEAM_SEND_DATA_URL,
            success: function (response) {
                if (!TEAM_DELETE_DATA_URL) {
                    window.location.href = TEAM_SUCCESS_ROUTE + '/' + response.data.id + '/update';
                }
            }
        });

        TRNMNT_sendData({
            selector: '.appTeamForm',
            method: 'post',
            url: TEAM_ID_SEND_DATA_URL,
        });

        TRNMNT_deleteData({
            selector: '.deleteTeamPlayer',
            url: TEAM_DELETE_DATA_URL,
            success: function (response, $button) {
                $button.closest('.card').parent('div').remove();
            }
        });

        TRNMNT_deleteData({
            selector: '.rejectApplication',
            url: TEAM_DELETE_DATA_URL,
            urlPostfix: 'application',
            success: function (response, $button) {
                $button.closest('.card').parent('div').remove();

                const $applicationsList = $('#applicationsList');
                if (!$applicationsList.find('.card').length) {
                    $applicationsList.remove();
                }
            }
        });

        $('.acceptApplication').on('click', event => {
            event.preventDefault();
            const user_id = $(event.target).data('id');

            TRNMNT_helpers.disableButtons();
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'post',
                url: TEAM_DELETE_DATA_URL,
                data: JSON.stringify({user_id: user_id}),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                processData: false,
                success: response => {
                    TRNMNT_helpers.enableButtons();
                    window.location.href = TEAM_SUCCESS_ROUTE + '/' + response.data.id + '/update';
                },
                error: TRNMNT_helpers.onErrorAjax,
                context: TRNMNT_helpers
            });
        });

        $('.updateTeamPlayer a').on('click', event => {
            event.preventDefault();
            const user_id = $(event.target).data('id');
            const is_captain = $(event.target).data('role');

            TRNMNT_helpers.disableButtons();
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'put',
                url: TEAM_DELETE_DATA_URL + '/' + user_id,
                data: JSON.stringify({is_captain: is_captain}),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                processData: false,
                success: response => {
                    TRNMNT_helpers.enableButtons();
                    window.location.href = TEAM_SUCCESS_ROUTE + '/' + response.data.id + '/update';
                },
                error: TRNMNT_helpers.onErrorAjax,
                context: TRNMNT_helpers
            });
        });

        TRNMNT_sendData({
            selector: '.teamSocialForm',
            method: 'post',
            url: TEAM_DELETE_DATA_URL + '/social',
            success: response => {
                TRNMNT_helpers.enableButtons();
                window.location.href = TEAM_SUCCESS_ROUTE + '/' + response.data.id + '/update';
            },
        });

        TRNMNT_deleteData({
            selector: '.teamSocialDelete',
            url: TEAM_DELETE_DATA_URL + '/social',
            success: function (response, $button) {
                $button.closest('form').remove();
            }
        });
    }

    // if (TEAM_PLAYER_ROLE_SEND_DATA_URL) {
    //     $('#teamPlayers input[type=radio]').on('change', function (event) {
    //         event.preventDefault();
    //         const $input = $(this);
    //         const isCaptain = +$input.data('captain');
    //         const playerId = +$input.closest('div').data('id');
    //
    //         if (isCaptain === 1) {
    //             $input.closest('#teamPlayers')
    //                 .find('input[data-captain=1]')
    //                 .each(function (index, element) {
    //                     const $captainButton = $(element);
    //
    //                     if ($captainButton.get(0) === $input.get(0)) {
    //                         console.log(`Same button`);
    //                         return;
    //                     }
    //
    //                     if (!$captainButton.prop('checked')) {
    //                         console.log(`No need to uncheck`);
    //                         return;
    //                     }
    //
    //                     console.log(`Not same button`);
    //                     $captainButton.siblings('input[data-captain=0]').prop('checked', true);
    //                 });
    //         }
    //
    //         // createCaptainBadge($button, isCaptain);
    //         TRNMNT_helpers.disableButtons();
    //         $.ajax({
    //             headers: {
    //                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //             },
    //             type: 'put',
    //             url: TEAM_PLAYER_ROLE_SEND_DATA_URL + '/' + playerId,
    //             data: 'is_captain=' + isCaptain,
    //             processData: false,
    //             success: TRNMNT_helpers.enableButtons,
    //             error: TRNMNT_helpers.onErrorAjax,
    //             context: TRNMNT_helpers
    //         });
    //     });
    // }

    // const $teamHeader = $('#teamHeader');
    // if ($teamHeader.length) {
    //     const backgroundColor = $teamHeader.data('color');
    //     const contrastColor = TRNMNT_helpers.getContrast(backgroundColor);
    //     $teamHeader.css('color', contrastColor);
    //
    //     $teamHeader.find('a').addClass(contrastColor === 'white' ? 'link-light' : 'link-dark');
    // }

});



