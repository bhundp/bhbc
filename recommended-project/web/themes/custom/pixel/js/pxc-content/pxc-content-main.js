// Pixel Theme Management

// PART 1. JQuery
(function($) {
$(document).ready(function () {
    
    //window.onload = function() {

    // 1. Create UI para facilitar la edicion
    // Pinta los botones de asistente y mejora de los textos en el Ckfinder.
    if ($('.ck-toolbar__items').length > 0){
        $( ".ck-toolbar__items" ).append( "<button type='button' class='ck ck-button ck-off pxc-ai-boton-ck pxc-ai-boton-ck-1' data-bs-toggle='modal' data-bs-target='#themeModal'>Asistente</button>" );
    }
    if ($('.ck-toolbar__items').length > 0){
        $( ".ck-toolbar__items" ).append( "<button type='button' class='ck ck-button ck-off pxc-ai-boton-ck pxc-ai-boton-ck-2' onclick='aiVarnish()'>Pulir texto</button>" );
    }
    
    // Crea los elementos de UI necesarios para manejar las opciones de edición por paneles.
    // Si es nuevo el nodo, las opciones son más limitadas que si es para editar.
    if (window.location.pathname == "/node/add/foam") {
        if ($('#wrapper-foam-video').length > 0){
            $( "#wrapper-foam-video > .pxc-grupo-paneles" ).prepend("<div class='container-xxl pxc-grupo-panel pxc-botones-opciones' id='pxc-botones-opciones-v'><div class='row justify-content-center'><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-video-1'>Cargar archivos de video</a></div><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-video-2'>Incluir enlaces a videos remotos</a></div><div class='col-md-3'><a href='javascript: void(0)' class='pxc-boton-opcion-editar pxc-boton-opcion-editar-disabled' id='pxc-boton-opcion-editar-video-31'>Grabar su propio video</a></div></div></div>");
            $('#wrapper-foam-video').parent('details').prepend("<span class='pxc-titulo-panel'>¿Qué opciones tienes para añadir video?</span>");
        }
        if ($('#wrapper-foam-audio').length > 0){
            $( "#wrapper-foam-audio > .pxc-grupo-paneles" ).prepend("<div class='container-xxl pxc-grupo-panel pxc-botones-opciones' id='pxc-botones-opciones-a'><div class='row justify-content-center'><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-audio-1'>Cargar archivos de audio</a></div><div class='col-md-3'><a href='javascript: void(0)' class='pxc-boton-opcion-editar pxc-boton-opcion-editar-disabled' id='pxc-boton-opcion-editar-audio-21'>Grabar su propio audio</a></div></div></div>");
            $('#wrapper-foam-audio').parent('details').prepend("<span class='pxc-titulo-panel'>¿Qué opciones tienes para añadir audio?</span>");
        }        
    }else{
        if ($('#wrapper-foam-video').length > 0){
            $( "#wrapper-foam-video > .pxc-grupo-paneles" ).prepend("<div class='container-xxl pxc-grupo-panel pxc-botones-opciones' id='pxc-botones-opciones-v'><div class='row justify-content-center'><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-video-1'>Cargar archivos de video</a></div><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-video-2'>Incluir enlaces a videos remotos</a></div><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-video-3'>Grabar su propio video</a></div></div></div>");
            $('#wrapper-foam-video').parent('details').prepend("<span class='pxc-titulo-panel'>¿Qué opciones tienes para añadir video?</span>");
        }
        if ($('#wrapper-foam-audio').length > 0){
            $( "#wrapper-foam-audio > .pxc-grupo-paneles" ).prepend("<div class='container-xxl pxc-grupo-panel pxc-botones-opciones' id='pxc-botones-opciones-a'><div class='row justify-content-center'><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-audio-1'>Cargar archivos de audio</a></div><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-audio-2'>Grabar su propio audio</a></div></div></div>");
            $('#wrapper-foam-audio').parent('details').prepend("<span class='pxc-titulo-panel'>¿Qué opciones tienes para añadir audio?</span>");
        }
    }
    if ($('#wrapper-foam-imagen').length > 0){
        $( "#wrapper-foam-imagen > .pxc-grupo-paneles" ).prepend("<div class='container-xxl pxc-grupo-panel pxc-botones-opciones' id='pxc-botones-opciones-i'><div class='row justify-content-center'><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-imagen-1'>Cargar imágenes</a></div></div></div>");
        $('#wrapper-foam-imagen').parent('details').prepend("<span class='pxc-titulo-panel'>¿Qué opciones tienes para añadir imágenes?</span>");
    }
    if ($('#wrapper-foam-enlaces').length > 0){
        $( "#wrapper-foam-enlaces > .pxc-grupo-paneles" ).prepend("<div class='container-xxl pxc-grupo-panel pxc-botones-opciones' id='pxc-botones-opciones-e'><div class='row justify-content-center'><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-link-1'>Cargar documentos</a></div><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-link-2'>Incluir enlaces</a></div><div class='col-md-3'><a href='#' class='pxc-boton-opcion-editar' id='pxc-boton-opcion-editar-link-3'>Seleccionarlos de la Biblioteca Humana</a></div></div></div>");
        $('#wrapper-foam-enlaces').parent('details').prepend("<span class='pxc-titulo-panel'>¿Qué opciones tienes para añadir anexos y enlaces?</span>");
    }
    // 1.1 Subtitulos de las opciones dentro de los paneles.
    $(".field--name-field-adj-videos").prepend("<span class='pxc-subtitulo-panel'>Cargar archivos de video</span>");
    $(".field--name-field-adj-videos-remotos").prepend("<span class='pxc-subtitulo-panel'>Incluir enlaces a videos remotos</span>");
    $(".field--name-field-stream-video").prepend("<span class='pxc-subtitulo-panel'>Grabar su propio video</span>");
    
    $(".field--name-field-adj-imagenes").prepend("<span class='pxc-subtitulo-panel'>Cargar imágenes</span>");
    
    $(".field--name-field-adj-audio").prepend("<span class='pxc-subtitulo-panel'>Cargar archivos de audio</span>");
    $(".field--name-field-stream-audio").prepend("<span class='pxc-subtitulo-panel'>Grabar su propio audio</span>");
    
    $(".field--name-field-adj-documentos").prepend("<span class='pxc-subtitulo-panel'>Cargar documentos</span>");
    $(".field--name-field-links").prepend("<span class='pxc-subtitulo-panel'>Incluir enlaces</span>");
    $(".field--name-field-adj-foam-relacionados").prepend("<span class='pxc-subtitulo-panel'>Seleccionarlos de la Biblioteca Humana</span>");
    
    // 2. Controlar la UI de edicion, agrega opciones para poder operar los panales de edición.
    $('.field--name-field-adj-videos').addClass("pxc-grupo-panel oculto");
    $('.field--name-field-adj-videos').append("<span class='pxc-panel-grupo-cerrar'>x</span>");
    $('.field--name-field-adj-videos-remotos').addClass("pxc-grupo-panel oculto");
    $('.field--name-field-adj-videos-remotos').append("<span class='pxc-panel-grupo-cerrar'>x</span>");
    $('.field--name-field-stream-video').addClass("pxc-grupo-panel oculto");
    $('.field--name-field-stream-video').append("<span class='pxc-panel-grupo-cerrar'>x</span>");
    
    $('.field--name-field-adj-imagenes').addClass("pxc-grupo-panel oculto");
    $('.field--name-field-adj-imagenes').append("<span class='pxc-panel-grupo-cerrar'>x</span>");
    
    $('.field--name-field-adj-audio').addClass("pxc-grupo-panel oculto");
    $('.field--name-field-adj-audio').append("<span class='pxc-panel-grupo-cerrar'>x</span>");
    $('.field--name-field-stream-audio').addClass("pxc-grupo-panel oculto");
    $('.field--name-field-stream-audio').append("<span class='pxc-panel-grupo-cerrar'>x</span>");
    
    $('.field--name-field-adj-documentos').addClass("pxc-grupo-panel oculto");
    $('.field--name-field-adj-documentos').append("<span class='pxc-panel-grupo-cerrar'>x</span>");
    
    // 2.1 Controla la UI de Foams relacionados adicionando elementos para hacer operable la ventana en donde se seleccionan contenidos de la biblioteca relacionados.
    $('.field--name-field-adj-foam-relacionados').addClass("pxc-grupo-panel oculto");
        $('.field--name-field-adj-foam-relacionados').prepend("<span id='pxc-lista-foam-relacionados' data-pxc-lock='1'></span><div id='pxc-vista-foam-relacionados'></div>");
    $("#pxc-absolute-footer").appendTo( ".field--name-field-adj-foam-relacionados" );    
    $('.field--name-field-adj-foam-relacionados').append("<span class='pxc-panel-grupo-cerrar'>x</span><div class='pxc-relacionar-mas text-center'><a id='pxc-button-launch-busqueda' type='button' class='pxc-foam-edit-launcher' data-bs-toggle='modal' data-bs-target='#themeModal-comentarios'>Seleccionar...</a></div>");
    // 2.1.1 Evento que adiciona desde la vista de búsqueda de contenidos relacionados a la vista de contenidos efectivamente relacionados con el nodo.
    $( "body" ).on( "click", "a[href='#foam-enlace']", function() {
        updateVistaFoamRel();
    });
    
    // 2.2 Reubicación elementos de temas y adición de elementos de UI para el panel de etiquetas de temas.
    $("#pxc-absolute-footer-1").appendTo( ".foam_temas_contenedor");
    $('.foam_temas_contenedor').prepend("<span class='pxc-titulo-panel'>¿Qué opciones tienes para etiquetar tu contenido?</span>");
    
    $('.field--name-field-links').addClass("pxc-grupo-panel oculto");
    $('.field--name-field-links').append("<span class='pxc-panel-grupo-cerrar'>x</span>");
    
    // 2.3 Autodiligenciar el nombre del contenido.
    if($(".field--name-title").length > 0) {
        let controlTitulo = 0;
        $( "input" ).each(function( index ) {
                nombreTemporal = $( this ).attr("data-drupal-selector");
                if(typeof nombreTemporal !== 'undefined' && nombreTemporal !== false) {
                    if(nombreTemporal.includes("edit-title") && $( this ).attr("name") == "title[0][value]" && $( this ).attr("value") == "") {
                        $( this ).attr("value", "Foam: " + $("#pxc-main").attr("data-pxc-cur-user") + " - " + Date.now());
                        controlTitulo++;
                    }
                }
        });
        if(controlTitulo == 0) {
            $(".pxc-page-title").children("h1").text("Editar contenido");
        }else{
            $(".pxc-page-title").children("h1").text("Crear nuevo contenido");
        }
    }
    
    // 2.4 Incluir check de borradores
    if($("select[data-drupal-selector='edit-moderation-state-0-state']").length > 0) {
        if($("select[data-drupal-selector='edit-moderation-state-0-state']").val() == "draft") {
            $("#pxc-checkbox-estatus").prop('checked', true);
            $(".pxc-borrador").removeClass('pxc-borrador-off');
        }else{
            $("#pxc-checkbox-estatus").prop('checked', false);
            $(".pxc-borrador").addClass('pxc-borrador-off');
        }
    }
    // 2.4.1 Evento de cambio de estatus a partir del checkbox que controla si es publicado o borrador.
    $( "body" ).on( "click", "#pxc-checkbox-estatus", function() {
            // Si es para prender
            if ($('#pxc-checkbox-estatus').is(':checked')) {
                $( "select[data-drupal-selector='edit-moderation-state-0-state']" ).val("draft").change();
                $( "select[data-drupal-selector='edit-moderation-state-0-state'] option[value='draft']" ).attr('selected','selected');
                $(".pxc-borrador").removeClass('pxc-borrador-off');
            }else{
                $( "select[data-drupal-selector='edit-moderation-state-0-state']" ).val("published").change();
                $( "select[data-drupal-selector='edit-moderation-state-0-state'] option[value='published']" ).attr('selected','selected');
                $(".pxc-borrador").addClass('pxc-borrador-off');
            }
    });
    
    // 3. Acciones para mostrar paneles en el UI.
    $('#pxc-boton-opcion-editar-video-1').on('click', function () { 
         $('#pxc-botones-opciones-v').addClass("oculto");
         $('.field--name-field-adj-videos-remotos').addClass("oculto");
         $('.field--name-field-adj-videos').removeClass("oculto");
    });
    $('#pxc-boton-opcion-editar-video-2').on('click', function () { 
         $('#pxc-botones-opciones-v').addClass("oculto");
         $('.field--name-field-adj-videos').addClass("oculto");
         $('.field--name-field-adj-videos-remotos').removeClass("oculto");
    });
    $('#pxc-boton-opcion-editar-video-3').on('click', function () { 
         $('#pxc-botones-opciones-v').addClass("oculto");
         $('.field--name-field-stream-video').addClass("oculto");
         $('.field--name-field-stream-video').removeClass("oculto");
    });
    $('#pxc-boton-opcion-editar-audio-1').on('click', function () { 
         $('#pxc-botones-opciones-a').addClass("oculto");
         $('.field--name-field-adj-audio').removeClass("oculto");
    });
    $('#pxc-boton-opcion-editar-audio-2').on('click', function () { 
         $('#pxc-botones-opciones-a').addClass("oculto");
         $('.field--name-field-stream-audio').removeClass("oculto");
    });
    $('#pxc-boton-opcion-editar-imagen-1').on('click', function () { 
         $('#pxc-botones-opciones-i').addClass("oculto");
         $('.field--name-field-adj-imagenes').removeClass("oculto");
    });
    $('#pxc-boton-opcion-editar-link-1').on('click', function () { 
         $('#pxc-botones-opciones-e').addClass("oculto");
         $('.field--name-field-links').addClass("oculto");
         $('.field--name-field-adj-foam-relacionados').addClass("oculto");
         $('.field--name-field-adj-documentos').removeClass("oculto");
    });
    $('#pxc-boton-opcion-editar-link-3').on('click', function () { 
         updateVistaFoamRel();
         $('#pxc-botones-opciones-e').addClass("oculto");
         $('.field--name-field-adj-documentos').addClass("oculto");
         $('.field--name-field-links').addClass("oculto");
         $('.field--name-field-adj-foam-relacionados').removeClass("oculto");
    });
    $('#pxc-boton-opcion-editar-link-2').on('click', function () { 
         $('#pxc-botones-opciones-e').addClass("oculto");
         $('.field--name-field-adj-documentos').addClass("oculto");
         $('.field--name-field-adj-foam-relacionados').addClass("oculto");
         $('.field--name-field-links').removeClass("oculto");
    });
    // 3.1 Acción de cerrar paneles.
    $('.pxc-panel-grupo-cerrar').on('click', function () { 
        $(this).parent('.pxc-grupo-panel').addClass("oculto");
        $(this).parent('.pxc-grupo-panel').siblings('.pxc-botones-opciones').removeClass("oculto");
    });
    
    // 3.2 Cerrar búsqueda con el botón "terminar" y agregar título a la modal cuando se abre.
    $( "body" ).on( "click", "#pxc-busqueda-interna-button", function(e) {
        e.preventDefault();
        $('#themeModal-comentarios').modal('hide');
    });
    $( "body" ).on( "click", "#pxc-button-launch-busqueda", function(e) {
        $("#themeModalLabel-comentarios").text("Buscar");
    });
    
    // 4. Badges
    // 4.1 Create empty badges
    if ($('#node-foam-edit-form').length > 0){
        checkBadges();
        checkFoams();
        checkTags();
    }
    
    // 4.2 Inclusión de textos de apoyo a la UI de etiquetado.
    if($("#block-pixel-views-block-tagging-form-pxc-tagging-del-nodo-form-2").length > 0) {
            $("#block-pixel-views-block-tagging-form-pxc-tagging-del-nodo-form-2").prepend("<hr class='pxc-linea-separadora'><p class='pxc-subtitulo-gris text-center'>¿Con cuáles temas está relacionado este contenido?</p>");
    }
   
    // 4.2.1 Ubicar datos por default si son suministrados en el CK editor y en los campos de enlace    
	if($(".ck-editor__editable").length > 0) {
		if($("#pxc-suggested-text").length > 0) {
			let texto = $("#pxc-suggested-text").text();
			const domEditableElement = document.querySelector( '.ck-editor__editable' );
			const editorInstance = domEditableElement.ckeditorInstance;
			editorInstance.setData( "<p>"+ texto +"</p>" );
		}
	}
    if($("[data-drupal-selector='edit-field-links']").length > 0) {
	let contador = 0;
	$('#pxc-suggested-documents ul li').each(function() {
		if(contador > 0) {
			$("[data-drupal-selector='edit-field-links-add-more']").trigger('mousedown');
		}else{
			// Si es el documento 0, como el campo está disponible simplemente le asigna el valor.
			$("[data-drupal-selector='edit-field-links-"+contador+"-uri']").val($(this).text());
			$("[data-drupal-selector='edit-field-links-"+contador+"-title']").val($(this).text());
		}
		contador++;
		checkBadges();
	});
    }


    // 4.3 Método para reubicar la foto del perfil del usuario al ítem de menú. Es una especie de refuerzo de esta misma función que se encuentra en main.js.
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
    
    // Funciones:
    
    // Check foams, crea un texto para el campo pxc-lista-foam-relacionados con la lista de ids de los foams relacionados. Este texto está en un campo oculto pero resulta vital para crear las relaciones al momento de salvar. Ese campo de hecho lo usa el ECA 5 como insumo para crear las relaciones. 
    function checkFoams() {
        let stringFoamsRel = "";
        let valorFoamRelacionado
        let valorSubpartes = [];
        let valorId = "";
        $( "input" ).each(function( index ) {
            nombreTemporal = $( this ).attr("data-drupal-selector");
            if(typeof nombreTemporal !== 'undefined' && nombreTemporal !== false) {
                if(nombreTemporal.includes("edit-field-adj-foam-relacionados") && $( this ).attr("type") == "text" && $( this ).val() != "" && $( this ).val() != undefined) {
                        console.log( "FOAM-REL:" + index + ": " + $( this ).attr("data-drupal-selector") + " - " + $( this ).attr("type") + " - " + $( this ).attr("value") );
                     valorFoamRelacionado = $( this ).attr("value");
                     if (valorFoamRelacionado !== "") {
                        valorSubpartes = valorFoamRelacionado.split("\(");
                        valorId = valorSubpartes[1].replace("\)","");
                        console.log(valorId);
                        stringFoamsRel += "[" + valorId + "]";
                     }
                }
            }
        });
        $("#pxc-lista-foam-relacionados").text(stringFoamsRel);
    }
    
    // Check tags, genera las pastillas que se ven en el área de etiquetas. Dado que Drupal guarda la información en el campo con la respectiva referencia, este script traduce esos valores en pastillas que son operables por el usuario. Lo hace tanto con los valores guardados en el campo de taxonomías oficiales, como en el de temas contribuidos. 
    function checkTags() {
        let stringFoamsRel = "";
        let valorFoamRelacionado;
        let valorSubpartes = [];
        let valorId = "";
        let valorLabel = "";
        
        $( ".vertical-tabs__menu-item.last" ).append("<span id='pxc-badge-0-6' class='pxc-badge-pht-6'></span>");
        
        const listaIds = [];
        const listaIdsContribuidas = [];
        const listaIdsAutor = [];
        let conteoTaxos = 0;
        
        $( "input" ).each(function( index ) {
            nombreTemporal = $( this ).attr("data-drupal-selector");
            if(typeof nombreTemporal !== 'undefined' && nombreTemporal !== false) {
                if(nombreTemporal.includes("edit-field-folksonomy") && $( this ).attr("type") == "text" && $( this ).val() != "" && $( this ).val() != undefined) {
                        console.log( "TAG:" + index + ": " + $( this ).attr("data-drupal-selector") + " - " + $( this ).attr("type") + " - " + $( this ).attr("value") );
                     valorFoamRelacionado = $( this ).attr("value");
                     if (valorFoamRelacionado !== "") {
                        valorSubpartes = valorFoamRelacionado.split("\ (");
                        valorId = valorSubpartes[1].replace("\)","");
                        valorLabel = valorSubpartes[0];
                        console.log(valorId);
                        
                        if(listaIds.includes(valorId) == false) { 
                            listaIds.push(valorId);
                            listaIdsAutor.push(valorId);
                            conteoTaxos++;
                            
                            $("#pxc-tag-list").append("<li class='pxc-tema-item-autor' data-id='"+ valorId +"'>" +  valorLabel + "<span class='pxc-tema-item-autor-cerrar'>X</span></li>");
                            
                            el = $("#pxc-badge-0-6");
                            updateBadge(el,el.text(),1);
                        }else{
                            console.log(newItem + " Ya está en la lista");
                        }
                        
                     }
                }
                if(nombreTemporal.includes("edit-field-temas-contribuidos") && $( this ).attr("type") == "text" && $( this ).val() != "" && $( this ).val() != undefined) {
                        console.log( "TAG:" + index + ": " + $( this ).attr("data-drupal-selector") + " - " + $( this ).attr("type") + " - " + $( this ).attr("value") );
                     valorFoamRelacionado = $( this ).attr("value");
                     if (valorFoamRelacionado !== "") {
                        valorSubpartes = valorFoamRelacionado.split("\ (");
                        valorId = valorSubpartes[1].replace("\)","");
                        valorLabel = valorSubpartes[0];
                        console.log(valorId);
                        
                        if(listaIds.includes(valorId) == false) { 
                            listaIds.push(valorId);
                            listaIdsContribuidas.push(valorId);
                            conteoTaxos++;
                            
                            $("#pxc-tag-list").append("<li class='pxc-tema-item-contribuidor' data-id='"+ valorId +"'>" + valorLabel + "<span class='pxc-tema-item-contribuidor-cerrar'>X</span></li>");
                            
                            el = $("#pxc-badge-0-6");
                            updateBadge(el,el.text(),1);
                        }else{
                            console.log(valorId + " Ya está en la lista");
                        }
                     }
                }
            }
        });
        
        // Carga por defecto todas las taxonomias contribuidas en el campo.
        if(listaIds.length > 0) {
            let cadenaDeTemas = "";
            cadenaDeTemas = listaIdsContribuidas.join("+") + "+sep+" + listaIdsAutor.join("+");
            $("#edit-field-lista-de-taxonomias-relaci-0-value").val(cadenaDeTemas).change();
        }
        
        // Deshabilita que el formulario se pueda enviar hasta que no haya ítems en el campo.
        $('#pxc-simple-form-tagging-content input[type="submit"]').prop("disabled", true);
        if(conteoTaxos == 0) {
            $("#block-pixel-pixeltagslist").prepend("<p class='pxc-subtitulo-azul'>Sin temas relacionados</p>");
        }else if (conteoTaxos == 1){
            $("#block-pixel-pixeltagslist").prepend("<p class='pxc-subtitulo-azul'>Un tema relacionado</p>");
        }else{    
            $("#block-pixel-pixeltagslist").prepend("<p class='pxc-subtitulo-azul'>"+ conteoTaxos +" temas relacionados</p>");
        }
        
        
    }
    
    // Checkbadges, hace un recorrido por los campos del formulario para detectar cuáles tienen valores y en qué cantidad para establecer a partir de allí el texto que mostrarán los distintos badges dispuestos en el formato de edición. Cada pestaña y cada opción dentro de los paneles tiene su propio badge diferenciado por un id.
    function checkBadges() {
        
        // Sí los badges están, los destruya
        if($(".pxc-badge-pht").length > 0) {
            $(".pxc-badge-pht").remove();
        }
        
        // Crear los badges como fantasmas
        $( ".vertical-tabs__menu-item" ).each(function( index ) {
            if(index != 6) {
                $( this ).append("<span id='pxc-badge-0-"+index+"' class='pxc-badge-pht'></span>");
            }
        });
        $( ".pxc-boton-opcion-editar" ).each(function( index ) {
            $( this ).parent("div").append("<span id='pxc-badge-1-"+index+"' class='pxc-badge-pht'></span>");
        });
        
        
        // Comienza a barrer cada uno de los campos sensibles a badges y suma.
        let el = [];
        let nombreTemporal = "";
        // Badges of the body
        $( "textarea" ).each(function( index ) {
            //console.log( index + ": " + $( this ).attr("data-drupal-selector") );
            if($( this ).attr("data-drupal-selector").includes("edit-body") && $( this ).val() != "" && $( this ).val() != undefined) {
                el = $("#pxc-badge-0-0");
                updateBadge(el,"",2);
            }
        });
        // Badges of others input
        let contarControles = 0;
        $( "input" ).each(function( index ) {
            nombreTemporal = $( this ).attr("data-drupal-selector");
            if(typeof nombreTemporal !== 'undefined' && nombreTemporal !== false) {
                if(nombreTemporal.includes("edit-field-adj-videos-remotos") && $( this ).attr("type") == "text" && $( this ).val() != "" && $( this ).val() != undefined) {
                    console.log( index + ": " + $( this ).attr("data-drupal-selector") + " - " + $( this ).attr("type") + " - " + $( this ).attr("value") );
                    el = $("#pxc-badge-0-1");
                    updateBadge(el,el.text(),1);
                    el = $("#pxc-badge-1-1");
                    updateBadge(el,el.text(),1);
                }
                if(nombreTemporal.includes("edit-field-links") && nombreTemporal.includes("-uri") && $( this ).attr("type") == "text" && $( this ).val() != "" && $( this ).val() != undefined) {
                    console.log( index + ": " + $( this ).attr("data-drupal-selector") + " - " + $( this ).attr("type") + " - " + $( this ).attr("value") );
                    el = $("#pxc-badge-0-4");
                    updateBadge(el,el.text(),1);
                    el = $("#pxc-badge-1-7");
                    updateBadge(el,el.text(),1);
                }
            }
        });
        // Badges of files
        $( "span" ).each(function( index ) {
            nombreTemporal = $( this ).attr("data-drupal-selector");
            if(typeof nombreTemporal !== 'undefined' && nombreTemporal !== false) {
                console.log( index + ": " + $( this ).attr("data-drupal-selector") );
                if(nombreTemporal.includes("edit-field-adj-audio")) {
                    el = $("#pxc-badge-0-3");
                    updateBadge(el,el.text(),1);
                    el = $("#pxc-badge-1-4");
                    updateBadge(el,el.text(),1);
                }
                if(nombreTemporal.includes("edit-field-adj-videos")) {
                    el = $("#pxc-badge-0-1");
                    updateBadge(el,el.text(),1);
                    el = $("#pxc-badge-1-0");
                    updateBadge(el,el.text(),1);
                }
                if(nombreTemporal.includes("edit-field-adj-imagenes")) {
                    el = $("#pxc-badge-0-2");
                    updateBadge(el,el.text(),1);
                    el = $("#pxc-badge-1-3");
                    updateBadge(el,el.text(),1);
                }
                if(nombreTemporal.includes("edit-field-adj-documentos")) {
                    el = $("#pxc-badge-0-4");
                    updateBadge(el,el.text(),1);
                    el = $("#pxc-badge-1-6");
                    updateBadge(el,el.text(),1);
                }
            }
        });
        
        if($("#block-pixel-views-block-foam-block-2").text().length > 0) {
            $( "#block-pixel-views-block-foam-block-2 .pxc-foam-micro-card" ).each(function( index ) {
                el = $("#pxc-badge-0-4");
                updateBadge(el,el.text(),1);
                el = $("#pxc-badge-1-8");
                updateBadge(el,el.text(),1);
            });
        }
        
    }
    
    // 4.4 Cuando hay llamados de Ajax exitosos, llamar la creación de badges.
    $( document ).on( "ajaxSuccess", function( event, xhr, settings ) {
        // console.log(settings.url);
        checkBadges();
    });
    
    //};

// End of Part 1
});
})(jQuery); 

    // updateVistaFoamRel, actualiza el parámetro de los foams relacionados para con éste se pueda recargar la vista embebida de los nodos relacionados con el que se edita. Es más que nada una utilidad de ayuda, pues la relación real se construye con un texto de foams relacionados que se gestiona de forma oculta (pxc-lista-foam-relacionados).
    function updateVistaFoamRel() {
        (function($) {
            let misIdsRam = $("#pxc-lista-foam-relacionados").text();
            misIdsRam = misIdsRam.replaceAll("][", "$|^");
            misIdsRam = misIdsRam.replace("[", "^");
            misIdsRam = misIdsRam.replace("]", "$");
            misIdsRam = "(" + misIdsRam + ")"
            let misIdsRam1 = $("#pxc-lista-foam-relacionados").text();
            misIdsRam1 = misIdsRam1.replaceAll("][", "+");
            misIdsRam1 = misIdsRam1.replace("[", "");
            misIdsRam1 = misIdsRam1.replace("]", "");
            if($(".pxc-aviso-de-vacio").length) {
                $(".pxc-aviso-de-vacio").remove();
            }
            
            $("input[data-drupal-selector='edit-nid']").val(misIdsRam).change();
            $("input[data-drupal-selector='edit-field-lista-de-foams-relacionado-0-value']").val(misIdsRam1).change();
            if(misIdsRam.length > 2) {
                $(".pxc-aviso-de-vacio").remove();
                $("#pxc-absolute-footer .js-form-submit").click();
            }else{
                $("#pxc-absolute-footer").addClass("oculto");
                $(".field--name-field-adj-foam-relacionados").prepend("<span class='pxc-aviso-de-vacio'>Aún no tienes enlaces con otras publicaciones.</span>");
            }
            
        })(jQuery); 
    }

    // updateBadge, ejecuta la actualización del badge como tal enviando el número al badge específico.
    function updateBadge(el, text, tipo) {
        console.log("Badging...for: " + el.attr("id"));
        (function($) {
            if(tipo == 0) { // Solo adiciona un texto
                el.text(text);
                el.addClass("pxc-badge");
            }
            if(tipo == 2) { // Adiciona el icono
                el.html("<img src='/themes/custom/pixel/img/chulo.png' alt='Icono de ok'>");
                el.addClass("pxc-badge");
            }
            if(tipo == 1) { // Solo adiciona un número
                let numero = 0;
                if(el.text() != "") {
                    numero = parseInt(text) + 1;
                    console.log("1: "+numero);
                }else{
                    numero = 1;
                    console.log("2: "+numero);
                }
                
                el.text(numero);
                el.addClass("pxc-badge");
            }
            if(tipo == -1) { // Solo quita un 1
                let numero = -1;
                if(el.text() != "") {
                    numero = parseInt(text) - 1;
                    console.log("1: "+ numero);
                }
                
                if (numero > 0) {
                    el.text(numero);
                    el.addClass("pxc-badge");
                }else{
                    el.text("");
                    el.removeClass("pxc-badge");
                }
            }
        })(jQuery); 
    }


// PART 2. Vainilla JS
