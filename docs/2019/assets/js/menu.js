/*
 *
 * メニューjs
 *
 */
/* --------------------------------------------------- */
/* pc=nav sm,tab=top                                           
/* --------------------------------------------------- */
$(function () {
  var ua = navigator.userAgent;
  if (ua.indexOf('iPhone') > -1 || ua.indexOf('Android') > -1 && ua.indexOf('Mobile') > -1 || ua.indexOf('iPad') > -1 || ua.indexOf('Android') > -1) {
    // SP,TBLETの処理

    // メニューの開閉	
    $('.gnav-ul > li').click(function () {
      $(this).children('ul').slideToggle();
      $(this).siblings().children('ul').slideUp();
    });
    // ハンバーガーメニューの開閉
    $('#js__sideMenuBtn').on('click', function () {
      $('.gnav').slideToggle();
      $('body').toggleClass('gnav-open');
    });
    // オーバーレイ
    $('#js__overlay').on('click', function () {
      $('.gnav').slideUp();
      $('body').removeClass('gnav-open');
    });

  } else {

    // PCの処理
	  
    // メニュー
    var $win = $(window);

    $win.on('load resize', function () {
      var windowWidth = window.innerWidth;

      if (windowWidth > 1001) {

        // 961px以上の処理　▼▼▼

        $('.gnav-ul > li').removeClass('active');
        $('.gnav-ul > li').unbind("click");
        $('.gnav-ul-child').slideUp(0);		  

        // メニューの開閉	
        var nav = $('.gnav-ul');
        $('li', nav)
          .mouseover(function () {
            $('ul', this).stop().slideDown('fast');
          })
          .mouseout(function () {
            $('ul', this).stop().slideUp('fast');
          });

        $(document).ready(function () {
          $(".gnav-ul-child").hover(
            function () {
              $(this).parent("li").addClass("current2");
            },
            function () {
              $(this).parent("li").removeClass("current2");
            }
          );
        });
        // 961px以上の処理 ▲▲▲

      } else {

        // 960px以下の処理　▼▼▼
        $('#js__sideMenuBtn').unbind("click");
        $('.gnav-ul > li').unbind("mouseover");
        $('.gnav-ul > li').unbind("mouseout");
        $('.gnav-ul > li').unbind("click");
		  $('.gnav-ul-child').removeAttr('style');
	
        // メニューの開閉
         $('.gnav-ul > li').click(function () {
          $(this).toggleClass('active');
          $(this).children('.gnav-ul-child').delay(100).slideToggle();
        });		  

        // ハンバーガーメニューの開閉
        $('#js__sideMenuBtn').on('click', function () {
          $('.gnav').slideToggle();
          $('.gnav-ul-child').slideUp();
          $('.gnav-ul > li').removeClass('active');
          $('body').toggleClass('gnav-open');
        });

        // オーバーレイ
        $('#js__overlay').on('click', function () {
          $('.gnav').slideUp();
          $('.gnav-ul-child').slideUp();
          $('.gnav-ul > li').removeClass('active');
          $('body').removeClass('gnav-open');
        });

        // 960px以下の処理 ▲▲▲ 

      }
    });
  }
})

// ページ内リンクメニューの閉
		  $('.gnav-ul-child > li').click(function () {
          $('body').removeClass('gnav-open');
			  $('.gnav').slideUp();
        });

/* リンク無効 */
//$('.gnav-ul > li.current > a,.gnav-ul-child li.current a').click(function () {
//return false;
//});
