export class ImageUploader {
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
