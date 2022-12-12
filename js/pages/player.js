$(document).ready(() => {

    new Swiper(".last-matches-command", {
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
            nextEl: '.last-matches-command .swiper-button-next',
            prevEl: '.last-matches-command .swiper-button-prev',
        },
        observer: true,
        observeParents: true,
        breakpoints: {
            // when window width is >= 320px
            1400: {
                slidesPerView: 3,
            },
            1000: {
                slidesPerView: 2,
            },
        }
    });

});
