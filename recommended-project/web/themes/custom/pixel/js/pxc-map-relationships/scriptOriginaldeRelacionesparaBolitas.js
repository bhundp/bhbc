// Librería de funcionalidades del Tagging

// PART 1. JQuery
(function($) {
$(document).ready(function () {
    
    //  PROVISIONAL
    // ******************************************************************
    // Metodo provisional por si se necesita hacer on click
    $( "#pxc-bolita-add" ).on( "click", function() {
        // Consulta cuáles Ids existen en el diagrama
        var ids = nodes.getIds();
        console.log('ids', ids);
        
        // Añade nodos
        nodes.add([
          { id: 6, label: "Node 6" },
          { id: 7, label: "Node 7" }
        ]);
        
        // Remueve nodos
        nodes.remove(4);
        
        // Actualiza nodos
        nodes.updateOnly({id: 2, label: "Nodo segundo"});
        
        // Añade conexiones
        edges.add([
            { from: 1, to: 6 },
            { from: 1, to: 7 },
        ]);
    });
    // ******************************************************************
    
    // Parte I. BOLITAS
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // 0. Crear el input con el arreglo
    $( "#pxc-main" ).append("<input type='hidden' id='arregloBolitasIds' value='' />");
    
    // 1. Lectura de bolitas desde los ítems impresos de la vista.
    let valores = [];
    const arregloBolitas = [];
    const arregloBolitasIds = [];
    let nuevasBolitas = [];
    let idTemporal = "";
    let conteo = 0;
    // 1.1 Si hay resultados en la vista
    if($( ".pxc-term-nodo" ).length > 0 ) {
        $( ".pxc-term-nodo" ).each(function( index ) {
            idTemporal = $(this).attr("data-term-id");
            if(!busIds(arregloBolitasIds, idTemporal)) {
                valores = [];
                valores[0] = idTemporal;
                valores[1] = $(this).text();
                /*console.log("--------------I");
                console.log(valores[0]);
                console.log(valores[1]);
                console.log(valores);
                console.log("--------------E");*/
                arregloBolitasIds[conteo] = idTemporal;
                arregloBolitas[conteo] = valores;
                conteo++;
            }
        });
    }
    function busIds(arregloBolitasIds, id) {
        for (let i = 0; i < arregloBolitasIds.length; i++) {
            console.log(String(arregloBolitasIds[i]) + " >>>> " + String(id));
            if(String(arregloBolitasIds[i]) == String(id)) {
                return true;
            }
        }
        return false;
    }
    
    // 2.  Si se leen taxos desde la vista se genera la gráfica
    if(arregloBolitasIds.length > 0 ) {
        $( "#arregloBolitasIds" ).val(arregloBolitasIds.join('---'));
    
        // Revisión del arreglo y asignación a la gráfica
        // console.log("Array final ::::::::::::::::::::::::::::::");
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        // 2.1 Creación de las bolitas
        let nodes = new vis.DataSet([]);
        for (let i = 0; i < arregloBolitas.length; i++) {
            // console.log(arregloBolitas[i][0]);
            // console.log(arregloBolitas[i][1]);
            nodes.add([{ id: arregloBolitas[i][0], label: arregloBolitas[i][1] }])
        }
        // 2.2 Creación de los vínculos
        let edges = new vis.DataSet([]);
        let termId = urlParams.get('termId')
        for (let i = 0; i < arregloBolitas.length; i++) {
            // console.log(arregloBolitas[i][0]);
            // console.log(arregloBolitas[i][1]);
            if(arregloBolitas[i][0] != termId) {
                edges.add([{ from: parseInt(termId), to: parseInt(arregloBolitas[i][0]) }])
            }
        }
        
        // 2.3 Creación del diagrama
        let container = document.getElementById("pxc-bolitas");
        let data = {
            nodes: nodes,
            edges: edges,
        };
        // 2.3.1 Aquí se pueden definir settings generales para todas las bolitas
        let options = {
          nodes: {
                shape: "circle",
                borderWidth : 0 ,
                shadow: true,
                margin: 15,
                font: "14px m-book #000",
              },
              interaction: { hover: true }
            };
        let network = new vis.Network(container, data, options);
        
        function addNodo(tid, nombre) {
            console.log("Tratando de agregar" + tid);
            nodes.add([{ id: tid, label: nombre }]);
        }
        function addEdge(ori,dest) {
            edges.add([{ from: ori, to: dest }]);
        }
    
        // 2.3.2, Eventos sobre el diagrama
        // Evento de seleccionar (con click) que disapara la consulta Ajax mediante el simple accionamiento del click del formulario.
        network.on("selectNode", function (params) {
            console.log("selectNode Event:", params['nodes'][0]);
            $('[name="termId"]').val(params['nodes'][0]);
            $("#views-exposed-form-relaciones-page-1 .form-submit").trigger("click");
        });
        
            // Evento de hover (hover)
        network.on("hoverNode", function (params) {
            console.log("hoverNode Event:", params['node']);
        });
          
        network.on("zoom", function (params) {
            console.log("hoverNode Event:", params);
        });
        
    }
    
    // 3. Monitorea los cambios en la vista que se recarga por Ajax
    $( document ).on( "ajaxSuccess", function( event, xhr, settings) {
        
        // Logica de Ajax
        ///////////////////////////////////////////////////////////////
        
        // PENDIENTE: que solo sea el que envia la recarga de bolitas.
        // console.log("Evento Ajax: " + event.type);
        // console.log(settings);
        let urlOrigen = settings.url;
        // console.log(settings.url);
        
        if(urlOrigen.indexOf("views/ajax?search_api_fulltext") !== -1) {
            // 1. Es un envío de la vista
            if(urlOrigen.indexOf("page=") !== -1) {
                // 1.1 Cuando pagina
                console.log("Estas paginando");
            }else{
                // 1.2 Cuando hace clic en el botón
                console.log("Estas cargando desde el clic");
                // Hace faceting si hay más de 0 caracteres en el query, debería quedar en 3 mínimo
                if($( "input[data-drupal-selector='edit-search-api-fulltext']" ).val().length >= 0) {
                    // Modo recuperación (1) por los valores de campo en el form.
                    console.log("Modo CLICK");
                    // Modo recuperación (0) por GET
                    recuperarFacets(1, function(respuesta) {
                        console.log(respuesta);
                        const tidsRespuesta = respuesta.facet_counts.facet_fields.itm_tid;
                        const nidsRespuesta = respuesta.response.docs;
                        // console.log(tidsRespuesta);
                        // console.log(nidsRespuesta);
                        let arrayTidsResponse = [];
                        let arrayNidsResponse = [];
                        let arraySizeResponse = [];
                        let tempNidsResponse = [];
                        // Si la respuesta no tiene ni tids ni nids indica que no hay resultados, entonces así ni recupere los nombres, ni las relaciones.
                        if(tidsRespuesta.length > 0 && nidsRespuesta.length > 0) {
                            // Extrae los tids del objeto JSON
                            tidsRespuesta.forEach( function(valor, indice, array) {
                                // Par, TID
                                if(indice % 2 === 0) {
                                    arrayTidsResponse.push(valor);
                                }
                                // Impar, Sizes
                                if(indice % 2 !== 0) {
                                    arraySizeResponse.push(valor);
                                }
                            });
                            // Extrae los nids del objeto JSON
                            nidsRespuesta.forEach( function(valor, indice, array) {
                                tempNidsResponse = valor.ss_search_api_id.split(":");
                                arrayNidsResponse.push(tempNidsResponse[1].replace("node/",""));
                            });
                            let stringTids = arrayTidsResponse.join("-");
                            console.log("ST: " + stringTids);
                            let stringNids = arrayNidsResponse.join("-");
                            console.log("SN: " + stringNids);
                            let stringSizes = arraySizeResponse.join("-");
                            console.log("SZ: " + stringSizes);
                            recuperarTaxonomias(stringTids, stringSizes);
                            $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-tids", stringTids);
                            $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-nids", stringNids);
                        }
                    });
                }
            }
        }else{
            console.log("Estas en un evento que no es de la vista. ¿Cuál?:");
            console.log(settings.url);
        }
        
        // Con esta URL se podrá diferenciar el evento entre el infinitescroll, la carga de bolitas, etc.
        // Aquí habría que llamar a los distintos eventos: bolitas, llamar de nuevo los facets con recuperarFacets(1), etc.
        
        /* Desactivo bolitas
        let bolitasIds = $( "#arregloBolitasIds" ).val();
        let arregloBolitasIdsAjax = [];
        arregloBolitasIdsAjax = String(bolitasIds).split("---");
        console.log("AB: " + " " + bolitasIds);
        console.log(arregloBolitasIdsAjax);
        nuevasBolitas = [];
        let conteo = 0;
        let conteoAjax = arregloBolitasIdsAjax.length;
        $( ".pxc-term-nodo" ).each(function( index ) {
            idTemporal = $(this).attr("data-term-id");
            if(!busIds(arregloBolitasIdsAjax, idTemporal)) {
                valores = [];
                valores[0] = idTemporal;
                valores[1] = $(this).text();
                console.log("--------------Iajax");
                console.log(valores[0]);
                console.log(valores[1]);
                console.log(valores);
                console.log("--------------Eajax");
                arregloBolitasIdsAjax[conteoAjax] = idTemporal;
                nuevasBolitas[conteo] = valores;
                conteo++;
            }
        });
        console.log("Array final ajax ::::::::::::::::::::::::::::::");
        console.log(nuevasBolitas);
        for (let i = 0; i < nuevasBolitas.length; i++) {
            console.log(nuevasBolitas[i][0]);
            console.log(nuevasBolitas[i][1]);
            addNodo(nuevasBolitas[i][0], nuevasBolitas[i][1]);
        }
        termId = $('[name="termId"]').val();
        for (let i = 0; i < nuevasBolitas.length; i++) {
            console.log(nuevasBolitas[i][0]);
            console.log(nuevasBolitas[i][1]);
            if(nuevasBolitas[i][0] != termId) {
                addEdge(parseInt(termId), parseInt(nuevasBolitas[i][0]));
            }
        }
        $( "#arregloBolitasIds" ).val(arregloBolitasIdsAjax.join('---'));
        Desactivo bolidtas */
    });
    
    
    // PARTE II. Búsqueda
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    
    // 4.  Si hay parámetros de búsqueda que los recupere para hacer el query de Facets ONLOAD.
    if($('#views-exposed-form-busqueda-os-page-1').length > 0 ) {
        
        // Logica de On load
        ///////////////////////////////////////////////////////////////
        console.log("Hola estoy cargando");
        
        // Hace faceting si hay más de 0 caracteres en el query, debería quedar en 3 mínimo
        if($( "input[data-drupal-selector='edit-search-api-fulltext']" ).val().length >= 0) {
            console.log("Modo GET");
            // Modo recuperación (0) por GET
            recuperarFacets(0, function(respuesta) {
                console.log(respuesta);
                const tidsRespuesta = respuesta.facet_counts.facet_fields.itm_tid;
                const nidsRespuesta = respuesta.response.docs;
                // console.log(tidsRespuesta);
                // console.log(nidsRespuesta);
                let arrayTidsResponse = [];
                let arrayNidsResponse = [];
                let arraySizeResponse = [];
                let tempNidsResponse = [];
                // Si la respuesta no tiene ni tids ni nids indica que no hay resultados, entonces así ni recupere los nombres, ni las relaciones.
                if(tidsRespuesta.length > 0 && nidsRespuesta.length > 0) {
                    // Extrae los tids del objeto JSON
                    tidsRespuesta.forEach( function(valor, indice, array) {
                        // Par, TID
                        if(indice % 2 === 0) {
                            arrayTidsResponse.push(valor);
                        }
                        // Impar, Sizes
                        if(indice % 2 !== 0) {
                            arraySizeResponse.push(valor);
                        }
                    });
                    // Extrae los nids del objeto JSON
                    nidsRespuesta.forEach( function(valor, indice, array) {
                        tempNidsResponse = valor.ss_search_api_id.split(":");
                        arrayNidsResponse.push(tempNidsResponse[1].replace("node/",""));
                    });
                    let stringTids = arrayTidsResponse.join("-");
                    console.log("ST: " + stringTids);
                    let stringNids = arrayNidsResponse.join("-");
                    console.log("SN: " + stringNids);
                    let stringSizes = arraySizeResponse.join("-");
                    console.log("SZ: " + stringSizes);
                    recuperarTaxonomias(stringTids, stringSizes);
                    $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-tids", stringTids);
                    $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-nids", stringNids);
                }
            });
        }
        
        /* PENDIENTE: con la anterior respuesta (si la hay), quitar la cosnt response que está quedama a continuación. */
        // Consultar términos a partir del JSON de respuesta anterior.
        
        // PENDIENTE: encadenar Y ACTIVAR todo.
        
        /*
        let arrayTidsResponse = [];
        let arrayNidsResponse = [];
        let tempNidsResponse = [];
        // Si la respuesta no tiene ni tids ni nids indica que no hay resultados, entonces así ni recupere los nombres, ni las relaciones.
        if(tidsRespuesta.length > 0 && nidsRespuesta.length > 0) {
            // Extrae los tids del objeto JSON
            tidsRespuesta.forEach( function(valor, indice, array) {
                // Par, TID
                if(indice % 2 === 0) {
                    arrayTidsResponse.push(valor);
                }
            });
            // Extrae los nids del objeto JSON
            nidsRespuesta.forEach( function(valor, indice, array) {
                tempNidsResponse = valor.ss_search_api_id.split(":");
                arrayNidsResponse.push(tempNidsResponse[1].replace("node/",""));
            });
            let stringTids = arrayTidsResponse.join("-");
            console.log("ST: " + stringTids);
            let stringNids = arrayNidsResponse.join("-");
            console.log("SN: " + stringNids);
            recuperarTaxonomias(stringTids);
            /* PENDIENTE: reemplazar lo quemado por lo que venga de respuesta y activar que esas variables se tomen así:
            1er param por stringTids.
            2do param por stringNids.
            */
            /*
        }
        Desactiva logica de facets */
    }
    
    // Lanzar consulta filtrada cuando se hace clic en una pastilla
    $("body").on( "click", "#pxc-buscador-os-pastillas li a", function(e) {
        e.preventDefault();
        
        let taxonomy = $(this).children(".pxc-buscador-os-pastillas-label").text();
        console.log(taxonomy);
        $( "input[data-drupal-selector='edit-taxonomy']" ).val(taxonomy).change();
        $( "#views-exposed-form-busqueda-os-page-1" ).trigger( "submit" );
    });
    
    // Lanzar el proceso de dibujo de las bolitas si hay datos
    $( "#pxc-relaciones-tab" ).on( "click", function() {
        let tids = $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-tids");
        let nids = $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-nids");
        if(tids.length > 0 && nids.length > 0) {
            relacionarTaxonomias(tids,nids);
        }else{
            $("#pxc-bolitas-aviso").html("<p>Nothing to show.</p>");
        }
    });
    
    // PARTE III. Control del UI
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // Esta en la Main.js
    
    // PARTE IV. Funciones
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    
    // Recupera el nombre de las taxonomías recuperadas a través de la consulta de facets al servidor de búsquedas mediante imn string de tipo tid1-tid2-tidn.
    
    function recuperarTaxonomias(tids, sizes) {
        
        let urlString = '/pxc-simple-taxonomy-listar?tids=' + tids + "&sizes=" + sizes;
            
        console.log("2. Start Ajax Lista Taxos");
        $.ajax({
            url: urlString,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json",
            success: function(data){
                dibujarPastillas(data);
                //process the JSON data etc
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        console.log("2. End Ajax Lista Taxos");
    }
    
    // Dibuja las pastillas en el área pxc-buscador-os-pastillas y las bolitas
    
    function dibujarPastillas(data) {
        data.sort((a, b) => b.size - a.size);
        data.forEach( function(valor, indice, array) {
            console.log("Índice: " + indice);
            console.log(valor);
            $("#pxc-buscador-os-pastillas").append("<li class='pxc-buscador-os-pastillas-li pxc-buscador-os-pastillas-li-"+valor.size+"'><a href='#' data-id-term='"+ valor.id +"' data-size-term='"+ valor.size +"'><span class='pxc-buscador-os-pastillas-label'>"+ valor.label +"</span><span class='pxc-buscador-os-pastillas-size'>"+ valor.size +"</span></a></li>");
        });
    }
    
    // Crea las relaciones a partir de los datos retornados que relacionan ciertos NIds con ciertos Tids.
    
    function createRelationships(respuesta, tids, nids) {
        let arrayTids = tids.split("-");
        let objTidsSizes = {};
        let objNidsRels = {};
        let objEdges = [];
        let arrayNids = nids.split("-");
        
        // Define el objeto objTidsSizes para relacionar Tids con sus números de ocurrencia, lo cual deteremina el tamaño.
        arrayTids.forEach( function(valor, indice, array) {
            objTidsSizes['tid_'+valor] = (JSON.parse('{"tid": '+ valor +',"size": 0}'));
        });
        
        // Crea el objeto objNidsRels para relacionar todas las taxonomias que están relacionadas con un determinado nodo.
        let contadoredgesglobal = 0;
        arrayNids.forEach( function(valor, indice, array) {
            let relaciones = "0-";
            let edges = "";
            let tempArray = [];
            let contadorfe = 0;
            let contadoredges = 0;
            // Para cada NID, recorra las parejas y extraiga las taxonomías con las que está relacionada.
                for (var key in respuesta) {
                    if(respuesta[key].nid == valor) {
                        if(contadorfe == 0) {
                            relaciones += respuesta[key].tid;
                        }else{
                            // Si no es la primera taxonomías que tiene, empiece a generar las llaves que necesita el componente.
                            // console.log("relaciones: " + relaciones);
                            tempArray = relaciones.split("-");
                            tempArray.forEach(function(current, index, array1) {
                               if(current != "0") {
                                    objEdges[contadoredgesglobal] = (JSON.parse('{ "from": '+current+', "to": '+respuesta[key].tid+' }'));
                                    if(contadoredges == 0) {
                                        edges += '{ "from": '+current+', "to": '+respuesta[key].tid+' }'; 
                                    }else{
                                        edges += ', { "from": '+current+', "to": '+respuesta[key].tid+' }'; 
                                    }
                                    contadoredges++;
                                    contadoredgesglobal++;
                               }
                            });
                            relaciones += "-" + respuesta[key].tid;
                            
                        }
                        contadorfe++;
                    }
                }
        // console.log('{"nid": '+ valor +', "related": "'+ relaciones +'", "edges": ["'+ edges +'"]}');
        objNidsRels['nid_'+valor] = (JSON.parse('{"nid": '+ valor +', "related": "'+ relaciones +'", "edges": ['+ edges +']}'));
        }, respuesta);
        
        // Remover duplicados de Edges
        const objEdgesUnique = objEdges.filter((value, index, self) =>
                index === self.findIndex((t) => (
                t.from === value.from && t.to === value.to
            ))
        );
            
        // Popula el objeto objTidsSizes con los tids y sus respectivos tamaños
        // console.log("Contar: " + (respuesta).length);
        let tempKey = "";
        for (var key in respuesta) {
            // console.log(respuesta[key]);
            // Crea una llave que permite ubicar la taxonomia en el Objeto objTidsSizesRels.
            tempKey = "tid_" + respuesta[key].tid;
            // A. Sumele 1 al valor sizes de la taxonomia en objTidsSizesRels por cada vez que la encuentre, pues quiere decir que tiene más nodos relacionados con ella.
            eval("objTidsSizes." + tempKey + ".size = objTidsSizes." + tempKey + ".size + 1;");
        }
            
        console.log("Tids vs. tamaños:");
        console.log(objTidsSizes);
        console.log("Taxos por nodos:");
        console.log(objNidsRels);
        console.log("Edges:");
        console.log(objEdges);
        console.log("Edges Unique:");
        console.log(objEdgesUnique);
        console.log("Json analizado:");
        console.log(respuesta);
    }
    
    // Genera tres objetos a partir de las taxonomías y nodos obtenidos través de la consulta de facets al servidor de búsquedas. El primer objeto objTidsSizes incluye por cada tid, su escala y el segundo objeto objNidsRels crea por nid las relaciones que deben existir entre taxos. Finalmente el tercer objeto objEdgesUnique (el más útil), incluye un arreglo de edges consolidado y sin repeticiones.
    
    function relacionarTaxonomias(tids, nids) {
        
        console.log("Log al relacionar taxonomias");


        urlString = '/pxc-simple-taxonomy-relacionar?tids=' + tids + "&nids=" + nids;
            
        console.log("3. Start Ajax Relación Taxos");
        
        console.log(urlString);
        
        // Consulta a la base de datos las parejas de relación que existen entre todos los nids dados y los tids para obtener un objeto similar al que está abajo en const "respuesta".
        $.ajax({
            url: urlString,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json",
            success: function(data){
                createRelationships(data, tids, nids);
                //process the JSON data etc
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
            
        /* PENDIENTE: A partir del anterior callback debe recuperar una respuesta válida para que se reemplace la que está quedama en const = respuesta */
            
        /*let arrayTids = tids.split("-");
        let objTidsSizes = {};
        let objNidsRels = {};
        let objEdges = [];
        let arrayNids = nids.split("-");
        
        const respuesta = JSON.parse('{ "parejas": [{ "tid" : 3, "nid" : "5" }, { "tid" : 5, "nid" : "177" }, { "tid" : 6, "nid" : "5" }, { "tid" : 7, "nid" : "45" }, { "tid" : 7, "nid" : "5" }, { "tid" : 7, "nid" : "174" }, { "tid" : 9, "nid" : "5" }, { "tid" : 10, "nid" : "45" }, { "tid" : 11, "nid" : "4" }, { "tid" : 11, "nid" : "183" }] }');
            
        // Define el objeto objTidsSizes para relacionar Tids con sus números de ocurrencia, lo cual deteremina el tamaño.
        arrayTids.forEach( function(valor, indice, array) {
            objTidsSizes['tid_'+valor] = (JSON.parse('{"tid": '+ valor +',"size": 0}'));
        });
            
        // Crea el objeto objNidsRels para relacionar todas las taxonomias que están relacionadas con un determinado nodo.
        let contadoredgesglobal = 0;
        arrayNids.forEach( function(valor, indice, array) {
            let relaciones = "0-";
            let edges = "";
            let tempArray = [];
            let contadorfe = 0;
            let contadoredges = 0;
            // Para cada NID, recorra las parejas y extraiga las taxonomías con las que está relacionada.
                for (var key in respuesta.parejas) {
                    if(respuesta.parejas[key].nid == valor) {
                        if(contadorfe == 0) {
                            relaciones += respuesta.parejas[key].tid;
                        }else{
                            // Si no es la primera taxonomías que tiene, empiece a generar las llaves que necesita el componente.
                            // console.log("relaciones: " + relaciones);
                            tempArray = relaciones.split("-");
                            tempArray.forEach(function(current, index, array1) {
                               if(current != "0") {
                                    objEdges[contadoredgesglobal] = (JSON.parse('{ "from": '+current+', "to": '+respuesta.parejas[key].tid+' }'));
                                    if(contadoredges == 0) {
                                        edges += '{ "from": '+current+', "to": '+respuesta.parejas[key].tid+' }'; 
                                    }else{
                                        edges += ', { "from": '+current+', "to": '+respuesta.parejas[key].tid+' }'; 
                                    }
                                    contadoredges++;
                                    contadoredgesglobal++;
                               }
                            });
                            relaciones += "-" + respuesta.parejas[key].tid;
                            
                        }
                        contadorfe++;
                    }
                }
        // console.log('{"nid": '+ valor +', "related": "'+ relaciones +'", "edges": ["'+ edges +'"]}');
        objNidsRels['nid_'+valor] = (JSON.parse('{"nid": '+ valor +', "related": "'+ relaciones +'", "edges": ['+ edges +']}'));
        }, respuesta);
        
        // Remover duplicados de Edges
        const objEdgesUnique = objEdges.filter((value, index, self) =>
                index === self.findIndex((t) => (
                t.from === value.from && t.to === value.to
            ))
        );
            
        // Popula el objeto objTidsSizes con los tids y sus respectivos tamaños
        // console.log("Contar: " + (respuesta.parejas).length);
        let tempKey = "";
        for (var key in respuesta.parejas) {
            // console.log(respuesta.parejas[key]);
            // Crea una llave que permite ubicar la taxonomia en el Objeto objTidsSizesRels.
            tempKey = "tid_" + respuesta.parejas[key].tid;
            // A. Sumele 1 al valor sizes de la taxonomia en objTidsSizesRels por cada vez que la encuentre, pues quiere decir que tiene más nodos relacionados con ella.
            eval("objTidsSizes." + tempKey + ".size = objTidsSizes." + tempKey + ".size + 1;");
        }
            
        console.log("Tids vs. tamaños:");
        console.log(objTidsSizes);
        console.log("Taxos por nodos:");
        console.log(objNidsRels);
        console.log("Edges:");
        console.log(objEdges);
        console.log("Edges Unique:");
        console.log(objEdgesUnique);
        console.log("Json analizado:");
        console.log(respuesta);
        
        */
            
        /* PENDIENTE: Hacer el return y del objeto objNidsRels extraer de todos los campos "edge" una colección de edges únicos para que no se vayan a repetir.*/
            
        console.log("3. End Ajax Relación Taxos");

    }    
    
    function recuperarFacets(momento, callback) {
    
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        let valor = "";
        let search_api_fulltext = "";
        let tipo = "";
        let estatus = "";
        let autor = "";
        let taxonomy = "";
        let created_min = "";
        let created_max = "";
        let filename_op = "";
        let filename_1_op = "";
        let filename_2_op = "";
        let title_op = "";
        let conteo = 0;
        
        // Momento 0, cuando carga y la URL tiene parámetros, es decir que la búsqueda viene de otra hoja.
        if(momento == 0) {
            // Iterar sobre los parámetros
            for (let p of urlParams) { 
                // Campo de texto
                if(p[0] == 'search_api_fulltext') {
                    // [[--search_api_fulltext--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        valor = valor.toLowerCase();
                        search_api_fulltext = valor;
                    }else{
                        search_api_fulltext = "";
                    }
                    conteo++;
                }
                // Tipo
                if(p[0] == 'tipo') {
                    // [[--tipo--]]
                    valor = p[1];
                    valor = valor.toLowerCase();
                    if (valor.length > 0) {
                        tipo = valor;
                    }
                    conteo++;
                }
                // Status
                if(p[0] == 'status') {
                    // [[--estatus--]]
                    valor = p[1];
                    if(valor == "1" || valor == "0") {
                        estatus = valor;
                    }
                    conteo++;
                }
                // Autor
                if(p[0] == 'autor') {
                    // [[--autor--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        // valor = valor.toLowerCase();
                        autor = valor;
                    }
                    conteo++;
                }
                // Taxonomy
                if(p[0] == 'taxonomy') {
                    // [[--taxonomy--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        // valor = valor.toLowerCase();
                        taxonomy = valor;
                    }
                    conteo++;
                }
                // Fecha inicio
                if(p[0] == 'created[min]') {
                    // [[--created_min--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        created_min = valor;
                    }
                    conteo++;
                }
                // Fecha fin
                if(p[0] == 'created[max]') {
                    // [[--created_max--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        created_max = valor;
                    }
                    conteo++;
                }
                // Imagenes
                if(p[0] == 'filename_op') {
                    // [[--imagenes--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        filename_op = valor;
                    }
                    conteo++;
                }
                // Audios
                if(p[0] == 'filename_1_op') {
                    // [[--imagenes--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        filename_1_op = valor;
                    }
                    conteo++;
                }
                // Videos
                if(p[0] == 'filename_2_op') {
                    // [[--imagenes--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        filename_2_op = valor;
                    }
                    conteo++;
                }
                // Video links
                if(p[0] == 'title_op') {
                    // [[--imagenes--]]
                    valor = p[1];
                    if (valor.length > 0) {
                        title_op = valor;
                    }
                    conteo++;
                }
            }
            // Si ciertos campos no se proveen entonces rellenelos por defecto
            if(estatus.length == 0) {
                // [[--estatus--]]
                estatus = 1;
            }
        }
        // Momento 1, cuando se cambian parámetros en el buscador y se dispara la actualización por Ajax.
        if(momento == 1) {
            
            search_api_fulltext = $( "input[data-drupal-selector='edit-search-api-fulltext']" ).val();
            tipo = $( "select[data-drupal-selector='edit-tipo']" ).val();
            estatus = $( "select[data-drupal-selector='edit-status']" ).val();
            autor = $( "input[data-drupal-selector='edit-autor']" ).val();
            taxonomy = $( "input[data-drupal-selector='edit-taxonomy']" ).val();
            created_min = $( "input[data-drupal-selector='edit-created-min']" ).val();
            created_max = $( "input[data-drupal-selector='edit-created-max']" ).val();
            filename_op = $( "select[data-drupal-selector='edit-filename-op']" ).val();
            filename_1_op = $( "select[data-drupal-selector='edit-filename-1-op']" ).val();
            filename_2_op = $( "select[data-drupal-selector='edit-filename-2-op']" ).val();
            title_op = $( "select[data-drupal-selector='edit-title-op']" ).val();
            
            conteo = 11;
        }
        
        if(conteo == 11) {
            
            // Si los campos no están completos, entonces no se genere el faceting, porque quiere decir que no ha habido búsqueda.
            
            let urlFacet = "/pxc-simple-facet-service?search_api_fulltext=" + search_api_fulltext + "&tipo=" + tipo + "&estatus=" + estatus + "&autor=" + autor + "&taxonomy=" + taxonomy + "&created_min=" + created_min + "&created_max=" + created_max + "&filename_op=" + filename_op + "&filename_1_op=" + filename_1_op + "&filename_2_op=" + filename_2_op + "&title_op=" + title_op;
            
            /*console.log("Search: " + search_api_fulltext);
            console.log("Tipo: " + tipo);
            console.log("Autor: " + autor);
            console.log("Taxo: " + taxonomy);
            console.log("F ini: " + created_min);
            console.log("F fin: " + created_max);
            console.log("Imagenes: " + filename_op);
            console.log("Audios: " + filename_1_op);
            console.log("Videos: " + filename_2_op);
            console.log("Videos links: " + title_op);
            console.log("Status: " + estatus);*/
            // console.log(urlFacet);
            
            // console.log("Start Ajax Facets");
            $.ajax({
                url: urlFacet,
                type: 'GET',
                dataType: 'json',
                contentType: "application/json",
                success: callback,
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("Error al recuperar facets:");
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
            // console.log("End Ajax Facets");
        }
    }

// End of Part 1
});
})(jQuery); 
    