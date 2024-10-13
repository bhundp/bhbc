// Librería de funcionalidades del Theme Pixel


// PART 1. JQuery
(function($) {
$(document).ready(function () {
    
    // window.onload = function() {

    // 1. Sandbox librerías
    
    $( "body" ).on( "click", ".pxc-button-foam-direct-messages-edit", function() {
        const boton = $(this);
        const nId = boton.attr('data-pxc-id');
        document.getElementById('pxc-foam-iframe').setAttribute("src","/node/"+nId+"?uimessages=1");
        $('#themeModalLabel-comentarios').attr("pxc-data-history", "/node/"+nId+"?uimessages=1");
    });
    $( "body" ).on( "click", ".pxc-button-foam-direct-messages-view", function() {
        const boton = $(this);
        const nId = boton.attr('data-pxc-id');
        document.getElementById('pxc-foam-iframe').setAttribute("src","/node/"+nId+"?uimessages=2");
        $('#themeModalLabel-comentarios').attr("pxc-data-history", "/node/"+nId+"?uimessages=2");
    });
    $( "body" ).on( "click", ".pxc-button-foam-comments", function() {
        const boton = $(this);
        const nId = boton.attr('data-pxc-id');
        document.getElementById('pxc-foam-iframe').setAttribute("src","/node/"+nId+"?uicomments=1");
        $('#themeModalLabel-comentarios').attr("pxc-data-history", "/node/"+nId+"?uicomments=1");
    });
    $( "body" ).on( "click", ".pxc-button-foam-enlaces", function() {
        const boton = $(this);
        const nId = boton.attr('data-pxc-id');
        document.getElementById('pxc-foam-iframe').setAttribute("src","/node/"+nId+"?uienlaces=1");
        $('#themeModalLabel-comentarios').attr("pxc-data-history", "/node/"+nId+"?uienlaces=1");
    });
    $( "body" ).on( "click", ".pxc-button-foam-details", function() {
        const boton = $(this);
        const nId = boton.attr('data-pxc-id');
        document.getElementById('pxc-foam-iframe').setAttribute("src","/node/"+nId+"?uidetails=1");
        $('#themeModalLabel-comentarios').attr("pxc-data-history", "/node/"+nId+"?uidetails=1");
    });
    $( "body" ).on( "click", ".pxc-button-foam-temas", function() {
        const boton = $(this);
        const nId = boton.attr('data-pxc-id');
        document.getElementById('pxc-foam-iframe').setAttribute("src","/tagging?nid="+nId+"&tagging=1");
        $('#themeModalLabel-comentarios').attr("pxc-data-history", "/tagging?nid="+nId+"&tagging=1");
    });
    $( "body" ).on( "click", "#pxc-button-user-mensaje", function() {
        const boton = $(".pxc-perfil-seguir");
        const uId = boton.attr('data-user-id');
        document.getElementById('pxc-foam-iframe').setAttribute("src","/user/"+uId+"?uimessages=1");
        $('#themeModalLabel-comentarios').attr("pxc-data-history", "/user/"+uId+"?uimessages=1");
    });
    
    
    // 2. Utilidades
    // 2.1.1 Hacer el menú fijo
    $(window).scroll(function() {
        if ($(document).scrollTop() > 0) {
            $('#header').addClass('pxc-sticky-header');
        } else {
            $('#header').removeClass('pxc-sticky-header');
        }
    });
    
    // 2.1.2 Hacer el menú colapsar cuando se mueve arriba
    // Initial state
    let scrollPos = 0;
    // adding scroll event
    window.addEventListener('scroll', function(){
    // detects new state and compares it with the new one
    if ((document.body.getBoundingClientRect()).top > scrollPos)
        $('#header').removeClass('pxc-sticky-header-collapsed');
    else
        $('#header').addClass('pxc-sticky-header-collapsed');
    	// saves the new position for iteration.
    	scrollPos = (document.body.getBoundingClientRect()).top;
    });
    
    // 2.1.3 Mover el avatar a su posición
    waitForElm('.pxc-micro-foto').then((elm) => {
        let fotoUser = $('.pxc-micro-foto').html();
        $('.pxc-yo-link').html(fotoUser);
        $('.pxc-yo-link').addClass("opaco");
        let uName = $('#uloged').text();
        $('.pxc-saludo-name').text(uName);
        // Solo para foto en comentarios nuevos
        if($("#pxc-yo").length > 0) {
            $('#pxc-yo').html(fotoUser);
        }
    });
    
    // 2.1.4 Colapsa los filtros intermitentes en movil
    
        if($("#pxc-activar-os-col-5").length > 0) {
            let myCollapsible5 = document.getElementById('collapseOs5')
                myCollapsible5.addEventListener('show.bs.collapse', function () {
                $("#collapseOs6").collapse('hide');
            });
        }
        if($("#pxc-activar-os-col-6").length > 0) {
            let myCollapsible6 = document.getElementById('collapseOs6')
                myCollapsible6.addEventListener('show.bs.collapse', function () {
                $("#collapseOs5").collapse('hide');
            });
        }
    
    // 2.1.5 Manipular los enlaces para que independientemente de que abran en una modal vayan a parent.
    $( "a[title='Ver perfil del usuario.']" ).each(function( index ) {
        $(this).attr("target", "_parent");
    });
    $( ".pxc-folksonomy-item a" ).each(function( index ) {
        $(this).attr("target", "_parent");
    });
    $( ".pxc-tema-contribuido-item a" ).each(function( index ) {
        $(this).attr("target", "_parent");
    });
    $( ".pxc-name-autor a" ).each(function( index ) {
        $(this).attr("target", "_parent");
    });
    $( ".pxc-links a" ).each(function( index ) {
        $(this).attr("target", "_blank");
    });
    $( ".pxc-archivo a" ).each(function( index ) {
        $(this).attr("target", "_blank");
    });
    $( ".pxc-link-stand a" ).each(function( index ) {
        $(this).attr("target", "_blank");
    });
    
    // 2.1.6 Regresar en las modales
    $( "body" ).on( "click", "#themeModalLabel-comentarios", function() {
        let urlIframe = document.getElementById("pxc-foam-iframe").contentWindow.location.href;
        console.log(urlIframe);
        if(("https://bibliotecahumana.co.undp.org" + $(this).attr("pxc-data-history")) == urlIframe) {
            $('#themeModal-comentarios').modal('toggle');
        }else{
            history.go(-1);
        }
    });
    
    // 2.1.7 Leer mas
    $( "body" ).on( "click", ".pxc-foam-body-l", function() {
        $(this).children(".pxc-foam-body-largo").addClass("full");
        $(this).addClass("full");
        console.log("leer mas");
    });
    
    // 2.1.8 Detener todos los audios y videos cuando: se reproduce otro video o audio, cuando se hace clic en las flechas del slick, cuando se abren o cierran modales.
    $( "video" ).each(function( index ) {
       $(this).addClass("pxc-media"); 
    });
    $( "audio" ).each(function( index ) {
       $(this).addClass("pxc-media"); 
    });
    // On slick
    $( "body" ).on( "click", ".slick-arrow", function() {
        stopAll();
    });
    
    // 2.2. Slick editor
    $(".slick-foam-media").slick({
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        infinite: false
    });
    $(".slick-foam-audio").slick({
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true
    });
    
    // 2.3 Mover controles de búsqueda según tamaño
    // En la carga
    if (parseInt(window.innerWidth) <= 990) {
        $( ".pxc-buscador-os-col-2" ).addClass("pxc-tiene-menu-bus");
        $( ".pxc-buscador-os-col-3" ).addClass("pxc-tiene-menu-ord");
        let buscadorUi = $( ".pxc-tiene-menu-bus" ).children("div");
        let ordenadorUi = $( ".pxc-tiene-menu-ord" ).children("div");
            
        buscadorUi.appendTo( ".pxc-buscador-os-col-5" );
        ordenadorUi.appendTo( ".pxc-buscador-os-col-6" );
            
        $( ".pxc-buscador-os-col-2" ).removeClass("pxc-tiene-menu-bus");
        $( ".pxc-buscador-os-col-3" ).removeClass("pxc-tiene-menu-ord");
        $( ".pxc-buscador-os-col-5" ).addClass("pxc-tiene-menu-bus");
        $( ".pxc-buscador-os-col-6" ).addClass("pxc-tiene-menu-ord");
    }else{
        $( ".pxc-buscador-os-col-5" ).removeClass("pxc-tiene-menu-bus");
        $( ".pxc-buscador-os-col-6" ).removeClass("pxc-tiene-menu-ord");
        $( ".pxc-buscador-os-col-2" ).addClass("pxc-tiene-menu-bus");
        $( ".pxc-buscador-os-col-3" ).addClass("pxc-tiene-menu-ord");
    }
    // On resize
    $(window).resize(function(){
        if (parseInt(window.innerWidth) <= 990) {
            let buscadorUi = $( ".pxc-tiene-menu-bus" ).children("div");
            let ordenadorUi = $( ".pxc-tiene-menu-ord" ).children("div");
            
            buscadorUi.appendTo( ".pxc-buscador-os-col-5" );
            ordenadorUi.appendTo( ".pxc-buscador-os-col-6" );
            
            $( ".pxc-buscador-os-col-2" ).removeClass("pxc-tiene-menu-bus");
            $( ".pxc-buscador-os-col-3" ).removeClass("pxc-tiene-menu-ord");
            $( ".pxc-buscador-os-col-5" ).addClass("pxc-tiene-menu-bus");
            $( ".pxc-buscador-os-col-6" ).addClass("pxc-tiene-menu-ord");
        }else{
            let buscadorUi = $( ".pxc-tiene-menu-bus" ).children("div");
            let ordenadorUi = $( ".pxc-tiene-menu-ord" ).children("div");
            
            buscadorUi.appendTo( ".pxc-buscador-os-col-2" );
            ordenadorUi.appendTo( ".pxc-buscador-os-col-3" );
            
            $( ".pxc-buscador-os-col-5" ).removeClass("pxc-tiene-menu-bus");
            $( ".pxc-buscador-os-col-6" ).removeClass("pxc-tiene-menu-ord");
            $( ".pxc-buscador-os-col-2" ).addClass("pxc-tiene-menu-bus");
            $( ".pxc-buscador-os-col-3" ).addClass("pxc-tiene-menu-ord");
        }
    });
    
    // 2.4 Quita elementos de los avisos innecesarios
    if($("#block-pixel-messages").length > 0) {
       $("#block-pixel-messages ul li").each(function( index ) {
            if($(this).text() == ".") {
                $(this).remove();
            }
            if($(this).text().includes("Foam")) {
              $(this).text("Se ha guardado tu contenido.");
            }
       });
       $("#block-pixel-messages > div").each(function( index ) {
            if($(this).html().includes("Foam")) {
              $(this).html("<div role='contentinfo' aria-label='Mensaje de estado'>Se ha guardado tu contenido.</div>");
            }
       });
    }
    
    // 2.5 Mover formulario de tagging de personas
    if($("#block-pixel-views-block-tagging-form-block-1").length > 0) {
            let formulario = $("#block-pixel-simpleformtaggingpeopleblock");
            formulario.appendTo( "#pxc-destino-forma" );
    }
    
    // 2.6 Rebautiza los links de actividades
    if($(".page-actividad").length > 0) {
        $(".pxc-actividad-nodo").find("a").each(function( index ) {
            $(this).text("Ver publicación relacionada");
        });
    }
    
    // 4. Ajax functions
    
    // 4.1 Marcar como favorito un contenido FOAM
        // 4.1.1 Funciona al hacer clic en el pseudo-boton de agregar a favoritos
        $( "body" ).on( "click", ".pxc-foam-favoritos-boton", function() {
            let foamId = $(this).attr("data-foam-id");
            $( "#edit-nid" ).prop("value", foamId);
            if($(this).children(".pxc-foam-favoritos-texto").children(".pxc-micro").length > 0) {
                $(this).children(".pxc-foam-favoritos-texto").children(".pxc-micro").remove();
            }
            $("#pxc-simple-form-follow-content").submit();
        });
    
        // 4.1.2 Evento de submit del formulario ECA correspondiente
        $("#pxc-simple-form-follow-content").submit(function(e) {
            e.preventDefault(); // avoid to execute the actual submit of the form.
        
            var form = $(this);
            var actionUrl = form.attr('action');
            
            const regex = /[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis;
    
            function jsonFromString(str) {
              const matches = str.match(regex);
              return Object.assign({}, ...matches.map((m) => JSON.parse(m)));
            }
            
            $.ajax({
                type: "POST",
                url: actionUrl,
                data: form.serialize(), // serializes the form's elements.
                }).done (function(data) {
                  let json = jsonFromString(data);
    
                  //if (json[0].hasOwnProperty("data")) {
                    //let respuesta = json[0].data.split("---");
                    let foamId = $( "#edit-nid" ).val();
                    //if(respuesta[2] == foamId) {
                        //console.log(respuesta[2]);
                        console.log(foamId);
                        $(".pxc-foam-favoritos[data-foam-id='" + foamId + "']").html("<span class='pxc-foam-favoritos-icono pxc-foam-favoritos-icono-activo'>V</span> <span class='pxc-foam-favoritos-texto'>Favorito</span>");
                        $(".pxc-foam-favoritos[data-foam-id='" + foamId + "']").removeClass("pxc-foam-favoritos-boton");
                        $(".pxc-foam-favoritos[data-foam-id='" + foamId + "']").addClass("pxc-foam-favorito-activo");
                        $(".pxc-foam-favoritos[data-foam-id='" + foamId + "']").addClass("pxc-favorito-reciente");
                        $(".pxc-foam-favoritos[data-foam-id='" + foamId + "']").off();
                    //}
		  /*}else{
                      $(".pxc-foam-favoritos[data-foam-id='" + foamId + "']").children(".pxc-foam-favoritos-texto").append("<small class='pxc-micro-aviso'>¡Opps!, algo sucedió, por favor intentalo de nuevo. Si este aviso persiste, informalo al equipo de soporte.</small>");
                  }*/
                  
                  //console.log(data); // show response from the php script.
                }).fail (function( jqXHR, textStatus, errorThrown ) {
                  if (jqXHR.status === 0) {
    
                    console.log('Setting favorite -- Not connect: Verify Network.');
                
                  } else if (jqXHR.status == 404) {
                
                    console.log('Setting favorite -- Requested page not found [404]');
                
                  } else if (jqXHR.status == 500) {
                
                    console.log('Setting favorite -- Internal Server Error [500].');
                
                  } else if (textStatus === 'parsererror') {
                
                    console.log('Setting favorite -- Requested JSON parse failed.');
                
                  } else if (textStatus === 'timeout') {
                
                    console.log('Setting favorite -- Time out error.');
                
                  } else if (textStatus === 'abort') {
                
                    console.log('Setting favorite -- Ajax request aborted.');
                
                  } else {
                
                    console.log('Setting favorite -- Uncaught Error: ' + jqXHR.responseText);
                
                  }
            });
    
        }); 
        
    // End of 4.1
    // 4.2 Seguir a una persona.
        
        // 4.2.1 Funciona al hacer clic en el pseudo-boton de seguir
        $( ".pxc-perfil-seguir" ).on( "click", function() {
            let userId = $(this).attr("data-user-id");
            $( "#edit-persona" ).prop("value", userId);
            if($(this).children(".pxc-perfil-seguir-texto").children(".pxc-micro").length > 0) {
                $(this).children(".pxc-perfil-seguir-texto").children(".pxc-micro").remove();
            }
            $("#pxc-simple-form-follow-people").submit();
        });
        
        // 4.2.2 Evento de submit del formulario ECA correspondiente
        $("#pxc-simple-form-follow-people").submit(function(e) {
            e.preventDefault(); // avoid to execute the actual submit of the form.
            
            var form = $(this);
            var actionUrl = form.attr('action');
            
            const regex = /[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis;
    
            function jsonFromString(str) {
              const matches = str.match(regex);
              return Object.assign({}, ...matches.map((m) => JSON.parse(m)));
            }
            
            $.ajax({
                type: "POST",
                url: actionUrl,
                data: form.serialize(), // serializes the form's elements.
                }).done (function(data) {
                    
                  let json = jsonFromString(data);
    
                  //if (json[0].hasOwnProperty("data")) {
                    //let respuesta = json[0].data.split("---");
                    let personaId = $(".pxc-perfil-seguir").attr("data-user-id");
                    //if(respuesta[2] == personaId) {
                        //console.log(respuesta[2]);
                        console.log(personaId);
                        $(".pxc-perfil-seguir[data-user-id='" + personaId + "']").html("<span class='pxc-perfil-seguir-icono pxc-perfil-seguir-icono-activo'>V</span> <span class='pxc-perfil-seguir-texto'>Seguido</span>");
                        $(".pxc-perfil-seguir[data-user-id='" + personaId + "']").removeClass("pxc-perfil-seguir-boton");
                        $(".pxc-perfil-seguir[data-user-id='" + personaId + "']").off();
                    //}
                  /*}else{
                      $(".pxc-perfil-seguir[data-foam-id='" + foamId + "']").children(".pxc-perfil-seguir-texto").append("<small class='pxc-micro-aviso'>¡Opps!, algo sucedió, por favor intentalo de nuevo. Si este aviso persiste, informalo al equipo de soporte.</small>");
                  }*/
                  
                  //console.log(data); // show response from the php script.
                }).fail (function( jqXHR, textStatus, errorThrown ) {
                  if (jqXHR.status === 0) {
    
                    console.log('Setting favorite -- Not connect: Verify Network.');
                
                  } else if (jqXHR.status == 404) {
                
                    console.log('Setting favorite -- Requested page not found [404]');
                
                  } else if (jqXHR.status == 500) {
                
                    console.log('Setting favorite -- Internal Server Error [500].');
                
                  } else if (textStatus === 'parsererror') {
                
                    console.log('Setting favorite -- Requested JSON parse failed.');
                
                  } else if (textStatus === 'timeout') {
                
                    console.log('Setting favorite -- Time out error.');
                
                  } else if (textStatus === 'abort') {
                
                    console.log('Setting favorite -- Ajax request aborted.');
                
                  } else {
                
                    console.log('Setting favorite -- Uncaught Error: ' + jqXHR.responseText);
                
                  }
            });
    
        }); 
        
    // End of 4.2
    
    // 5. User UI
    // Controles de la UI de usuario.
    if($(".pxc-perfil-lista-foam").length > 0) {
        let numeroPubs = 0;
        let numeroPubsDrafts = 0;
        $( ".pxc-perfil-lista-foam" ).each(function( index ) {
            numeroPubs++;
            if($(this).attr("data-status") == "0") {
                numeroPubsDrafts++;    
            }
        });
        $('.pxc-perfil-indicador-texto-2').text(numeroPubs);
        $('.pxc-perfil-indicador-texto-3').text(numeroPubsDrafts);
        if(numeroPubs == 1) {
            $('.pxc-perfil-indicador-subtexto-2').text("Publicación");
        }else{
            $('.pxc-perfil-indicador-subtexto-2').text("Publicaciones");
        }
        if(numeroPubs > 0) {
            $('.pxc-perfil-indicador-link-2').addClass("visible");
        }
        if(numeroPubsDrafts == 1) {
            $('.pxc-perfil-indicador-subtexto-3').text("Borrador");
        }else{
            $('.pxc-perfil-indicador-subtexto-3').text("Borradores");
        }
        if(numeroPubsDrafts > 0) {
            $('.pxc-perfil-indicador-link-3').addClass("visible");
        }
        
    }
    if($(".pxc-perfil-mail").length > 0) {
        let mailUser = $(".pxc-perfil-mail").html();
        $(".pxc-perfil-mail-publicado").append(mailUser);
    }
    if($("#pxc-perfil-comentario-count").length > 0) {
        let conteoComentarios = $("#pxc-perfil-comentario-count").attr("data-conteo");
        $('.pxc-perfil-indicador-texto-4').text(conteoComentarios);
        if(conteoComentarios == 1) {
            $('.pxc-perfil-indicador-subtexto-4').text("Comentario");
        }else{
            $('.pxc-perfil-indicador-subtexto-4').text("Comentarios");
        }
    }else{
        let conteoComentarios = 0;
        $('.pxc-perfil-indicador-texto-4').text(conteoComentarios);
        $('.pxc-perfil-indicador-subtexto-4').text("Comentarios");
    }
    if($("#pxc-lista-contenidos-iframe").length > 0) {
        let currentSrc = "/lista-de-contenidos?nid=";
        let currentUsr = $(".pxc-perfil-seguir").attr("data-user-id");
        $("#pxc-lista-contenidos-iframe").attr("src", currentSrc + currentUsr);
    }
    // Controla si se ven o no seguidores, incluso si el usuario es él mismo. 
    if($("#pxc-perfil-seguidores").length > 0 && $("#pxc-perfil-sesion").length > 0) {
        let personaId = $(".pxc-perfil-seguir").attr("data-user-id");
        let enSes = $("#pxc-perfil-sesion").text();
        if(personaId != enSes) { // Que no sea la misma persona.
            if($("#pxc-perfil-seguidores").text() != "no-followers") {
                let followers = $("#pxc-perfil-seguidores").text().split("---"), i;
                for (i = 0; i < followers.length; i++) {
                    if(followers[i] == enSes) {
                        $(".pxc-perfil-seguir[data-user-id='" + personaId + "']").html("<span class='pxc-perfil-seguir-icono pxc-perfil-seguir-icono-activo'>V</span> <span class='pxc-perfil-seguir-texto'>Seguido</span>");
                        $(".pxc-perfil-seguir[data-user-id='" + personaId + "']").removeClass("pxc-perfil-seguir-boton");
                        $(".pxc-perfil-seguir[data-user-id='" + personaId + "']").off();
                    }
                }
            }
            // Oculta opciones cuando es otra persona
            $(".pxc-perfil-indicador-3").remove();
        }else{
            // Oculta opciones cuando es la misma persona
            $(".pxc-perfil-seguir").addClass("oculto");
            $(".pxc-perfil-mensaje a").text("Ver mis mensajes");
        }
    }
    // Contenidos y drafts de contenido en la vista de usuario.
    $( "#pxc-ver-contenidos-full" ).on( "click", function() {
        console.log("FULL");
        let currentSrc = "/lista-de-contenidos?nid=";
        let currentUsr = $(".pxc-perfil-seguir").attr("data-user-id");
        $("#pxc-lista-contenidos-iframe").attr("src", currentSrc + currentUsr);
        document.getElementById('pxc-lista-contenidos-iframe').setAttribute("src",currentSrc + currentUsr);
    });
    
    $( "#pxc-ver-contenidos-draft" ).on( "click", function() {
        console.log("DRAFTS");
        let currentSrc = "/lista-de-contenidos-draft?nid=";
        let currentUsr = $(".pxc-perfil-seguir").attr("data-user-id");
        $("#pxc-lista-contenidos-iframe").attr("src", currentSrc + currentUsr);
        document.getElementById('pxc-lista-contenidos-iframe').setAttribute("src",currentSrc + currentUsr);
    });
    
    
    // 6. Aplicación de beneficios
    $( ".pxc-apply-benefit-t" ).on( "click", function() {
        let beneficioName = $(this).attr("data-pxc-name");
        let beneficioId = $(this).attr("data-pxc-id");
        let beneficioTokens = $(this).attr("data-pxc-tokens");
        if($("#pxc-msg-beneficio").length > 0) {
            $("#pxc-msg-beneficio").remove();
        }
        $("#pxc-simple-form-apply-benefit").append("<div id='pxc-msg-beneficio'><p><span class='pxc-pre-pregunta'>¿Realmente quieres utilizar tus puntos en el beneficio?</span><span class='pxc-pregunta-titulo'>"+beneficioName+"</span><span class='pxc-post-pregunta pxc-micro-aviso'>Se descontarán "+beneficioTokens+" puntos de tu saldo.</span></p><div><button id='pxc-aplicar-beneficio' type='button' class='btn btn-primary'>Sí</button><button id='pxc-cerrar' type='button' class='btn btn-outline-secondary'>Cancelar</button></div></div>");
        $("#edit-beneficio").val(beneficioId).change();
        $("#edit-puntos").val(beneficioTokens).change();
    });
    $( "body" ).on( "click", "#pxc-aplicar-beneficio", function() {
        $("#pxc-simple-form-apply-benefit").submit();
    });
    $( "body" ).on( "click", "#pxc-cerrar", function() {
        $('#themeModal1').modal('hide');
    });
    
    // 7. UI del buscador
    // 7.1 UI de los tipos
    // 7.1.1 UI de FOAM y Publicaciones
    $( "#pxc-buscador-os-tipo-publicaciones" ).on( "click", function() {
        limpiarEditTipo();
        if ($('#pxc-buscador-os-tipo-publicaciones').is(':checked')) {
            // Si es para prender 1
            if ($('#pxc-buscador-os-tipo-contenido').is(':checked')) {
                $( "select[data-drupal-selector='edit-tipo']" ).val("All").change();
               $( "select[data-drupal-selector='edit-tipo'] option[value='All']" ).attr('selected','selected');
            }else{
               // 0k    
               $( "select[data-drupal-selector='edit-tipo']" ).val("1").change();
               $( "select[data-drupal-selector='edit-tipo'] option[value='1']" ).attr('selected','selected');
            }
        // Si es para apagar 1    
        }else{
            if ($('#pxc-buscador-os-tipo-contenido').is(':checked')) {
                $( "select[data-drupal-selector='edit-tipo']" ).val("0").change();
               $( "select[data-drupal-selector='edit-tipo'] option[value='0']" ).attr('selected','selected');
            }else{
               $( "select[data-drupal-selector='edit-tipo']" ).val("All").change();
               $( "select[data-drupal-selector='edit-tipo'] option[value='All']" ).attr('selected','selected');
            }
        }
        checkBadgesSearch(1);
    });
    $( "#pxc-buscador-os-tipo-contenido" ).on( "click", function() {
        limpiarEditTipo();
        // Si es para prender 0
        if ($('#pxc-buscador-os-tipo-contenido').is(':checked')) {
            if ($('#pxc-buscador-os-tipo-publicaciones').is(':checked')) {
                $( "select[data-drupal-selector='edit-tipo']" ).val("All").change();
               $( "select[data-drupal-selector='edit-tipo'] option[value='All']" ).attr('selected','selected');
            // 0k   
            }else{
               $( "select[data-drupal-selector='edit-tipo']" ).val("0").change();
               $( "select[data-drupal-selector='edit-tipo'] option[value='0']" ).attr('selected','selected');
            }
        // Si es para apagar 0
        }else{
            if ($('#pxc-buscador-os-tipo-publicaciones').is(':checked')) {
                $( "select[data-drupal-selector='edit-tipo']" ).val("1").change();
               $( "select[data-drupal-selector='edit-tipo'] option[value='1']" ).attr('selected','selected');
            }else{
               $( "select[data-drupal-selector='edit-tipo']" ).val("All").change();
               $( "select[data-drupal-selector='edit-tipo'] option[value='All']" ).attr('selected','selected');
            }
        }
        checkBadgesSearch(1);
    });
    // 7.1.2 UI de medios
        // 7.1.2.1 Imágenes
        $( "#pxc-buscador-os-tipo-imagenes" ).on( "click", function() {
            limpiarEditFilenameOp();
            // Si es para prender
            if ($('#pxc-buscador-os-tipo-imagenes').is(':checked')) {
                $( "select[data-drupal-selector='edit-filename-op']" ).val("not empty").change();
                $( "select[data-drupal-selector='edit-filename-op'] option[value='not empty']" ).attr('selected','selected');
            // Si es para apagar 0
            }else{
                $( "select[data-drupal-selector='edit-filename-op']" ).val("=").change();
                $( "select[data-drupal-selector='edit-filename-op'] option[value='=']" ).attr('selected','selected');
            }
            checkBadgesSearch(1);
        });
        // 7.1.2.2 Audios
        $( "#pxc-buscador-os-tipo-audio" ).on( "click", function() {
            limpiarEditFilenameOp1();
            // Si es para prender
            if ($('#pxc-buscador-os-tipo-audio').is(':checked')) {
                $( "select[data-drupal-selector='edit-filename-1-op']" ).val("not empty").change();
                $( "select[data-drupal-selector='edit-filename-1-op'] option[value='not empty']" ).attr('selected','selected');
            // Si es para apagar 0
            }else{
                $( "select[data-drupal-selector='edit-filename-1-op']" ).val("=").change();
                $( "select[data-drupal-selector='edit-filename-1-op'] option[value='=']" ).attr('selected','selected');
            }
            checkBadgesSearch(1);
        });
        // 7.1.2.3 Videos
        $( "#pxc-buscador-os-tipo-video" ).on( "click", function() {
            limpiarEditFilenameOp2();
            limpiarEditTitleOp();
            // Si es para prender
            if ($('#pxc-buscador-os-tipo-video').is(':checked')) {
                $( "select[data-drupal-selector='edit-filename-2-op']" ).val("not empty").change();
                $( "select[data-drupal-selector='edit-filename-2-op'] option[value='not empty']" ).attr('selected','selected');
                $( "select[data-drupal-selector='edit-title-op']" ).val("not empty").change();
                $( "select[data-drupal-selector='edit-title-op'] option[value='not empty']" ).attr('selected','selected');
            // Si es para apagar 0
            }else{
                $( "select[data-drupal-selector='edit-filename-2-op']" ).val("=").change();
                $( "select[data-drupal-selector='edit-filename-2-op'] option[value='=']" ).attr('selected','selected');
                $( "select[data-drupal-selector='edit-title-op']" ).val("=").change();
                $( "select[data-drupal-selector='edit-title-op'] option[value='=']" ).attr('selected','selected');
            }
            checkBadgesSearch(1);
        });
    // 7.1.3 UI de borradores
    $( "#pxc-buscador-os-ver-borradores" ).on( "click", function() {
        limpiarEditSatus();
        // Si es para prender
        if ($('#pxc-buscador-os-ver-borradores').is(':checked')) {
            $( "select[data-drupal-selector='edit-status']" ).val("0").change();
            $( "select[data-drupal-selector='edit-status'] option[value='0']" ).attr('selected','selected');
        // Si es para apagar 0
        }else{
            $( "select[data-drupal-selector='edit-status']" ).val("1").change();
            $( "select[data-drupal-selector='edit-status'] option[value='1']" ).attr('selected','selected');
        }
        checkBadgesSearch(1);
    }); 
    // 7.1.4 UI de sorting
    $( "#pxc-buscador-os-orden-1" ).on( "click", function() {
        limpiarSorting (); 
        $( "#pxc-buscador-os-orden-2" ).prop('checked', false);
        $( "#pxc-buscador-os-orden-3" ).prop('checked', false);
        // Si es para prender
        if ($('#pxc-buscador-os-orden-1').is(':checked')) {
            resetSorting();
        // Si es para apagar    
        }else{
            resetSorting(); 
        }
        checkBadgesSearch(2);
    });
    $( "#pxc-buscador-os-orden-2" ).on( "click", function() {
        limpiarSorting (); 
        $( "#pxc-buscador-os-orden-1" ).prop('checked', false);
        $( "#pxc-buscador-os-orden-3" ).prop('checked', false);
        // Si es para prender
        if ($('#pxc-buscador-os-orden-2').is(':checked')) {
            setSortingAsc(); 
        // Si es para apagar    
        }else{
            resetSorting();            
        }
        checkBadgesSearch(2);
    });
    $( "#pxc-buscador-os-orden-3" ).on( "click", function() {
        limpiarSorting (); 
        $( "#pxc-buscador-os-orden-2" ).prop('checked', false);
        $( "#pxc-buscador-os-orden-1" ).prop('checked', false);
        // Si es para prender
        if ($('#pxc-buscador-os-orden-3').is(':checked')) {
            setSortingPopular();
        // Si es para apagar    
        }else{
            resetSorting();
        }
        checkBadgesSearch(2);
    });
    // 7.1.4 UI de Fecha
    $( "#pxc-buscador-os-fecha-desde" ).on( "change", function() {
        let tempDate = $( "#pxc-buscador-os-fecha-desde" ).val();
        $( "input[data-drupal-selector='edit-created-min']" ).val(tempDate).change();
        if(tempDate.length > 0) {
            let tempDateD = $( "#pxc-buscador-os-fecha-desde" ).val();
            const [y, m, d] = tempDateD.split(/-|\//);
            const dateD = new Date(y, (m - 1), d);
            minDate = dateD.toISOString().substring(0,10);
            $( "#pxc-buscador-os-fecha-hasta" ).prop('min', minDate);
        }
        checkBadgesSearch(1);
    });
    $( "#pxc-buscador-os-fecha-hasta" ).on( "change", function() {
        let tempDate = $( "#pxc-buscador-os-fecha-hasta" ).val();
        $( "input[data-drupal-selector='edit-created-max']" ).val(tempDate).change();
        if(tempDate.length > 0) {
            let tempDateH = $( "#pxc-buscador-os-fecha-hasta" ).val();
            const [y, m, d] = tempDateH.split(/-|\//);
            const dateH = new Date(y, (m - 1), (d - 1));
            maxDate = dateH.toISOString().substring(0,10);
            $( "#pxc-buscador-os-fecha-desde" ).prop('max', maxDate);
        }
        checkBadgesSearch(1);
    });
    // 7.1.5 UI de Autor y temas
    // A medida que escribe sugiere si la entrada es de más de 2 caracteres.
    $("#pxc-buscador-os-autor").on( "keyup", function() {
        if($(this).val().length > 2) {
            let sugerencia = autocompletarAutores($(this).val());
        }else{
            $( "input[data-drupal-selector='edit-autor']" ).val("").change();
        }
    });
    $("#pxc-buscador-os-temas").on( "keyup", function() {
        if($(this).val().length > 2) {
            let sugerencia = autocompletarTemas($(this).val());
        }else{
            $( "input[data-drupal-selector='edit-taxonomy']" ).val("").change();
        }
    });
    // Si selecciona una de las sugerencias, la usa en el propio campo y en el oculto.
    $( "body" ).on( "click", ".pxc-suggestion-topic", function(e) {
        e.preventDefault();
        $(this).parent("li").parent("ul").parent(".pxc-buscador-os-autocomplete-panel").prev().val($(this).text());
        $(this).parent("li").parent("ul").parent(".pxc-buscador-os-autocomplete-panel").removeClass("visible");
        if($(this).attr("data-pxc-tipo") == "pxc-autor") {
            $( "input[data-drupal-selector='edit-autor']" ).val($(this).text()).change();
        }else{
            $( "input[data-drupal-selector='edit-taxonomy']" ).val($(this).text()).change();
        }
        checkBadgesSearch(1);
    });
    $( "body" ).on( "change", "#pxc-buscador-os-autor", function(e) {
        checkBadgesSearch(1);   
    });
    $( "body" ).on( "change", "#pxc-buscador-os-temas", function(e) {
        checkBadgesSearch(1);   
    });
    
    // Cierra el hablador, si hace clic en cualquier parte del body y además el campo no tiene el foco.
    $( "body" ).on( "click", function(e) {
        if($("#pxc-buscador-os-temas").length > 0 && $("#pxc-buscador-os-temas").not(":focus")) {
            $("#pxc-buscador-os-temas").next(".pxc-buscador-os-autocomplete-panel").removeClass("visible");
            console.log("cerrar");
        }
        if($("#pxc-buscador-os-autor").length > 0 && $("#pxc-buscador-os-autor").not(":focus")) {
            $("#pxc-buscador-os-autor").next(".pxc-buscador-os-autocomplete-panel").removeClass("visible");
            console.log("cerrar");
        }
    });
    
    // Carga por Load
    // Si hay parámetros de búsqueda que los recupere para hacer el query de Facets ONLOAD.
    waitForElm('#views-exposed-form-busqueda-os-page-1').then((elm) => {

        // 7.2 Onload, get the values.
        if($('#views-exposed-form-busqueda-os-page-1').length > 0 ) {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            
            // Por defecto, ya que en este caso el check está condicionado por dos campos, se carga siempre inválido. Si al iterar sobre los params se encuentra que es verdadero para cualquiera de los dos campos se reescribe.
            $( "#pxc-buscador-os-tipo-video" ).prop('checked', false);
            
            // Iterar sobre los parámetros
            let organizadoPor = "";
            let okFiltros = 0;
            let okOrders = 0;
            for (let p of urlParams) { 
                // Tipo
                if(p[0] == 'tipo') {
                    // [[--tipo--]]
                    valor = p[1];
                    valor = valor.toLowerCase();
                    if (valor.length > 0) {
                        if(valor == "1") {
                            $( "#pxc-buscador-os-tipo-publicaciones" ).prop('checked', true);
                            okFiltros++;
                        }
                        if(valor == "0") {
                            $( "#pxc-buscador-os-tipo-contenido" ).prop('checked', true);
                            okFiltros++;
                        }
                    }
                }
                // Status
                if(p[0] == 'status') {
                    // [[--estatus--]]
                    valor = p[1];
                    if(valor == "1") {
                        $( "#pxc-buscador-os-ver-borradores" ).prop('checked',false);
                        okFiltros++;
                    }
                    if(valor == "0") {
                        $( "#pxc-buscador-os-ver-borradores" ).prop('checked', true);
                    }
                }
                // Autor
                if(p[0] == 'autor') {
                    // [[--autor--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        valor = valor.toLowerCase();
                        $( "#pxc-buscador-os-autor").val(DOMPurify.sanitize(valor));
                        okFiltros++;
                    }
                }
                // Taxonomy
                if(p[0] == 'taxonomy') {
                    // [[--taxonomy--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        valor = valor.toLowerCase();
                        $( "#pxc-buscador-os-temas").val(DOMPurify.sanitize(valor));
                        okFiltros++;
                    }
                }
                // Fecha inicio
                if(p[0] == 'created[min]') {
                    // [[--created_min--]]
                    valor = p[1];
                    if (valor.length > 0 && isDateValid(valor)) {
                        $("#pxc-buscador-os-fecha-desde").val(valor).change();
                        let tempDateD = valor;
                        const [y, m, d] = tempDateD.split(/-|\//);
                        const dateD = new Date(y, (m - 1), d);
                        minDate = dateD.toISOString().substring(0,10);
                        $( "#pxc-buscador-os-fecha-hasta" ).prop('min', minDate);
                        okFiltros++;
                    }
                }
                // Fecha fin
                if(p[0] == 'created[max]') {
                    // [[--created_max--]]
                    valor = p[1];
                    if (valor.length > 0 && isDateValid(valor)) {
                        $("#pxc-buscador-os-fecha-hasta").val(valor).change();
                        let tempDateH = valor;
                        const [y, m, d] = tempDateH.split(/-|\//);
                        const dateH = new Date(y, (m - 1), (d - 1));
                        maxDate = dateH.toISOString().substring(0,10);
                        $( "#pxc-buscador-os-fecha-desde" ).prop('max', maxDate);
                        okFiltros++;
                    }
                }
                // Medios: imágenes, audio y video.
                if(p[0] == 'filename_op') {
                    // [[--imagenes--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        if(valor == "=") {
                            $( "#pxc-buscador-os-tipo-imagenes" ).prop('checked', false);
                        }
                        if(valor == "not empty") {
                            $( "#pxc-buscador-os-tipo-imagenes" ).prop('checked', true);
                            okFiltros++;
                        }
                    }
                }
                if(p[0] == 'filename_1_op') {
                    // [[--audios--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        if(valor == "=") {
                            $( "#pxc-buscador-os-tipo-audio" ).prop('checked', false);
                        }
                        if(valor == "not empty") {
                            $( "#pxc-buscador-os-tipo-audio" ).prop('checked', true);
                            okFiltros++;
                        }
                    }
                }
                if(p[0] == 'filename_2_op' || p[0] == 'title_op') {
                    // [[--video--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        if(valor == "not empty") {
                            $( "#pxc-buscador-os-tipo-video" ).prop('checked', true);
                            okFiltros++;
                        }
                    }
                }
                // Sort by
                if(p[0] == 'sort_by') {
                    valor = p[1];
                    if (valor.length > 0) {
                        if(valor == "vistas" || valor == "created") {
                            organizadoPor = valor;
                        }
                    }
                }
                // Sort desc
                if(p[0] == 'sort_order') {
                    valor = p[1];
                    if (valor.length > 0) {
                        if(organizadoPor == "vistas") {
                            console.log(organizadoPor);
                            $( "#pxc-buscador-os-orden-3" ).prop('checked', true);
                            okOrders++;
                        }
                        if(organizadoPor == "created") {
                            if(valor == "DESC") {
                                $( "#pxc-buscador-os-orden-1" ).prop('checked', true);
                            }
                            if(valor == "ASC") {
                                $( "#pxc-buscador-os-orden-2" ).prop('checked', true);
                                okOrders++;
                            }
                        }
                    }                
                }
            }
            if(okFiltros > 0) {
                checkBadgesSearch(1);
            }
            if(okOrders > 0) {
                checkBadgesSearch(2);
            }
        
		let opcionBus0 = "<input type='checkbox' id='opcionBus0' name='opcionBus0' value='0' checked><label for='opcionBus0'>Publicaciones hechas por los usuarios</label>";
		let opcionBus1 = "<input type='checkbox' id='opcionBus1' name='opcionBus1' value='1' checked><label for='opcionBus1'>En el lago de conocimiento</label>";

		if(urlParams.has('opcionBus0') === true) {
			if ($(".pxc-buscador-os-no-result").length === 0 ) {
				$( ".pxc-busqueda-os-grid" ).removeClass("oculto"); 
				$( "#pxc-tabBuscadorOs").removeClass("oculto"); 
				$( "#tabBuscadorOsContent").removeClass("oculto"); 
			}else{
				if(urlParams.has('opcionBus1') === true) {
					$( "#collapseLago").addClass("show"); 
					$( ".pxc-busqueda-os-grid").addClass("oculto");
					$( "#pxc-tabBuscadorOs").addClass("oculto");
					$( "#tabBuscadorOsContent").addClass("oculto");
					console.log("1) Vista Empty On Load launch search by default");
					const myTimeout = setTimeout(function(){pixelSearch();}, 1000);
				}else{
					// Si no, igual muestre que no hay resultados
					$( ".pxc-busqueda-os-grid" ).removeClass("oculto");
					$( "#pxc-tabBuscadorOs").addClass("oculto");
					$( "#tabBuscadorOsContent").addClass("oculto");
				}

			}
		}else{
			$( ".pxc-busqueda-os-grid" ).addClass("oculto");
			$( "#pxc-tabBuscadorOs").addClass("oculto");
			$( "#tabBuscadorOsContent").addClass("oculto");
			opcionBus0 = "<input type='checkbox' id='opcionBus0' name='opcionBus0' value='0'><label for='opcionBus0'>Publicaciones hechas por los usuarios</label>";
		}
		if(urlParams.has('opcionBus1') === true) {
	                $( "#block-pixel-pixeluichatbusqueda").removeClass("oculto");
	                if(urlParams.has('opcionBus0') === false) {
				$( "#collapseLago").addClass("show");
				$( ".pxc-busqueda-os-grid").addClass("oculto"); 
				$( "#pxc-tabBuscadorOs").addClass("oculto");
				$( "#tabBuscadorOsContent").addClass("oculto");
				console.log("2) Solo Chat On Load launch search by default");
				const myTimeout = setTimeout(function(){pixelSearch();}, 1000);
			}
		}else{
			    $( "#block-pixel-pixeluichatbusqueda").addClass("oculto");
			    opcionBus1 = "<input type='checkbox' id='opcionBus1' name='opcionBus1' value='1'><label for='opcionBus1'>En el lago de conocimiento</label>";
		 }
		if(urlParams.has('opcionBus0') === false && urlParams.has('opcionBus1') === false) {
			opcionBus0 = "<input type='checkbox' id='opcionBus0' name='opcionBus0' value='0' checked><label for='opcionBus0'>Publicaciones hechas por los usuarios</label>";
			opcionBus1 = "<input type='checkbox' id='opcionBus1' name='opcionBus1' value='1' checked><label for='opcionBus1'>En el lago de conocimiento</label>";
		}
		$('#views-exposed-form-busqueda-os-page-1').append("<div class='pxc-bus-opciones-lago form-actions'><div class='row'><div class='col-6'>"+ opcionBus0 +"</div><div class='col-6'>"+ opcionBus1 +"</div></div></div>");
        }
    });


    // 8. Controla que alguno este marcado
		$( "body" ).on( "click", "#opcionBus0", function() {
			// Si es para prender
			if ($('#opcionBus0').is(':checked')) {
				// Si es para apagar 0
			}else{
				$( "#opcionBus1" ).prop('checked', true);
			}
		});
		$( "body" ).on( "click", "#opcionBus1", function() {
			// Si es para prender
			if ($('#opcionBus1').is(':checked')) {
				//  Si es para apagar 0
			}else{
				$( "#opcionBus0" ).prop('checked', true);
			}
		});

    
    // 7.2.1 Si carga vía Ajax, en ese caso por el Infinite Scroll, que cargue el slick slider también.    
    $( document ).on( "ajaxSuccess", function( event, xhr, settings) {

          /*$('.slick-foam-media').not('.slick-initialized').slick(getFoamSliderSettings());
          $('.slick-foam-audio').not('.slick-initialized').slick(getAudioSliderSettings());*/
          
            $( ".pxc-folksonomy-item a" ).each(function( index ) {
            $(this).attr("target", "_parent");
            });
            $( ".pxc-tema-contribuido-item a" ).each(function( index ) {
                $(this).attr("target", "_parent");
            });
            $( ".pxc-name-autor a" ).each(function( index ) {
                $(this).attr("target", "_parent");
            });
            $( ".pxc-links a" ).each(function( index ) {
                $(this).attr("target", "_blank");
            });
            $( ".pxc-archivo a" ).each(function( index ) {
                $(this).attr("target", "_blank");
            });
            $( ".pxc-link-stand a" ).each(function( index ) {
                $(this).attr("target", "_blank");
            });
          
    });
    
    // 7.2.2 Beneficios
    $( ".pxc-apply-benefit-t" ).each(function( index ) {
        let beneficioId = $(this).attr("data-pxc-id");
        let botonBeneficio = $(this);
        console.log("---");
        console.log(yaAplico(beneficioId));
        console.log("---");
        if(yaAplico(beneficioId) === 1) {
            botonBeneficio.replaceWith("<span class='pxc-beneficio-aplicado'>Aplicado</span>");
        }else{
            let puntosRequeridosComp = $(this).attr("data-pxc-tokens");
            let puntosDisponiblesTot = $("#data-pxc-puntos-disponible").attr("data-pxc-puntos-disponibles");
            if((parseInt(puntosRequeridosComp)) > (parseInt(puntosDisponiblesTot))) {
                $(this).replaceWith("<span class='pxc-necesitas-mas-puntos'>Tienes que acumular más puntos para participar</span>");
            }
        }
    });
    
    
    // Detiene videos y audios y embebidos cuando se reproduce un video o audio.
    //window.addEventListener('load', function(event) {
      document.querySelectorAll(".pxc-media").forEach((video) => {
        video.onplay = function(event) {
          event.preventDefault();
          document.querySelectorAll(".pxc-media").forEach((playing) => {
            if (video === playing)
              playing.play();
            else
              playing.pause();
          });
          // Los iframes
          var media = document.getElementsByClassName('pxc-frame-videos'),
          i = media.length;

          while (i--) {
              let iframeSrc = media[i].src;
              media[i].src = iframeSrc; 
          }
        }
      });
    //});
    
    //}; // Cierre del window load
    
    function yaAplico(beneficioId) {
        let regreso = 0
        $( ".pxc-item-list-beneficios-aplicados" ).find("span").each(function( index ) {
            if($(this).text() == beneficioId) {
                console.log("si aplico" + beneficioId);
                regreso = 1;
            }
        });
        return regreso;
    }
    
    // 7.3 Utily functions for 7
    // Asigna bdages a la búsqueda para advertir cambios.
    function checkBadgesSearch(tipo) {
        if(tipo == 1) {
            if (
                $('#pxc-buscador-os-tipo-publicaciones').is(':checked') || 
                $('#pxc-buscador-os-tipo-contenido').is(':checked') || 
                $('#pxc-buscador-os-tipo-imagenes').is(':checked') || 
                $('#pxc-buscador-os-tipo-audio').is(':checked') || 
                $('#pxc-buscador-os-tipo-video').is(':checked') || 
                $('#pxc-buscador-os-ver-borradores').is(':checked') ||
                $("#pxc-buscador-os-fecha-hasta" ).val().length > 0 || 
                $("#pxc-buscador-os-fecha-desde" ).val().length > 0 || 
                $("#pxc-buscador-os-autor").val().length > 0 || 
                $("#pxc-buscador-os-temas").val().length > 0 ) {
                $("#pxc-badge-f").removeClass("oculto");
            }else{
                $("#pxc-badge-f").addClass("oculto");
            }
        }else{
            if ($('#pxc-buscador-os-orden-1').is(':checked') || $('#pxc-buscador-os-orden-2').is(':checked') || $('#pxc-buscador-os-orden-3').is(':checked')) {
                $("#pxc-badge-o").removeClass("oculto");
            }else{
                $("#pxc-badge-o").addClass("oculto");
            }            
        }
    }
    
    function limpiarEditTipo () {
        $( "select[data-drupal-selector='edit-tipo']" ).children("option").each(function( index ) {
            $(this).removeAttr('selected');
        });
    }
    function limpiarEditFilenameOp () {
        $( "select[data-drupal-selector='edit-filename-op']" ).children("option").each(function( index ) {
            $(this).removeAttr('selected');
        });
    }
    function limpiarEditFilenameOp1 () {
        $( "select[data-drupal-selector='edit-filename-1-op']" ).children("option").each(function( index ) {
            $(this).removeAttr('selected');
        });
    }
    function limpiarEditFilenameOp2 () {
        $( "select[data-drupal-selector='edit-filename-2-op']" ).children("option").each(function( index ) {
            $(this).removeAttr('selected');
        });
    }
    function limpiarEditTitleOp () {
        $( "select[data-drupal-selector='edit-title-op']" ).children("option").each(function( index ) {
            $(this).removeAttr('selected');
        });
    }
    function limpiarEditSatus () {
        $( "select[data-drupal-selector='edit-status']" ).children("option").each(function( index ) {
            $(this).removeAttr('selected');
        });
    }
    function resetSorting () {
        $( "select[data-drupal-selector='edit-sort-by']" ).val("created").change();
        $( "select[data-drupal-selector='edit-sort-by'] option[value='created']" ).attr('selected','selected');
        $( "select[data-drupal-selector='edit-sort-order']" ).val("DESC").change();
        $( "select[data-drupal-selector='edit-sort-order'] option[value='DESC']" ).attr('selected','selected');
    }
    function setSortingAsc () {
        $( "select[data-drupal-selector='edit-sort-by']" ).val("created").change();
        $( "select[data-drupal-selector='edit-sort-by'] option[value='created']" ).attr('selected','selected');
        $( "select[data-drupal-selector='edit-sort-order']" ).val("ASC").change();
        $( "select[data-drupal-selector='edit-sort-order'] option[value='ASC']" ).attr('selected','selected');
    }
    function setSortingPopular () {
        $( "select[data-drupal-selector='edit-sort-by']" ).val("vistas").change();
        $( "select[data-drupal-selector='edit-sort-by'] option[value='vistas']" ).attr('selected','selected');
        $( "select[data-drupal-selector='edit-sort-order']" ).val("DESC").change();
        $( "select[data-drupal-selector='edit-sort-order'] option[value='DESC']" ).attr('selected','selected');
    }
    function limpiarSorting () {
        $( "select[data-drupal-selector='edit-sort-by']" ).children("option").each(function( index ) {
            $(this).removeAttr('selected');
        });
        $( "select[data-drupal-selector='edit-sort-order']" ).children("option").each(function( index ) {
            $(this).removeAttr('selected');
        });
    }
    function isDateValid(dateStr) {
        return !isNaN(new Date(dateStr));
    }
    function autocompletarAutores(q) {
        
        // Si los campos no están completos, entonces no se genere el autocompletado, porque quiere decir que no ha habido búsqueda.
            
        let urlAuto = "/pxc-simple-auto-autores-service?q=" + q;
            
        // console.log("Start Ajax Autocomplete Autor");
        $.ajax({
            url: urlAuto,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json",
            success: function(data){
                //process the JSON data etc.
                dibujarAutocompletar(data.suggest.autores, "#pxc-buscador-os-autor-autocomplete-panel");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        
    }
    function autocompletarTemas(q) {
        
        // Si los campos no están completos, entonces no se genere el autocompletado, porque quiere decir que no ha habido búsqueda.
            
        let urlAuto = "/pxc-simple-auto-temas-service?q=" + q;
            
            
        // console.log("Start Ajax Autocomplete Temas");
        $.ajax({
            url: urlAuto,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json",
            success: function(data){
                //process the JSON data etc
                dibujarAutocompletar(data.suggest.taxoterms, "#pxc-buscador-os-temas-autocomplete-panel");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        
    }
    function dibujarAutocompletar(data, control) {
        console.log(data);
        console.log(control);
        let uKey = "";
        Object.keys(data).forEach(function (key) {
            uKey = data[key];
        });
        console.log(uKey.suggestions);
        let html = "";
        if(uKey.suggestions.length > 0) {
            let diferenciador = "pxc-autor";
            if(control == "#pxc-buscador-os-temas-autocomplete-panel") {
                diferenciador = "pxc-tema";
            }
            html += "<ul>";
            for (let i = 0; i < uKey.suggestions.length; i++) {
                html += "<li><a class='pxc-suggestion-topic' data-pxc-tipo="+diferenciador+" href='#'>" + uKey.suggestions[i].term + "</a></li>";
            }
            html += "</ul>";
            $(control).addClass("visible");
            let controlHtml = $(control).html(html);
        }
    }
    

// End of Part 1
});
})(jQuery); 



// PART 2. Vainilla JS

    // 2.1 Abrir sidebar
    function openNav(){
        var element=document.getElementById("pxc-lateral");element.classList.add("pxc-lateral-activo");
        document.getElementById("pxc-main-menu-boton").setAttribute("aria-expanded", true);
        document.getElementById("pxc-lateral-boton").setAttribute("aria-expanded", true);
    }
    function closeNav(){
        var element=document.getElementById("pxc-lateral");element.classList.remove("pxc-lateral-activo");
        document.getElementById("pxc-main-menu-boton").setAttribute("aria-expanded", false);
        document.getElementById("pxc-lateral-boton").setAttribute("aria-expanded", false);
    }
    
    // 3. Wait to exist
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
    
            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    
    // Eventos de las modales
    waitForElm('#themeModal-comentarios').then((elm) => {
        const myModalComentarios = document.getElementById('themeModal-comentarios')
            // Blanquea la modal cuando se cierra para evitar parpadeos entre recargas de urls.
            myModalComentarios.addEventListener('hidden.bs.modal', event => {
                let elValido = document.getElementById('pxc-foam-iframe');
                if(elValido != null) {
                    document.getElementById('pxc-foam-iframe').setAttribute("src","about:blank");
                }
            });
            myModalComentarios.addEventListener('hide.bs.modal', function (event) {
                // Detiene todos los medios
                stopAll();
            });
            myModalComentarios.addEventListener('show.bs.modal', function (event) {
                // Detiene todos los medios
                stopAll();
            });
    })
    waitForElm('#themeModal1').then((elm) => {
        const myModalComentarios = document.getElementById('themeModal1')
            myModalComentarios.addEventListener('hidden.bs.modal', event => {
                let elValido = document.getElementById('pxc-lista-contenidos-iframe');
                if(elValido != null) {
                    document.getElementById('pxc-lista-contenidos-iframe').setAttribute("src","about:blank");
                }
            });
    })
    
    // Detiene toda la reproducción: videos, audios y embebidos
    function stopAll() {
        // Todos los audios y videos
        var media = document.getElementsByClassName('pxc-media'),
        i = media.length;

        while (i--) {
            media[i].pause();
        }
        
        // Los iframes
        var media = document.getElementsByClassName('pxc-frame-videos'),
        i = media.length;

        while (i--) {
            let iframeSrc = media[i].src;
            media[i].src = iframeSrc; 
        }
    }

    
    // Mutation observer
    
    //
    /*function getFoamSliderSettings(){
      return {
        dots: false,
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    function getAudioSliderSettings(){
      return {
        dots: false,
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }*/




// EOF (Fin del archivo para produccion)
