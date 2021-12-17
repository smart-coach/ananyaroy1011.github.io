TweenMax.staggerTo('.under_sub span span', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .9,
  delay: .0,
  rotation: 5
}, .0);

TweenMax.staggerTo('.under_sub_jp', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .9,
  delay: .0,
  rotation: 5
}, .0);


TweenMax.staggerTo('.under_sub span span', 1, {
  ease: Power4.easeOut,
  opacity: 1,
  y: 0,
  scale: .9,
  delay: .01,
  rotation: 0
}, .09);

TweenMax.staggerTo('.under_sub_jp', 1, {
  ease: Power4.easeOut,
  opacity: 1,
  y: 0,
  scale: .9,
  delay: .01,
  rotation: 0
}, .09);
TweenMax.staggerTo('.about_mv_co img', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .9,
  delay: .0,
  rotation: 5
}, .0);
TweenMax.staggerTo('.about_mv_co img', 1, {
  ease: Power4.easeOut,
  opacity: 1,
  y: 0,
  scale: .9,
  delay: .2,
  rotation: 0
}, .2);
var move = new ScrollMagic.Controller();
var about = TweenMax.staggerFrom('h3 span', .5, {
  ease: Power1.easeOut,
  opacity: 0,
  y: 10,
}, .04);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_co_area",
  triggerHook: 0.6,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.about_left_tex', 1, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(10)
}, .35);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_co_area",
  triggerHook: 0.6,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.contact_area_img01', 1, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(30),
  rotation: 20
}, .35);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_contact",
  triggerHook: 0.6,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.contact_area_img02', 1, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(30),
  rotation: 20
}, .35);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_contact",
  triggerHook: 0.6,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.illust_bg', .6, {
  ease: Power1.easeOut,
  y: vh(10)
}, .35);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_co_right",
  triggerHook: 0.6,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.obj_item', .6, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(10)
}, .35);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_co_right",
  triggerHook: 0.4,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.about_role p span', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(10),
  rotation: 5
}, .02);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_role",
  triggerHook: 0.9,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.obj_te img', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(10),
  rotation: 5
}, .02);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_co_area",
  triggerHook: 0.5,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.about_contact_main ', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(5),
  rotation: 0
}, .02);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_contact",
  triggerHook: 0.5,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.about_contact_main .about_sans', 1, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(5),
  rotation: 0,
  delay: .2
}, .1);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_contact",
  triggerHook: 0.8,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.about_contact ul li ', .8, {
  ease: Power3.easeOut,
  opacity: 0,
  y: vh(2),
  rotation: 0,
  delay: .2
}, .1);
var about = new ScrollMagic.Scene({
  triggerElement: ".about_contact",
  triggerHook: 0.4,
}).setTween(about).addTo(move);
/**/
//マウス制御設定
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (event) => {
  mouseX = event.pageX;
});
document.addEventListener("mousemove", (event) => {
  mouseY = event.pageY;
});
/*画面中央から*/
var centerx = 0;
var centery = 0;
document.addEventListener("mousemove", (event) => {
  centerx = (window.innerWidth / 2) - event.pageX;
});
document.addEventListener("mousemove", (event) => {
  centery = (window.innerHeight / 2) - event.pageY;
});
$(window).on('mousemove', function () {
  $('.illust_bg_a img').each(function () {
    $(this).css('transform', 'translate3d(' + centerx / 40 + 'px,' + centery / 40 + 'px,0) scale(1.1)');
  });
});
$(window).on('mousemove', function () {
  $('.illust_bg_b img').each(function () {
    $(this).css('transform', 'translate3d(' + centerx / -40 + 'px,' + centery / -40 + 'px,0) scale(1.1)');
  });
});
$(window).on('mousemove', function () {
  $('.obj_te img').each(function () {
    $(this).css('transform', 'translate3d(' + centerx / 60 + 'px,' + centery / 60 + 'px,0) scale(1.1)');
  });
});
$(window).on('mousemove', function () {
  $('.obj_te img').each(function () {
    $(this).css('transform', 'translate3d(' + centerx / -80 + 'px,' + centery / -80 + 'px,0)');
  });
});


TweenMax.staggerFrom('.pa1 p', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(10),
  rotation: 5
}, .25);
TweenMax.staggerFrom('.ar_trash', 0, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(10),
  rotation: 5
}, .25);
TweenMax.staggerFrom('.ar_trash', .8, {
  ease: Power1.easeOut,
  opacity: 1,
  y: vh(10),
  rotation: 5
}, .25);
TweenMax.staggerFrom('.ar_b1_i3_g', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(10),
  rotation: 5
}, .25);




var about = TweenMax.staggerFrom('.ar_b1_i1 img', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(5),
  rotation: -5
}, .2);
var about = new ScrollMagic.Scene({
  triggerElement: ".ar_b1_c",
  triggerHook: 0.8,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.ar_b1_i2 img', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(5),
  rotation: -5
}, .2);
var about = new ScrollMagic.Scene({
  triggerElement: ".ar_b1_c",
  triggerHook: 0.8,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.ar_box_te,.ar_box_te_jp', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(2)
}, .2);
var about = new ScrollMagic.Scene({
  triggerElement: ".ar_b1_c",
  triggerHook: 0.8,
}).setTween(about).addTo(move);



var about = TweenMax.staggerFrom('.ar_box_te2,.ar_box_te_jp2', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(2)
}, .2);
var about = new ScrollMagic.Scene({
  triggerElement: ".ar_box_te2",
  triggerHook: 0.8,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.ar_b1_i4_7', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(2),
  rotation: -3
}, .09);
var about = new ScrollMagic.Scene({
  triggerElement: ".ar_b1_c2",
  triggerHook: 0.8,
}).setTween(about).addTo(move);
/**/
var about = TweenMax.staggerFrom('.ar_b2_i1 img', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(2),
  rotation: -3
}, .09);
var about = new ScrollMagic.Scene({
  triggerElement: ".ar_b2_c",
  triggerHook: 0.8,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.ar_b2_i2 img', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(2),
  rotation: -3
}, .09);
var about = new ScrollMagic.Scene({
  triggerElement: ".ar_b2_c",
  triggerHook: 0.8,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.ar_b3_i2 img', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(5),
  rotation: -3
}, .09);
var about = new ScrollMagic.Scene({
  triggerElement: ".ar_b3_c",
  triggerHook: 0.8,
}).setTween(about).addTo(move);
var about = TweenMax.staggerFrom('.ar_b3_i3 img', .8, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(10),
  rotation: -3
}, .09);
var about = new ScrollMagic.Scene({
  triggerElement: ".ar_b3_c",
  triggerHook: 0.8,
}).setTween(about).addTo(move);
/**/
$(function () {
  $('.a_c_9').hover(function () {
    TweenMax.staggerTo('.c_h_i_01', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      y: vw(-4),
      rotation: -5
    });
  }, function () {
    TweenMax.staggerTo('.c_h_i_01', .5, {
      ease: Power2.easeOut,
      opacity: 0,
      x: vw(1)
    });
  });
});
$(function () {
  $('.a_c_j').hover(function () {
    TweenMax.staggerTo('.c_h_i_02', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      y: vw(-2),
      rotation: 5
    });
  }, function () {
    TweenMax.staggerTo('.c_h_i_02', .5, {
      ease: Power2.easeOut,
      opacity: 0,
      y: vw(-4),
      rotation: 0
    });
  });
});
$(function () {
  $('.a_c_f').hover(function () {
    TweenMax.staggerTo('.c_h_i_03', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      y: vw(-3),
      rotation: -3
    });
  }, function () {
    TweenMax.staggerTo('.c_h_i_03', .5, {
      ease: Power2.easeOut,
      opacity: 0,
      y: vw(-4),
      rotation: 0
    });
  });
});
$(function () {
  $('.a_c_t').hover(function () {
    TweenMax.staggerTo('.c_h_i_04', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      y: vw(-3),
      rotation: -3
    });
  }, function () {
    TweenMax.staggerTo('.c_h_i_04', .5, {
      ease: Power2.easeOut,
      opacity: 0,
      y: vw(-4),
      rotation: 0
    });
  });
});
$(function () {
  $('.a_c_l').hover(function () {
    TweenMax.staggerTo('.c_h_i_05', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      y: vw(-3),
      rotation: 3
    });
  }, function () {
    TweenMax.staggerTo('.c_h_i_05', .5, {
      ease: Power2.easeOut,
      opacity: 0,
      y: vw(-4),
      rotation: 0
    });
  });
});

/**/
$(window).on('scroll', function () {
  $('.ar_box_lo_na').each(function () {
    var scroll = $(window).scrollTop();
    var movettl = Math.round(scroll * 0.2);
    $('.ar_box_lo_na').css('transform', 'rotate(' + movettl /3 + 'deg)');
  });
});