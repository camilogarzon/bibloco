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
    ReadingLorapp.averageWordsPerMin = 125;
    ReadingLorapp.userEnable = false;

    //////////////////////////////////////////////////////////////////////
    // METODOS ///////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    ReadingLorapp.setUserFontSize = function(fontSize){ global.fontSize = fontSize; };
    ReadingLorapp.getUserFontSize = function(){ return global.fontSize; };
    ReadingLorapp.setUserBackgroundStyle = function(backgroundStyle){ global.backgroundStyle = backgroundStyle; };
    ReadingLorapp.getUserBackgroundStyle = function(){ return global.backgroundStyle; };

    /**
     * CLICK EN #BUTTON-FULLSCREEN LLEVA A PANTALLA COMPLETA Y CLICK DE NUEVO SALE DE ELLA
     */
    ReadingLorapp.toggleFullScreen = function(event){
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
    };
    /**
     * Funcion que calcula el porcentaje leido
     */
    ReadingLorapp.calculatePercentageRead = function(){
        var height = $('#reading-container').height();
        var viewportHeight = $(window).height();
        var scrollTop = $(document).scrollTop();
        var readingBeginning = $('#reading-container').offset().top;
        percentageRead = ((scrollTop - readingBeginning) * 100) / (height - viewportHeight);
        roundedPercentageRead = Math.round(percentageRead);
    };

    /**
     * reimprime el porcentaje tanto en número como en la barra de progreso
     */
    ReadingLorapp.printPercentageRead = function() {
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
    };

    /**
     *
     * @param pr Porcentaje relacionado para el calculo de los minutos estimados de lectura
     */
    ReadingLorapp.updateMinutes = function(pr) {
        pr = parseInt(pr);
        pr = (isNaN(pr)) ? parseInt($('.reading-percentage-data').html()) : pr;
        var words = $('.bodyText').text();
        var wordCount = words.replace(/[^\w ]/g, "").split(/\s+/).length;
        var minutesLeft = Math.round((wordCount / ReadingLorapp.averageWordsPerMin) - ((wordCount / ReadingLorapp.averageWordsPerMin) * (pr / 100)));
        minutesLeft = (minutesLeft < 0) ? 0 : minutesLeft;
        $('.minutes-left-data').html(minutesLeft);
    };

    /**
     * Rerun info calculations for correct % read and minutes left.
     * @param height actual container to measure
     */
    ReadingLorapp.updateMinutesPercent = function(height) {
        height = (isNaN(height)) ? $(document).height() : height;
        var viewportHeight = $(window).height();
        var scrollTop = $(document).scrollTop();
        var readingBeginning = $('#reading-container').offset().top;
        var percentageRead = ((scrollTop - readingBeginning) * 100) / (height - viewportHeight);
        var roundedPercentageRead = Math.round(percentageRead);
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
        ReadingLorapp.updateMinutes(percentageRead);
    };

    /**
     * Proteccion para evitar usar el clic derecho y copiar con teclado
     */
    ReadingLorapp.lock = function(){
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
    };

    /**
     * actualiza el tamano de letra seleccionado por el usuario
     * @param size
     */
    ReadingLorapp.updateFontSize = function (size){
        $('.size-small-div, .size-medium-div, .size-large-div').removeClass('active');
        var s = '1.35em';
        if (size == 'small'){
            s = '1.125em';
        } else if (size == 'medium'){
            s = '1.35em';
        } else if (size == 'large'){
            s = '1.575em';
        } else {
            size = 'medium';
        }
        $('.size-'+size+'-div').addClass('active');
        $('body').css({'font-size': s});
        ReadingLorapp.setUserFontSize(size);
        ReadingLorapp.updateMinutesPercent();
        ReadingLorapp.saveSetup();
    };

    /**
     * actualiza el estilo del color de fondo y la letra de una lectura
     * @param style, nombre del estilo aplicado
     */
    ReadingLorapp.updateBackgroundStyle = function (style){
        $('.color-light-btn, .color-sepia-btn, .color-night-btn').removeClass('active');
        if (style == 'sepia'){
            $('body').removeClass('night').addClass('sepia');
        } else if (style == 'night'){
            $('body').removeClass('sepia').addClass('night');
        } else {
            $('body').removeClass('sepia').removeClass('night');
            style = 'light';
        }
        $('.color-'+style+'-btn').addClass('active');
        ReadingLorapp.setUserBackgroundStyle(style);
        ReadingLorapp.saveSetup();
    }

    /**
     * Actualiza la informacion de configuracion de lectura del usuario
     * @returns {boolean}
     */
    ReadingLorapp.saveSetup = function() {
        if (!ReadingLorapp.userEnable) return false;
        var d = {};
        d.font_size = ReadingLorapp.getUserFontSize();
        d.background_style = ReadingLorapp.getUserBackgroundStyle();
        //Util.callAjax(d, global.url + "/savesetup", "POST");
    };

    /** 
     * Metodo que inicializa el modulo
     */
    ReadingLorapp.initialize = function() {
        ReadingLorapp.userEnable = global.userEnable();
        ReadingLorapp.updateFontSize(ReadingLorapp.getUserFontSize());
        ReadingLorapp.updateBackgroundStyle(ReadingLorapp.getUserBackgroundStyle());
        NoteAction.noteLoader = '#note_loader';
        NoteAction.noteText = '#note_text';
        NoteAction.noteTextEdit = '#note_text_edit';
        NoteAction.btnNoteEdit = '#btn_note_edit';
        NoteAction.btnNoteCancel = '#btn_note_cancel';
        NoteAction.btnNoteSave = '#btn_note_save';
        $('#icon_fullscreen, .full-screen-btn').click(ReadingLorapp.toggleFullScreen);

        $("#icon_note").click(function(event) {
            NoteAction.getNote(global.lecturesection_id);
        });
        $( document ).on( "vclick", "#icon_note", function() {
            NoteAction.getNote(global.lecturesection_id);
        });
        ReadingLorapp.lock();
        ReadingLorapp.snippets();
        $(document).ready(function() {
            ReadingLorapp.calculatePercentageRead();
        });
        // START: Calculate reading minutes remaining
        ReadingLorapp.updateMinutes();
        // recalculate on scroll
        $(document).scroll(function() {
            height = $('#reading-container').height();
            ReadingLorapp.updateMinutesPercent(height);
        });
    };

    /**********************************************************************************************
     * ********************************************************************************************
     * Metodo que ejecuta snippets de codigo, pendiente por organizar en los respectivos modulos
     * ********************************************************************************************
     *********************************************************************************************/

    ReadingLorapp.snippets = function() {


        $(document).ready(function() {

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
            $("#takeHighlight, #takeFreeNote").click(function(event) {
                event.preventDefault();
                $("#selectedtext_display").removeClass("hidden");
                if(event.currentTarget.id == "takeFreeNote"){
                    $("#selectedtext_display").addClass("hidden");
                    $("#selectedtext_display, #selectedtext_hidden").html("");
                    $("#selectedtext_html, #selectedtext").val("");
                }
                $(".add-note-wrapper").addClass("show");
            });

            /**
             * click en botón Cancelar apunte esconde casilla de apuntes y (limpia el campo de texto -por hacer-)
             */
            $("#btn_cancelar_note").click(function(event) {
                event.preventDefault();
                Highlight.NoteContainer.openClose("close");
            });

            /**
            * click en botón estilos hace slide de menú estilos o lo oculta si ya está abierto
            */
            $('#mobile-styles-btn').on('click', function() {
                if ($('.nav-menu').hasClass('slideDown')) {
                    $('.nav-menu').removeClass('slideDown');
                }
                else {
                    $('.nav-menu').addClass('slideDown');
                }
            });

            /**
            * click en botón apuntes hace slide de apuntes
            */
            $("#my-notes-btn").on('click', function(event) {
                event.preventDefault();
                $(".notesMainWrapper").addClass("show");
                // Se bloquea el scroll del body mientras los apuntes se muestren
                $("body").addClass("stop-scrolling");

                $('.closer-box').fadeIn(500);
                $('.left-close-icon').fadeIn(500);
                // Esconde el menú de estilos si está abierto
                $('.nav-menu').addClass('slideDown');
            });

            /**
             * click en botón .show-my-readings-btn hace slide de menú lateral
             */
            $("#table-of-contents-btn").on('click', function(event) {
                event.preventDefault();
                $(".my-readings-wrapper").addClass("show");
                // Se bloquea el scroll del body mientras el menú lateral se muestre
                $("body").addClass("stop-scrolling");
                $('.closer-box').fadeIn(500);
                $('.right-close-icon').fadeIn(500);
                // Esconde el menú de estilos si está abierto
                $('.nav-menu').addClass('slideDown');
            });

            /**
             * Se esconde opciones de tamano de letra y color de fondo cuando hay clic en el body
             */
            $("#bodyText").on('click', function(event) {
                $('.nav-menu').addClass('slideDown');
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



            // START: Click en boton full-width lleva a full-width
            $('.wide-btn-div').on('click',
                    function() {
                        // if the button is clicked when active
                        $('.body-wrapper').addClass('reading-full-width');
                        $('.narrow-btn-div').removeClass('active');
                        $(this).addClass('active');
                        // Rerun info calculations for correct % read and minutes left.
                        ReadingLorapp.calculatePercentageRead();
                        // reprint percentage read, keep 0 if < 0 and 100 if > 100
                        ReadingLorapp.printPercentageRead();
                        ReadingLorapp.updateMinutes();
                    });

            $('.narrow-btn-div').on('click',
                    function() {
                        // if the button is clicked when active
                        $('.body-wrapper').removeClass('reading-full-width');
                        $('.wide-btn-div').removeClass('active');
                        $(this).addClass('active');
                        // Rerun info calculations for correct % read and minutes left.
                        ReadingLorapp.calculatePercentageRead();
                        // reprint percentage read, keep 0 if < 0 and 100 if > 100
                        ReadingLorapp.printPercentageRead();
                        ReadingLorapp.updateMinutes();
                    });
            // END: Click en título de capítulo lleva a full-width


            // START: Click en botones de color ajusta estilos
            $('.color-light-btn').on('click', function() {
                ReadingLorapp.updateBackgroundStyle('light');
            });

            $('.color-sepia-btn').on('click', function() {
                ReadingLorapp.updateBackgroundStyle('sepia');
            });

            $('.color-night-btn').on('click', function() {
                ReadingLorapp.updateBackgroundStyle('night');
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



// START: Click on size buttons changes body font-size
        $('.size-small-div').click(function() {
            ReadingLorapp.updateFontSize('small');
        });
        $('.size-medium-div').click(function() {
            ReadingLorapp.updateFontSize('medium');
        });
        $('.size-large-div').click(function() {
            ReadingLorapp.updateFontSize('large');
        });


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


    };


})();

/**
 * Funcion de inicializacion en el momento en que se completa el DOM llamada desde jquery
 * Esta funcion realiza los procesos de inicializacion de la aplicacion
 */


$(function() {
    ReadingLorapp.initialize();
});
