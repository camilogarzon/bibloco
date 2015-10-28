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
//            NoteAction.getNote(global.lecturesection_id);
        });

    };

    /** 
     * Metodo que ejecuta snippets de codigo, pendiente por organizar en los respectivos modulos
     */

    ReadingLorapp.snippets = function() {


        $(document).ready(function() {

            // Función que recalcula el porcentaje leído
            function calculatePercentageRead() {
                height = $('#reading-container').height();
                viewportHeight = $(window).height();
                scrollTop = $(document).scrollTop();
                readingBeginning = $('#reading-container').offset().top;
                percentageRead = ((scrollTop - readingBeginning) * 100) / (height - viewportHeight);
                roundedPercentageRead = Math.round(percentageRead);
            }

            // Función que reimprime el porcentaje tanto en número como en la barra de progreso
            function printPercentageRead() {
                if (percentageRead > 100) {
                    $('.reading-percentage-data').html(100);
                    $('.reading-progress-bar-full').css({"width":100+"%"});
                } else if (percentageRead < 0) {
                    $('.reading-percentage-data').html(0);
                    $('.reading-progress-bar-full').css({"width":0+"%"});
                } else {
                    $('.reading-percentage-data').html(roundedPercentageRead);
                    $('.reading-progress-bar-full').css({"width":percentageRead+"%"});
                }
            }

            // START: Page smoothly scrolls until the #reading-container, to hide the previous chapter button.
            // Condition so it doesn't happen when page is refreshed in the middle of the reading.
            var scrollTop = $(document).scrollTop();
            var readingBeginning = $('#reading-container').offset().top;

            if (scrollTop < readingBeginning) {
                $("html, body").animate({ scrollTop: $('#reading-container').offset().top }, 500);
            };
            // END: Page smoothly scrolls until the #reading-container, to hide the previous chapter button

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
            $("#takeHighlight").click(function(event) {
                event.preventDefault();
                $(".add-note-wrapper").addClass("show");
            });

            /**
             * click en botón Cancelar apunte esconde casilla de apuntes y (limpia el campo de texto -por hacer-)
             */
            $("#btn_cancelar_note").click(function(event) {
                event.preventDefault();
                $(".add-note-wrapper").removeClass("show");
            });

            /**
            * click en botón apuntes hace slide de apuntes
            */
            $(".show-my-notes-btn").on('click touchend', function(event) {
                event.preventDefault();
                $(".notesMainWrapper").addClass("show");
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
                $(".my-readings-wrapper").addClass("show");
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
                $(".my-readings-wrapper").removeClass("show");
                // Se desbloquea el scroll del body
                $(".notesMainWrapper").removeClass("show");

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
                var currentScrollPosition = $(document).scrollTop();
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
                window.scrollTo(0, currentScrollPosition);
            });


            // START: Click en boton full-width lleva a full-width
            $('.wide-btn-div').on('click',
                    function() {
                        // if the button is clicked when active
                        $('.body-wrapper').addClass('reading-full-width');
                        $('.narrow-btn-div').removeClass('active');
                        $(this).addClass('active');

                        // Rerun info calculations for correct % read and minutes left.
                        calculatePercentageRead();
                        
                        // reprint percentage read, keep 0 if < 0 and 100 if > 100
                        printPercentageRead();

                        var percentageShown = $('.reading-percentage-data').html();
                        var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageShown / 100)));
                        $('.minutes-left-data').html(minutesLeft);
                    });

            $('.narrow-btn-div').on('click',
                    function() {
                        // if the button is clicked when active
                        $('.body-wrapper').removeClass('reading-full-width');
                        $('.wide-btn-div').removeClass('active');
                        $(this).addClass('active');

                        // Rerun info calculations for correct % read and minutes left.
                        calculatePercentageRead();
                        
                        // reprint percentage read, keep 0 if < 0 and 100 if > 100
                        printPercentageRead();

                        var percentageShown = $('.reading-percentage-data').html();
                        var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageShown / 100)));
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
                $('.color-light-btn, .color-sepia-btn, .color-night-btn').removeClass('active');
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
                $('.color-light-btn, .color-sepia-btn, .color-night-btn').removeClass('active');
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
                $('.color-light-btn, .color-sepia-btn, .color-night-btn').removeClass('active');
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
            $('.brightness-bar2:nth-child(3), .brightness-bar2:nth-child(4), .brightness-bar2:nth-child(5), .brightness-bar2:nth-child(6)').removeClass('full-bar');
        });
        $('.brightness-bar2:nth-child(3)').click(function() {
            $('.brightness').css({opacity: 0.525});
            $('.brightness-bar2:nth-child(2), .brightness-bar2:nth-child(3)').addClass('full-bar');
            $('.brightness-bar2:nth-child(4), .brightness-bar2:nth-child(5), .brightness-bar2:nth-child(6)').removeClass('full-bar');
        });
        $('.brightness-bar2:nth-child(4)').click(function() {
            $('.brightness').css({opacity: 0.35});
            $('.brightness-bar2:nth-child(2), .brightness-bar2:nth-child(3), .brightness-bar2:nth-child(4)').addClass('full-bar');
            $('.brightness-bar2:nth-child(5), .brightness-bar2:nth-child(6)').removeClass('full-bar');
        });
        $('.brightness-bar2:nth-child(5)').click(function() {
            $('.brightness').css({opacity: 0.175});
            $('.brightness-bar2:nth-child(2), .brightness-bar2:nth-child(3), .brightness-bar2:nth-child(4), .brightness-bar2:nth-child(5)').addClass('full-bar');
            $('.brightness-bar2:nth-child(6)').removeClass('full-bar');
        });
        $('.brightness-bar2:nth-child(6)').click(function() {
            $('.brightness').css({opacity: 0});
            $('.brightness-bar2:nth-child(2), .brightness-bar2:nth-child(3), .brightness-bar2:nth-child(4), .brightness-bar2:nth-child(5), .brightness-bar2:nth-child(6)').addClass('full-bar');
        });
// END: Click on brightness buttons changes .brightness opacity





// START: Calculate percentage read
        var height = $('#reading-container').height();
        var viewportHeight = $(window).height();
        var scrollTop = $(document).scrollTop();
        var readingBeginning = $('#reading-container').offset().top;
        var percentageRead = ((scrollTop - readingBeginning) * 100) / (height - viewportHeight);
        var roundedPercentageRead = Math.round(percentageRead);

        // print percentageRead in html. Keep 0 if < 0 and 100 if > 100
        if (percentageRead > 100) {
            $('.reading-percentage-data').html(100);
            $('.reading-progress-bar-full').css({"width":100+"%"});
        }
        else if (percentageRead < 0) {
            $('.reading-percentage-data').html(0);
            $('.reading-progress-bar-full').css({"width":0+"%"});
        }
        else {
            $('.reading-percentage-data').html(roundedPercentageRead);
            $('.reading-progress-bar-full').css({"width":percentageRead+"%"});
        };

        // recalculate when scrolling
        $(document).scroll(function() {
            height = $('#reading-container').height();
            viewportHeight = $(window).height();
            scrollTop = $(document).scrollTop();
            readingBeginning = $('#reading-container').offset().top;
            percentageRead = ((scrollTop - readingBeginning) * 100) / (height - viewportHeight);
            roundedPercentageRead = Math.round(percentageRead);
            

            // print updated percentageRead in html on scroll. Keep 0 if < 0 and 100 if > 100
            if (percentageRead > 100) {
                $('.reading-percentage-data').html(100);
                $('.reading-progress-bar-full').css({"width":100+"%"});
            } else if (percentageRead < 0) {
                $('.reading-percentage-data').html(0);
                $('.reading-progress-bar-full').css({"width":0+"%"});
            } else {
                $('.reading-percentage-data').html(roundedPercentageRead);
                $('.reading-progress-bar-full').css({"width":percentageRead+"%"});
            }
        });
// END: Calculate percentage read

// START: Calculate reading minutes remaining
        var words = $('.bodyText').text()
                , wordCount = words.replace(/[^\w ]/g, "").split(/\s+/).length;
        var averageWordsPerMin = 250;
        var percentageShown = $('.reading-percentage-data').html();
        var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageShown / 100)));
        // print minutesLeft in html
        $('.minutes-left-data').html(minutesLeft);

        // recalculate on scroll
        $(document).scroll(function() {
            var percentageShown = $('.reading-percentage-data').html();
            var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageShown / 100)));
            // print updated minutesLeft in html on scroll
            $('.minutes-left-data').html(minutesLeft);
        });
// END: Calculate reading minutes remaining


// START: Click on size buttons changes body font-size
        $('.size-small-div').click(function() {
            $('body').css({'font-size': '1.125em'});
            $('.size-small-div, .size-medium-div, .size-large-div').removeClass('active');
            $(this).addClass('active');

            // Rerun info calculations for correct % read and minutes left.
            height = $(document).height();
            scrollTop = $(document).scrollTop();
            percentageRead = ((scrollTop - readingBeginning) * 100) / (height - viewportHeight);
            roundedPercentageRead = Math.round(percentageRead);
            if (percentageRead > 100) {
                $('.reading-percentage-data').html(100);
                $('.reading-progress-bar-full').css({"width":100+"%"});
            } else if (percentageRead < 0) {
                $('.reading-percentage-data').html(0);
                $('.reading-progress-bar-full').css({"width":0+"%"});
            } else {
                $('.reading-percentage-data').html(roundedPercentageRead);
                $('.reading-progress-bar-full').css({"width":percentageRead+"%"});
            };
            var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageRead / 100)));
            $('.minutes-left-data').html(minutesLeft);
        });
        $('.size-medium-div').click(function() {
            $('body').css({'font-size': '1.35em'});
            $('.size-small-div, .size-medium-div, .size-large-div').removeClass('active');
            $(this).addClass('active');

            // Rerun info calculations for correct % read and minutes left.
            height = $(document).height();
            scrollTop = $(document).scrollTop();
            percentageRead = ((scrollTop - readingBeginning) * 100) / (height - viewportHeight);
            roundedPercentageRead = Math.round(percentageRead);
            if (percentageRead > 100) {
                $('.reading-percentage-data').html(100);
                $('.reading-progress-bar-full').css({"width":100+"%"});
            } else if (percentageRead < 0) {
                $('.reading-percentage-data').html(0);
                $('.reading-progress-bar-full').css({"width":0+"%"});
            } else {
                $('.reading-percentage-data').html(roundedPercentageRead);
                $('.reading-progress-bar-full').css({"width":percentageRead+"%"});
            };
            var minutesLeft = Math.round((wordCount / averageWordsPerMin) - ((wordCount / averageWordsPerMin) * (percentageRead / 100)));
            $('.minutes-left-data').html(minutesLeft);
        });
        $('.size-large-div').click(function() {
            $('body').css({'font-size': '1.575em'});
            $('.size-small-div, .size-medium-div, .size-large-div').removeClass('active');
            $(this).addClass('active');

            // Rerun info calculations for correct % read and minutes left.
            height = $(document).height();
            scrollTop = $(document).scrollTop();
            percentageRead = ((scrollTop - readingBeginning) * 100) / (height - viewportHeight);
            roundedPercentageRead = Math.round(percentageRead);
            if (percentageRead > 100) {
                $('.reading-percentage-data').html(100);
                $('.reading-progress-bar-full').css({"width":100+"%"});
            } else if (percentageRead < 0) {
                $('.reading-percentage-data').html(0);
                $('.reading-progress-bar-full').css({"width":0+"%"});
            } else {
                $('.reading-percentage-data').html(roundedPercentageRead);
                $('.reading-progress-bar-full').css({"width":percentageRead+"%"});
            };
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


// START: Autogrow.js aplicado en .note-input y en .edit-note-textarea
        $('.note-input').autogrow({onInitialize: true});
        $('.edit-note-textarea').autogrow({onInitialize: true});
// END: Autogrow.js aplicado en .note-input y en .edit-note-textarea




// START: TESTING SelectionSharer.js
        /*
         * share-selection: Medium like popover menu to share on Twitter or by email any text selected on the page
         *
         * -- Requires jQuery --
         * -- AMD compatible  --
         *
         * Author: Xavier Damman (@xdamman)
         * GIT: https://github.com/xdamman/share-selection
         * MIT License
         */

        (function($) {

            var SelectionSharer = function(options) {

                var self = this;

                options = options || {};
                if (typeof options == 'string')
                    options = {elements: options};

                this.sel = null;
                this.textSelection = '';
                this.htmlSelection = '';

                // this.appId = $('meta[property="fb:app_id"]').attr("content") || $('meta[property="fb:app_id"]').attr("value");
                // this.url2share = $('meta[property="og:url"]').attr("content") || $('meta[property="og:url"]').attr("value") || window.location.href;

                this.getSelectionText = function(sel) {
                    var html = "", text = "";
                    var sel = sel || window.getSelection();
                    if (sel.rangeCount) {
                        var container = document.createElement("div");
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            container.appendChild(sel.getRangeAt(i).cloneContents());
                        }
                        text = container.textContent;
                        html = container.innerHTML
                    }
                    self.textSelection = text;
                    self.htmlSelection = html || text;
                    return text;
                };

                this.selectionDirection = function(selection) {
                    var sel = selection || window.getSelection();
                    var range = document.createRange();
                    if (!sel.anchorNode)
                        return 0;
                    range.setStart(sel.anchorNode, sel.anchorOffset);
                    range.setEnd(sel.focusNode, sel.focusOffset);
                    var direction = (range.collapsed) ? "backward" : "forward";
                    range.detach();
                    return direction;
                };

                this.showPopunder = function() {
                    self.popunder = self.popunder || document.getElementById('selectionSharerPopunder');

                    var sel = window.getSelection();
                    var selection = self.getSelectionText(sel);

                    if (sel.isCollapsed || selection.length < 10 || !selection.match(/ /))
                        return self.hidePopunder();

                    if (self.popunder.classList.contains("fixed"))
                        return self.popunder.style.bottom = 0;

                    var range = sel.getRangeAt(0);
                    var node = range.endContainer.parentNode; // The <p> where the selection ends

                    // If the popunder is currently displayed
                    if (self.popunder.classList.contains('show')) {
                        // If the popunder is already at the right place, we do nothing
                        if (Math.ceil(self.popunder.getBoundingClientRect().top) == Math.ceil(node.getBoundingClientRect().bottom))
                            return;

                        // Otherwise, we first hide it and the we try again
                        return self.hidePopunder(self.showPopunder);
                    }

                    if (node.nextElementSibling) {
                        // We need to push down all the following siblings
                        self.pushSiblings(node);
                    }
                    else {
                        // We need to append a new element to push all the content below
                        if (!self.placeholder) {
                            self.placeholder = document.createElement('div');
                            self.placeholder.className = 'selectionSharerPlaceholder';
                        }

                        // If we add a div between two <p> that have a 1em margin, the space between them
                        // will become 2x 1em. So we give the placeholder a negative margin to avoid that
                        var margin = window.getComputedStyle(node).marginBottom;
                        self.placeholder.style.height = margin;
                        self.placeholder.style.marginBottom = (-2 * parseInt(margin, 10)) + 'px';
                        node.parentNode.insertBefore(self.placeholder);
                    }

                    // scroll offset
                    var offsetTop = window.pageYOffset + node.getBoundingClientRect().bottom;
                    self.popunder.style.top = Math.ceil(offsetTop) + 'px';

                    setTimeout(function() {
                        if (self.placeholder)
                            self.placeholder.classList.add('show');
                        self.popunder.classList.add('show');
                    }, 0);

                };

                this.pushSiblings = function(el) {
                    while (el = el.nextElementSibling) {
                        el.classList.add('selectionSharer');
                        el.classList.add('moveDown');
                    }
                };

                this.hidePopunder = function(cb) {
                    cb = cb || function() {
                    };

                    if (self.popunder == "fixed") {
                        self.popunder.style.bottom = '-50px';
                        return cb();
                    }

                    self.popunder.classList.remove('show');
                    if (self.placeholder)
                        self.placeholder.classList.remove('show');
                    // We need to push back up all the siblings
                    var els = document.getElementsByClassName('moveDown');
                    while (el = els[0]) {
                        el.classList.remove('moveDown');
                    }

                    // CSS3 transition takes 0.6s
                    setTimeout(function() {
                        if (self.placeholder)
                            document.body.insertBefore(self.placeholder);
                        cb();
                    }, 600);

                };

                this.show = function(e) {
                    setTimeout(function() {
                        var sel = window.getSelection();
                        var selection = self.getSelectionText(sel);
                        // In the next line, the x in "selection.length < x" determines 
                        // the min string lenght that will trigger the popover
                        if (!sel.isCollapsed && selection && selection.length > 2 && selection.match(/ /)) {
                            var range = sel.getRangeAt(0);
                            var topOffset = range.getBoundingClientRect().top - 5;
                            var top = topOffset + window.scrollY - self.$popover.height();
                            var left = 0;
                            if (e) {
                                left = e.pageX;
                            }
                            else {
                                var obj = sel.anchorNode.parentNode;
                                left += obj.offsetWidth / 2;
                                do {
                                    left += obj.offsetLeft;
                                }
                                while (obj = obj.offsetParent);
                            }
                            switch (self.selectionDirection(sel)) {
                                case 'forward':
                                    left -= self.$popover.width() / 2;
                                    break;
                                case 'backward':
                                    left += self.$popover.width() * -0.5;
                                    break;
                                default:
                                    return;
                            }
                            self.$popover.removeClass("anim").css("top", top + 10).css("left", left).show();
                            setTimeout(function() {
                                self.$popover.addClass("anim").css("top", top);
                            }, 0);
                        }
                    }, 10);
                };

                this.hide = function(e) {
                    self.$popover.hide();
                };

                this.smart_truncate = function(str, n) {
                    if (!str || !str.length)
                        return str;
                    var toLong = str.length > n,
                            s_ = toLong ? str.substr(0, n - 1) : str;
                    s_ = toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
                    return  toLong ? s_ + '...' : s_;
                };

                // this.getRelatedTwitterAccounts = function() {
                //   var usernames = [];

                //   var creator = $('meta[name="twitter:creator"]').attr("content") || $('meta[name="twitter:creator"]').attr("value");
                //   if(creator) usernames.push(creator);


                //   // We scrape the page to find a link to http(s)://twitter.com/username
                //   var anchors = document.getElementsByTagName('a');
                //   for(var i=0, len=anchors.length;i<len;i++) {
                //     if(anchors[i].attributes.href && typeof anchors[i].attributes.href.value == 'string') {
                //       var matches = anchors[i].attributes.href.value.match(/^https?:\/\/twitter\.com\/([a-z0-9_]{1,20})/i)
                //       if(matches && matches.length > 1 && ['widgets','intent'].indexOf(matches[1])==-1)
                //         usernames.push(matches[1]);
                //     }
                //   }

                //   if(usernames.length > 0)
                //     return usernames.join(',');
                //   else
                //     return '';
                // };

                // this.shareTwitter = function(e) {
                //   e.preventDefault();

                //   var text = "“"+self.smart_truncate(self.textSelection.trim(), 114)+"”";
                //   var url = 'http://twitter.com/intent/tweet?text='+encodeURIComponent(text)+'&related='+self.relatedTwitterAccounts+'&url='+encodeURIComponent(window.location.href);

                //   // We only show the via @twitter:site if we have enough room
                //   if(self.viaTwitterAccount && text.length < (120-6-self.viaTwitterAccount.length))
                //     url += '&via='+self.viaTwitterAccount;

                //   var w = 640, h=440;
                //   var left = (screen.width/2)-(w/2);
                //   var top = (screen.height/2)-(h/2)-100;
                //   window.open(url, "share_twitter", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
                //   self.hide();
                //   return false;
                // };

                // this.shareFacebook = function(e) {
                //   e.preventDefault();
                //   var text = self.htmlSelection.replace(/<p[^>]*>/ig,'\n').replace(/<\/p>|  /ig,'').trim();

                //   var url = 'https://www.facebook.com/dialog/feed?' +
                //             'app_id='+self.appId +
                //             '&display=popup'+
                //             '&caption='+encodeURIComponent(text)+
                //             '&link='+encodeURIComponent(self.url2share)+
                //             '&href='+encodeURIComponent(self.url2share)+
                //             '&redirect_uri='+encodeURIComponent(self.url2share);
                //   var w = 640, h=440;
                //   var left = (screen.width/2)-(w/2);
                //   var top = (screen.height/2)-(h/2)-100;

                //   window.open(url, "share_facebook", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
                // };

                // this.shareEmail = function(e) {
                //   var text = self.htmlSelection.replace(/<p[^>]*>/ig,'\n').replace(/<\/p>|  /ig,'').trim();
                //   var email = {};
                //   email.subject = encodeURIComponent("Quote from "+document.title);
                //   email.body = encodeURIComponent("“"+text+"”")+"%0D%0A%0D%0AFrom: "+document.title+"%0D%0A"+window.location.href;
                //   $(this).attr("href","mailto:?subject="+email.subject+"&body="+email.body);
                //   self.hide();
                //   return true;
                // };

                this.addNote = function(e) {
                    $('#selectionSharerPopover').hide();
                    TextHighlight.Selector.mouseup(self.textSelection, self.htmlSelection);
                    return true;
                };

                this.render = function() {
                    var popoverHTML = '<div class="selectionSharer" id="selectionSharerPopover" style="position:absolute;">'
                            + '  <div id="selectionSharerPopover-inner" style="    height: 36px;">'
                            + '    <ul>'
                            // + '      <li><a class="action tweet" href="" title="Share this selection on Twitter" target="_blank">Tweet</a></li>'
                            // + '      <li><a class="action facebook" href="" title="Share this selection on Facebook" target="_blank">Facebook</a></li>'
                            // + '      <li><a class="action email" href="" title="Share this selection by email" target="_blank"><svg width="20" height="20"><path stroke="#FFF" stroke-width="6" d="m16,25h82v60H16zl37,37q4,3 8,0l37-37M16,85l30-30m22,0 30,30"/></svg></a></li>'
                             + '      <li><a class="action highlight-btn active" title="Resaltado" target="_blank"><span class="glyphicon glyphicon-ok highlight-ok-icon"></span><span class="glyphicon glyphicon-remove highlight-cancel-icon"></span><span class="glyphicon glyphicon-font highlight-icon"></span></a></li>'
                            + '      <li><a class="action add-note-btn" title="Agregar nota" ><span class="glyphicon glyphicon-pencil add-note-icon"></span></a></li>'
                            + '    </ul>'
                            + '  </div>'
                            + '  <div class="selectionSharerPopover-clip"><span class="selectionSharerPopover-arrow"></span></div>'
                            + '</div>';

                    var popunderHTML = '<div id="selectionSharerPopunder" class="selectionSharer">'
                            + '  <div id="selectionSharerPopunder-inner">'
                            + '    <label>Subraya o toma una nota</label>'
                            + '    <ul>'
                            // + '      <li><a class="action tweet" href="" title="Share this selection on Twitter" target="_blank">Tweet</a></li>'
                            // + '      <li><a class="action facebook" href="" title="Share this selection on Facebook" target="_blank">Facebook</a></li>'
                            // + '      <li><a class="action email" href="" title="Share this selection by email" target="_blank"><svg width="20" height="20"><path stroke="#FFF" stroke-width="6" d="m16,25h82v60H16zl37,37q4,3 8,0l37-37M16,85l30-30m22,0 30,30"/></svg></a></li>'
                             + '      <li><a class="action highlight-btn active" title="Resaltado" target="_blank"><span class="glyphicon glyphicon-ok highlight-ok-icon"></span><span class="glyphicon glyphicon-remove highlight-cancel-icon"></span></a></li>'
                            + '      <li><a class="action add-note-btn" title="Agregar nota" ><span class="glyphicon glyphicon-pencil add-note-icon"></span></a></li>'
                            + '    </ul>'
                            + '  </div>'
                            + '</div>';
                    self.$popover = $(popoverHTML);
                    // self.$popover.find('a.tweet').click(self.shareTwitter);
                    // self.$popover.find('a.facebook').click(self.shareFacebook);
                    // self.$popover.find('a.email').click(self.shareEmail);
                    self.$popover.find('a.add-note-btn').click(self.addNote);

                    $('body').append(self.$popover);

                    self.$popunder = $(popunderHTML);
                    // self.$popunder.find('a.tweet').click(self.shareTwitter);
                    // self.$popunder.find('a.facebook').click(self.shareFacebook);
                    // self.$popunder.find('a.email').click(self.shareEmail);
                    self.$popunder.find('a.add-note-btn').click(self.addNote);

                    // if (self.appId && self.url2share){
                    //   $(".selectionSharer a.facebook").css('display','inline-block');
                    // }
                };

                this.setElements = function(elements) {
                    if (typeof elements == 'string')
                        elements = $(elements);
                    self.$elements = elements instanceof $ ? elements : $(elements);
                    self.$elements.mouseup(self.show).mousedown(self.hide).addClass("selectionShareable");

                    self.$elements.bind('touchstart', function(e) {
                        self.isMobile = true;
                    });

                    document.onselectionchange = self.selectionChanged;
                };

                this.selectionChanged = function(e) {
                    if (!self.isMobile)
                        return;

                    if (self.lastSelectionChanged) {
                        clearTimeout(self.lastSelectionChanged);
                    }
                    self.lastSelectionChanged = setTimeout(function() {
                        self.showPopunder(e);
                    }, 300);
                };

                this.render();

                if (options.elements) {
                    this.setElements(options.elements);
                }

            };

            // jQuery plugin
            // Usage: $( "p" ).selectionSharer();
            $.fn.selectionSharer = function() {
                var sharer = new SelectionSharer();
                sharer.setElements(this);
                return this;
            };

            // For AMD / requirejs
            // Usage: require(["selection-sharer!"]);
            //     or require(["selection-sharer"], function(selectionSharer) { var sharer = new SelectionSharer('p'); });
            if (typeof define == 'function') {
                define(function() {
                    SelectionSharer.load = function(name, req, onLoad, config) {
                        var sharer = new SelectionSharer();
                        sharer.setElements('p');
                        onLoad();
                    };
                    return SelectionSharer;
                });

            }
            else {
                // Registering SelectionSharer as a global
                // Usage: var sharer = new SelectionSharer('p');
                window.SelectionSharer = SelectionSharer;
            }

        })(jQuery);

// Apply SelectionSharer.js to .bodyText
        $('.mainWrapper .bodyText').selectionSharer();

// END: TESTING SelectionSharer.js
















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

////        //$(document).bind("mouseup", ReadingLorapp.Selector.mouseup);
//////        $('#bodyText').bind("mouseup", ReadingLorapp.Selector.mouseup);
/////// http://madapaja.github.io/jquery.selection/
////        // Get selected text / 選択部分のテキストを取得
////        $('#sel-text').click(function() {
////            $('#result').text($.selection());
////        });
////
////// Get selected html / 選択部分のHTMLを取得
////        $('#sel-html').click(function() {
////            $('#result').text($.selection('html'));
////        });
//        $('#bodyText').mouseup(TextHighlight.Selector.mouseup);


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

//        var myLecture = {};
//        /**
//         * Muestra opciones del toolbox de lectura: seleccionar, resaltar, limpiar, crear nota
//         * @param Event e
//         */
//        myLecture.floatMenu = function(e) {
//            myLecture.savedText = myLecture.saveSelection();
//            setTimeout(function() {
//                var isEmpty = myLecture.savedText.toString().length === 0;
//                if (!isEmpty) {
//                    $("#highlight-button").css({position: 'absolute'});//, top: e.pageY, left: e.pageX});
//                    //$("#float_note").css({top: e.pageY + 40});
//                    $("#highlight-button").show();
//                } else {
//                    //$(".add-note-wrapper").animate({bottom: "-18em"}, 10);
//                    $("#highlight-button").hide();
//                    $("#float_note").hide();
//                }
//            }, 10);
//        };
//        myLecture.saveSelection = function() {
//            if (window.getSelection) {
//                var sel = window.getSelection();
//                if (sel.getRangeAt && sel.rangeCount) {
//                    return sel.getRangeAt(0);
//                }
//            } else if (document.selection && document.selection.createRange) {
//                return document.selection.createRange();
//            }
//            return null;
//        };
//
//        var hltr = new TextHighlighter(document.getElementById('bodyText'), {
//            onBeforeHighlight: function(range) {
//                console.log(range);
//                myLecture.floatMenu(null);
//                return true;
//            },
//            onAfterHighlight: function(range, hlts) {
//                return true;
//            },
//            onRemoveHighlight: function(hlt) {
//                return true;
//            }
//        });

    };


})();

/**
 * Funcion de inicializacion en el momento en que se completa el DOM llamada desde jquery
 * Esta funcion realiza los procesos de inicializacion de la aplicacion
 */


$(function() {
    ReadingLorapp.initialize();
});
