/* init carousel */
$('.carousel').carousel({
    interval: 4000
});
$('body').append('<div title="Quay lên đầu trang" id="toTop" class="btn btn-primary color1"><span class="glyphicon glyphicon-chevron-up"></span></div>');
$(window).scroll(function () {
    if ($(this).scrollTop() != 0) {
        $('#toTop').fadeIn();
    } else {
        $('#toTop').fadeOut();
    }
});
$('#toTop').click(function () {
    $("html, body").animate({scrollTop: 0}, 700);
    return false;
});
function gallery(){};
    var $itemsHolder = $('ul.port2');
    var $itemsClone = $itemsHolder.clone(); 
    var $filterClass = "";
    $('ul.filter li').click(function(e) {
    e.preventDefault();
    $filterClass = $(this).attr('data-value');
        if($filterClass == 'all'){ var $filters = $itemsClone.find('li'); }
        else { var $filters = $itemsClone.find('li[data-type='+ $filterClass +']'); }
        $itemsHolder.quicksand(
            $filters,
            { duration: 1000 },
            gallery
            );
    });

    $(document).ready(gallery);

    /* Show text short */
    (function ($) {
        $.fn.wrapLongTitle = function (options) {
            return this.each(function () {
                var plugin = $(this);
                plugin.maxTitleHeight = 32;
    
                if (typeof options !== "undefined" && typeof options.maxTitleHeight !== "undefined") {
                    plugin.maxTitleHeight = options.maxTitleHeight;
                }
                plugin.init = function () {
                    var h = $(plugin).height();
                    var nt = $(plugin).html().trim();
                    if (h > plugin.maxTitleHeight) {
                        while (true) {
                            if (h <= plugin.maxTitleHeight) {
                                break;
                            }
                            $(plugin).html(nt + ' ...');
                            h = $(plugin).height();
                            nt = nt.substring(0, nt.lastIndexOf(' '));
                        }
                    }
                };
                plugin.init();
            });
        }
        $.fn.wrapLongTitleOneLine = function (options) {
            return this.each(function () {
                var plugin = $(this);
                plugin.maxTitleHeight = 16;
    
                if (typeof options !== "undefined" && typeof options.maxTitleHeight !== "undefined") {
                    plugin.maxTitleHeight = options.maxTitleHeight;
                }
                plugin.init = function () {
                    var h = $(plugin).height();
                    var nt = $(plugin).html().trim();
                    if (h > plugin.maxTitleHeight) {
                        while (true) {
                            if (h <= plugin.maxTitleHeight) {
                                break;
                            }
                            $(plugin).html(nt + ' ...');
                            h = $(plugin).height();
                            nt = nt.substring(0, nt.lastIndexOf(' '));
                        }
                    }
                };
                plugin.init();
            });
        }
    })(jQuery);
    
    /* map  */
function initMap() {
 
    var broadway = {
    info: '<p style="color:#333"> <strong>Công ty TNHH một thành viên Thoát nước Hà Nội (HSDC)</strong><br>\
    Số 65 Vân Hồ 3, Hai Bà Trưng, Hà Nội<br>\
    Điện thoại: (043) 976 2245  <br>\
    Fax: (043) 974 5348<br>\
    </p>',
    lat: 21.010392,
    long: 105.846167
    };
      
    var locations = [
    [broadway.info, broadway.lat, broadway.long, 0],
    ];
      
    var element = document.getElementsByClassName('map_holder');
    for (var ele=0; ele<element.length; ele++){
        var map = new google.maps.Map(element[ele], {
            zoom: 16,
            center: new google.maps.LatLng(21.010392, 105.846167),
            mapTypeId: google.maps.MapTypeId.ROADMAP
            });
              
            var infowindow = new google.maps.InfoWindow({
                content: broadway.info,
                    maxWidth: 400
            });
              
            var marker, i;
              
            for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            });
              
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
            }
            })(marker, i));
            infowindow.open(map, marker);
    }
  }
}


var _fancyboxGroupImages=[
    {
        'href'	: 'images/s1.jpg',
        'title'	: 'Công ty TNHH 1 thành viên HSDC'
    },
    {
        'href'	: 'images/s2.jpg',
        'title'	: 'Công ty TNHH 1 thành viên HSDC - Ảnh hội nghị mới 2018'
    },
        {
            'href'	: 'images/s3.jpg',
            'title'	: 'Công ty TNHH 1 thành viên HSDC - Ảnh Tổng giám đốc phát biểu'
        },
        {
            'href'	: 'images/s4.jpg',
            'title'	: 'Công ty TNHH 1 thành viên HSDC - Nội dung cuộc họp Quý III'
        },
        {
            'href'	: 'images/s5.jpg',
            'title'	: 'Công ty TNHH 1 thành viên HSDC - Cán bộ công nhân viên công ty'
        },
        {
            'href'	: 'images/s3.jpg',
            'title'	: 'Công ty TNHH 1 thành viên HSDC - Cuộc thi dành cho cán bộ công nhân viên'
        }
]
// function getImages() {
//     return _fancyboxGroupImages[Math.floor(Math.random() * _fancyboxGroupImages.length)];
//  }
 function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  function affixscrolltop() {
    if ($(window).scrollTop() > 41) {
        $('#nav').stop().addClass('fixed-top');        
        $('#nav').stop().css('margin-bottom', '70px')
    } else {
        $('#nav').stop().removeClass('fixed-top');
        $('#nav').stop().css('margin-bottom', '0px')
    }
    $(window).scroll(function () {
        if ($(this).scrollTop() > 41) {
            $('#nav').stop().addClass('fixed-top');
            $('#nav').stop().css('margin-bottom', '70px')
        } else {
            $('#nav').stop().removeClass('fixed-top');
            $('#nav').stop().css('margin-bottom', '0px')
        }
    });

}

  function chayChu() {
    $('.tlt').textillate({
        // the default selector to use when detecting multiple texts to animate
        selector: '.texts',

        // enable looping
        loop: true,

        // sets the minimum display time for each text before it is replaced
        minDisplayTime: 5000,

        // sets the initial delay before starting the animation
        // (note that depending on the in effect you may need to manually apply
        // visibility: hidden to the element before running this plugin)
        initialDelay: 0,

        // set whether or not to automatically start animating
        autoStart: true,

        // custom set of 'in' effects. This effects whether or not the
        // character is shown/hidden before or after an animation
        inEffects: [],

        // custom set of 'out' effects
        outEffects: ['hinge'],

        // in animation settings
        in: {
            // set the effect name
            effect: 'bounceIn',

            // set the delay factor applied to each consecutive character
            delayScale: 1,

            // set the delay between each character
            delay: 100,

            // set to true to animate all the characters at the same time
            sync: false,

            // randomize the character sequence
            // (note that shuffle doesn't make sense with sync = true)
            shuffle: false,

            // reverse the character sequence
            // (note that reverse doesn't make sense with sync = true)
            reverse: false,

            // callback that executes once the animation has finished
            callback: function () { }
        },

        // out animation settings.
        out: {
            effect: 'fadeOutRight',
            delayScale: 1.5,
            delay: 100,
            sync: true,
            shuffle: false,
            reverse: false,
            callback: function () { }
        },

        // callback that executes once textillate has finished
        callback: function () { },

        // set the type of token to animate (available types: 'char' and 'word')
        type: 'char'
    });
}
function initMenuMobile(){
	$(".mobile_menu").on("click",function(event){
        event.stopPropagation();
		$('#nav').removeClass('wow')
		.removeClass('flipInX')
		.removeClass('center')
		.removeClass(' animated')
		.removeClass('affix-top')
		.removeAttr('data-wow-delay')
		.removeAttr('style');
		$('#nav #menu_top').addClass('text-left');
        if ($("#menu_top").is(":visible")) {
            $("#menu_top").hide();
            $(".mobile_menu").removeClass("menu_mobile_active");
        }
        else {
            $("#menu_top").show();
            $(".mobile_menu").addClass("menu_mobile_active");
        }

    });
}

function showQuantracmoitruong(){
    var _item=$('.tvcb_title');
    if(_item){
        if(_item.hasClass('activie')){
                return;
        }else{
            setTimeout(() => {
                timer=1;
            var quantrac= _item.closest('.home_tvcb').find('.tvcb_item').each(function(){
                $(this).fadeIn(timer * 250);
                timer ++;
            }); 
            }, 100);
           
        }
    }
}
function searchToggle(obj, evt){
    var container = $(obj).closest('li').find('.search-form');
        if(!container.hasClass('active')){
            container.addClass('active');
            evt.preventDefault();
        }
        else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
            container.removeClass('active');
            // clear input
            container.find('.search-input').val('');
        }
}
$(document).ready(function(){
    
    // $('.gallery .gallery-item-fancybox').each(function(){
    //     $(this).click(function() {
    //         $.fancybox(shuffle(_fancyboxGroupImages), {
    //             'padding'			: 0,
    //             'transitionIn'		: 'none',
    //             'transitionOut'		: 'none',
    //             'type'              : 'image',
    //             'changeFade'        : 0
    //         });
    //     });
    // });

    // $(".gallery .gallery-item-video-fancybox")
    // .attr('rel', 'gallery-videos')
    // .fancybox({
    //     openEffect  : 'none',
    //     closeEffect : 'none',
    //     nextEffect  : 'none',
    //     prevEffect  : 'none',
    //     padding     : 0,
    //     margin      : [20, 60, 20, 60] // Increase left/right margin
    // });

    //run chay chữ header
    chayChu();
	initMenuMobile();
    //affixscrolltop();
    $('.tvcb_title .title_style').on('click',function(){
        showQuantracmoitruong();
    }).on('mouseover',function(){
        showQuantracmoitruong();
    });
    wow = new WOW(
        {
          animateClass: 'animated',
          offset:30,
        //   callback:     function(box) {
        //     console.log("WOW: animating <" + box.tagName.toLowerCase() + ">")
        //   }
        })
    wow.init();
    setTimeout(() => {
        $('#nav').removeAttr('style');
    }, 500);

	
})