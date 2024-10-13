// Librería de funcionalidades del Tagging

// PART 1. JQuery
(function($) {
$(document).ready(function () {
    
    // PARTE I. Búsqueda
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    // ******************************************************************
    
    // Carga por Ajax
    // Monitorea los cambios en la vista de búsqueda que se recargan por Ajax, es decir que evalua si lanza una consulta desde ajax o es un evento Ajax de otro tipo. Con esto puede disparar por ejemplo los eventos de faceting y demás acciones asociadas. Incluso los eventos que no son de búsqueda también se controlan cuando por ejemplo se añaden los controles de selección a las tarjetas dentro de la búsqueda embebida dentro del panel de búsqueda embebida en la edición de los nodos.
    $( document ).on( "ajaxSuccess", function( event, xhr, settings) {
        
        // Logica de Ajax
        ///////////////////////////////////////////////////////////////
        
        let urlOrigen = settings.url;
        // console.log(settings.url);
        
        if(urlOrigen.indexOf("views/ajax?search_api_fulltext") !== -1 || urlOrigen.indexOf("/views/ajax?_wrapper_format=drupal_ajax&search_api_fulltext") !== -1) {
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
		    ajaxChat();
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
                            $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-sizes", stringSizes);
                            $("#pxc-bolitas-aviso").html("");
                            $("#pxc-bolitas").removeClass("oculto");
                        }else{
                            console.log("No hay facets");
                            $("#pxc-buscador-os-pastillas").html("");
                            $("#pxc-bolitas-aviso").html("<p>Nothing to show.</p>");
                            $("#pxc-bolitas").addClass("oculto");
                        }
                    });
                }
            }
        }else{
            console.log("Estas en un evento que no es de la vista. ¿Cuál?:");
            console.log(settings.url);
	    if(settings.url == "/node/add/foam?ajax_form=1&_wrapper_format=drupal_ajax") {
		    actualizarDocumentos();
	    }
            if ($("#pxc-busqueda-interna").length > 0 ) {
                let misIdsRam2 = $("#pxc-lista-foam-relacionados").text();
                misIdsRam2 = misIdsRam2.replaceAll("][", "-");
                misIdsRam2 = misIdsRam2.replace("[", "");
                misIdsRam2 = misIdsRam2.replace("]", "");
                let misIdsRamArray = misIdsRam2.split("-");
                let controlIdsRam = 0;
                let tempIdFoamRel = "";
                let idDelNodoHost = $("#pxc-main").attr("data-pxc-cur-id");
                // Añade el control de selección a las tarjetas retornadas como búsqueda y a aquellas que están relacionadas con el foam editado aparecen marcadas.
                $( ".pxc-foam-card" ).each(function( index ) {
                    console.log("Foam Id:" + $(this).attr("data-history-node-id"));
                    tempIdFoamRel = $(this).attr("data-history-node-id");
                    controlIdsRam = 0;
                    misIdsRamArray.forEach( function(valor, indice, array) {
                        if(tempIdFoamRel == valor) {
                            controlIdsRam++;
                        }
                    }, tempIdFoamRel);
                    if($(this).attr("data-history-node-id") != idDelNodoHost) {
                        if(controlIdsRam == 0) {
                            $(this).append("<span class='pxc-foam-node-selector deseleccionado' data-pxc-nodo-id='"+ $(this).attr("data-history-node-id") + "'></span>");
                        }else{
                            $(this).append("<span class='pxc-foam-node-selector seleccionado' data-pxc-nodo-id='"+ $(this).attr("data-history-node-id") + "'></span>");
                        }
                    }
                });
                $( ".pxc-foam-micro-card" ).each(function( index ) {
                    console.log("Foam Id:" + $(this).attr("data-history-node-id"));
                    if($(this).attr("data-history-node-id") != idDelNodoHost) {
                        $(this).append("<span class='pxc-foam-node-selector seleccionado' data-pxc-nodo-id='"+ $(this).attr("data-history-node-id") + "'></span>");
                    }
                });
            }
        }
        
        // Acciones reiterativas ante cargas por Ajax para hacer que los enlaces se carguen en las ventanas correctas. 
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
    
	function ajaxChat() {
		console.log("Hitting button");
	        if ($('#opcionBus0').is(':checked')) {
			if ($(".pxc-buscador-os-no-result").length === 0 ) {
				$( ".pxc-busqueda-os-grid" ).removeClass("oculto"); 
				$( "#pxc-tabBuscadorOs").removeClass("oculto"); 
				$( "#tabBuscadorOsContent").removeClass("oculto");
			}else{
				if ($('#opcionBus1').is(':checked')) {
					$( "#collapseLago").addClass("show");
					$( ".pxc-busqueda-os-grid").addClass("oculto");
					$( "#pxc-tabBuscadorOs").addClass("oculto");
					$( "#tabBuscadorOsContent").addClass("oculto");
					console.log("3) Vista Empty On Click launch search");
					newQuerySearch();
				}else{
					$( ".pxc-busqueda-os-grid" ).removeClass("oculto");
					$( "#pxc-tabBuscadorOs").addClass("oculto");
					$( "#tabBuscadorOsContent").addClass("oculto");
				}
			}
		}else{
			$( ".pxc-busqueda-os-grid" ).addClass("oculto");  
			$( "#pxc-tabBuscadorOs").addClass("oculto"); 
			$( "#tabBuscadorOsContent").addClass("oculto");
		}
	        if ($('#opcionBus1').is(':checked')) {
			$( "#block-pixel-pixeluichatbusqueda").removeClass("oculto");
			if ($('#opcionBus0').is(':checked')) {
			}else{
				$( "#collapseLago").addClass("show");
				$( ".pxc-busqueda-os-grid").addClass("oculto");
				$( "#pxc-tabBuscadorOs").addClass("oculto");
				$( "#tabBuscadorOsContent").addClass("oculto");
				console.log("4) Solo Chat On Click launch search");
				newQuerySearch();
			}
		}else{
			$( "#block-pixel-pixeluichatbusqueda").addClass("oculto");
		}
	    }

    waitForElm('#views-exposed-form-busqueda-os-page-1').then((elm) => {
        if($('#views-exposed-form-busqueda-os-page-1').length > 0 && window.location.pathname != "/") {
            
            // Logica de On load
            ///////////////////////////////////////////////////////////////
            console.log("Hola estoy cargando");
            
            // Hace faceting si hay más de 0 caracteres en el query, debería quedar en 3 mínimo
            if($( "input[data-drupal-selector='edit-search-api-fulltext']" ).val().length >= 3) {
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
                        $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-sizes", stringSizes);
                        $("#pxc-bolitas-aviso").html("");
                        $("#pxc-bolitas").removeClass("oculto");
                    }else{
                        console.log("No hay facets");
                        $("#pxc-buscador-os-pastillas").html("");
                        $("#pxc-bolitas-aviso").html("<p>Nothing to show.</p>");
                        $("#pxc-bolitas").addClass("oculto");
                    }
                });
            }
        }
    });
    
    // Evento de lanzar consulta filtrada cuando se hace clic en una pastilla retornada como facet.
    $("body").on( "click", "#pxc-buscador-os-pastillas li a", function(e) {
        e.preventDefault();
        
        let taxonomy = $(this).children(".pxc-buscador-os-pastillas-label").text();
        console.log(taxonomy);
        $( "input[data-drupal-selector='edit-taxonomy']" ).val(taxonomy).change();
        $( "#pxc-buscador-os-temas" ).val(taxonomy).change();
        //$( "#views-exposed-form-busqueda-os-page-1" ).trigger( "submit" );
        // recargar(e);
        $("input[data-drupal-selector='edit-submit-busqueda-os-2']").click();
    });
    
    // Evento para lanzar el proceso de dibujo de las bolitas si hay datos en los parámteros de la división #pxc-buscador-os-fila-2-bolitas.
    $("body").on( "click", "#pxc-relaciones-tab", function() {
        console.log("marti");
        let tids = $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-tids");
        let nids = $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-nids");
        let sizes = $("#pxc-buscador-os-fila-2-bolitas").attr("data-pxc-sizes");
        if(tids.length > 0 && nids.length > 0 && sizes.length > 0) {
            recuperarTaxonomiasObj(tids, sizes, function (respuesta) {
               console.log(respuesta);
               if(respuesta.length > 0) {
                    relacionarTaxonomias(tids,nids, respuesta); 
               }
            });
        }else{
            $("#pxc-bolitas-aviso").html("<p>Nothing to show.</p>");
        }
    });
    
    // Eventos de selección y deselección cuando se hace búsqueda interna que lanza la actualización de los parámteros en el campo de texto #pxc-lista-foam-relacionados, actualiza los badges y lanza la actualización de la vista embebida con la lista de contenidos relacionados con el nodo.
    $("body").on( "click", ".pxc-foam-node-selector", function(e) {
        
        let misIdsOri = $("#pxc-lista-foam-relacionados").text();
        let tempIdAfectado = $(this).attr("data-pxc-nodo-id");
        
        if ($(this).hasClass("deseleccionado")) {
            // Si se va a seleccionar
            $("#pxc-lista-foam-relacionados").text(misIdsOri + "[" + tempIdAfectado + "]")
            $(this).removeClass("deseleccionado");
            $(this).addClass("seleccionado");
            $("#pxc-absolute-footer").removeClass("oculto");
            $("#pxc-lista-foam-relacionados").attr("data-pxc-lock", "0");
            el = $("#pxc-badge-0-4");
            updateBadge(el,el.text(),1);
            el = $("#pxc-badge-1-8");
            updateBadge(el,el.text(),1);
            updateVistaFoamRel();
        }else{
            // Si se va a deseleccionar
            misIdsOri = misIdsOri.replace("[" + tempIdAfectado + "]", "");
            $("#pxc-lista-foam-relacionados").text(misIdsOri);
            $(this).removeClass("seleccionado");
            $(this).addClass("deseleccionado");
            $("#pxc-lista-foam-relacionados").attr("data-pxc-lock", "0");
            el = $("#pxc-badge-0-4");
            updateBadge(el,el.text(),-1);
            el = $("#pxc-badge-1-8");
            updateBadge(el,el.text(),-1);
            updateVistaFoamRel();
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
    
    function actualizarDocumentos() {
	    let contador = 0;
	    $('#pxc-suggested-documents ul li').each(function() {
		    $("[data-drupal-selector='edit-field-links-"+contador+"-uri']").val($(this).text());
		    $("[data-drupal-selector='edit-field-links-"+contador+"-title']").val($(this).text());
		    contador++;
		    console.log("Updating documents trought chat");
	    });
    }
    
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
    
    // Recupera el nombre de las taxonomías recuperadas a través de la consulta de facets al servidor de búsquedas mediante imn string de tipo tid1-tid2-tidn. Mutación de la anterior para usar con callback
    
    function recuperarTaxonomiasObj(tids, sizes, callback) {
        
        let urlString = '/pxc-simple-taxonomy-listar?tids=' + tids + "&sizes=" + sizes;
            
        $.ajax({
            url: urlString,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json",
            success: callback,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });

    }
    
    // Dibuja las pastillas en el área pxc-buscador-os-pastillas y las bolitas
    
    function dibujarPastillas(data) {
        data.sort((a, b) => b.size - a.size);
        $("#pxc-buscador-os-pastillas").html("");
        data.forEach( function(valor, indice, array) {
            console.log("Índice: " + indice);
            console.log(valor);
            $("#pxc-buscador-os-pastillas").append("<li class='pxc-buscador-os-pastillas-li pxc-buscador-os-pastillas-li-"+valor.size+"'><a href='#' data-id-term='"+ valor.id +"' data-size-term='"+ valor.size +"'><span class='pxc-buscador-os-pastillas-label'>"+ valor.label +"</span><span class='pxc-buscador-os-pastillas-size'>"+ valor.size +"</span></a></li>");
        });
    }
    
    // Crea las relaciones a partir de los datos retornados que relacionan ciertos NIds con ciertos Tids.
    
    function createRelationships(respuesta, tids, nids, listataxos) {
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
        // console.log(respuesta);
        let tempKey = "";
        let maxValor = 0;
        let minValor = 0;
        for (var key in respuesta) {
            // console.log(respuesta[key]);
            // Crea una llave que permite ubicar la taxonomia en el Objeto objTidsSizesRels.
            tempKey = "tid_" + respuesta[key].tid;
            // A. Sumele 1 al valor sizes de la taxonomia en objTidsSizesRels por cada vez que la encuentre, pues quiere decir que tiene más nodos relacionados con ella.
            eval("objTidsSizes." + tempKey + ".size = objTidsSizes." + tempKey + ".size + 1;");
        }
        
        let nuevoListado = listataxos;
        nuevoListado.sort((a, b) => b.size - a.size);
            
        /*
        console.log("Tids vs. tamaños:");
        console.log(objTidsSizes);
        console.log("Taxos por nodos:");
        console.log(objNidsRels);
        console.log("Edges:");
        console.log(objEdges);
        console.log("Edges Unique:");
        console.log(objEdgesUnique);
        console.log("Json analizado:");
        console.log(respuesta);*/
        console.log("Lista taxos:");
        console.log(listataxos);
        /*console.log("Lista taxos ordenada:");
        console.log(nuevoListado);*/
        
        // Se extrae el size máximo y mínimo, size que está dado basicamente por el número de nodos relacionados con cada taxo.
        let maxSize = nuevoListado[0].size;
        let minSize = nuevoListado[(nuevoListado.length - 1)].size;
        console.log("Max: " + maxSize + " Min:" + minSize);
        
        ///////// Si hay datos cree las bolitas
        if(Object.keys(objTidsSizes).length > 0 && listataxos.length > 0) {
            
            console.log("Drawing nodes...");
            
            // 1 Creación de las bolitas
            let nodes = new vis.DataSet([]);
            let conteo = 0;
            let escala = 0;
            listataxos.forEach( function(valor, indice, array) {
                // Se normaliza la escala para que independientemente del valor, el size de la bolita siempre sea entre 0 y 1.
                if(minSize == maxSize) {
                    escala = 1;
                }else{
                    escala = ((listataxos[conteo].size - minSize)/(maxSize - minSize));
                }
                console.log(escala);
                if(conteo <= 9) {
                    nodes.add([{ id: listataxos[conteo].id, value:escala , label: listataxos[conteo].label, font: { strokeWidth: 3, strokeColor: "white" }, color: retornaColor((conteo + 1)) }]);
                }else{
                    nodes.add([{ id: listataxos[conteo].id, value:escala , label: listataxos[conteo].label, font: { strokeWidth: 3, strokeColor: "white" }, color: retornaColor(0) }]);
                }
                conteo++;
            });
            
            console.log(nodes);
            
            // 2. Edges
            let edges = new vis.DataSet(objEdgesUnique);
            
            // 3 Creación del diagrama
            let container = document.getElementById("pxc-bolitas");
            let data = {
                nodes: nodes,
                edges: edges,
            };
            // 2.3.1 Aquí se pueden definir settings generales para todas las bolitas
            let options = {
              nodes: {
                    shape: "dot",
                    borderWidth : 0 ,
                    shadow: true,
                    font: "14px m-book #0c4d92",
                    scaling: {
                      customScalingFunction: function (min, max, total, value) {
                        return value / total;
                      },
                      min: 10,
                      max: 100,
                    },
                  },
                  interaction: { hover: true }
                };
            let network = new vis.Network(container, data, options);
            
            // Evento de hover (hover)
            network.on("hoverNode", function (params) {
                console.log("hoverNode Event:", params['node']);
            });
              
            network.on("zoom", function (params) {
                console.log("hoverNode Event:", params);
            });
            
            // Evento equivalente de onclic
            network.on("selectNode", function (params) {
                console.log("selectNode Event on click:", params['nodes'][0]);
                let taxonomy = "";
                let conteo = 0;
                listataxos.forEach( function(valor, indice, array) {
                    if(listataxos[conteo].id == params['nodes'][0]) {
                        taxonomy = listataxos[conteo].label;
                    }
                    conteo++;
                });
                console.log(taxonomy);
                $( "input[data-drupal-selector='edit-taxonomy']" ).val(taxonomy).change();
                $( "#pxc-buscador-os-temas" ).val(taxonomy).change();
                //$( "#views-exposed-form-busqueda-os-page-1" ).trigger( "submit" );
                $("input[data-drupal-selector='edit-submit-busqueda-os-2']").click();
            });
        }
    }
    
    // Retorna un color hex a partir de un valor numérico.
    
    function retornaColor(fijo) {
        let cual = fijo;
        if(fijo == 0) {
            cual = Math.floor((Math.random() * 10) + 1);
        }
        let color = "#a9e0f0";
        if(cual == 1) {
            color = "#f9e2c4";
        }
        if(cual == 2) {
            color = "#f9cde0";
        }
        if(cual == 3) {
            color = "#c8dff1";
        }
        if(cual == 4) {
            color = "#d8e6ca";
        }
        if(cual == 5) {
            color = "#decae6";
        }
        if(cual == 6) {
            color = "#cdf9df";
        }   
        if(cual == 7) {
            color = "#cdcdf9";
        }
        if(cual == 8) {
            color = "#c8c8c8";
        }
        if(cual == 9) {
            color = "#bfb8c9";
        }
        if(cual == 10) {
            color = "#a9e0f0";
        }
        return color;
    }
    
    
    // Genera tres objetos a partir de las taxonomías y nodos obtenidos través de la consulta de facets al servidor de búsquedas. El primer objeto objTidsSizes incluye por cada tid, su escala y el segundo objeto objNidsRels crea por nid las relaciones que deben existir entre taxos. Finalmente el tercer objeto objEdgesUnique (el más útil), incluye un arreglo de edges consolidado y sin repeticiones.
    
    function relacionarTaxonomias(tids, nids, objrespuesta) {
        
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
                createRelationships(data, tids, nids, objrespuesta);
                //process the JSON data etc
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
            
        console.log("3. End Ajax Relación Taxos");

    }    
    
    // Función que ejecuta a partir de los valores presentes en la búsqueda la consulta de los facets lanzando un request Ajax al controlador de facets creado dentro del módulo personalizado.
    
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
            console.log("Solr Facet:---------------------------------------");
            console.log(urlFacet);
            
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

//https://drupal.stackexchange.com/questions/287522/how-to-load-a-view-via-ajax-without-breaking-ajax-functionality
    
