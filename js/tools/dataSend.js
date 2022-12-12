import TRNMNT_helpers from './helpers';

function castValue(type, value) {
    switch (type) {
        case 'int':
            return +value;
        case 'str':
            return '' + value;
        default:
            return value;
    }
}

export default function (params) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(params.selector).submit(function (e) {
        e.preventDefault();
        TRNMNT_helpers.disableButtons();

        const $form = $(this);
        const $groups = $(this).data('groups');
        const formData = $form.serializeArray();
        const request = {};
        const groupCast = {};

        if (typeof $groups === 'object' && $groups !== null) {
            for (let group in $groups) {
                request[group] = [];
                groupCast[group] = $groups[group];
            }
        }

        for (let i = 0; i < formData.length; i += 1) {
            const nameParts = formData[i].name.split('_');

            if (formData[i].value) {
                switch (formData[i].value) {
                    case 'on':
                        if (!request.hasOwnProperty(nameParts[0])) {
                            request[formData[i].name] = true;
                        } else {
                            const value = castValue(
                                groupCast[nameParts[0]],
                                nameParts[nameParts.length - 1]
                            )
                            request[nameParts[0]].push(value);
                        }
                        break;
                    case 'off':
                        if (!request.hasOwnProperty(nameParts[0])) {
                            request[formData[i].name] = false;
                        }
                        break;
                    default:
                        request[formData[i].name] = formData[i].value;
                }
            }
            const field = $form.find('[name=' + formData[i].name + ']');
            field.removeClass('is-invalid');
            field.closest('.form-group').find('.invalid-feedback').empty();
        }

        const url = $form.data('id') ? params.url + '/' + $form.data('id') : params.url;
        const method = $form.data('id') ? 'put' : 'post';

        $.ajax({
            type: method,
            url: url,
            data: JSON.stringify(request),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                TRNMNT_helpers.enableButtons();
                params.success && params.success(response);
            },
            error: function (response) {
                TRNMNT_helpers.onErrorAjax(response);
                for (let key in response.responseJSON.errors) {
                    const errors = response.responseJSON.errors[key];
                    const field = $form.find('[name=' + key + ']');
                    field.addClass('is-invalid');
                    let message = '';
                    for (let i = 0; i < errors.length; i += 1) {
                        message += errors[i] + '<br>';
                    }
                    field.closest('.form-group').find('.invalid-feedback').html(message);
                }
            }
        });
    });
};
