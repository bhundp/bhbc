// Librería de funcionalidades del Tagging para edición


// PART 1. JQuery
(function($) {
$(document).ready(function () {
    
    // Ejecuta la adición de etiquetas contribuidas por el autor al momento de editar el nodo.
    $( document ).on( "ajaxComplete", function(event, xhr, settings) {
        //console.log(settings.url);
        let ajaxUrl = settings.url;
        $("#pxc-aviso-efimero").fadeOut();
        $("#pxc-aviso-efimero").text("");
        //console.log($("#pxc-new-tag").val().length);
        
        // Si el request de Ajax es el de la vista y no ningún otro.
        if($("#pxc-new-tag").length > 0 && ajaxUrl.indexOf("view_name=tagging_form&view_display_id=pxc_tagging_del_nodo_form") !== -1) {
            // Captura el valor de la lista actual
            let newItem = $("#pxc-new-tag").attr("data-id");
            let lista = $("#edit-field-lista-de-taxonomias-relaci-0-value").val();
            let anade = 0;
            // Si la lista ya tiene valores, analiza si existen en ésta y sino las incluye.
            console.log(newItem);
            console.log(lista);
            if(lista != "" && lista != "+sep+") {
                const listaArreglo = lista.split("+");
                if(listaArreglo.includes(newItem) == false) {
                   let partesListaT = lista.split("+sep+");
                   console.log("a la derecha" + partesListaT[1]);
                   if(partesListaT[1].length == 0) {
                        lista = lista + newItem;
                   }else{
                       lista = lista + "+" + newItem;
                   }
                   anade = 1;
                } else {
                    $("#pxc-aviso-efimero").fadeIn();
                    $("#pxc-aviso-efimero").text("Tema ya añadido");
                    $('input[data-drupal-selector="edit-tema"]').val('').change();
                }
            }else if(lista == "+sep+") {
                lista = lista + newItem;
                anade = 1;
            }else{
                lista = "+sep+" + newItem;
                anade = 1;
            }
            // Opera algunas acciones de UI si se añadieron tags.
            if(anade == 1) {
                $("#pxc-tag-list").append("<li class='pxc-tema-item-autor' data-id='"+ newItem +"'>" + $("#pxc-new-tag").text() + "<span class='pxc-tema-item-autor-cerrar'>X</span></li>");
                $("#edit-field-lista-de-taxonomias-relaci-0-value").val(lista).change();
                $('#pxc-simple-form-tagging-content input[type="submit"]').prop("disabled", false);
                $('input[data-drupal-selector="edit-tema"]').val('').change();
                el = $("#pxc-badge-0-6");
                updateBadge(el,el.text(),1);
            }
        }
    });
    
    // Evento que dispara la eliminación de taxonomias añadidas al nodo, no importa si son del autor o contribuidas.
    $( "#pxc-tag-list" ).on( "click", ".pxc-tema-item-autor-cerrar, .pxc-tema-item-contribuidor-cerrar", function() {
        let aEliminar = $(this).parent("li");
        let aEliminarId = $(this).parent("li").attr("data-id");
        console.log("ud va eliminar" + aEliminarId);
        let lista = $("#edit-field-lista-de-taxonomias-relaci-0-value").val();
        console.log("Esta es la lista:" + lista);
        
        let supraLista = lista.split("+sep+");
        
        if(supraLista.length == 2) {
            let partesLista = [];
            
            for (let i = 0; i < 2; i++) {
                if(supraLista[i] != "") {
                    const listaArreglo = supraLista[i].split("+");
                    // Extrae de un arreglo con los ítems, aquel que debe salir.
                    for (let i = 0; i < listaArreglo.length; i++) { 
                        if (listaArreglo[i] === aEliminarId) { 
                            let spliced = listaArreglo.splice(i, 1); 
                            console.log("Removed element: " + spliced); 
                            // Elimina el elemento del DOM.
                            aEliminar.remove();
                            el = $("#pxc-badge-0-6");
                            updateBadge(el,el.text(),-1);
                        } 
                    }
                    // Recrea el arreglo.
                    const result = listaArreglo.join("+");
                    // Controla la UI dependiendo de si el elemento que salió es el último o no.
                    console.log("Número de ítems restantes: " + listaArreglo.length + "," + result);
                    if(result != "") {
                        partesLista[i] = result;
                    }else{
                        partesLista[i] = -1;
                    }
                }else{
                    partesLista[i] = -1;
                }
            }
            
            console.log(partesLista[0] + " y " + partesLista[1]);
            
            if(partesLista[0] == -1 && partesLista[1] == -1) {
                // Ni contribuyentes, ni autores
                $('#pxc-simple-form-tagging-content input[type="submit"]').prop("disabled", true);
                $("#edit-field-lista-de-taxonomias-relaci-0-value").val("+sep+").change();
            }else if (partesLista[0] == -1 && partesLista[1] != -1) {
                //  Solo autores
                $("#edit-field-lista-de-taxonomias-relaci-0-value").val("+sep+" + partesLista[1]).change();
            }else if (partesLista[0] != -1 && partesLista[1] == -1) {
                //  Solo contribuyentes
                $("#edit-field-lista-de-taxonomias-relaci-0-value").val(partesLista[0] + "+sep+").change();
            }else{
                // Ambos
                $("#edit-field-lista-de-taxonomias-relaci-0-value").val(partesLista[0] + "+sep+" + partesLista[1]).change();
            }
            
        }

        
        let cuantosNuevosQuedan = 0;
        $( ".pxc-tema-item-autor-cerrar" ).each(function( index ) {
            cuantosNuevosQuedan++;
        });
        if(cuantosNuevosQuedan == 0) {
            $('#pxc-simple-form-tagging-content input[type="submit"]').prop("disabled", true);
        }
    });
    
    

// End of Part 1
});
})(jQuery); 