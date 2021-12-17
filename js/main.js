/**/
/**/
/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2019, Codrops
 * http://www.codrops.com
 */
{
  // body element
  const body = document.body;
  // helper functions
  const MathUtils = {
    // linear interpolation
    lerp: (a, b, n) => (1 - n) * a + n * b,
    // distance between two points
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
  }
  // get the mouse position
  const getMousePos = (ev) => {
    let posx = 0;
    let posy = 0;
    if (!ev) ev = window.event;
    if (ev.pageX || ev.pageY) {
      posx = ev.pageX;
      posy = ev.pageY - window.innerHeight;
    } else if (ev.clientX || ev.clientY) {
      posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
      posy = ev.clientY + body.scrollTop + docEl.scrollTop;
    }
    return {
      x: posx,
      y: posy
    };
  }
  // mousePos: current mouse position
  // cacheMousePos: previous mouse position
  // lastMousePos: last last recorded mouse position (at the time the last image was shown)
  let mousePos = lastMousePos = cacheMousePos = {
    x: 0,
    y: 0
  };
  // update the mouse position
  window.addEventListener('mousemove', ev => mousePos = getMousePos(ev));
  // gets the distance from the current mouse position to the last recorded mouse position
  const getMouseDistance = () => MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);
  class Image {
    constructor(el) {
      this.DOM = {
        el: el
      };
      // image deafult styles
      this.defaultStyle = {
        scale: 1,
        x: 0,
        y: 0,
        opacity: 0
      };
      // get sizes/position
      this.getRect();
      // init/bind events
      this.initEvents();
    }
    initEvents() {
      // on resize get updated sizes/position
      window.addEventListener('resize', () => this.resize());
    }
    resize() {
      // reset styles
      TweenMax.set(this.DOM.el, this.defaultStyle);
      // get sizes/position
      this.getRect();
    }
    getRect() {
      this.rect = this.DOM.el.getBoundingClientRect();
    }
    isActive() {
      // check if image is animating or if it's visible
      return TweenMax.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
    }
  }
  class ImageTrail {
    constructor() {
      // images container
      this.DOM = {
        content: document.querySelector('.content')
      };
      // array of Image objs, one per image element
      this.images = [];
      [...this.DOM.content.querySelectorAll('img')].forEach(img => this.images.push(new Image(img)));
      // total number of images
      this.imagesTotal = this.images.length;
      // upcoming image index
      this.imgPosition = 0;
      // zIndex value to apply to the upcoming image
      this.zIndexVal = 1;
      // mouse distance required to show the next image
      this.threshold = 300;
      // render the images
      requestAnimationFrame(() => this.render());
    }
    render() {
      // get distance between the current mouse position and the position of the previous image
      let distance = getMouseDistance();
      // cache previous mouse position
      cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
      cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);
      // if the mouse moved more than [this.threshold] then show the next image
      if (distance > this.threshold) {
        this.showNextImage();
        ++this.zIndexVal;
        this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
        lastMousePos = mousePos;
      }
      // check when mousemove stops and all images are inactive (not visible and not animating)
      let isIdle = true;
      for (let img of this.images) {
        if (img.isActive()) {
          isIdle = false;
          break;
        }
      }
      // reset z-index initial value
      if (isIdle && this.zIndexVal !== 1) {
        this.zIndexVal = 1;
      }
      // loop..
      requestAnimationFrame(() => this.render());
    }
    showNextImage() {
      // show image at position [this.imgPosition]
      const img = this.images[this.imgPosition];
      // kill any tween on the image
      TweenMax.killTweensOf(img.DOM.el);
      new TimelineMax()
        // show the image
        .set(img.DOM.el, {
          startAt: {
            opacity: 0,
            scale: 1.5
          },
          opacity: 1,
          scale: 1.5,
          zIndex: this.zIndexVal,
          x: cacheMousePos.x - img.rect.width / 2,
          y: cacheMousePos.y - img.rect.height / 2
        }, 0)
        // animate position
        .to(img.DOM.el, 0.9, {
          ease: Expo.easeOut,
          x: mousePos.x - img.rect.width / 2,
          y: mousePos.y - img.rect.height / 4
        }, 0)
        // then make it disappear
        .to(img.DOM.el, 1, {
          ease: Power1.easeOut,
          opacity: 0
        }, 0.4)
        // scale down the image
        .to(img.DOM.el, 1, {
          ease: Quint.easeOut,
          scale: 0.8
        }, 0.4);
    }
  }
  /***********************************/
  /********** Preload stuff **********/
  // Preload images
  const preloadImages = () => {
    return new Promise((resolve, reject) => {
      imagesLoaded(document.querySelectorAll('.content__img'), resolve);
      imagesLoaded(document.querySelectorAll('.f_img'), resolve);
      imagesLoaded(document.querySelectorAll('.pro_main_img'), resolve);
      imagesLoaded(document.querySelectorAll('.fv_temp'), resolve);
    });
  };
  // And then..
  preloadImages().then(() => {
    // Remove the loader
    document.body.classList.remove('loading');

    TweenMax.staggerFrom('canvas', 2, {
      ease: Power1.easeOut,
      opacity: 1,
      scale: 1.2,
      y: vh(10)
    });
    TweenMax.staggerFrom('.fv_temp', 2, {
      ease: Power1.easeOut,
      opacity: 1,
      scale: 1.2,
      y: vh(10)
    });
    TweenMax.staggerFrom('.fv_co h1', .8, {
      ease: Power1.easeOut,
      opacity: 0,
      y: 50
    });
    TweenMax.staggerFrom('.fv_sub_title', .8, {
      ease: Power4.easeOut,
      y: 50
    }, .05);
    TweenMax.staggerFrom('.fv_sub_title span', .6, {
      ease: Power4.easeOut,
      opacity: 0
    }, .05);
    TweenMax.staggerFrom('.fv_sub_text span', .8, {
      ease: Power4.easeOut,
      opacity: 0,
      delay: .6
    }, .05);
    new ImageTrail();
  });
}
/*準備*/
const vw = (coef) => window.innerWidth * (coef / 100)
const vh = (coef) => window.innerHeight * (coef / 100)
/*fv*/
$(window).on('scroll', function () {
  $('.fv').each(function () {
    var scroll = $(window).scrollTop();
    var movettl = Math.round(scroll * 0.2);
    $('h1 img').css('transform', 'translate3d(0px,' + movettl / 2 + 'px,0px)');
    $('.fv_sub_title').css('transform', 'translate3d(0px,' + movettl / 1.55 + 'px,0px)');
    $('.fv_sub_text').css('transform', 'translate3d(0px,' + movettl / 1.35 + 'px,0px)');
  });
});
/*前処理*/
TweenMax.staggerTo('.works_guide p', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .9
}, .0);
TweenMax.staggerTo('.works_de_nav_sp', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .9
}, .0);
TweenMax.staggerTo('.works_title_sub', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .9,
  delay: .01
}, .0);
TweenMax.staggerTo('.works_title_main span', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .9,
  delay: .01
}, .0);
TweenMax.staggerTo('.img_box img', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .8,
  delay: .01
}, .0);
TweenMax.staggerTo('.img_text', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .8,
  delay: .01
}, .0);
TweenMax.staggerTo('.wokrs_de_te div p', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 0,
  scale: .8,
  delay: .01
});
/*画面02の背景*/
TweenMax.staggerTo('.work_bg_item div img', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 0,
  scale: .9,
  delay: .01
});
/*メニュー*/
TweenMax.staggerFrom('.menu_contents_bottom ul li a', .4, {
  ease: Power1.easeOut,
  opacity: 0,
  y: vh(0),
  delay: .2
}, .03);
/*ストーカー*/
TweenMax.staggerTo('#stalker', 0, {
  ease: Power2.easeOut,
  opacity: 0
});
TweenMax.staggerTo('.st_arrow', 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 100,
  scale: .9,
  delay: .01
}, .0);
/*画面03*/
TweenMax.staggerTo(".pro1 .pro_right_tex p", 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 10,
  x: 0,
  rotation: 0
});
TweenMax.staggerTo(".pro2 .pro_right_tex p", 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 10,
  x: 0,
  rotation: 0
});
TweenMax.staggerTo(".pro3 .pro_right_tex p", 0, {
  ease: Power4.easeOut,
  opacity: 0,
  y: 10,
  x: 0,
  rotation: 0
});
/*スクロール*/
/**/
TweenMax.staggerTo('.pro1_img img', 0, {
  ease: Power2.easeOut,
  opacity: 0,
  y: 50,
  delay: .2
}, .0);
TweenMax.staggerTo('.pro2_img img', 0, {
  ease: Power2.easeOut,
  opacity: 0,
  y: 50,
  delay: .2
}, .0);
TweenMax.staggerTo('.pro3_img img', 0, {
  ease: Power2.easeOut,
  opacity: 0,
  y: 50,
  delay: .2
}, .0);
/*scroll 画面01⇆画面02 */
$(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > window.innerHeight / 2) {
      /*画面01*/
      TweenMax.staggerTo('canvas', 2, {
        ease: Power2.easeOut,
        opacity: 0,
        y: 100,
        scale: 1.2
      });
            TweenMax.staggerTo('.fv_temp', 2, {
        ease: Power2.easeOut,
        opacity: 0,
        y: 100,
        scale: 1.2
      });
      TweenMax.staggerTo('.fv_co h1', .5, {
        ease: Power2.easeOut,
        opacity: 0,
        y: 50
      });
      TweenMax.staggerTo('.fv_co .fv_sub_title span', .8, {
        ease: Power2.easeOut,
        opacity: 0,
        y: 50,
        delay: .1
      }, .03);
      TweenMax.staggerTo('.fv_co .fv_sub_text span', .5, {
        ease: Power2.easeOut,
        opacity: 0,
        y: 50,
        delay: .2
      }, .05);
      TweenMax.staggerTo('.fv_scroll', .5, {
        ease: Power2.easeOut,
        opacity: 0,
        y: 50,
        delay: .2
      }, .05);
      $('.fv').css('z-index', '0');
      /*画面01*/
      /*画面02*/
      TweenMax.staggerTo('.works_de_nav_sp', 1, {
        ease: Power4.easeOut,
        opacity: 1,
        y: 0,
        scale: 1
      }, .0);
      TweenMax.staggerTo('.works_title_sub', 1, {
        ease: Power4.easeOut,
        opacity: 1,
        y: 0,
        scale: 1,
        delay: .01
      }, .05);
      TweenMax.staggerTo('.img_box img', 1, {
        ease: Power3.easeOut,
        opacity: 1,
        y: 0,
        scale: 1,
        delay: .01
      }, .05);
      TweenMax.staggerTo('.img_text', 1, {
        ease: Power3.easeOut,
        opacity: 1,
        y: 0,
        scale: 1,
        delay: .01
      }, .05);
      TweenMax.staggerTo('.wokrs_de_te div p', 0, {
        ease: Power1.easeOut,
        opacity: 1,
        y: 0,
        scale: 1,
        delay: .2
      }, .08);
      /*画面02*/
      /**/
      TweenMax.staggerTo('#stalker', 1, {
        ease: Power2.easeOut,
        opacity: 1,
        delay: .4
      });
      TweenMax.staggerTo('.works_guide p', 1.4, {
        ease: Power4.easeOut,
        opacity: 1,
        y: 0,
        scale: 1,
        delay: .5
      }, .5);
      //			TweenMax.staggerFromTo(".works_guide p", 1 ,{y:0,rotation:0,x:0 ,opacity:1},{y:100,rotation:-30,x:0 ,opacity:0,delay:2},.08);
      setTimeout(function () {
        TweenMax.staggerTo('.works_guide p', 1.4, {
          ease: Power4.easeOut,
          opacity: 0,
          y: -50,
          scale: 1,
          delay: .01
        }, .5);
      }, 2500);
      if ($('.smb1').hasClass("box_on")) {
        TweenMax.staggerTo('.te1 span', 1, {
          ease: Power2.easeOut,
          opacity: 1,
          y: 0,
          scale: 1,
          delay: .2,
        }, .03);
        TweenMax.staggerTo('.co_i1 div img', .7, {
          ease: Power1.easeOut,
          opacity: 1,
          y: 0,
          scale: 1,
          delay: .01
        }, .08);
      } else if ($('.smb2').hasClass("box_on")) {
        TweenMax.staggerTo('.te2 span', 1, {
          ease: Power2.easeOut,
          opacity: 1,
          y: 0,
          scale: 1,
          delay: .2,
        }, .03);
        TweenMax.staggerTo('.co_i2 div img', .7, {
          ease: Power1.easeOut,
          opacity: 1,
          y: 0,
          scale: 1,
          delay: .01
        }, .08);
      } else if ($('.smb3').hasClass("box_on")) {
        TweenMax.staggerTo('.te3 span', 1, {
          ease: Power2.easeOut,
          opacity: 1,
          y: 0,
          scale: 1,
          delay: .2,
        }, .03);
        TweenMax.staggerTo('.co_i3 div img', .7, {
          ease: Power1.easeOut,
          opacity: 1,
          y: 0,
          scale: 1,
          delay: .01
        }, .08);
      }
    } else if ($(this).scrollTop() < window.innerHeight / 2.1) {
      /*画面01*/
      TweenMax.staggerTo('canvas', 2, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        scale: 1
      });
           TweenMax.staggerTo('.fv_temp', 2, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        scale: 1
      }); 
      TweenMax.staggerTo('.fv_co h1', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0
      });
      TweenMax.staggerTo('.fv_co .fv_sub_title span', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        delay: .1
      }, .03);
      TweenMax.staggerTo('.fv_co .fv_sub_text span', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        delay: .2
      }, .05);
      TweenMax.staggerTo('.fv_scroll', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        delay: .2
      }, .05);
      $('.fv').css('z-index', '5000');
      $('canvas').css('z-index', '0');
      
      /*画面01*/
      /*画面02*/
      TweenMax.staggerTo('.works_de_nav_sp', 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 100,
        scale: .9
      }, .0);
      TweenMax.staggerTo('.works_guide p', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 100,
        scale: .9
      }, .0);
      TweenMax.staggerTo('.works_title_sub', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: 1,
        delay: .01
      }, .05);
      TweenMax.staggerTo('.works_title_main span', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: 1,
        delay: .02
      }, .03);
      TweenMax.staggerTo('.img_box img', 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 100,
        scale: .8,
        delay: .01
      }, .0);
      TweenMax.staggerTo('.img_text', 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 100,
        scale: .8,
        delay: .01
      }, .0);
      TweenMax.staggerTo('.wokrs_de_te div p', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: .8,
        delay: .01
      }, .05);
      TweenMax.staggerTo('.work_bg_item div img', 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: .9,
        delay: .01
      }, .05);
      /*画面02*/
      TweenMax.staggerTo('#stalker', 1, {
        ease: Power2.easeOut,
        opacity: 0,
        delay: .4
      });
    }
  });
});
$(function () {
  $(".fv_scroll").on("click", function () {
    $(".works").animate({
      scrollTop: $(".works")[0].scrollHeight
    }, 500, "swing");
  })
})
/*スタート時がMVになるおまじない*/
function onloadgo() {
  $('.space').css('height', '200vh');
}
setTimeout("onloadgo()", 500);
/*画面02work_切り替え*/
$('.wo_prev').click(function () {
  if ($('.smb1').hasClass("box_on")) {
    $('.smb1').addClass("box_off");
    $('.smb1').toggleClass("box_on");
    $('.smb3').addClass("box_on");
    $('.smb3').toggleClass("box_off");
    TweenMax.fromTo(".smb1 img", .6, {
      y: 0,
      rotation: 0,
      x: 0
    }, {
      y: 100,
      rotation: -30,
      x: 0
    });
    TweenMax.fromTo(".smb3 img", .6, {
      y: -100,
      rotation: 30,
      x: 0
    }, {
      y: 0,
      rotation: 0,
      x: 0
    });
    $('.te3').css('display', 'block');
    TweenMax.staggerTo('.te1', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te1 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te3', 1, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.te3 span', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      scale: 1,
      delay: .2,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerFromTo(".co_i1 div img", 0.8, {
      opacity: 1
    }, {
      opacity: 0,
      y: -50
    }, 0.05)
    TweenMax.staggerFromTo(".co_i3 div img", 0.4, {
      opacity: 0
    }, {
      opacity: 1,
      y: 50
    }, 0.05)
    $('.no01').addClass("off");
    $('.no01').toggleClass("on");
    $('.no03').addClass("on");
    $('.no03').toggleClass("off");
  } else if ($('.smb3').hasClass("box_on")) {
    $('.smb3').addClass("box_off");
    $('.smb3').toggleClass("box_on");
    $('.smb2').addClass("box_on");
    $('.smb2').toggleClass("box_off");
    TweenMax.fromTo(".smb3 img", .6, {
      y: 0,
      rotation: 0,
      x: 0
    }, {
      y: 100,
      rotation: -30,
      x: 0
    });
    TweenMax.fromTo(".smb2 img", .6, {
      y: -100,
      rotation: 30,
      x: 0
    }, {
      y: 0,
      rotation: 0,
      x: 0
    });
    $('.te2').css('display', 'block');
    TweenMax.staggerTo('.te3', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te3 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te2', 1, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.te2 span', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      scale: 1,
      delay: .2,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerFromTo(".co_i3 div img", 0.8, {
      opacity: 1
    }, {
      opacity: 0,
      y: -50
    }, 0.05)
    TweenMax.staggerFromTo(".co_i2 div img", 0.4, {
      opacity: 0
    }, {
      opacity: 1,
      y: 50
    }, 0.05)
    $('.no03').addClass("off");
    $('.no03').toggleClass("on");
    $('.no02').addClass("on");
    $('.no02').toggleClass("off");
  } else if ($('.smb2').hasClass("box_on")) {
    $('.smb2').addClass("box_off");
    $('.smb2').toggleClass("box_on");
    $('.smb1').addClass("box_on");
    $('.smb1').toggleClass("box_off");
    TweenMax.fromTo(".smb2 img", .6, {
      y: 0,
      rotation: 0,
      x: 0
    }, {
      y: 100,
      rotation: -30,
      x: 0
    });
    TweenMax.fromTo(".smb1 img", .6, {
      y: -100,
      rotation: 30,
      x: 0
    }, {
      y: 0,
      rotation: 0,
      x: 0
    });
    $('.te1').css('display', 'block');
    TweenMax.staggerTo('.te2', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te2 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te1', 1, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.te1 span', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      scale: 1,
      delay: .2,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerFromTo(".co_i2 div img", 0.8, {
      opacity: 1
    }, {
      opacity: 0,
      y: -50
    }, 0.05);
    TweenMax.staggerFromTo(".co_i1 div img", 0.4, {
      opacity: 0
    }, {
      opacity: 1,
      y: 50
    }, 0.05);
    $('.no02').addClass("off");
    $('.no02').toggleClass("on");
    $('.no01').addClass("on");
    $('.no01').toggleClass("off");
  }
  //cursor
  TweenMax.staggerFromTo(".st_bg", 0.8, {
    opacity: 1,
    y: -100,
    x: 100
  }, {
    opacity: 0,
    y: 100,
    x: -100
  }, 0.05)
  TweenMax.staggerFromTo(".st_arrow span", 0.8, {
    ease: Back.easeOut,
    rotation: 0
  }, {
    ease: Back.easeOut,
    rotation: -360
  }, 0.05)
});
$('.wo_next').click(function () {
  if ($('.smb1').hasClass("box_on")) {
    $('.smb1').addClass("box_off");
    $('.smb1').toggleClass("box_on");
    $('.smb2').addClass("box_on");
    $('.smb2').toggleClass("box_off");
    TweenMax.fromTo(".smb1 img", .6, {
      y: 0,
      rotation: 0,
      x: 0
    }, {
      y: -100,
      rotation: 30,
      x: 0
    });
    TweenMax.fromTo(".smb2 img", .6, {
      y: 100,
      rotation: -30,
      x: 0
    }, {
      y: 0,
      rotation: 0,
      x: 0
    });
    $('.te2').css('display', 'block');
    TweenMax.staggerTo('.te1', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te1 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te2', 1, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.te2 span', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      scale: 1,
      delay: .2,
      display: 'inline-block'
    }, .03);
    $('.no01').addClass("off");
    $('.no01').toggleClass("on");
    $('.no02').addClass("on");
    $('.no02').toggleClass("off");
    TweenMax.staggerFromTo(".co_i1 div img", 0.8, {
      opacity: 1
    }, {
      opacity: 0,
      y: 50
    }, 0.05)
    TweenMax.staggerFromTo(".co_i2 div img", 0.4, {
      opacity: 0
    }, {
      opacity: 1,
      y: -50
    }, 0.05)
  } else if ($('.smb2').hasClass("box_on")) {
    $('.smb2').addClass("box_off");
    $('.smb2').toggleClass("box_on");
    $('.smb3').addClass("box_on");
    $('.smb3').toggleClass("box_off");
    TweenMax.fromTo(".smb2 img", .6, {
      y: 0,
      rotation: 0,
      x: 0
    }, {
      y: -100,
      rotation: 30,
      x: 0
    });
    TweenMax.fromTo(".smb3 img", .6, {
      y: 100,
      rotation: -30,
      x: 0
    }, {
      y: 0,
      rotation: 0,
      x: 0
    });
    $('.te3').css('display', 'block');
    TweenMax.staggerTo('.te2', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te2 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te3', 1, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.te3 span', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      scale: 1,
      delay: .2,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerFromTo(".co_i2 div img", 0.8, {
      opacity: 1
    }, {
      opacity: 0,
      y: 50
    }, 0.05)
    TweenMax.staggerFromTo(".co_i3 div img", 0.4, {
      opacity: 0
    }, {
      opacity: 1,
      y: -50
    }, 0.05)
    $('.no02').addClass("off");
    $('.no02').toggleClass("on");
    $('.no03').addClass("on");
    $('.no03').toggleClass("off");
  } else if ($('.smb3').hasClass("box_on")) {
    $('.smb3').addClass("box_off");
    $('.smb3').toggleClass("box_on");
    $('.smb1').addClass("box_on");
    $('.smb1').toggleClass("box_off");
    TweenMax.fromTo(".smb3 img", .6, {
      y: 0,
      rotation: 0,
      x: 0
    }, {
      y: -100,
      rotation: 30,
      x: 0
    });
    TweenMax.fromTo(".smb1 img", .6, {
      y: 100,
      rotation: -30,
      x: 0
    }, {
      y: 0,
      rotation: 0,
      x: 0
    });
    $('.te1').css('display', 'block');
    TweenMax.staggerTo('.te3', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te3 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te1', 1, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.te1 span', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      scale: 1,
      delay: .2,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerFromTo(".co_i3 div img", 0.8, {
      opacity: 1
    }, {
      opacity: 0,
      y: 50
    }, 0.05)
    TweenMax.staggerFromTo(".co_i1 div img", 0.4, {
      opacity: 0
    }, {
      opacity: 1,
      y: -50
    }, 0.05)
    $('.no03').addClass("off");
    $('.no03').toggleClass("on");
    $('.no01').addClass("on");
    $('.no01').toggleClass("off");
  }
  //curosr
  TweenMax.staggerFromTo(".st_bg", 0.8, {
    opacity: 1,
    y: 100,
    x: -100
  }, {
    opacity: 0,
    y: -100,
    x: 100
  }, 0.05)
  TweenMax.staggerFromTo(".st_arrow span", 0.8, {
    ease: Back.easeOut,
    rotation: 0
  }, {
    ease: Back.easeOut,
    rotation: 360
  }, 0.05)
});
/*drag_hover*/
$(function () {
  $('.img_box').hover(function () {
    TweenMax.staggerTo('.img_box img', .5, {
      ease: Power2.easeOut,
      scale: 1.1
    });
    $('#stalker').css('width', '10vw');
    $('#stalker').css('height', '10vw');
    $('#stalker').css('top', '-5vw');
    $('#stalker').css('left', '-5vw');
    TweenMax.staggerTo('.st_text_drag', .2, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.st_arrow_drag', .2, {
      ease: Power2.easeOut,
      display: 'block'
    }, .03);
    TweenMax.staggerTo('.st_arrow', 0, {
      ease: Power2.easeOut,
      display: 'none'
    });
    TweenMax.staggerTo('.st_text_nomal', 0, {
      ease: Power2.easeOut,
      display: 'none'
    });
    TweenMax.staggerFromTo(".st_text_drag span", 0.8, {
      opacity: 0,
      y: 0
    }, {
      opacity: 1,
      y: 0
    }, 0.05);
  }, function () {
    TweenMax.staggerTo('.img_box img', .5, {
      ease: Power2.easeOut,
      scale: 1
    });
    $('#stalker').css('width', '14vw');
    $('#stalker').css('height', '14vw');
    $('#stalker').css('top', '-7vw');
    $('#stalker').css('left', '-7vw');
    TweenMax.staggerTo('.st_text_drag', 0, {
      ease: Power2.easeOut,
      display: 'none'
    });
    TweenMax.staggerTo('.st_arrow_drag', 0, {
      ease: Power2.easeOut,
      display: 'none'
    });
    TweenMax.staggerTo('.st_arrow', .2, {
      ease: Power2.easeOut,
      display: 'block'
    }, .03);
    TweenMax.staggerTo('.st_text_nomal', .2, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
  });
});
/*drag 準備*/
var $draggable = $('.img_box').draggabilly({});
$draggable.on('dragStart', function (event, pointer) {})
$draggable.on('pointerMove', function (event, pointer, moveVector) {
  TweenMax.staggerTo('.img_box img', 1, {
    ease: Power2.easeOut,
    scale: .8
  });
  $('.pointer').children('img').attr('src', '');
  TweenMax.staggerTo('.works_title', .4, {
    ease: Power1.easeOut,
    opacity: 1,
    y: 0,
    scale: .9
  }, .01);
  TweenMax.staggerTo('#stalker', 0, {
    ease: Power2.easeOut,
    opacity: 0,
    display: 'none'
  });
})
$draggable.on('dragEnd', function (event, pointer) {
  $('.img_box').css('transform', 'rotate(0deg)  translate3d(0,0,0)');
  $('.works').css('top', '0vh');
  $('.works_img').css('top', '0');
  $('.works_img').css('height', '100vh');
  $('.img_box').css('width', '50vw');
  $('.img_box').css('height', '100vh');
  $('.img_box img').css('width', '50vw');
  $('.img_box img').css('height', '100vh');
  $('.img_box img').css('object-fit', 'cover');
  $('.img_box img').css('filter', 'grayscale(1)');
  $('.img_box').css('top', '0');
  $('.img_box').css('left', '0');
  $('.works_img').css('z-index', '500');
  //	$('.works_img').css('background', '#EFEFEF');	
  TweenMax.staggerTo('#stalker', 0, {
    ease: Power2.easeOut,
    opacity: 0
  });
  TweenMax.staggerTo('.img_box img', 1, {
    ease: Power2.easeOut,
    scale: 1
  });
  TweenMax.staggerTo('.works_title_sub', .5, {
    ease: Power2.easeOut,
    opacity: 0,
    y: -100,
    scale: 1,
    delay: .01
  }, .05);
  TweenMax.staggerTo('.img_text', .5, {
    ease: Power2.easeOut,
    opacity: 0,
    y: -100,
    scale: 1,
    delay: .02
  }, .03);
  TweenMax.staggerTo('.box_on p', .3, {
    ease: Power2.easeOut,
    opacity: 0,
    y: -10,
    scale: 1,
    delay: .02
  }, .1);
  TweenMax.staggerTo('.box_off p', .3, {
    ease: Power2.easeOut,
    opacity: 0,
    y: -10,
    scale: 1,
    delay: .02
  }, .1);
  $('.de_te_co').addClass("open");
  $('.img_box').toggleClass("on_mode");
  //スクロール禁止
  $('body').css('overflow', 'hidden');
  $(window).on('touchmove.noScroll', function (e) {
    e.preventDefault();
  });
  if ($('.smb1').hasClass("box_on")) {
    TweenMax.staggerTo('.te1 span', .5, {
      ease: Power2.easeOut,
      opacity: 0,
      y: -100,
      scale: 1,
      delay: .02
    }, .03);
    TweenMax.staggerTo('.pro1', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'flex'
    }, .03);
    TweenMax.staggerTo('.project', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'flex'
    }, .03);
    TweenMax.staggerTo('.pro1_img img', .6, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      display: 'inline-block',
      delay: .2
    }, .08);
    TweenMax.staggerTo(".pro1 .pro_right_tex p", .6, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      x: 0,
      rotation: 0
    }, .03);
  } else if ($('.smb2').hasClass("box_on")) {
    TweenMax.staggerTo('.te2 span', .5, {
      ease: Power2.easeOut,
      opacity: 0,
      y: -100,
      scale: 1,
      delay: .02
    }, .03);
    TweenMax.staggerTo('.pro2', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'flex'
    }, .03);
    TweenMax.staggerTo('.project', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'flex'
    }, .03);
    TweenMax.staggerTo('.pro2_img img', .6, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      display: 'inline-block',
      delay: .2
    }, .08);
    TweenMax.staggerTo(".pro2 .pro_right_tex p", .6, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      x: 0,
      rotation: 0
    }, .03);
  } else if ($('.smb3').hasClass("box_on")) {
    TweenMax.staggerTo('.te3 span', .5, {
      ease: Power2.easeOut,
      opacity: 0,
      y: -100,
      scale: 1,
      delay: .02
    }, .03);
    TweenMax.staggerTo('.pro3', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'flex'
    }, .03);
    TweenMax.staggerTo('.project', 1, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'flex'
    }, .03);
    TweenMax.staggerTo('.pro3_img img', .6, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      display: 'inline-block',
      delay: .2
    }, .08);
    TweenMax.staggerTo(".pro3 .pro_right_tex p", .6, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      x: 0,
      rotation: 0
    }, .03);
  }
  if (isMobileSize) {
    $('.img_box').css('width', '100vw');
    $('.img_box').css('height', '50vh');
    $('.img_box img').css('width', '100vw');
    $('.img_box img').css('height', '50vh');
    if ($('.smb1').hasClass("box_on")) {
      TweenMax.staggerTo('.te1 span', .5, {
        ease: Power2.easeOut,
        opacity: 0,
        y: -100,
        scale: 1,
        delay: .02
      }, .03);
      TweenMax.staggerTo('.pro1', 1, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.project', 1, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.pro1_img img', .6, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        display: 'inline-block',
        delay: .2
      }, .08);
      TweenMax.staggerTo(".pro1 .pro_right_tex p", .6, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0
      }, .03);
    } else if ($('.smb2').hasClass("box_on")) {
      TweenMax.staggerTo('.te2 span', .5, {
        ease: Power2.easeOut,
        opacity: 0,
        y: -100,
        scale: 1,
        delay: .02
      }, .03);
      TweenMax.staggerTo('.pro2', 1, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.project', 1, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.pro2_img img', .6, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        display: 'inline-block',
        delay: .2
      }, .08);
      TweenMax.staggerTo(".pro2 .pro_right_tex p", .6, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0
      }, .03);
    } else if ($('.smb3').hasClass("box_on")) {
      TweenMax.staggerTo('.te3 span', .5, {
        ease: Power2.easeOut,
        opacity: 0,
        y: -100,
        scale: 1,
        delay: .02
      }, .03);
      TweenMax.staggerTo('.pro3', 1, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.project', 1, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.pro3_img img', .6, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        display: 'inline-block',
        delay: .2
      }, .08);
      TweenMax.staggerTo(".pro3 .pro_right_tex p", .6, {
        ease: Power2.easeOut,
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0
      }, .03);
    }
  }
})
/*画面03→画面02*/
$windowWidth = window.innerWidth;
$breakPointA = 568;
$breakPointB = 768;
isMobileSize = ($windowWidth < $breakPointA);
isTabletSize = ($windowWidth <= $breakPointB) && ($windowWidth > $breakPointA);
isPcSize = ($windowWidth > $breakPointB);


$('.back').click(function () {

  $('.img_box').toggleClass("on_mode");
  $('.works').css('top', '8vh');
  //	$('.works_img').css('top', '10vh');
  //	$('.works_img').css('height', '90vh');
  $('.img_box').css('width', '18vw');
  $('.img_box').css('height', '10vw');
  $('.img_box img').css('height', 'auto');
  $('.img_box img').css('width', '100%');
  $('.img_box').css('top', 'auto');
  $('.img_box').css('left', 'auto');
  $('.img_box img').css('filter', 'grayscale(0)');
  TweenMax.staggerTo('#stalker', 1, {
    ease: Power2.easeOut,
    opacity: 1,
    delay: .4
  });
	TweenMax.staggerTo(".pro1_ma img", .6, {y: 0,x: 0,rotation: 0});
	TweenMax.staggerTo(".pro2_ma img", .6, {y: 0,x: 0,rotation: 0});
	TweenMax.staggerTo(".pro3_ma img", .6, {y: 0,x: 0,rotation: 0});
  $('.works_img').css('background', 'none');
  $('.works_img').css('z-index', '10');
  TweenMax.staggerTo('#stalker', 1, {
    ease: Power2.easeOut,
    opacity: 1,
    display: 'inline-block'
  });
  //禁止解除
  $('body').css('overflow', 'auto');
  $(window).off('.noScroll');
  //画面02要素
  TweenMax.staggerTo('.works_title_sub', .5, {
    ease: Power2.easeOut,
    opacity: 1,
    y: 0,
    scale: 1,
    delay: .01
  }, .05);
  TweenMax.staggerTo('.img_text', .5, {
    ease: Power2.easeOut,
    opacity: 1,
    y: 0,
    scale: 1,
    delay: .02
  }, .03);
  //
  $('.de_te_co').toggleClass("open");
  TweenMax.staggerTo('.works_title', .4, {
    ease: Power1.easeOut,
    opacity: 1,
    y: 0,
    scale: 1
  }, .01);
  TweenMax.staggerTo('.project_co', .5, {
    ease: Power2.easeOut,
    opacity: 0,
    display: 'none'
  }, .03);
  TweenMax.staggerTo('.project', .5, {
    ease: Power2.easeOut,
    opacity: 0,
    display: 'none'
  }, .03);
  TweenMax.staggerTo('.pro_smb_img img', 0, {
    ease: Power2.easeOut,
    opacity: 1,
    display: 'none',
    y: 50
  }, .0);
  if ($('.smb1').hasClass("box_on")) {
    TweenMax.staggerTo('.te1 span', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      scale: 1,
      delay: .02
    }, .03);
    TweenMax.staggerTo('.box_on p', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: 0,
      scale: 1
    }, .1);
    TweenMax.staggerTo('.box_off p', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: 0,
      scale: 1
    }, .1);
    $('.no01').addClass("on");
    $('.no01').removeClass("off");
    $('.no02').addClass("off");
    $('.no02').toggleClass("on");
    $('.no03').addClass("off");
    $('.no03').toggleClass("on");
  } else if ($('.smb2').hasClass("box_on")) {
    TweenMax.staggerTo('.te2 span', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      scale: 1,
      delay: .02
    }, .03);
    TweenMax.staggerTo('.box_on p', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: 0,
      scale: 1
    }, .1);
    TweenMax.staggerTo('.box_off p', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: 0,
      scale: 1
    }, .1);
    $('.no02').addClass("on");
    $('.no02').removeClass("off");
    $('.no03').addClass("off");
    $('.no03').toggleClass("on");
    $('.no01').addClass("off");
    $('.no01').toggleClass("on");
  } else if ($('.smb3').hasClass("box_on")) {
    TweenMax.staggerTo('.te3 span', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      y: 0,
      scale: 1,
      delay: .02
    }, .03);
    TweenMax.staggerTo('.box_on p', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: 0,
      scale: 1
    }, .1);
    TweenMax.staggerTo('.box_off p', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: 0,
      scale: 1
    }, .1);
    $('.no03').addClass("on");
    $('.no03').removeClass("off");
    $('.no02').addClass("off");
    $('.no02').toggleClass("on");
    $('.no01').addClass("off");
    $('.no01').toggleClass("on");
  }
  if (isMobileSize) {
    $('.img_box').css('width', '78vw');
    $('.img_box').css('height', '40vw');
    $('.works').css('top', '0');
  }
});
/*メニュー*/
$('.menu_btn').click(function () {
  if ($('.menu_btn').hasClass("offmode")) {
    $('.menu_contents').css('display', 'block');
    $('.menu_btn').css('color', 'white');
    $('.menu_btn').toggleClass("offmode");
    $(window).on('touchmove.noScroll', function (e) {
      e.preventDefault();
    });
    $('body').css('overflow', 'hidden');
    TweenMax.staggerTo('.menu_bg', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: vh(0)
    }, .03);
    TweenMax.staggerTo('.menu_contents', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: vh(0),
      delay: .2
    }, .03);
    TweenMax.staggerTo('.menu_contents', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: vh(0),
      delay: .2
    }, .03);
    TweenMax.staggerFrom('.menu_sub_title span', .4, {
      ease: Power1.easeOut,
      opacity: 1,
      y: vh(0),
      delay: .2
    }, .03);
    TweenMax.staggerFromTo(".menu_contents_bottom ul li a", 0.4, {
      opacity: 0,
      y: -50
    }, {
      opacity: 1,
      y: 0
    }, 0.05)
  } else {
    //ifでimg_boxが開いてたらスクロール禁止は解かないという処理にする
    TweenMax.staggerTo('.menu_bg', .4, {
      ease: Power1.easeOut,
      opacity: 0,
      y: vh(-100)
    }, .03);
    TweenMax.staggerTo('.menu_contents', .4, {
      ease: Power1.easeOut,
      opacity: 0,
      y: vh(0)
    }, .03);
    $('.menu_btn').css('color', 'black');
    $('.menu_btn').toggleClass("offmode");
    $('.menu_contents').css('display', 'none');
    if ($('.de_te_co').hasClass("open")) {} else {
      $('body').css('overflow', 'auto');
      $(window).off('.noScroll');
    }
  }
});
$(function () {
  $('.menu_btn').hover(function () {
    TweenMax.staggerTo('#stalker', 0, {
      ease: Power2.easeOut,
      opacity: 0
    });
  }, function () {
    TweenMax.staggerTo('#stalker', 0, {
      ease: Power2.easeOut,
      opacity: 1
    });
  });
});
/*メニューマウス*/
$(function () {
  $('.link1').hover(function () {
    TweenMax.staggerTo('.link2', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      x: vw(0)
    });
    TweenMax.staggerTo('.link3', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      x: vw(-10)
    });
    if (isMobileSize) {
      TweenMax.staggerTo('.link2', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        x: vw(0)
      });
      TweenMax.staggerTo('.link3', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        x: vw(0)
      });
    }
  }, function () {
    TweenMax.staggerTo('.link2', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      x: vw(-10)
    });
    TweenMax.staggerTo('.link3', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      x: vw(-20)
    });
    if (isMobileSize) {
      TweenMax.staggerTo('.link2', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        x: vw(-0)
      });
      TweenMax.staggerTo('.link3', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        x: vw(-00)
      });
    }
  });
});
$(function () {
  $('.link2').hover(function () {
    TweenMax.staggerTo('.link3', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      x: vw(-10)
    });
    if (isMobileSize) {
      TweenMax.staggerTo('.link3', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        x: vw(0)
      });
    }
  }, function () {
    TweenMax.staggerTo('.link3', .5, {
      ease: Power2.easeOut,
      opacity: 1,
      x: vw(-20)
    });
    if (isMobileSize) {
      TweenMax.staggerTo('.link3', .5, {
        ease: Power2.easeOut,
        opacity: 1,
        x: vw(0)
      });
    }
  });
});
$(function () {
  $('.link3').hover(function () {}, function () {});
});
/*ストーカー*/
var centerx = 0;
var centery = 0;
document.addEventListener("mousemove", (event) => {
  centerx = (window.innerWidth / 2) - event.pageX;
});
document.addEventListener("mousemove", (event) => {
  centery = (window.innerHeight / 2) - event.pageY;
});
$(".wo_prev").mousemove(function (e) {
  stalker.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
  $('.st_arrow').css('transform', 'rotate(' + centerx / -8 + 'deg)');
  TweenMax.staggerTo('.st_arrow', 1, {
    ease: Power4.easeOut,
    opacity: 1
  }, .0);
});
$(".wo_next").mousemove(function (e) {
  stalker.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
  $('.st_arrow').css('transform', 'rotate(' + centerx / -8 + 'deg)');
  TweenMax.staggerTo('.st_arrow', 1, {
    ease: Power4.easeOut,
    opacity: 1
  }, .0);
});
$(".img_box").mousemove(function (e) {
  stalker.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
  TweenMax.staggerTo('.st_arrow', 0, {
    ease: Power4.easeOut,
    opacity: 0,
    y: vh(-4)
  }, .0);
});
/*pro*/
$('.pro_next').click(function () {
  if ($('.smb1').hasClass("box_on")) {
    $('.smb1').addClass("box_off");
    $('.smb1').toggleClass("box_on");
    $('.smb2').addClass("box_on");
    $('.smb2').toggleClass("box_off");

    TweenMax.fromTo(".pro1_ma img", .6, {
      y: 0,
      x: 0,
      rotation: 0
    }, {
      y: -10,
      x: 10,
      rotation: 5
    });
    TweenMax.fromTo(".pro2_ma img", .6, {
      y: 10,
      x: -10,
      rotation: -5
    }, {
      y: 0,
      x: 0,
      rotation: 0
    });
    
    TweenMax.fromTo(".smb1 img", .6, {
      y: 0,
      x: 0,
      rotation: 0
    }, {
      y: -10,
      x: 10,
      rotation: 5
    });
    TweenMax.fromTo(".smb2 img", .6, {
      y: 10,
      x: -10,
      rotation: -5
    }, {
      y: 0,
      x: 0,
      rotation: 0
    });
    TweenMax.staggerTo('.pro1', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      display: 'none'
    }, .03);
    TweenMax.staggerTo('.pro3', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      display: 'none'
    }, .03);
    TweenMax.staggerTo('.pro2', 0, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'flex'
    }, .03);
    TweenMax.staggerTo('.pro1_img img', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      delay: .2,
      y: 50
    }, .0);
    TweenMax.staggerTo('.pro3_img img', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      delay: .2,
      y: 50
    }, .0);
    TweenMax.staggerTo('.pro2_img img', .6, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'inline-block',
      delay: .2,
      y: 0
    }, .1);
    $('.te2').css('display', 'block');
    TweenMax.staggerTo('.te1', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te1 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te3', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te3 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te2', 1, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.te2 span', 1, {
      ease: Power2.easeOut,
      opacity: 0,
      y: -100,
      scale: 1,
      delay: .2,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo(".pro2 .pro_right_tex p", 1, {
      ease: Power4.easeOut,
      opacity: 1,
      y: 0,
      x: 0,
      rotation: 0
    });
    TweenMax.staggerTo(".pro1 .pro_right_tex p", 1, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 10,
      x: 0,
      rotation: 0
    });
    TweenMax.staggerTo(".pro3 .pro_right_tex p", 1, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 10,
      x: 0,
      rotation: 0
    });
  } else if ($('.smb2').hasClass("box_on")) {
    $('.smb2').addClass("box_off");
    $('.smb2').toggleClass("box_on");
    $('.smb3').addClass("box_on");
    $('.smb3').toggleClass("box_off");
    
        TweenMax.fromTo(".pro2_ma img", .6, {
      y: 0,
      x: 0,
      rotation: 0
    }, {
      y: -10,
      x: 10,
      rotation: 5
    });
    TweenMax.fromTo(".pro3_ma img", .6, {
      y: 10,
      x: -10,
      rotation: -5
    }, {
      y: 0,
      x: 0,
      rotation: 0
    });
    
    
    TweenMax.fromTo(".smb2 img", .6, {
      y: 0,
      x: 0,
      rotation: 0
    }, {
      y: -10,
      x: 10,
      rotation: 5
    });
    TweenMax.fromTo(".smb3 img", .6, {
      y: 10,
      x: -10,
      rotation: -5
    }, {
      y: 0,
      x: 0,
      rotation: 0
    });
    TweenMax.staggerTo('.pro1', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      display: 'none',
    }, .03);
    TweenMax.staggerTo('.pro2', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      display: 'none',
    }, .03);
    TweenMax.staggerTo('.pro3', 0, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'flex',
    }, .03);
    TweenMax.staggerTo('.pro1_img img', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      delay: .2,
      y: 50
    }, .0);
    TweenMax.staggerTo('.pro2_img img', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      delay: .2,
      y: 50
    }, .0);
    TweenMax.staggerTo('.pro3_img img', .6, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'inline-block',
      delay: .2,
      y: 0
    }, .1);
    $('.te3').css('display', 'block');
    TweenMax.staggerTo('.te1', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te1 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te2', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te2 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te3', 1, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.te3 span', 1, {
      ease: Power2.easeOut,
      opacity: 0,
      y: -100,
      scale: 1,
      delay: .2,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo(".pro3 .pro_right_tex p", 1, {
      ease: Power4.easeOut,
      opacity: 1,
      y: 0,
      x: 0,
      rotation: 0
    });
    TweenMax.staggerTo(".pro1 .pro_right_tex p", 1, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 10,
      x: 0,
      rotation: 0
    });
    TweenMax.staggerTo(".pro2 .pro_right_tex p", 1, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 10,
      x: 0,
      rotation: 0
    });
  } else if ($('.smb3').hasClass("box_on")) {
    $('.smb3').addClass("box_off");
    $('.smb3').toggleClass("box_on");
    $('.smb1').addClass("box_on");
    $('.smb1').toggleClass("box_off");
    TweenMax.fromTo(".pro3_ma img", .6, {
      y: 0,
      x: 0,
      rotation: 0
    }, {
      y: -10,
      x: 10,
      rotation: 5
    });
    TweenMax.fromTo(".pro1_ma img", .6, {
      y: 10,
      x: -10,
      rotation: -5
    }, {
      y: 0,
      x: 0,
      rotation: 0
    });
    
    
    TweenMax.fromTo(".smb3 img", .6, {
      y: 0,
      x: 0,
      rotation: 0
    }, {
      y: -10,
      x: 10,
      rotation: 5
    });
    TweenMax.fromTo(".smb1 img", .6, {
      y: 10,
      x: -10,
      rotation: -5
    }, {
      y: 0,
      x: 0,
      rotation: 0
    });
    TweenMax.staggerTo('.pro2', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      display: 'none',
    }, .03);
    TweenMax.staggerTo('.pro3', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      display: 'none',
    }, .03);
    TweenMax.staggerTo('.pro1', 0, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'flex',
    }, .03);
    TweenMax.staggerTo('.pro2_img img', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      delay: .2,
      y: 50
    }, .0);
    TweenMax.staggerTo('.pro3_img img', 0, {
      ease: Power2.easeOut,
      opacity: 0,
      delay: .2,
      y: 50
    }, .0);
    TweenMax.staggerTo('.pro1_img img', .6, {
      ease: Power2.easeOut,
      opacity: 1,
      display: 'inline-block',
      delay: .2,
      y: 0
    }, .1);
    $('.te1').css('display', 'block');
    TweenMax.staggerTo('.te3', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te3 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te3', 0, {
      ease: Power2.easeOut,
      display: 'none'
    }, );
    TweenMax.staggerTo('.te3 span', 0, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 0,
      scale: 1
    }, .03);
    TweenMax.staggerTo('.te1', 1, {
      ease: Power2.easeOut,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo('.te1 span', 1, {
      ease: Power2.easeOut,
      opacity: 0,
      y: -100,
      scale: 1,
      delay: .2,
      display: 'inline-block'
    }, .03);
    TweenMax.staggerTo(".pro1 .pro_right_tex p", 1, {
      ease: Power4.easeOut,
      opacity: 1,
      y: 0,
      x: 0,
      rotation: 0
    });
    TweenMax.staggerTo(".pro2 .pro_right_tex p", 1, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 10,
      x: 0,
      rotation: 0
    });
    TweenMax.staggerTo(".pro3 .pro_right_tex p", 1, {
      ease: Power4.easeOut,
      opacity: 0,
      y: 10,
      x: 0,
      rotation: 0
    });
  }
  if (isMobileSize) {
    if ($('.smb1').hasClass("box_on")) {
      $('.smb1').addClass("box_off");
      $('.smb1').toggleClass("box_on");
      $('.smb2').addClass("box_on");
      $('.smb2').toggleClass("box_off");
      TweenMax.fromTo(".smb1 img", .6, {
        y: 0,
        x: 0,
        rotation: 0
      }, {
        y: -10,
        x: 10,
        rotation: 5
      });
      TweenMax.fromTo(".smb2 img", .6, {
        y: 10,
        x: -10,
        rotation: -5
      }, {
        y: 0,
        x: 0,
        rotation: 0
      });
      TweenMax.staggerTo('.pro1', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        display: 'none'
      }, .03);
      TweenMax.staggerTo('.pro3', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        display: 'none'
      }, .03);
      TweenMax.staggerTo('.pro2', 0, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.pro1_img img', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        delay: .2,
        y: 50
      }, .0);
      TweenMax.staggerTo('.pro3_img img', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        delay: .2,
        y: 50
      }, .0);
      TweenMax.staggerTo('.pro2_img img', .6, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block',
        delay: .2,
        y: 0
      }, .1);
      $('.te2').css('display', 'block');
      TweenMax.staggerTo('.te1', 0, {
        ease: Power2.easeOut,
        display: 'none'
      }, );
      TweenMax.staggerTo('.te1 span', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: 1
      }, .03);
      TweenMax.staggerTo('.te3', 0, {
        ease: Power2.easeOut,
        display: 'none'
      }, );
      TweenMax.staggerTo('.te3 span', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: 1
      }, .03);
      TweenMax.staggerTo('.te2', 1, {
        ease: Power2.easeOut,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.te2 span', 1, {
        ease: Power2.easeOut,
        opacity: 0,
        y: -100,
        scale: 1,
        delay: .2,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo(".pro2 .pro_right_tex p", 1, {
        ease: Power4.easeOut,
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0
      });
      TweenMax.staggerTo(".pro1 .pro_right_tex p", 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 10,
        x: 0,
        rotation: 0
      });
      TweenMax.staggerTo(".pro3 .pro_right_tex p", 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 10,
        x: 0,
        rotation: 0
      });
    } else if ($('.smb2').hasClass("box_on")) {
      $('.smb2').addClass("box_off");
      $('.smb2').toggleClass("box_on");
      $('.smb3').addClass("box_on");
      $('.smb3').toggleClass("box_off");
      TweenMax.fromTo(".smb2 img", .6, {
        y: 0,
        x: 0,
        rotation: 0
      }, {
        y: -10,
        x: 10,
        rotation: 5
      });
      TweenMax.fromTo(".smb3 img", .6, {
        y: 10,
        x: -10,
        rotation: -5
      }, {
        y: 0,
        x: 0,
        rotation: 0
      });
      TweenMax.staggerTo('.pro1', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        display: 'none',
      }, .03);
      TweenMax.staggerTo('.pro2', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        display: 'none',
      }, .03);
      TweenMax.staggerTo('.pro3', 0, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block',
      }, .03);
      TweenMax.staggerTo('.pro1_img img', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        delay: .2,
        y: 50
      }, .0);
      TweenMax.staggerTo('.pro2_img img', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        delay: .2,
        y: 50
      }, .0);
      TweenMax.staggerTo('.pro3_img img', .6, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block',
        delay: .2,
        y: 0
      }, .1);
      $('.te3').css('display', 'block');
      TweenMax.staggerTo('.te1', 0, {
        ease: Power2.easeOut,
        display: 'none'
      }, );
      TweenMax.staggerTo('.te1 span', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: 1
      }, .03);
      TweenMax.staggerTo('.te2', 0, {
        ease: Power2.easeOut,
        display: 'none'
      }, );
      TweenMax.staggerTo('.te2 span', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: 1
      }, .03);
      TweenMax.staggerTo('.te3', 1, {
        ease: Power2.easeOut,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.te3 span', 1, {
        ease: Power2.easeOut,
        opacity: 0,
        y: -100,
        scale: 1,
        delay: .2,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo(".pro3 .pro_right_tex p", 1, {
        ease: Power4.easeOut,
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0
      });
      TweenMax.staggerTo(".pro1 .pro_right_tex p", 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 10,
        x: 0,
        rotation: 0
      });
      TweenMax.staggerTo(".pro2 .pro_right_tex p", 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 10,
        x: 0,
        rotation: 0
      });
    } else if ($('.smb3').hasClass("box_on")) {
      $('.smb3').addClass("box_off");
      $('.smb3').toggleClass("box_on");
      $('.smb1').addClass("box_on");
      $('.smb1').toggleClass("box_off");
      TweenMax.fromTo(".smb3 img", .6, {
        y: 0,
        x: 0,
        rotation: 0
      }, {
        y: -10,
        x: 10,
        rotation: 5
      });
      TweenMax.fromTo(".smb1 img", .6, {
        y: 10,
        x: -10,
        rotation: -5
      }, {
        y: 0,
        x: 0,
        rotation: 0
      });
      TweenMax.staggerTo('.pro2', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        display: 'none',
      }, .03);
      TweenMax.staggerTo('.pro3', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        display: 'none',
      }, .03);
      TweenMax.staggerTo('.pro1', 0, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block',
      }, .03);
      TweenMax.staggerTo('.pro2_img img', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        delay: .2,
        y: 50
      }, .0);
      TweenMax.staggerTo('.pro3_img img', 0, {
        ease: Power2.easeOut,
        opacity: 0,
        delay: .2,
        y: 50
      }, .0);
      TweenMax.staggerTo('.pro1_img img', .6, {
        ease: Power2.easeOut,
        opacity: 1,
        display: 'inline-block',
        delay: .2,
        y: 0
      }, .1);
      $('.te1').css('display', 'block');
      TweenMax.staggerTo('.te3', 0, {
        ease: Power2.easeOut,
        display: 'none'
      }, );
      TweenMax.staggerTo('.te3 span', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: 1
      }, .03);
      TweenMax.staggerTo('.te3', 0, {
        ease: Power2.easeOut,
        display: 'none'
      }, );
      TweenMax.staggerTo('.te3 span', 0, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 0,
        scale: 1
      }, .03);
      TweenMax.staggerTo('.te1', 1, {
        ease: Power2.easeOut,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo('.te1 span', 1, {
        ease: Power2.easeOut,
        opacity: 0,
        y: -100,
        scale: 1,
        delay: .2,
        display: 'inline-block'
      }, .03);
      TweenMax.staggerTo(".pro1 .pro_right_tex p", 1, {
        ease: Power4.easeOut,
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0
      });
      TweenMax.staggerTo(".pro2 .pro_right_tex p", 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 10,
        x: 0,
        rotation: 0
      });
      TweenMax.staggerTo(".pro3 .pro_right_tex p", 1, {
        ease: Power4.easeOut,
        opacity: 0,
        y: 10,
        x: 0,
        rotation: 0
      });
    }
  }
});
/*pro_next_smb*/
$(".pro_next").mousemove(function (hover) {
  TweenMax.staggerTo('.pro_smb_next_img', 1, {
    ease: Power2.easeOut,
    opacity: 1
  });
  $('.pro_smb_next_img').css('transform', 'translate(' + hover.clientX + 'px, ' + hover.clientY + 'px)');
});
$(".pro_next").mouseout(function (hover) {
  TweenMax.staggerTo('.pro_smb_next_img', 1, {
    ease: Power2.easeOut,
    opacity: 0
  });
});
/*hover*/
/*p_area*/
$('.pro1_01').on('mousemove', function () {
  $('.pro1_ma').children('img').attr('src', 'img/p_01.png');
});
$('.pro1_02').on('mousemove', function () {
  $('.pro1_ma').children('img').attr('src', 'img/p/p_01.gif');
});
$('.pro1_03').on('mousemove', function () {
  $('.pro1_ma').children('img').attr('src', 'img/p/03.gif');
});
$('.pro1_04').on('mousemove', function () {
  $('.pro1_ma').children('img').attr('src', 'img/p/04.gif');
});

$('.pro1_01').on('mouseleave', function () {
  $('.pro1_ma').children('img').attr('src', 'img/p/p_01.gif');
});
$('.pro1_02').on('mouseleave', function () {
  $('.pro1_ma').children('img').attr('src', 'img/p/p_01.gif');
});
$('.pro1_03').on('mouseleave', function () {
  $('.pro1_ma').children('img').attr('src', 'img/p/03.gif');
});
$('.pro1_04').on('mouseleave', function () {
  $('.pro1_ma').children('img').attr('src', 'img/p/04.gif');
});
/**/
/*n_area*/
$('.pro2_01').on('mousemove', function () {
  $('.pro2_ma').children('img').attr('src', 'img/n/01.png');
});
$('.pro2_02').on('mousemove', function () {
  $('.pro2_ma').children('img').attr('src', 'img/n/02.png');
});
$('.pro2_03').on('mousemove', function () {
  $('.pro2_ma').children('img').attr('src', 'img/n/03.png');
});
$('.pro2_01').on('mouseleave', function () {
  $('.pro2_ma').children('img').attr('src', 'img/n/01.png');
});
$('.pro2_02').on('mouseleave', function () {
  $('.pro2_ma').children('img').attr('src', 'img/n/02.png');
});
$('.pro2_03').on('mouseleave', function () {
  $('.pro2_ma').children('img').attr('src', 'img/n/03.png');
});
/**/
/*m_area*/
$('.pro3_01').on('mousemove', function () {
  $('.pro3_ma').children('img').attr('src', 'img/m/m-01.gif');
});
$('.pro3_02').on('mousemove', function () {
  $('.pro3_ma').children('img').attr('src', 'img/m/02.gif');
});
$('.pro3_03').on('mousemove', function () {
  $('.pro3_ma').children('img').attr('src', 'img/m/03.gif');
});
$('.pro3_04').on('mousemove', function () {
  $('.pro3_ma').children('img').attr('src', 'img/m/04.gif');
});
$('.pro3_01').on('mouseleave', function () {
  $('.pro3_ma').children('img').attr('src', 'img/m/m-01.gif');
});
$('.pro3_02').on('mouseleave', function () {
  $('.pro3_ma').children('img').attr('src', 'img/m/02.gif');
});
$('.pro3_03').on('mouseleave', function () {
  $('.pro3_ma').children('img').attr('src', 'img/m/03.gif');
});
$('.pro3_04').on('mouseleave', function () {
  $('.pro3_ma').children('img').attr('src', 'img/m/04.gif');
});
/*about*/
$(window).on('scroll', function () {
  $('.about_link_bar').each(function () {
    var scroll = $(window).scrollTop();
    var movettl = Math.round(scroll * 0.2);
    $('.about_link_bar img').css('transform', 'translate3d(' + movettl * -3 + 'px,0px,0px)');
  });
  $('.mv_point').each(function () {
    var scroll = $(window).scrollTop();
    var movettl = Math.round(scroll * 0.2);
    $('.mv_point span').css('transform', 'rotate(' + movettl * -5 + 'deg)');
  });
});
$(function () {
  $('.menu-trigger').on('click', function () {
    $(this).toggleClass('active');
    return false;
  });
});