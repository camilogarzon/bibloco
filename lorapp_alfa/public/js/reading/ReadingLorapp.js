/**
 * Modulo para la seccion de lectura del usuario
 * @author Camilo Garzon
 * @version 1.0
 * @since 2015-07-11
 */

var ReadingLorapp = {};

/**
 * Funcion autoejecutable encargada de definir todas las variables y funciones 
 */
(function() {

    //////////////////////////////////////////////////////////////////////
    // ATRIBUTOS /////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////
    // METODOS ///////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    /** 
     * Metodo que inicializa el modulo
     */
    ReadingLorapp.initialize = function() {
        ReadingLorapp.snippets();
        // se inicializa el modulo NoteAction

        NoteAction.noteLoader = '#note_loader';
        NoteAction.noteText = '#note_text';
        NoteAction.noteTextEdit = '#note_text_edit';
        NoteAction.btnNoteEdit = '#btn_note_edit';
        NoteAction.btnNoteCancel = '#btn_note_cancel';
        NoteAction.btnNoteSave = '#btn_note_save';
        $("#icon_note").click(function(event) {
            //NoteAction.getNote(global.lecturesection_id);
        });

    };

    /** 
     * Metodo que ejecuta snippets de codigo, pendiente por organizar en los respectivos modulos
     */
    ReadingLorapp.snippets = function() {


        $(document).ready(function() {

            // START: If user is on a Mac, add class .mac to the body, else add class .pc
            if (navigator.userAgent.indexOf('Mac OS X') != -1) {
                $("body").addClass("mac");
            } else {
                $("body").addClass("pc");
            }
            // END: If user is on a Mac, add class .mac to the body, else add class .pc

            /**
             * click en botón agregar apunte hace slide de casilla de apuntes
             */
            $("#take-note").click(function(event) {
                event.preventDefault();
                $(".add-note-wrapper").animate({
                    bottom: "0%"
                }, 500);
            });


            $(".show-my-notes-btn").click(function(event) {
                /**
                 * click en botón apuntes hace slide de apuntes
                 */
                event.preventDefault();
                // $('.notesMainWrapper').css('left', 'auto');
                $(".notesMainWrapper").animate({
                    right: "0"
                }, 500);
                // Se bloquea el scroll del body mientras los apuntes se muestren
                $("body").addClass("stop-scrolling");

                $('.closer-box').fadeIn(500);
                $('.left-close-icon').fadeIn(500);
            });

            /**
             * click en botón .show-my-readings-btn hace slide de menú lateral
             */
            $(".show-my-readings-btn").click(function(event) {
                event.preventDefault();
                $(".my-readings-wrapper").animate({
                    left: "0"
                }, 500);
                // Se bloquea el scroll del body mientras el menú lateral se muestre
                $("body").addClass("stop-scrolling");
                $('.closer-box').fadeIn(500);
                $('.right-close-icon').fadeIn(500);
            });


            /**
             * click en el botón X o en la sección oscurecida que sale en los menus laterales los cierra
             */
            $(".closer-box, .right-close-icon, .left-close-icon").click(function(event) {
                event.preventDefault();
                $(".my-readings-wrapper").animate({
                    left: "-450px"
                }, 500);
                $(".notesMainWrapper").animate({
                    right: "-650px"
                }, 500);
                // Se desbloquea el scroll del body
                $("body").removeClass("stop-scrolling");
                $('.closer-box').fadeOut(500);
                $('.right-close-icon').fadeOut(500);
                $('.left-close-icon').fadeOut(500);
            });


//
//            $('#close_note_loader').click(function() {
////                myLecture.closeNoteLoader();
//            });
//            $('#icon_print').mouseover(function() {
//                util.byIdShowHide('label_print', true);
//            });
//            $('#icon_print').mouseout(function() {
//                util.byIdShowHide('label_print', false);
//            });
//            $('#icon_print').click(function() {
////                myLecture.printContentById('lecture');
//            });
//            $('#icon_fullscreen').mouseover(function() {
//                util.byIdShowHide('label_fullscreen', true);
//            });
//            $('#icon_fullscreen').mouseout(function() {
//                util.byIdShowHide('label_fullscreen', false);
//            });
//            $('#icon_nightmode').mouseover(function() {
//                util.byIdShowHide('label_nightmode', true);
//            });
//            $('#icon_nightmode').mouseout(function() {
//                util.byIdShowHide('label_nightmode', false);
//            });
//
//


            // START: CLICK EN #BUTTON-FULLSCREEN LLEVA A PANTALLA COMPLETA Y CLICK DE NUEVO SALE DE ELLA
            $('#icon_fullscreen, .full-screen-btn').click(function toggleFullScreen() {
                if (!document.fullscreenElement && // alternative standard method
                        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.msRequestFullscreen) {
                        document.documentElement.msRequestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            });

        
            // START: Click en boton full-width lleva a full-width
            $('.wide-btn-div').on('click',
                function () {
                    // if the button is clicked when active
                    $('.reading-wrapper').addClass('reading-full-width');
                    $('.narrow-btn-div').removeClass('active');
                    $(this).addClass('active');
                    
                    // Rerun info calculations for correct % read and minutes left.
                    height = $(document).height(); 
                    scrollTop = $(document).scrollTop();
                    percentageRead = Math.round((scrollTop * 100)/(height - viewportHeight));
                    $('.reading-percentage-data').html(percentageRead);
                        var minutesLeft = Math.round((wordCount/averageWordsPerMin) - ((wordCount/averageWordsPerMin) * (percentageRead/100)));
                    $('.minutes-left-data').html(minutesLeft);
            });

            $('.narrow-btn-div').on('click',
                function () {
                    // if the button is clicked when active
                    $('.reading-wrapper').removeClass('reading-full-width');
                    $('.wide-btn-div').removeClass('active');
                    $(this).addClass('active');

                    // Rerun info calculations for correct % read and minutes left.
                    height = $(document).height(); 
                    scrollTop = $(document).scrollTop();
                    percentageRead = Math.round((scrollTop * 100)/(height - viewportHeight));
                    $('.reading-percentage-data').html(percentageRead);
                        var minutesLeft = Math.round((wordCount/averageWordsPerMin) - ((wordCount/averageWordsPerMin) * (percentageRead/100)));
                    $('.minutes-left-data').html(minutesLeft);
            });
            // END: Click en título de capítulo lleva a full-width


            // START: Click en botones de color ajusta estilos
            $('.color-light-btn').on('click', function() {
                if ($('body').hasClass('sepia')) {
                    $('body').removeClass('sepia');
                }
                if ($('body').hasClass('night')) {
                    $('body').removeClass('night');
                }
                $('.color-light-btn').removeClass('active');
                $('.color-sepia-btn').removeClass('active');
                $('.color-night-btn').removeClass('active');
                $(this).addClass('active');
            });

            $('.color-sepia-btn').on('click', function() {
                if ($('body').hasClass('night')) {
                    $('body').removeClass('night');
                    $('body').addClass('sepia');
                }
                else {
                    $('body').addClass('sepia');
                }
                $('.color-light-btn').removeClass('active');
                $('.color-sepia-btn').removeClass('active');
                $('.color-night-btn').removeClass('active');
                $(this).addClass('active');
            });

            $('.color-night-btn').on('click', function() {
                if ($('body').hasClass('sepia')) {
                    $('body').removeClass('sepia');
                    $('body').addClass('night');
                }
                else {
                    $('body').addClass('night');
                }
                $('.color-light-btn').removeClass('active');
                $('.color-sepia-btn').removeClass('active');
                $('.color-night-btn').removeClass('active');
                $(this).addClass('active');
            });
            // END: Click en botones de color ajusta estilos



            /**
             * opciones del toolbox de lectura: seleccionar, resaltar, limpiar, crear nota
             */
//            $('.lecture').mouseup(myLecture.floatMenu);
//            $('#add_note').mousedown(myLecture.addNote);
//            //resalta texto
//            $('#highlighter').click(myLecture.highlighter);
//            //limpia el texto resaltado
//            $('#unhighlight').click(myLecture.unHighlight);
//            $('#btn_guardar').click(myLecture.saveNote);
//            $('#btn_cancelar').click(myLecture.closeNote);



            // START: SMOOTH SCROLLING ON CLICK
            $('#down-scroll').click(function() {
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset().top
                }, 500);
                return false;
            });
            // END: SMOOTH SCROLLING ON CLICK
            //localstorage
        });



// START: Click on brightness buttons changes .brightness opacity
        $('.increase-brightness-btn').click(function() {
            brightness = ($('.brightness').css('opacity'))
            if (brightness > 0) {
                brightness = (parseFloat($('.brightness').css('opacity')) - 0.175).toFixed(3);
                $('.brightness').css('opacity', brightness);
                $('.brightness-bar2.full-bar + .brightness-bar2').addClass('full-bar');
            }
            ;
        });
        $('.decrease-brightness-btn').click(function() {
            brightness = ($('.brightness').css('opacity'))
            if (brightness <= 0.526) {
                brightness = (parseFloat($('.brightness').css('opacity')) + 0.175).toFixed(3);
                $('.brightness').css('opacity', brightness);
                $('.full-bar:last').removeClass('full-bar');
            }
            ;
            // (BUG FIX) If user clicks during transition from 0.6 to 0.8 brightess 
            // stays in 0.8 and first bar regains full-bar class
            // if (brightness>0.6) {
            //         brightness= 0.8;
            //         $('.brightness').css('opacity', brightness);
            //         $('.brightness-bar2:first-of-type').addClass('full-bar');
            //     };
        });

// Brightness bars change .brightness opacity and get full or empty
        $('.brightness-bar2:nth-child(2)').click(function() {
            $('.brightness').css({opacity: 0.7});
            $('.brightness-bar2:nth-child(2)').addClass('full-bar');
            $('.brightness-bar2:nth-child(3)').removeClass('full-bar');
            $('.brightness-bar2:nth-child(4)').removeClass('full-bar');
            $('.brightness-bar2:nth-child(5)').removeClass('full-bar');
            $('.brightness-bar2:nth-child(6)').removeClass('full-bar');
        });
        $('.brightness-bar2:nth-child(3)').click(function() {
            $('.brightness').css({opacity: 0.525});
            $('.brightness-bar2:nth-child(2)').addClass('full-bar');
            $('.brightness-bar2:nth-child(3)').addClass('full-bar');
            $('.brightness-bar2:nth-child(4)').removeClass('full-bar');
            $('.brightness-bar2:nth-child(5)').removeClass('full-bar');
            $('.brightness-bar2:nth-child(6)').removeClass('full-bar');
        });
        $('.brightness-bar2:nth-child(4)').click(function() {
            $('.brightness').css({opacity: 0.35});
            $('.brightness-bar2:nth-child(2)').addClass('full-bar');
            $('.brightness-bar2:nth-child(3)').addClass('full-bar');
            $('.brightness-bar2:nth-child(4)').addClass('full-bar');
            $('.brightness-bar2:nth-child(5)').removeClass('full-bar');
            $('.brightness-bar2:nth-child(6)').removeClass('full-bar');
        });
        $('.brightness-bar2:nth-child(5)').click(function() {
            $('.brightness').css({opacity: 0.175});
            $('.brightness-bar2:nth-child(2)').addClass('full-bar');
            $('.brightness-bar2:nth-child(3)').addClass('full-bar');
            $('.brightness-bar2:nth-child(4)').addClass('full-bar');
            $('.brightness-bar2:nth-child(5)').addClass('full-bar');
            $('.brightness-bar2:nth-child(6)').removeClass('full-bar');
        });
        $('.brightness-bar2:nth-child(6)').click(function() {
            $('.brightness').css({opacity: 0});
            $('.brightness-bar2:nth-child(2)').addClass('full-bar');
            $('.brightness-bar2:nth-child(3)').addClass('full-bar');
            $('.brightness-bar2:nth-child(4)').addClass('full-bar');
            $('.brightness-bar2:nth-child(5)').addClass('full-bar');
            $('.brightness-bar2:nth-child(6)').addClass('full-bar');
        });
// END: Click on brightness buttons changes .brightness opacity





// START: Calculate percentage read
        var height = $(document).height();
        var viewportHeight = $(window).height();
        var scrollTop = $(document).scrollTop();
        var percentageRead = Math.round((scrollTop * 100) / (height - viewportHeight));
// print percentageRead in html
        $('.reading-percentage-data').html(percentageRead);

        $(document).scroll(function() {
            height = $(document).height();
            viewportHeight = $(window).height();
            scrollTop = $(document).scrollTop();
            percentageRead = Math.round((scrollTop * 100) / (height - viewportHeight));

            // update percentageRead in html on scroll
            $('.reading-percentage-data').html(percentageRead);
        });
// END: Calculate percentage read

//// START: Calculate percentage read
//        var viewportHeight = $('#scrollWrapper').height();
//        var height = $('.reading-wrapper').height();
//        var scrollTop = $('#scrollWrapper').scrollTop();
//        var percentageRead = Math.round((scrollTop * 100) / (height - viewportHeight));
//// print percentageRead in html
//        $('.reading-percentage-data').html(percentageRead);
//
//        $('#scrollWrapper').scroll(function() {
//            height = $('.reading-wrapper').height();
//            viewportHeight = $('#scrollWrapper').height();
//            scrollTop = $('#scrollWrapper').scrollTop();
//            percentageRead = Math.round((scrollTop * 100) / (height - viewportHeight));
//
//            // update percentageRead in html on scroll
//            $('.reading-percentage-data').html(percentageRead);
//        });
//// END: Calculate percentage read


// START: Calculate reading minutes remaining
        var words = $('.bodyText').text()
                , wordCount = words.replace(/[^\w ]/g, "").split(/\s+/).length;
        var averageWordsPerMin = 250;
        var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageRead / 100)));
// print minutesLeft in html
        $('.minutes-left-data').html(minutesLeft);

        $(document).scroll(function() {
        //$('#scrollWrapper').scroll(function() {
            var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageRead / 100)));
            // update minutesLeft in html on scroll
            $('.minutes-left-data').html(minutesLeft);
        });
// END: Calculate reading minutes remaining


// START: Click on size buttons changes body font-size
        $('.size-small-div').click(function() {
            $('body').css({'font-size': '1.125em'});
            $('.size-small-div').removeClass('active');
            $('.size-medium-div').removeClass('active');
            $('.size-large-div').removeClass('active');
            $(this).addClass('active');

            // Rerun info calculations for correct % read and minutes left.
            height = $(document).height();
            scrollTop = $(document).scrollTop();
            percentageRead = Math.round((scrollTop * 100) / (height - viewportHeight));
            $('.reading-percentage-data').html(percentageRead);
            var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageRead / 100)));
            $('.minutes-left-data').html(minutesLeft);
        });
        $('.size-medium-div').click(function() {
            $('body').css({'font-size': '1.35em'});
            $('.size-small-div').removeClass('active');
            $('.size-medium-div').removeClass('active');
            $('.size-large-div').removeClass('active');
            $(this).addClass('active');

            // Rerun info calculations for correct % read and minutes left.
            height = $(document).height();
            scrollTop = $(document).scrollTop();
            percentageRead = Math.round((scrollTop * 100) / (height - viewportHeight));
            $('.reading-percentage-data').html(percentageRead);
            var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageRead / 100)));
            $('.minutes-left-data').html(minutesLeft);
        });
        $('.size-large-div').click(function() {
            $('body').css({'font-size': '1.575em'});
            $('.size-small-div').removeClass('active');
            $('.size-medium-div').removeClass('active');
            $('.size-large-div').removeClass('active');
            $(this).addClass('active');

            // Rerun info calculations for correct % read and minutes left.
            height = $(document).height();
            scrollTop = $(document).scrollTop();
            percentageRead = Math.round((scrollTop * 100) / (height - viewportHeight));
            $('.reading-percentage-data').html(percentageRead);
            var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageRead / 100)));
            $('.minutes-left-data').html(minutesLeft);
        });
// END: Click on size buttons changes body font-size

// START: .reading-info-box, .menu-tip and .nav-menu opacity is 1 if mouse moves, then fade away
// $(window).on("mousemove",function(e){
//     $(".reading-info-box").css({opacity:1});
//     clearTimeout(window.myTimeout);
//     window.myTimeout=setTimeout(function(){
//         $(".reading-info-box").css({opacity:0});
//     },1500);
// });
// $(window).on("mousemove",function(e){
//     $(".menu-tip").css({opacity:1});
//     clearTimeout(window.timeout);
//     window.timeout=setTimeout(function(){
//         $(".menu-tip").css({opacity:0});
//     },1500);
// });
// END: .nav-menu opacity is 1 if mouse moves. Then fades away.


// START: Autogrow.js textareas enlarge as user keeps typing
        /* autogrow.js - Copyright (C) 2014, Jason Edelman <edelman.jason@gmail.com>
         Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
         The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
         THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */
        ;
        (function(e) {
            e.fn.autogrow = function(t) {
                function s(n) {
                    var r = e(this), i = r.innerHeight(), s = this.scrollHeight, o = r.data("autogrow-start-height") || 0, u;
                    if (i < s) {
                        this.scrollTop = 0;
                        t.animate ? r.stop().animate({height: s}, t.speed) : r.innerHeight(s)
                    } else if (!n || n.which == 8 || n.which == 46 || n.ctrlKey && n.which == 88) {
                        if (i > o) {
                            u = r.clone().addClass(t.cloneClass).css({position: "absolute", zIndex: -10, height: ""}).val(r.val());
                            r.after(u);
                            do {
                                s = u[0].scrollHeight - 1;
                                u.innerHeight(s)
                            } while (s === u[0].scrollHeight);
                            s++;
                            u.remove();
                            r.focus();
                            s < o && (s = o);
                            i > s && t.animate ? r.stop().animate({height: s}, t.speed) : r.innerHeight(s)
                        } else {
                            r.innerHeight(o)
                        }
                    }
                }
                var n = e(this).css({overflow: "hidden", resize: "none"}), r = n.selector, i = {context: e(document), animate: true, speed: 200, fixMinHeight: true, cloneClass: "autogrowclone", onInitialize: false};
                t = e.isPlainObject(t) ? t : {context: t ? t : e(document)};
                t = e.extend({}, i, t);
                n.each(function(n, r) {
                    var i, o;
                    r = e(r);
                    if (r.is(":visible") || parseInt(r.css("height"), 10) > 0) {
                        i = parseInt(r.css("height"), 10) || r.innerHeight()
                    } else {
                        o = r.clone().addClass(t.cloneClass).val(r.val()).css({position: "absolute", visibility: "hidden", display: "block"});
                        e("body").append(o);
                        i = o.innerHeight();
                        o.remove()
                    }
                    if (t.fixMinHeight) {
                        r.data("autogrow-start-height", i)
                    }
                    r.css("height", i);
                    if (t.onInitialize) {
                        s.call(r)
                    }
                });
                t.context.on("keyup paste", r, s);
                return n
            }
        })(jQuery);
// END: Autogrow.js textareas enlarge as user keeps typing


// START: Autogrow.js aplicado en .note-input
        $('.note-input').autogrow({onInitialize: true});
// END: Autogrow.js aplicado en .note-input


// START: Click en una frase le agrega o elimina clase .highlight
        $('.bodyText .sentence').on('click',
                function() {
                    if ($(this).hasClass("highlight")) {
                        $(this).removeClass("highlight");
                    }
                    else {
                        $(this).addClass("highlight");
                    }
                });
// END: Click en una frase le agrega o elimina clase .highlight


// START: TESTING Click en logo Lorapp le agrega o elimina clase .blurred al body -Borrar en versión abierta al público
        $('.footer-logo').on('click',
                function() {
//                    if ($('body').hasClass('blurred')) {
//                        $('body').removeClass('blurred');
//                    }
//                    else {
//                        $('body').addClass('blurred');
//                    }
                });
// START: TESTING Click en logo Lorapp le agrega o elimina clase .blurred al body

// START: Initialize bootstrap popovers on hover and tooltips
        $(function() {
            $('[data-toggle="popover"]').popover({trigger: "hover"});
            $('[data-toggle="tooltip"]').tooltip();
        });
// END: Initialize bootstrap popovers on hover and tooltips
//        $("#icon_note").click(function(event) {
//            myLecture.openNoteLoader(global.lecturesection_id);
//        });
// START: Initialize Fancybox with overlay not locked to fix bug that made page jump to top when using fancybox
        $(".fancybox").fancybox({
            // padding: 0,
            helpers: {
                overlay: {
                    locked: false
                }
            }
        });
// END: Initialize Fancybox

        //$(document).bind("mouseup", ReadingLorapp.Selector.mouseup);
//        $('#bodyText').bind("mouseup", ReadingLorapp.Selector.mouseup);
/// http://madapaja.github.io/jquery.selection/
        // Get selected text / 選択部分のテキストを取得
        $('#sel-text').click(function() {
            $('#result').text($.selection());
        });

// Get selected html / 選択部分のHTMLを取得
        $('#sel-html').click(function() {
            $('#result').text($.selection('html'));
        });
        $('#bodyText').mouseup(TextHighlight.Selector.mouseup);


        //bloquea el clic derecho y copiar con teclado
        if (document.layers) {
            document.captureEvents(Event.MOUSEDOWN);
            document.onmousedown = function(e) {
                if (document.layers || document.getElementById && !document.all) {
                    if (e.which == 2 || e.which == 3) {
                        return false;
                    }
                }
            };
        } else if (document.all && !document.getElementById) {
            document.onmousedown = function() {
                if (event.button == 2) {
                    return false;
                }
            };
        }
        document.oncontextmenu = new Function("return false");
        document.ondragstart = new Function("return false");
        document.oncopy = new Function("return false");
        
        // para remover elementos HTML de un string
        //jQuery('<p>' + $('.lecture_container').html() + '</p>').text();
        
        
    };


})();

/**
 * Funcion de inicializacion en el momento en que se completa el DOM llamada desde jquery
 * Esta funcion realiza los procesos de inicializacion de la aplicacion
 */
$(function() {
    ReadingLorapp.initialize();
});
