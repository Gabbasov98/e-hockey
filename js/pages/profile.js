$(document).ready(() => {
    const uploader = new ImageUploader({
        url: PLAYER_SEND_AVATAR_URL,
        isRounded: true,
        width: 160,
        height: 160,
        selector: '#profileAvatar'
    });

    TRNMNT_sendData({
        selector: '#playerForm',
        method: 'put',
        url: PLAYER_SEND_DATA_URL,
        success: function (response) {
            //Do nothing
        }
    });

    TRNMNT_deleteData({
        selector: '#playerDeleteButton',
        url: PLAYER_DELETE_DATA_URL,
        success: function () {
            window.location.href = PLAYER_SUCCESS_ROUTE;
        }
    });

    TRNMNT_sendData({
        selector: '.tagUpdateForm',
        method: 'post',
        url: TAG_SEND_DATA_URL,
        success(response) {
            window.location.href = TAG_SUCCESS_ROUTE;
        },
    });

    TRNMNT_deleteData({
        selector: '.tagDeleteButton',
        url: TAG_SEND_DATA_URL,
        success: (response, $button) => {
            $button.closest('form').remove();
        },
    });
});
