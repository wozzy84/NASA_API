document.addEventListener('DOMContentLoaded', function () {

    function setPhoto(index, object) {

        $(".photo").remove();
        for (k = 0; k < object.photos.length; k++) {
            $(".sec_second").append(`<div class="photo">
                    <img class="img_small photo_${k}" src="${object.photos[index+k].img_src}" class="rounded mx-auto d-block" alt="..." data-camera="${object.photos[index+k].camera.full_name}"
                    data-id="${object.photos[index+k].id}"
                    data-earthDate="${object.photos[index+k].earth_date}"></div>`)

        }
        $('.sec_second').children().hide()
        $('.sec_second').children().slice(0, 6).show();

    }

    // function pagination(index, object) {
    //     $(".first_page").text(`${index/6}`)
    //     if ($(".first_page").text() == '0') {
    //         $(".first_page").css('opacity', '0')
    //         $('window').focus();
    //     } else {
    //         $(".first_page").css('opacity', '1')
    //     }
    //     $(".second_page").text(`${index/6+1}`)
    //     $(".third_page").text(`${index/6+2}`)

    //     if (object != null) {
    //         if (index >= (object.photos.length - object.photos.length % 6 - 6)) {
    //             $(".third_page").css("opacity", '0');
    //         }

    //     }
    // }

    $.ajax({
        url: 'https://images-api.nasa.gov/asset/as11-40-5874',
        dataType: 'json',
        method: 'GET',
    }).done(function (response) {
        $(".sec_first_continer").css("backgroundImage", `url(${response.collection.items[2].href})`)
    }).fail(function (error) {
        console.log(error.responseText);
    })

    


    function diplayPhotos(rover, sol) {
        $.ajax({
            url: `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=RSvcKCmoFW3dPRfkvReqq8bqL69Q78uAy1XqYh1l`,
            dataType: 'json',
            method: 'GET',
            beforeSend: function () {
                $(".photos_sec").hide();
                $('.loading').css('display', 'flex');
            },
            complete: function () {
                setTimeout(function () {
                    $('.loading').hide();
                    $(".photos_sec").show()
                }, 500);

            }

        }).done(function (response) {
            let i = 0;         
            setPhoto(i, response);
            if (response.photos.length > 0) {
                $(".res_name").text(rover)
                $(".res_sol").text(sol)
                $(".res_day").text(response.photos[0].earth_date)
                $(".res_pic").text(response.photos.length)
            } else {
                $(".res_name").text(rover)
                $(".res_sol").text(sol)
                $(".res_day").text()
                $(".res_pic").text("No photos were taken")
            }

            $(".next").on('click', function (e) {
                e.preventDefault();
                console.log(i)
                if (i < response.photos.length - 6) {
                    i += 6;
                    $('.sec_second').children().hide()
                    $('.sec_second').children().slice(i, i + 6).show();
                    //pagination(i, response);
                } 
            })

            $(".prev").on('click', function (e) {
                e.preventDefault();
                if (i >= 6) {
                    i -= 6;
                    $('.sec_second').children().hide();
                    $('.sec_second').children().slice(i, i + 6).show();
                   // pagination(i, response);
                }
            })

            $(".first_page").on('click', function (e) {

                e.preventDefault();
                if (i >= 6) {
                    i -= 6;
                    $('.sec_second').children().hide();
                    $('.sec_second').children().slice(i, i + 6).show();
                    //pagination(i, response);
                }
            })

            $(".second_page").on('click', function (e) {
                e.preventDefault()
            })
            $(".third_page").on('click', function (e) {
                e.preventDefault();
                if (i < response.photos.length - 6) {
                    i += 6;
                    $('.sec_second').children().hide()
                    $('.sec_second').children().slice(i, i + 6).show();
                   // pagination(i, response);
                }
            })
         

        }).fail(function (error) {
            console.log(error.responseText);
        })


    }

    $('.mission_btn').on('click', function (e) {
        e.preventDefault();
        let rover = $(this).text();
        $(".mission_btn").removeClass("active");
        $(this).addClass('active');
        $(".fbox").fadeIn().css('display', 'flex');
        $(".photos_sec").fadeOut();
        $(".res_name").text("--")
        $(".res_sol").text("--")
        $(".res_day").text("--")
        $(".res_pic").text("--")

        $.ajax({
            url: `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?&api_key=RSvcKCmoFW3dPRfkvReqq8bqL69Q78uAy1XqYh1l`,
            dataType: 'json',
            method: 'GET',

        }).done(function (response) {
            $('.missionName').text(response.photo_manifest.name)
            $(".launchingDate").text(response.photo_manifest.launch_date)
            $(".landinngDate").text(response.photo_manifest.landing_date)
            $(".status").text(response.photo_manifest.status)
            $(".maxDate").text(response.photo_manifest.max_date)
            $(".photosTaken").text(response.photo_manifest.total_photos)
            $(".sols").text(response.photo_manifest.max_sol);
            $(".pickNumber").attr("placeholder", `(0 - ${response.photo_manifest.max_sol})`)

        }).fail(function (error) {
            console.log(error.responseText);
        })

    })

    $(".accept").on("click", function (e) {
        e.preventDefault();
        let roverName = $('.btn-group').find('.active').text();
        let solNumber = $('.pickNumber').val();
       
        diplayPhotos(roverName, solNumber);
        $('.pickNumber').val('');
        //pagination(0);
       
    })

    $("body").on("click", ".photo", function () {
        $("body").append('<div class="lightbox"></div>')
        $("body").css('overflow-x', 'hidden');
        $("body").css('overflow-y', 'hidden')
        $("body").append(`<div class="imgBox">
        <p class="pic_descr"> Mission: ${$(".res_name").text()} | Photo ID : ${$(this).children().data("id")} | Earth date ${$(this).children().data("earthdate")} | Camera: ${$(this).children().data("camera")} </p>
        <img  class="img_big" src = "">
        </img>
        <button type="button" class="close" id="cls" aria-label="Close">Zamknij
        <span aria-hidden="true">&times;</span>
      </button>
        </div>`);
        $(".imgBox").find('.img_big').attr("src", $(this).children()[0].currentSrc);

    })

    function closeLbox() {
        $('.img_big').remove();
        $(".imgBox").remove();
        $('.lightbox').remove();
        $("body").css('overflow-x', 'auto');
        $("body").css('overflow-y', 'auto')

    }
    $("body").on("click", ".lightbox", function () {
        closeLbox()

    })

    $("body").on("click", "#cls", function () {
        closeLbox()
    })


    $(".arrow").click(function (e) {

        var offset = 20; //Offset of 20px

        $('html, body').animate({
            scrollTop: $(".info_sec").offset().top + offset
        }, 500);
    });

    $('.mission-info').on('click', function (e) {
        e.stopPropagation();
        $('.asideTable').fadeIn();


    })

    $('.cls').on('click', function (e) {
        e.preventDefault()
        $('.asideTable').fadeOut();

    })

    $('body').on('click', function (e) {
        e.preventDefault()
        $('.asideTable').fadeOut();

    })
    $('.asideTable').on('click', function (e) {
        e.stopPropagation();
    })


});