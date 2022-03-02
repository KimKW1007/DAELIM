(($,window,document,undefined)=>{

  class Dealim {
    init(){
      this.header();
      this.section1();
      this.section2();
      this.section3();
      this.footer();
      this.goTop();
      this.mobile();
      /* 
     @@@@@@@@@ a태그 임시 차단 @@@@@@@@@
    @@@@@@@@@ 나중에 풀어야 합니다. @@@@@@@@@
      */
      $('#wrap').on({
        click(e){
          e.preventDefault();
        }
      })
    }
    header(){
      const $window = $(window),
            $header = $('#header'),
            nav = $header.find('#nav'),
            main_menu = nav.find('.main_menu'),
            m_menu_btn = main_menu.find(' >a'),
            sub_box = main_menu.find('.sub_box'),
            s_menu_btn = sub_box.find('a'),
            langs_box = $header.find('.langs_box'),
            select_lang = langs_box.find('.select_lang'),
            scrollEnd = ($(document).height() - $(window).height());/* 스크롤 끝감지 */

       let lastScroll; 

          /* header hide event */
            $window.on({
              scroll(){
              let nowScroll = $(this).scrollTop();
                if(lastScroll - nowScroll >= 0 || nowScroll == scrollEnd){ /* 마우스 올리거나 스크롤 끝에 가면 내려옴 */
                  $header.removeClass('up')
                }else{            /* 마우스 내리면 헤더 올라감 */
                  $header.addClass('active');
                  $header.addClass('up');
                  sub_box.stop().slideUp(400)
                  select_lang.removeClass('active')
                }
                if(nowScroll == 0 ){
                  $header.removeClass('active')
                }
                lastScroll = nowScroll;
              }
            })
            
            /* 서브메뉴 슬라이드 */
            nav.on({
              mouseenter(){
                sub_box.stop().slideDown(400)
              }
            })
            $header.on({
              mouseleave(){
                sub_box.stop().slideUp(400)
              }
            })

            /* lang slide event in css */
            select_lang.on({
              mouseenter(){
                select_lang.addClass('active')
              },
              mouseleave(){
                select_lang.removeClass('active')
              }
            })

         
    }
    section1(){
      const slide_container = $('.slide_container'),
            slide_view = slide_container.find('.slide_view'),
            slide_wrap = slide_view.find('.slide_wrap'),
            slides = slide_wrap.find('.slide'),
            slideLength = slides.length,
            indicator = slide_container.find('.indicator'),
            page_btn = indicator.find('.page_btn'),
            play_btn = indicator.find('.play_btn'),
            view_more_btn = slide_container.find('view_more_btn');


        // m = mouse, 
        let cnt = 0,
            second = 0,
            timer,
            reStart,
            mStart,
            mEnd,
            slide_re_width,
            slide_re_height;



            function resizeFn(){
                slide_re_width = $(window).innerWidth();
                if( $(window).innerWidth() < 900){
                  slide_re_height = $(window).height()*0.871768355739;
                }else{
                  slide_re_height = slide_re_width*0.4390625;
                }
                slide_container.css({width : slide_re_width, height : slide_re_height})
            }
            resizeFn()
            $(window).on({
              resize(){
                resizeFn()
              }
            })
        


            /* 메인슬라이드 */
            function mainSlide(index){
              let nextCnt;
                if( index == undefined){
                  nextCnt = (cnt+1) % slideLength;
                }else{
                  nextCnt = index;
                }
                if(!slides.is(':animated')){
                  slides.eq(cnt).css({zIndex:1}).removeClass('show').stop().animate({backgroundPosition:88+'%'},1000,function(){
                    slides.css({backgroundPosition:48+'%'})
                  })
                  slides.eq(nextCnt).css({zIndex:2}).addClass('show').stop().animate({backgroundPosition:68+'%'},1000);
                  cnt = nextCnt;
                  pageFn()
                 }
            }

           

            /* 페이지버튼 이벤트 */
            page_btn.each(function(idx){
              $(this).on({
                click(e){
                  e.preventDefault();
                    mainSlide(idx)
                    chkStart()
                }
              })
            })
            function pageFn(){
              page_btn.removeClass('active');
              page_btn.eq(cnt).addClass('active');
            }



            /* 웹버전 터치이벤트 */
            slide_view.on({
              mousedown(e){
                mStart = e.clientX; 
              },
              mouseup(e){
                mEnd = e.clientX; 
                if(mStart - mEnd > 0){
                  if(cnt >= slideLength - 1){
                    mainSlide(0)
                    chkStart()
                  }else{
                    mainSlide(cnt + 1)
                    chkStart()
                  }
                }
                if(mStart - mEnd < 0){
                  if(cnt < 0){
                    mainSlide(slideLength - 1)
                    chkStart()
                  }else{
                    mainSlide(cnt - 1)
                    chkStart()
                  }
                }
              }
            })
            slide_view.on({
              touchstart(e){
                mStart = e.originalEvent.touches[0].clientX; 
              },
              touchend(e){
                mEnd = e.originalEvent.changedTouches[0].clientX; 
                console.log(e.originalEvent);
                if(mStart - mEnd > 0){
                  if(cnt >= slideLength - 1){
                    mainSlide(0)
                    chkStart()
                  }else{
                    mainSlide(cnt + 1)
                    chkStart()
                  }
                }
                if(mStart - mEnd < 0){
                  if(cnt < 0){
                    mainSlide(slideLength - 1)
                    chkStart()
                  }else{
                    mainSlide(cnt - 1)
                    chkStart()
                  }
                }
              }
            })
          

            /* 플레이 퍼즈 버튼이벤트 */
            play_btn.on({
              click(e){
                e.preventDefault();
                $(this).toggleClass('pause');
                chkStart()
              }
            })

            /* pause가 걸려있는지 확인하는 함수 */
            function chkStart(){
              if(play_btn.hasClass('pause')){
                clearInterval(timer)
              }else{
                stopRestart()
              }
            }
           
            /* 자동슬라이드 */
            function autoTimer(){
              timer = setInterval(mainSlide,4000)
            }
            autoTimer()


            /* 페이지버튼 이나 터치슬라이드 이벤트시 잠시정지후 다시시작 */
            function stopRestart(){
              clearInterval(timer);
              clearInterval(reStart);
              second = 0;
              reStart = setInterval(function(){
                second++;
                if(second == 2){
                  if(play_btn.hasClass('pause')){
                    clearInterval(timer);
                    clearInterval(reStart);
                  }else{
                    autoTimer();
                    clearInterval(reStart);
                  }
                }
              },1000)
            }
    }/* section1 End */



    section2(){
      const fade_slide_view  = $('.fade_slide_view'),
            fade_slide_wrap  = fade_slide_view.find('.fade_slide_wrap'),
            fadeSlides  = fade_slide_wrap.find('.fadeSlide'),
            visual_illusion_wrap  = fade_slide_view.find('.visual_illusion_wrap'),
            v_illusion_img  = visual_illusion_wrap.find('.v_illusion_img'),
            detail_btn_box = $('.detail_btn_box'),
            datail_txt_wrap = $('.datail_txt_wrap'),
            detail_btn = detail_btn_box.find('.detail_btn'),
            detail_btn_bar = detail_btn_box.find('.detail_btn_bar'),
            txt_item = $('.txt_item');

      let currentIdx =0,
          fade_slide_re_width,
          fade_slide_re_height;


      function resizeFn(){
        fade_slide_re_width = $(window).innerWidth();
        fade_slide_re_height = fade_slide_re_width*0.15625;

        fade_slide_wrap.css({ height : fade_slide_re_height})
        }
        resizeFn()
        $(window).on({
          resize(){
            resizeFn()
          }
        })
        

            /* 섹션2 페이드슬라이드 */
            function fadeSlideFn(){
                fadeSlides.stop().fadeOut(500);
                fadeSlides.eq(currentIdx).stop().fadeIn(500);
                v_illusion_img.stop().fadeOut(500);
                v_illusion_img.eq(currentIdx).stop().delay(200).fadeIn(800);
            }

            /* 페이드슬라이드 페이지(?)버튼 */
            detail_btn.each(function(idx){
              let targetLeft = $(this).position().left+2;
                  $(this).on({
                    click(e){
                      e.preventDefault();
                      currentIdx = idx;
                      detail_btn.removeClass('active');
                      $(this).addClass('active');
                      fadeSlideFn();
                      detailItemFn();
                      detail_btn_bar.stop().animate({left:targetLeft});
                      }
                  })
                 
            })

            /* 버튼 아래 디테일 요소 이벤트 */
            function detailItemFn(){
              txt_item.stop().fadeOut(500);
              txt_item.eq(currentIdx).stop().fadeIn(500);
            }
    }/* section2 End */



    section3(){
      /* 내용 없음 */
    }/* section3 End */



    footer(){
      const quick_link = $('.quick_link'),
            quick_link_btn = quick_link.find('.quick_link_btn'),
            quick_inner = quick_link.find('.quick_inner');

            
            /* Quick link 버튼 이벤트 */
            quick_link_btn.on({
              click(e){
                e.preventDefault();
                quick_inner.stop().fadeIn(400);
              }
            })
            quick_link.on({
              mouseleave(){
                quick_inner.stop().fadeOut(400);
              }
            })
    }/* footer End */

    goTop(){
      const  $window = $(window),
             goTop_box = $('#goTop_box'),
             goTop_btn = goTop_box.find('.goTop_btn');

    
              
              $window.on({
                  scroll(){
                    if($(this).width()>700){
                      if($(this).scrollTop() > 0){
                        goTop_box.stop().fadeIn(300);
                      }else{
                        goTop_box.stop().fadeOut(300);
                      }
                    }else{
                      goTop_box.stop().fadeOut(300);
                    }
                    
                  }
                })

                goTop_btn.on({
                  click(e){
                    e.preventDefault();
                    $('html,body').stop().animate({scrollTop:0},1000,'swing')
                  }
                })
      

    }/* goTop End */
    mobile(){
      const m_nav_box = $('#m_nav_box'),
            m_nav_container = m_nav_box.find('.m_nav_container'),
            close_m_menu_box = m_nav_container.find('.close_m_menu_box'),
            main_menu_btn = m_nav_container.find('.main_menu > a'),
            mob_menu_btn = $('.mob_menu_btn');


            mob_menu_btn.on({
              click(e){
                e.preventDefault();
                m_nav_box.addClass('active');
              }
            })
            main_menu_btn.on({
              click(e){
                e.preventDefault();
                $(this).toggleClass('active');
                $(this).next().stop().slideToggle(300);
              }
            })
            close_m_menu_box.on({
              click(e){
                e.preventDefault();
                m_nav_box.removeClass('active');
                main_menu_btn.removeClass('active');
                main_menu_btn.next().stop().hide();
              }
            })

    }/* mobile End */


  }/* Class Dealim End */
const NewDealim = new Dealim();
      NewDealim.init();

})(jQuery,window,document);