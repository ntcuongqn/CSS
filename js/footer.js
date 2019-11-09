function genMenu() {
    $.get("/api/Menu/genMenu", function (result) {
        if (result.Code == 0) {
            $('.ulmenu1').append(result.Content);
        } else {
            alert(result.Content);
        }
    });
}

function genBanner() {
    $.get("/api/banner/genBanner", function (result) {
        for (var i = 0; i < result.length; i++) {
            var div = $('<div class="item"></div>');
            if (i == 0) {
                div = $('<div class="item active"></div>');
            }
            var a = $('<a href="' + result[i].BannerLink + '"></a>');
            var img = $('<img class="full-width" src="' + result[i].BannerUrl + '" title="thoatnuochanoi.vn" alt="thoatnuochanoi.vn" />');
            $('.carousel-inner').append(div.append(a.append(img)));
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


function getInfoAll() {
    $.ajax({
        url: "/api/cauhinh/getCauHinh",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.length > 0) {
                var root = $.grep(result, function (obj) { return obj.MaCauHinh === "upload_root"; });

                document.title = $.grep(result, function (obj) { return obj.MaCauHinh === "title"; })[0].CauHinh;
                $("meta[name='description']").attr('content', $.grep(result, function (obj) { return obj.MaCauHinh === "meta_description"; })[0].CauHinh);
                $("meta[name='keywords']").attr('content', $.grep(result, function (obj) { return obj.MaCauHinh === "meta_keywords"; })[0].CauHinh);

                $("meta[property='og:title']").attr("content", $.grep(result, function (obj) { return obj.MaCauHinh === "title"; })[0].CauHinh);
                $("meta[property='og:description']").attr("content", $.grep(result, function (obj) { return obj.MaCauHinh === "meta_description"; })[0].CauHinh);
                $("meta[property='og:keywords']").attr("content", $.grep(result, function (obj) { return obj.MaCauHinh === "meta_keywords"; })[0].CauHinh);


                var logoUrl = $.grep(result, function (obj) { return obj.MaCauHinh === "logo"; });
                var logoImage = $.grep(result, function (obj) { return obj.MaCauHinh === "logo-image"; });
                $('.imgLogo').attr("src", '/' + root[0].CauHinh + '/' + logoUrl[0].CauHinh + '/' + logoImage[0].CauHinh);
                $('link[rel="shortcut icon"]').attr('href', '/' + root[0].CauHinh + '/' + logoUrl[0].CauHinh + '/' + logoImage[0].CauHinh);
                $("meta[property='og:image']").attr("content", '/' + root[0].CauHinh + '/' + logoUrl[0].CauHinh + '/' + logoImage[0].CauHinh);

                //var backgroundUrl = $.grep(result, function (obj) {return obj.MaCauHinh === "background";});
                //var backgroundImage = $.grep(result, function (obj) { return obj.MaCauHinh === "background-image"; });
                //$('body').css('background-image', 'url(/' + root[0].CauHinh + '/' + backgroundUrl[0].CauHinh + '/' + backgroundImage[0].CauHinh + ')');

                $('.thanhpho').html($.grep(result, function (obj) { return obj.MaCauHinh === "thanhpho"; })[0].CauHinh);
                $('.congty').html($.grep(result, function (obj) { return obj.MaCauHinh === "congty"; })[0].CauHinh);
                $('.slogan').html($.grep(result, function (obj) { return obj.MaCauHinh === "slogan"; })[0].CauHinh);
                chayChu();
                //info
                //$('.info').html($.grep(result, function (obj) { return obj.MaCauHinh === "info"; })[0].CauHinh);
            }
        },
    });
}
$('document').ready(function () {
    genMenu();
    genBanner();
    getInfoAll();
    
    
});
