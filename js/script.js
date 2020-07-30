toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
};

$(function () {
    $('.iconChannel').tooltip()
})

$(window).on("load", function () {
    $('footer').css("visibility", "visible");
    $('#welcome').modal('show');

});


$(document).ready(function () {

    //hide welcome screen
    $('.btn-welcomeSet').click(function () {
        $('#welcome').modal('hide');
    });

    //play audio
    $('.btn-Test').click(function () {
        const audio = new Audio('assets/alert.wav');
        //audio.loop = true;
        audio.play();
    });

    //btn-Set clicked
    $('.btn-Set').click(function () {
        const value = $('.selectpicker').val();
        console.log(value);
        if (value == null) {
            swal("Opps", "Set Time Please!", "warning");
        } else {
            $('.timer').timer({
                countdown: true,
                duration: `${value}m`,	// Set the duration to 25 minutes
                callback: function () {
                    const audio = new Audio('assets/alert.wav');
                    audio.loop = true;
                    audio.play();
                    $('#timeUp').css('display', 'block');
                    $('#stopVid').remove();
                    $('#listVideo').remove();
                    console.log('time is up!!');
                }
            });
            $('.btn-Set').attr('disabled', true);
            $('.btn-Set').addClass('btn-secondary');
            $('.btn-Stop').css('display', 'block');
            $('.timer').css('display', 'block');
            swal("Great", "Reminder Succesfully Set!", "success");
        }

    });

    //btn-Stop clicked
    $('.btn-Stop').click(function () {
        $('.btn-Set').removeClass('btn-secondary');
        $('.btn-Set').attr('disabled', false);
        $('.timer').timer('remove');
        $('.timer').css('display', 'none');
        $('.btn-Stop').css('display', 'none');
        swal("Hmmm", "Reminder Removed!", "error");
        //$('.timer').stopTimer();
    });


    //load channel
    const key = 'AIzaSyC0faUqclz7fFCKuO8ViteHT3SCleKA0LY';
    const urlChannel = 'https://www.googleapis.com/youtube/v3/channels';
    const defaultUsername = 'SmartBooksMedia';

    loadChannels(defaultUsername);
    $('.channel-item').click(function () {
        const username = $(this).attr('username');
        loadChannels(username);
        $('.modal').modal('hide');
        $('#sidebar').toggleClass('active');
        $('#overlay').toggleClass('active');
        $(window).scrollTop(0);
    });




    function loadChannels(username) {
        $.getJSON(urlChannel,
            { part: 'snippet, contentDetails', key: key, forUsername: username }, function (data) {
                UploadPlaylist(data);

            })
    }

    //load playlist
    const urlPlaylist = 'https://www.googleapis.com/youtube/v3/playlistItems';

    function UploadPlaylist(data) {
        const playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;
        const thumbChannel = data.items[0].snippet.thumbnails.default.url;
        const titleChannel = data.items[0].snippet.title;

        console.log(playlistId);
        loadVideos(playlistId);

        function loadVideos(playlistId) {
            $.getJSON(urlPlaylist, { part: 'snippet', key: key, maxResults: 50, playlistId: playlistId }, function (data) {
                console.log(data);
                mainVideo(data);
                detailMain(data);
                videoList(data);
            })
        }

        function detailMain(data) {
            const title = data.items[0].snippet.title;
            $('#detailMain').html(`
            <div class="container mt-3 detailMain">
                <div class="row mb-0">
                    <div class="col-9">
                        <h5 class="font-weight-bold">${title}</h5>
                    </div>
                    <div class="col-3">
                        <div class="iconChannel" data-toggle="tooltip" data-placement="top" title="${titleChannel}">
                        <img src="${thumbChannel}"
                        alt="thumbnail"></div>
                    </div>
                </div>
                <hr>
            </div>
            `);
        }

        function detailMainPLay(title) {
            $('#detailMain').html(`
            <div class="container mt-3 detailMain">
                <div class="row mb-0">
                    <div class="col-9">
                        <h5 class="font-weight-bold">${title}</h5>
                    </div>
                    <div class="col-3">
                        <div class="iconChannel" data-toggle="tooltip" data-placement="top" title="${titleChannel}">
                        <img src="${thumbChannel}"
                        alt="thumbnail"></div>
                    </div>
                </div>
                <hr>
            </div>
            `);
        }

        $('#listVid').on('click', 'article', function () {
            const id = $(this).attr('data-key');
            const title = $(this).attr('data-title');
            if ($(window).width() >= 640) {
                $(window).scrollTop(0);
            }
            mainVideoPlay(id);
            detailMainPLay(title)
        });

        let output = '';
        function videoList(data) {
            $.each(data.items, function (i, item) {
                const thumb = item.snippet.thumbnails.medium.url;
                const title = item.snippet.title;
                const desc = item.snippet.description.substring(0, 100);
                const vid = item.snippet.resourceId.videoId;

                output += `
                        <article class="col-sm-6 col-md-4 item" data-key="${vid}" data-title="${title}">
                            <div class="row p-1">
                                <div class="col-md-12 list-thumb">
                                    <img src="${thumb}"
                                        alt="thumbnail">
                                </div>
                                <div class="col-md-12 list-desc">
                                    <h6 class="mt-2">${title}</h6>
                                    <p>${desc}</p>
                                </div>
                            </div>
                        </article>`;


            });
            //console.log(output);
            $('#listVid').html(output);
        }

    }




    // <iframe id="stopVid" class="embed-responsive-item" src="https://embd.gq/${id}" frameborder="0"></iframe>    

    function mainVideo(data) {
        const id = data.items[0].snippet.resourceId.videoId;
        $('#mainVid').html(`
        <div class="container text-center ">
            <div class="embed embed-responsive embed-responsive-16by9">
            
            <iframe id="stopVid" class="embed-responsive-item" src="https://www.youtube.com/embed/${id}?rel=0&modestbranding=1"
            allowfullscreen></iframe>
            </div>
        </div>
        `);
    }


    function mainVideoPlay(id) {
        $('#mainVid').html(`
        <div class="container text-center ">
            <div class="embed embed-responsive embed-responsive-16by9">
                <iframe id="stopVid" class="embed-responsive-item" src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
                allow='autoplay' allowfullscreen></iframe>
            </div>
        </div>
        `);
    }









});

