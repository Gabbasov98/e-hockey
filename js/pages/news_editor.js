$(document).ready(() => {
    if (NEWS_EDIT) {
        const newsBannerLong = new ImageUploader({
            url: NEWS_SEND_BANNER_LONG_URL,
            height: 260,
            width: 1000,
            selector: '#newsBannerLong',
        });

        const newsBannerSmall = new ImageUploader({
            url: NEWS_SEND_BANNER_SMALL_URL,
            height: 200,
            width: 424,
            selector: '#newsBannerSmall',
        });

        const newsBannerTall = new ImageUploader({
            url: NEWS_SEND_BANNER_TALL_URL,
            height: 424,
            width: 424,
            selector: '#newsBannerTall',
        });

        TRNMNT_deleteData({
            selector: '#deleteNews',
            url: NEWS_SAVE_URL,
            success: function (response, $button) {
                window.location.href = NEWS_SUCCESS_ROUTE;
            }
        });
    }

    const editor = new EditorJS({
        placeholder: 'Пора бы написать новость!',

        tools: {
            embed: EJSEmbedTool,
            image: {
                class: EJSImageTool,
                config: {
                    endpoints: {
                        // Your backend file uploader endpoint
                        byFile: NEWS_IMAGE_UPLOAD_FILE_URL,
                        // Your endpoint that provides uploading by Url
                        byUrl: NEWS_IMAGE_FETCH_URL,
                    },
                    additionalRequestHeaders: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                }
            },
            list: EJSListTool,
            table: EJSTableTool,
        },
        data: NEWS_DATA,

        onReady() {
            $('.codex-editor__redactor').removeAttr('style');
        },

        /**
         * Internationalization config
         */
        i18n: getLocalization(),
    });

    $('#createNews').on('click', () => {
        editor.save().then((outputData) => {
            TRNMNT_helpers.disableButtons();
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: NEWS_EDIT ? 'put' : 'post',
                url: NEWS_SAVE_URL,
                data: JSON.stringify({header: $('#header').val(), body: JSON.stringify(outputData)}),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                processData: false,
                success: response => {
                    TRNMNT_helpers.enableButtons();
                    window.location.href = NEWS_SUCCESS_ROUTE + '/' + response.data.id + '/update';
                },
                error: TRNMNT_helpers.onErrorAjax,
                context: TRNMNT_helpers
            });
        }).catch((error) => {
            console.log('Saving failed: ', error);
        });
    });

});

function getLocalization() {
    return {
        /**
         * @type {I18nDictionary}
         */
        messages: {
            /**
             * Other below: translation of different UI components of the editor.js core
             */
            ui: {
                "blockTunes": {
                    "toggler": {
                        "Click to tune": "Нажмите, чтобы настроить",
                        "or drag to move": "или перетащите"
                    },
                },
                "inlineToolbar": {
                    "converter": {
                        "Convert to": "Конвертировать в"
                    }
                },
                "toolbar": {
                    "toolbox": {
                        "Add": "Добавить"
                    }
                }
            },

            /**
             * Section for translation Tool Names: both block and inline tools
             */
            toolNames: {
                "Text": "Параграф",
                "Heading": "Заголовок",
                "List": "Список",
                "Warning": "Примечание",
                "Checklist": "Чеклист",
                "Quote": "Цитата",
                "Code": "Код",
                "Delimiter": "Разделитель",
                "Raw HTML": "HTML-фрагмент",
                "Table": "Таблица",
                "Link": "Ссылка",
                "Marker": "Маркер",
                "Bold": "Полужирный",
                "Italic": "Курсив",
                "InlineCode": "Моноширинный",
                "Image": "Картинка",
            },

            /**
             * Section for passing translations to the external tools classes
             */
            tools: {
                /**
                 * Each subsection is the i18n dictionary that will be passed to the corresponded plugin
                 * The name of a plugin should be equal the name you specify in the 'tool' section for that plugin
                 */
                "warning": { // <-- 'Warning' tool will accept this dictionary section
                    "Title": "Название",
                    "Message": "Сообщение",
                },

                /**
                 * Link is the internal Inline Tool
                 */
                "link": {
                    "Add a link": "Вставьте ссылку"
                },
                /**
                 * The "stub" is an internal block tool, used to fit blocks that does not have the corresponded plugin
                 */
                "stub": {
                    'The block can not be displayed correctly.': 'Блок не может быть отображен'
                },

                "image": {
                    "With border": "Обводка",
                    "Stretch image": "Растянуть картинку",
                    "With background": "Фон",
                    "Select an Image": "Выбери картинку",
                    "Caption": "Подпись",
                },

                "table": {
                    "Add column to left": "Добавить колонку слева",
                    "Add column to right": "Добавить колонку справа",
                    "Delete column": "Удалить колонку",
                    "Add row above": "Добавить ряд выше",
                    "Add row below": "Добавить ряд ниже",
                    "Delete row": "Удалить ряд",
                    "With headings": "С заголовками",
                    "Without headings": "Без заголовков",
                },

                "embed": {
                    "Enter a caption": "Подпись",
                }
            },

            /**
             * Section allows to translate Block Tunes
             */
            blockTunes: {
                /**
                 * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
                 * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
                 *
                 * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
                 */
                "delete": {
                    "Delete": "Удалить"
                },
                "moveUp": {
                    "Move up": "Переместить вверх"
                },
                "moveDown": {
                    "Move down": "Переместить вниз"
                }
            },
        }
    };
}
