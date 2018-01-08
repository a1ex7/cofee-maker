$(function(){

  /* Header scroll to fixed */

  var $header = $('.s-header');
  var headerHeight = $header.height();

  $(window).scroll(function () {

    var scrollPosition = $(this).scrollTop();

    /* Fixed menu should be appeared when scrolling more than 3x header height */
    if ( !$header.hasClass('s-header--fixed') && scrollPosition >= headerHeight*3 ) {
      $header.addClass('s-header--fixed');
      $header.animate({
        top: 0
      }, 400);
    }
    if ( $header.hasClass('s-header--fixed') && scrollPosition < headerHeight*3 ) {
      $header.animate({
        top: '-100px'
      }, 100, function(){
        $header.removeClass('s-header--fixed');
      });
    }
  });


  /* Smooth scroll */
  $( '.menu__link' ).click(function(e) {

    var targetId = $(this).attr('href');
    var $targetSection = $(targetId);
    var targetPosition = $targetSection.offset().top;

    $('body').animate({
      scrollTop: targetPosition
    }, 400);

  });


  /* Palallax Effect */

  var rellax = new Rellax('.rellax', {center: false});

  $(window).scroll(function () {

    var scrollPosition = $(this).scrollTop();

    $('.prellax').each(function() {

      var $prelaxEl = $(this);
      var $cn = $prelaxEl.parent();
      var cnHeight = $cn.outerHeight();
      var cnPercent = $prelaxEl.data('prellax-percent');
      var speed = $prelaxEl.data('prellax-speed');
      var cnScrollPosition = scrollPosition - $cn.offset().top - cnHeight * cnPercent;

      var translateY = cnScrollPosition * speed / 10;

      $prelaxEl.css({
        'transform': 'translate(0px, ' + translateY +'%)'
      });

    });

  });


  /* Program Tabs */

  var $programTabs = $('.program__content');

  $programTabs.slick({
    // fade: true,
    arrows: false,
    infinite: false,
  });

  $('.program__link').on('click', function(e) {
    e.preventDefault()
    var index = $(this).index('.program__link');
    $programTabs.slick('slickGoTo', index);
  });

  /* On before slide change we activate the link */
  $programTabs.on('beforeChange', function(event, slick, currentSlide, nextSlide){

    /* Activate Link */
    $link = $('.program__link').eq(nextSlide);
    $link.addClass('program__link--active');
    $link.parent().siblings().children('a').removeClass('program__link--active');

  });


  /* Gallery Slider */

  var $gallerySlider = $('.s-gallery__slider');

  $gallerySlider.slick({
    infinite: true,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
    prevArrow: '.s-gallery__controls .control--arrow-left',
    nextArrow: '.s-gallery__controls .control--arrow-right',
  });

  $gallerySlider.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide) {

    /* Change number of current slide */
    var i = (currentSlide ? currentSlide : 0) + 1;
    $('.control--text').html(i + '<span> from </span>' + slick.slideCount);

  });


  /* Testimonials Slider */

  $('.s-testimonials__content').slick({
    dots: true,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    appendDots: '.s-testimonials__controls',
    prevArrow: '.s-testimonials__arrow--prev',
    nextArrow: '.s-testimonials__arrow--next',
    responsive: [
      {
        breakpoint: 480,
        settings: {
          dots: false
        }
      }
    ]
  });


  /* Partners Slider */

  $('.s-partners__list').slick({
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    prevArrow: '.s-partners__arrow--prev',
    nextArrow: '.s-partners__arrow--next',
    responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
  });

});