// Librería de funcionalidades del Tagging


// PART 1. JQuery
(function($) {
$(document).ready(function () {
    
    //window.onload = function() {
    
        $("#pxc-aviso-efimero").addClass("translucido");
        $("#pxc-aviso-efimero").text("");
    
    //};
    
    // Controla la adición de taxonomías contribuidas cuando se etiqueta contenido por parte de un usuario que no es el autor.
    $( document ).on( "ajaxComplete", function(event, xhr, settings) {
        //console.log(settings.url);
        let ajaxUrl = settings.url;
        $("#pxc-aviso-efimero").addClass("translucido");
        $("#pxc-aviso-efimero").text("");
        //console.log($("#pxc-new-tag").val().length);
        
        // Si el request de Ajax es el de la vista y no ningún otro.
        if($("#pxc-new-tag").length > 0 && ajaxUrl.startsWith("/views/ajax?nid")) {
            // Captura el valor de la lista actual
            let newItem = $("#pxc-new-tag").attr("data-id");
            let lista = $("#edit-tags").val();
            let anade = 0;
            // Si la lista ya tiene valores, analiza si existen en ésta y sino las incluye.
            console.log(newItem);
            if(lista.length > 0) {
                const listaArreglo = lista.split("+");
                if(listaArreglo.includes(newItem) == false) {
                   lista = lista + "+" + newItem;
                   anade = 1;
                } else {
                    $("#pxc-aviso-efimero").removeClass("translucido");
                    $("#pxc-aviso-efimero").text("Tema ya añadido");
                    $('input[data-drupal-selector="edit-tema"]').val('');
                }
            }else{
                lista = newItem;
                anade = 1;
            }
            // Opera algunas acciones de UI si se añadieron tags.
            if(anade == 1) {
                $("#pxc-tag-list").append("<li class='pxc-tema-item-contribuidor' data-id='"+ newItem +"'>" + $("#pxc-new-tag").text() + "<span class='pxc-tema-item-contribuidor-cerrar'>X</span></li>");
                $("#edit-tags").val(lista);
                $('#pxc-simple-form-tagging-content input[type="submit"]').prop("disabled", false);
                $('input[data-drupal-selector="edit-tema"]').val('');
            }
        }
    });
    
    //window.onload = function() {
    
    // Carga inicial de los elementos de UI para el proceso de tageo de contenido.
    if($("#pxc-tag-list").length > 0) {
         const listaIds = [];
         const listaIdsContribuidas = [];
         let conteoTaxos = 0;
        $( ".pxc-tema" ).each(function( index ) {
            let newItem = $(this).attr("data-id");
            // Crea la lista inicial de temas y diferencia si son del autor o contribuidos
            if(listaIds.includes(newItem) == false) { 
                listaIds.push(newItem);
                if($(this).hasClass("pxc-folksonomy-item")) {
                    $("#pxc-tag-list").append("<li class='pxc-tema-item-autor pxc-tema-item-sin-cierre'>" + $(this).children("a").html() + "</li>");
                }else{
                    $("#pxc-tag-list").append("<li class='pxc-tema-item-contribuidor pxc-tema-item-sin-cierre'>" + $(this).children("a").html() + "</li>");
                    listaIdsContribuidas.push(newItem);
                }
                conteoTaxos++;
            }else{
                console.log(newItem + " Ya está en la lista");
            }
        });
        // Carga por defecto todas las taxonomias contribuidas en el campo.
        if(listaIdsContribuidas.length > 0) {
            $("#edit-tags").val(listaIdsContribuidas.join("+"));
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
    }else{
        $("#block-pixel-pixeltagslist").prepend("<p class='pxc-subtitulo-azul'>Sin temas relacionados</p>");
    }
    
    // Inclusión de textos
    if($("#block-pixel-views-block-tagging-form-pxc-tagging-del-nodo-form").length > 0) {
        $("#block-pixel-views-block-tagging-form-pxc-tagging-del-nodo-form").prepend("<hr class='pxc-linea-separadora'><p class='pxc-subtitulo-gris text-center'>¿Con cuáles otros temas está relacionado este contenido?</p>");
    }
    
    // };
    
    
    // Elimina taxonomias añadidas
    $( "#pxc-tag-list" ).on( "click", ".pxc-tema-item-contribuidor-cerrar", function() {
        let aEliminar = $(this).parent("li");
        let aEliminarId = $(this).parent("li").attr("data-id");
        console.log("ud va eliminar" + aEliminarId);
        let lista = $("#edit-tags").val();
        if(lista.length > 0) {
            const listaArreglo = lista.split("+");
            // Extrae de un arreglo con los ítems, aquel que debe salir.
            for (let i = 0; i < listaArreglo.length; i++) { 
                if (listaArreglo[i] === aEliminarId) { 
                    let spliced = listaArreglo.splice(i, 1); 
                    console.log("Removed element: " + spliced); 
                } 
            }
            // Recrea el arreglo.
            const result = listaArreglo.join("+");
            // Controla la UI dependiendo de si el elemento que salió es el último o no.
            if(listaArreglo.length > 0) {
                $("#edit-tags").val(result);
            }else{
                $("#edit-tags").val(result);
                $('#pxc-simple-form-tagging-content input[type="submit"]').prop("disabled", true);
            }
            // Elimina el elemento del DOM.
            aEliminar.remove();
        }
        let cuantosNuevosQuedan = 0;
        $( ".pxc-tema-item-contribuidor-cerrar" ).each(function( index ) {
            cuantosNuevosQuedan++;
        });
        if(cuantosNuevosQuedan == 0) {
            $('#pxc-simple-form-tagging-content input[type="submit"]').prop("disabled", true);
        }
    });
    
    $( "body" ).on( "click", ".pxc-foam-body-l", function() {
        $(this).children(".pxc-foam-body-largo").addClass("full");
        $(this).addClass("full");
        console.log("leer mas");
    });
    
    

// End of Part 1
});
})(jQuery); 
