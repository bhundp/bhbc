// Librería de funcionalidades del Tagging People (entrenamiento)


// PART 1. JQuery
(function($) {
$(document).ready(function () {
    
    // Evento que permite seleccionar o deseleccionar ítems de la lista de temas del entrenamiento.
    $( "body" ).on( "click", ".pxc-new-tag", function() {
        let lista = $("#edit-tags").val();
        if($(this).hasClass("pxc-tema-seleccionado")) {
            $(this).removeClass("pxc-tema-seleccionado");
            let idAfectado = $(this).attr("data-id");
            console.log(idAfectado);
            if (lista.length > 0) {
                const listaArreglo = lista.split("+");
                if(listaArreglo.includes(idAfectado) == true) {
                   for (let i = 0; i < listaArreglo.length; i++) { 
                        if (listaArreglo[i] === idAfectado) { 
                            let spliced = listaArreglo.splice(i, 1); 
                            console.log("Removed element: " + spliced); 
                        } 
                    }
                    const result = listaArreglo.join("+");
                    $("#edit-tags").val(result);
                    if(result.length == 0) {
                        $('#pxc-simple-form-tagging-people input[type="submit"]').prop("disabled", true);
                    }else{
                       $('#pxc-simple-form-tagging-people input[type="submit"]').prop("disabled", false); 
                    }
                }
            }
        }else{
            $(this).addClass("pxc-tema-seleccionado");
            let idAfectado = $(this).attr("data-id");
            console.log(idAfectado);
            if (lista.length > 0) {
                const listaArreglo = lista.split("+");
                if(listaArreglo.includes(idAfectado) == false) {
                   lista = lista + "+" + idAfectado;
                }
            }else{
                lista = idAfectado;
            }
            $('#pxc-simple-form-tagging-people input[type="submit"]').prop("disabled", false);
            $("#edit-tags").val(lista);            
        }
    });
    
// End of Part 1
});
})(jQuery); 



waitForElm('.pxc-contenedor-blanco').then((elm) => {
    (function($) {
        // Carga inicial de los elementos de UI para el proceso de entrenamiento.
        if($(".pxc-tema-preferencias").length > 0) {
             const listaIds = [];
            $( ".pxc-tema-preferencias-item" ).each(function( index ) {
                let newItem = $(this).attr("data-id");
                // Crea la lista inicial de temas que el usuario tiene como preferidos
                // Si es un ítem diferente, es decir si no es duplicado.
                if(listaIds.includes(newItem) == false) { 
                    listaIds.push(newItem);
                    // console.log(newItem);
                    $( ".pxc-new-tag" ).each(function() {
                        // console.log($(this).attr("data-id"));
                        if($(this).attr("data-id") == newItem) {
                            $(this).addClass("pxc-tema-seleccionado");
                        }
                    });
                }else{
                    console.log(newItem + " Ya está en la lista");
                }
            });
            if(listaIds.length > 0) {
                $("#edit-tags").val(listaIds.join("+"));
            }
            // Deshabilita que el formulario se pueda enviar hasta que no hayan nuevas selecciones
            $('#pxc-simple-form-tagging-people input[type="submit"]').prop("disabled", true);
        }
    })(jQuery); 
});