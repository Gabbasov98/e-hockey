const TRNMNT_helpers = {
    showPreLoader: function () {
        $('<div id="bigPreloader"></div>').appendTo('body')
            .html(`
                <span style="vertical-align:middle; display: table-cell;">
                    <i class="fas fa-cog fa-spin fa-7x"></i>
                </span>`)
            .css({
                position: 'fixed',
                width: '100%',
                height: '100%',
                background: 'rgba(255,255,255,0.9)',
                top: 0,
                left: 0,
                'z-index': 100000,
                'text-align': 'center',
                'display': 'table'
            });
    },
    hidePreLoader: function () {
        $('#bigPreloader').remove();
    },
    disableButtons: function (noPreloader) {
        $('input[type=submit], input[type=button], button').prop('disabled', true);
        this.hidePreLoader();
        if (!noPreloader) {
            this.showPreLoader();
        }
    },
    enableButtons: function () {
        $('input[type=submit], input[type=button], button').prop('disabled', false);
        this.hidePreLoader();
    },
    showNotification: function (message, params) {
        const settings = {
            blockClass: 'alert',
            duration: 10000, //Время отображения сообщения
            animationDuration: 500, //Длительность анимации
            alertType: 'success', //Цвет сообщения
            types: {//Варианты цветов сообщений
                success: 'alert-success',
                info: 'alert-info',
                warning: 'alert-warning',
                error: 'alert-danger'
            },
            position: 'se', //Позиционирование элемента
            margin: 30//Отступ
        };
        const css = {
            nw: {top: settings.margin + 'px', left: settings.margin + 'px'},
            ne: {top: settings.margin + 'px', right: settings.margin + 'px'},
            sw: {bottom: settings.margin + 'px', left: settings.margin + 'px'},
            se: {bottom: settings.margin + 'px', right: settings.margin + 'px'}
        };
        params = params || {};
        $.extend(true, settings, params);
        var direction = ['sw', 'se'].indexOf(settings.position) !== -1 ? 'bottom' : 'top';

        var $note = $('<div class="notification ' + settings.blockClass + ' ' + settings.types[settings.alertType] + '"></div>')
            .click(function (event) {
                event.preventDefault();
                removeNote($(this));
            })
            .css($.extend(true, css[settings.position], {position: 'fixed', display: 'none', 'z-index': 1050}))
            .appendTo('body')
            .html(message)
            .animate({opacity: 'show'}, settings.animationDuration)
            .delay(settings.duration)
            .animate({opacity: 'hide'}, settings.animationDuration)
            .delay(settings.animationDuration)
            .queue(function () {
                $(this).remove();
            });

        $('.' + settings.blockClass).not($note).each(function (index, element) {
            var block = $(element);
            var height = $note.height() + parseInt($note.css('padding')) * 2 + 10;
            block.css(direction, parseInt(block.css(direction)) + height + 'px');
        });

        function removeNote($noteToRemove) {
            var $notes = $('.' + settings.blockClass);
            var height = $noteToRemove.height() + parseInt($noteToRemove.css('padding')) * 2 + 10;
            var noteToRemoveIndex = $notes.index($noteToRemove);

            $noteToRemove.hide();
            $notes.each(function (index, element) {
                var block = $(element);
                if (index < noteToRemoveIndex) {
                    block.css(direction, parseInt(block.css(direction)) - height + 'px');
                }
            });
            $noteToRemove.remove();
        }
    },
    hideNotifications: function () {
        $('.notification').remove();
    },
    getParameterByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    jsonStringify: function (s, emit_unicode) {
        var json = JSON.stringify(s);
        var result;
        if (emit_unicode) {
            result = json;
        } else {
            result = json.replace(/(\\\\)/g, '/')
                .replace(/(\\n)/g, ' ')
                .replace(/(\s+\\")/g, ' «')
                .replace(/("\\")/g, '"«')
                .replace(/(\\")/g, '»');
        }
        return result;
    },
    parseUrl: function (url = window.location.href) {
        var a = document.createElement('a'),
            params = null,
            segments = [],
            tmp;
        a.href = url;
        tmp = a.search.replace('?', '');
        if (tmp.length) {
            params = {};
            tmp = decodeURI(tmp);
            tmp = tmp.split('&');
            tmp.forEach(function (p) {
                var t = p.split('=');
                params[t[0]] = t[1];
            });
        }
        tmp = a.pathname.split('/');
        for (var i = 0; i < tmp.length; i++) {
            if (tmp[i] !== '') {
                segments.push(tmp[i]);
            }
        }

        return {
            url: a.href,
            protocol: a.protocol.replace(':', ''),
            host: a.host,
            port: a.port,
            path: a.pathname,
            search: a.search,
            params: params,
            segments: segments
        };
    },
    onErrorAjax: function (e) {
        var response;
        if (e.responseText !== undefined) {
            response = JSON.parse(e.responseText);
            let message = response.message;
            if (response.errors) {
                for (let error in response.errors) {
                    for (let serverMessage of response.errors[error]) message += `<br>${error}: ${serverMessage}`;
                }
            }
            this.showNotification(message, {alertType: 'error'});
        } else {
            this.showNotification('Server error.', {alertType: 'error'});
        }
        this.enableButtons();
        this.hidePreLoader();
    },
    updateCount: function (selector, selectorEmpty) {
        const countNode = $(selector);
        const count = parseInt(countNode.text()) - 1;
        const parentNode = countNode.parent();
        countNode.text(count);
        if (count === 0) {
            parentNode.text(parentNode.text().replace(/\s+\(.*/, ''));
            selectorEmpty && $(selectorEmpty).show();
        }
    },
    validateEmail: function (email) {
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return pattern.test(email);
    },
    validateUrl: function (url) {
        var pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/;

        return pattern.test(url);
    },
    getDatePickerSettings: function () {
        return {
            format: "yyyy-mm-dd",
            weekStart: 1,
            todayHighlight: true,
            autoclose: true,
            language: "ru"
        };
    },
    convertTimeStringToSeconds: function (time) {
        const tmp = time.split(':');
        let seconds = 0;
        for (let i = 0; i < tmp.length; i += 1) {
            const multiplier = (60 * -(i + 1 - tmp.length));
            seconds += tmp[i] * (multiplier ? multiplier : 1);
        }
        return seconds;
    },
    convertSecondsToTimeString: function (seconds) {
        const date = new Date(seconds * 1000);
        return (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
            + ':'
            + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    },
    /**!
     * Get the contrasting color for any hex color
     * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
     * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
     * @param  {String} hex_color A hex color value
     * @return {String} The contrasting color (black or white)
     */
    getContrast(hex_color) {
        // If a leading # is provided, remove it
        if (hex_color.slice(0, 1) === '#') {
            hex_color = hex_color.slice(1);
        }

        // If a three-character hexcode, make six-character
        if (hex_color.length === 3) {
            hex_color = hex_color.split('').map(function (hex) {
                return hex + hex;
            }).join('');
        }

        // Convert to RGB value
        const r = parseInt(hex_color.substr(0, 2), 16);
        const g = parseInt(hex_color.substr(2, 2), 16);
        const b = parseInt(hex_color.substr(4, 2), 16);

        // Get YIQ ratio
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        // Check contrast
        return (yiq >= 128) ? 'black' : 'white';
    },
    getPlatformColor(platform_id) {
        return platform_id === 'xbox' ? '#0e7810' : '#003e93'
    },
    createCommentBlock(id, comment) {
        const $template = $('#templates').find('.template-comment').clone();
        const $avatar = $('#mainUserAvatar');
        const date = new Date();
        const time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        $template.find('.comment-avatar').attr('src', $avatar.attr('src'));
        $template.find('.comment-comment').text(comment);
        $template.find('.comment-like').data('id', id + '/like');
        $template.find('.comment-author').html(`<a href="/profile">${$avatar.attr('alt')}</a>, ${time}`);

        $template.prependTo('#comments');
    },
    comment(selector, url) {
        TRNMNT_sendData({
            selector: selector,
            method: 'post',
            url: url,
            success: response => {
                const $commentInput = $('#comment');
                this.createCommentBlock(response.data.id, $commentInput.val());
                $commentInput.val('');

                const $commentCount = $('#commentCount');
                $commentCount.text(+$commentCount.text() + 1);
            },
        });
    },
    like(selector, url) {
        $(document).on('click', selector, event => {
            event.preventDefault();
            const id = $(event.target).closest('div').data('id');

            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'post',
                url: url + (id ? '/' + id : ''),
                contentType: "application/json; charset=utf-8",
                processData: false,
                success: response => {
                    const $button = $(event.target);
                    const $likeCount = $button.closest('div').find('.like-count');
                    if ($button.hasClass('like-liked')) {
                        $likeCount.text(+$likeCount.text() - 1);
                    } else {
                        $likeCount.text(+$likeCount.text() + 1);
                    }
                    $button.toggleClass('like-liked');
                },
                error: this.onErrorAjax,
                context: this
            });
        });
    }
};

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

function dataSend(params) {
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

function dataDelete(params) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(document).on('click', params.selector, function (e) {
        e.preventDefault();
        const $button = $(this);
        const id = $button.data('id');
        const url = (id ? params.url + '/' + id : params.url) + (params.urlPostfix ? '/' + params.urlPostfix : '');

        if (confirm('Точно удалить?')) {
            $.ajax({
                type: 'delete',
                url: url,
                dataType: 'json',
                success: function (response) {
                    TRNMNT_helpers.enableButtons();
                    params.success(response, $button);
                },
                error: TRNMNT_helpers.onErrorAjax
            });
        }
    });
};


window.TRNMNT_sendData = dataSend.default;
window.TRNMNT_deleteData = dataDelete.default;
window.TRNMNT_helpers = TRNMNT_helpers;

// import.meta.glob([
//     '../images/**',
// ]);

class ImageUploader {
    constructor(params) {
        console.log(`[IMAGE UPLOADER] Created: ${params.selector}`);

        this.$block = $(params.selector);
        this.url = params.url;
        this.width = params.width ? params.width : 160;
        this.height = params.height ? params.height : 160;

        this.cropper = null;
        this.initialAvatarURL = null;
        this.file = null;
        this.modalElement = this.$block.find('.imageUploaderModal').get(0);
        this.modal = new bootstrap.Modal(
            this.modalElement,
            {
                backdrop: true,
            }
        );
        this.$thumbnail = this.$block.find('.imageUploaderThumbnail');
        this.$cropButton = this.$block.find('.imageUploaderCrop');
        this.$input = this.$block.find('.imageUploaderInput');
        this.$image = this.$block.find('.imageUploaderCropImage');
        this.$progressBar = this.$block.find('.imageUploaderProgressBar');
        this.$alert = this.$block.find('.imageUploaderAlert');

        this.setEvents();
    }

    setEvents() {
        this.$input.on('change', this.onChangeImage.bind(this));
        this.modalElement.addEventListener('shown.bs.modal', this.onShowModal.bind(this));
        this.modalElement.addEventListener('hidden.bs.modal', this.onHideModal.bind(this));
        this.$cropButton.on('click', this.onClickCropButton.bind(this));
    }

    onChangeImage(event) {
        console.log(`[IMAGE UPLOADER] Get file`);
        const files = event.target.files;

        if (files && files.length > 0) {
            this.file = files[0];

            if (URL) {
                console.log(`[IMAGE UPLOADER] Load file through URL object`);
                this.runCropper(URL.createObjectURL(this.file));
            } else if (FileReader) {
                const reader = new FileReader();
                reader.onload = () => {
                    console.log(`[IMAGE UPLOADER] Load file through reader`);
                    this.runCropper(reader.result);
                };
                reader.readAsDataURL(this.file);
            }
        }
    }

    runCropper(url) {
        console.log(`[IMAGE UPLOADER] File chosen`);
        this.$input.value = '';
        this.$image.attr('src', url);
        this.modal.show();
    }

    onShowModal() {
        console.log(`[IMAGE UPLOADER] Show modal`);
        this.cropper = new Cropper(this.$image.get(0), {
            aspectRatio: this.width / this.height,
            viewMode: 3,
        });
    }

    onHideModal() {
        console.log(`[IMAGE UPLOADER] Hide modal`);
        // this.cropper.destroy();
        // this.cropper = null;
    }

    onClickCropButton() {
        this.modal.hide();

        if (!this.cropper) {
            return;
        }

        const canvas = this.cropper.getCroppedCanvas({
            width: this.width,
            height: this.height,
        });

        this.initialAvatarURL = this.$thumbnail.attr('src');
        this.$thumbnail.attr('src', canvas.toDataURL());
        this.$progressBar.length && this.$progressBar.show();
        this.$alert.length && this.$alert.removeClass('alert-success alert-warning');
        canvas.toBlob(this.toBlob.bind(this));
    }

    toBlob(blob) {
        const formData = new FormData();

        formData.append('image', blob, this.file.name);

        this.$progressBar.removeClass('visually-hidden');

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax(this.url, {
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,

            xhr: () => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = progressEvent => {
                    let percent = '0';
                    let percentage = '0%';

                    if (!progressEvent.lengthComputable) {
                        return;
                    }
                    percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    percentage = percent + '%';

                    this.$progressBar.length && this.$progressBar.width(percentage)
                        .attr('aria-valuenow', percent)
                        .text(percentage);
                };

                return xhr;
            },

            success: () => {
                this.$alert.length && this.$alert.show()
                    .addClass('alert-success')
                    .text('Upload success');
            },

            error: () => {
                this.$thumbnail.attr('src', this.initialAvatarURL);
                this.$alert.length && this.$alert.show()
                    .addClass('alert-warning')
                    .text('Upload error');
            },

            complete: () => {
                this.$progressBar.length && this.$progressBar.addClass('visually-hidden');
            },
        });
    }

    getRoundedCanvas(sourceCanvas) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const width = sourceCanvas.width;
        const height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();

        return canvas;
    }
}

window.ImageUploader = ImageUploader;

// window.Alpine = require('alpinejs');

// Alpine.start();

//Bootstrap tooltips
$(document).ready(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    $(document).on('change', 'input[type=checkbox]', event => {
        event.target.value = event.target.checked ? 'on' : 'off';
    });

    $(".tabs").each(function(){
        let $this = $(this);

        $this.find(".tabs__titles").on("click", "li", function (){
            let id = $(this).data("id");

            $this.find(".tabs__titles li").removeClass("active");
            $(this).addClass("active");

            $this.find(".tab").hide();
            $this.find(".tab-" + id).show();
        });
    });

    new Swiper(".matches-results", {
        slidesPerView: "auto",
        variableWidth: true,
        navigation: {
            nextEl: '.matches-results-wrap .swiper-button-next',
            prevEl: '.matches-results-wrap .swiper-button-prev',
        },
        observer: true,
        observeParents: true,
        breakpoints: {
            320: {
                spaceBetween: 15,
                slidesPerView: 3,
                variableWidth: false,
            },
            576: {
                variableWidth: true,
                slidesPerView: "auto",
            }
        }
    });

    $(document).on("click", ".navbar-toggler", function(){
        $("body").toggleClass("hidden");
    });
});

Date.prototype.getShortDate = function (delimiter = '.', inverse = false) {
    const day = _.padStart(this.getDate().toString(), 2, '0');
    const month = _.padStart((this.getMonth() + 1).toString(), 2, '0');

    if (!inverse) return day + delimiter + month + delimiter + this.getFullYear();

    return this.getFullYear() + delimiter + month + delimiter + day;
};

/**
 * Получить дату со временем.
 * @param {String} [delimiter]
 * @returns {String}
 */
Date.prototype.getFullDate = function (delimiter = '.') {
    const day = _.padStart(this.getDate().toString(), 2, '0');
    const month = _.padStart((this.getMonth() + 1).toString(), 2, '0');
    const hour = _.padStart(this.getHours().toString(), 2, '0');
    const minute = _.padStart(this.getMinutes().toString(), 2, '0');
    // let second = _.padStart(this.getSeconds().toString(), 2, '0');

    return day + delimiter + month + delimiter + this.getFullYear() + ' ' + hour + ':' + minute;
};

/**
 * Получить объект даты начала дня
 * @returns {Date}
 */
Date.prototype.getDayBegin = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
};

/**
 * Подставить данные в строку
 * @link http://habrahabr.ru/post/192124/#comment_6673074
 * @returns {string}
 */
String.prototype.format = function () {
    let i = -1;
    const args = arguments;

    return this.replace(/#\{(.*?)\}/g, function (_, two) {
        return (typeof args[0] === 'object') ? args[0][two] : args[++i];
    });
};
