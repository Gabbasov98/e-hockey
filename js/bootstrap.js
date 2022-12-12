window._ = require('lodash');

/*
 Font awesome
 */
require('@fortawesome/fontawesome-free/js/fontawesome.min');
require('@fortawesome/fontawesome-free/js/brands.min');
require('@fortawesome/fontawesome-free/js/solid.min');
require('@fortawesome/fontawesome-free/js/regular.min');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.Popper = require('@popperjs/core');
    window.$ = window.jQuery = require('jquery');

    window.bootstrap = require('bootstrap');
} catch (e) {
}

/*
 EditorJS
 */
window.EditorJS = require('@editorjs/editorjs');
window.EJSEmbedTool = require('@editorjs/embed');
window.EJSImageTool = require('@editorjs/image');
window.EJSListTool = require('@editorjs/list');
window.EJSTableTool = require('@editorjs/table');

/*
 DataTables
 */
require('datatables.net-responsive-bs5');

/*
 Masonry Layout
 */
window.Masonry = require('masonry-layout');

/*
 Cropper
 */
import 'cropperjs/dist/cropper.min.css'
// Я хз, почему здесь полный путь надо вводить. Без него ошибка импорта
window.Cropper = require('cropperjs');
require('jquery-cropper/dist/jquery-cropper.min');

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

//Glide
window.Glide = require('@glidejs/glide').default;

// Import all of Bootstrap's JS
require('bootstrap');

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// import Pusher from 'pusher-js';
// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });

