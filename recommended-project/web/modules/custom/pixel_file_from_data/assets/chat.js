var aiChat = false;

function uiChat(el, ask = false) {
  if (aiChat) return;

  aiChat = true;

  // Variables
  var me = this;
  var input = jQuery(el).find('#button-addon2').prev();
  var button_ask = jQuery(el).find('#button-addon2');
  var input_file = jQuery(el).find('#file_uploaded');
  var button_document = jQuery(el).find('#file_uploaded').next();
  var footer = jQuery(el).find('#pxc-ai-footer');
  var chat = jQuery(el).find('#pxc-ai-body .pxc-ai-body-pad');
  var csrf_token = '';
  var mensaje_error_500 = 'Hay una alta demanda de consultas en este instante. Intenta de nuevo.';
  var max_intentos = 3;

  const agregarTexto = function (texto, tipo, citations) {
    let clase = (tipo == 'user') ? 'end' : 'start';
    let role = (tipo == 'user') ? 'user' : 'assistant';
    let description = (tipo == 'user') ? 'TÚ' : 'BH';

    let rand = Math.floor(Math.random() * (99999 - 11111) + 11111);

    let x_citations = '';
    if (citations) {

      // Determinar citas en texto
      let quotes = texto.match(/\[doc[0-9]*\]/g);
      quotes = [...new Set(quotes)];

      // Reemplazar [doc#] por etiqueta
      quotes.forEach((element, index) => {
        let el = element.replace(/[\[\]]+/g, "");
        let html = `<span class="quote_link collapse_link" data-toggle="collapse" data-target="#cita_${rand}_${el}" aria-expanded="false" aria-controls="cita_${rand}_${el}">${index + 1}</span>`;
        texto = texto.replaceAll(element, html);
      });

      let citation_index = 0;

      x_citations += `<div class="pxc-ai-body-message-machine-references quotes" id="pxc-ai-body-message-machine-references-${rand}">`;
      citations.forEach((citation, index) => {
        if (quotes.includes("[doc" + (index + 1) + "]")) {
          quote_index = quotes.indexOf("[doc" + (index + 1) + "]");
          var subcitations = citation.content.split(/\r?\n\n/).filter((el) => {
            return (el.length > 25);
          });



          var x_subcitationes = subcitations.map((paragraph, index) => {
            citation_index++;
            return `<div class="row citation_item">
                          <div class="col-11 texto_cita">${paragraph}</div>
                            <div class="col-1">
                              <div class="form-check">
                                <input class="form-check-input input-checkbox-usar-cita" type="checkbox" value="" id="pxc-ai-body-message-machine-references-${rand}-row-${citation_index}-cb">
                                <label class="form-check-label" for="pxc-ai-body-message-machine-references-${rand}-row-${citation_index}-cb">
                                Usar
                                </label>
                              </div>
                            </div>
                          </div>`;
          }).join("");

          const link = (citation.url != null) ? `<a target="_BLANK" href="${citation.url}"><i class="bi bi-link - 45deg"></i></a>` : ``;

          const document_name = citation.url.split('/').pop().replace(/[-_]/g, " ");

          x_citations += `<div class="row pxc-ai-body-message-machine-references-row" id="pxc-ai-body-message-machine-references-${rand}-row-a" data-link="${citation.url}">
										<div class="col-1">
											${link}
										</div>
										<div class="col-11">
											<div class="pxc-ai-body-message-machine-references-${rand}-row-a-text">
                        <span class="collapse_link collapse_title" data-toggle="collapse" data-target="#cita_${rand}_doc${index + 1}" aria-expanded="false" aria-controls="cita_${rand}_doc${index + 1}">Cita ${quote_index + 1}</span>
                        <span class="document_name">Documento: ${document_name}</span>
												<div class="collapse" id="cita_${rand}_doc${index + 1}">
                          ${x_subcitationes}
                        </div>
											</div>
										</div>
									</div>`;
        }
      });
      x_citations += `</div>`;
    }

    let html = (tipo == 'user') ? `<div class="row justify-content-${clase} chat-message-line" data-role="${role}">
						<div class="col-9">
							<div class="pxc-ai-body-message pxc-ai-body-message-${tipo}">
								<span class="pxc-ai-body-pad-persona pxc-ai-body-pad-persona-ai">${description}</span>
								<div class='texto'>${texto}</div>
							</div>
						</div>
					</div>` : `<div id="citas_${rand}" class="row justify-content-${clase} chat-message-line" data-role="${role}">
						<div class="col-md-10">
							<div class="pxc-ai-body-message pxc-ai-body-message-${tipo}">
								<span class="pxc-ai-body-pad-persona pxc-ai-body-pad-persona-ai">${description}</span>
								<div class="pxc-ai-body-message-machine-response" id="pxc-ai-body-message-machine-response-${rand}">
									<div class="row">
										<div class="col-md-10 pxc-ai-body-message-machine-response-text texto">${texto}</div>
										<div class="col-md-2">
											<button class="btn btn-outline-secondary btn-usar-respuesta" type="button" id="pxc-ai-body-message-machine-response-${rand}-accion">Usar</button>
										</div>
									</div>
								</div>
                ${x_citations}
							</div>
						</div>
					</div>`;

    jQuery(chat).append(html);

    jQuery(chat).find('#citas_' + rand + ' span[data-toggle=collapse]').on('click', function (index) {
      var id = jQuery(this).attr('data-target');
      new bootstrap.Collapse(id).toggle();
    });

    if (tipo == 'user') {
      var loading = `<div class="row loading chat-message-line">
						<div class="col-12">
							<div class="pxc-ai-body-message pxc-ai-body-message-machine">
								<div class='texto'>Consultando</div>
							</div>
						</div>
          </div>`;
      jQuery(chat).append(loading);
    } else {
      jQuery(chat).find(".row.loading").remove();
    }

  }

  const getCsrfToken = function (callback) {
    jQuery
      .get(Drupal.url('session/token'))
      .done(function (data) {
        var csrfToken = data;
        csrf_token = data;
        callback(csrfToken);
      });
  }

  const askAI = function (csrfToken, data, intentos) {
    jQuery.ajax({
      url: '/api/pixel-azure/chat?_format=json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      data: JSON.stringify(data),
      success: function (node) {
        var choice = node.choices.shift();
        var message = choice.message;

        agregarTexto(message.content, message.role, choice.message.context.citations);
        jQuery(el).removeClass("loading");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (intentos <= 1) {
          jQuery(chat).find(".row.loading .texto").addClass('warning').html(mensaje_error_500);
          jQuery(el).removeClass("loading");
        } else {
          setTimeout(function () {
            askAI(csrfToken, data, intentos - 1);
          }, 40000);
        }
      }
    });
  }

  const filterTagText = function (text) {
    return text.replace(/<span [^>]*>[0-9]*<\/span>/g, '').replace(/\s\s/g, " ").replace(/\s\./g, ".");
  }

  const countWords = function (str) {
    return str.trim().split(/\s+/).length;
  }

  const addDocumentToChat = function () {

    var input = document.getElementById("file_uploaded");

    if (input.files.length) {
      jQuery(el).addClass("loading");
      const file = input.files[0];
      const { name } = file;
      const ext = name.toLowerCase().substring(name.lastIndexOf(".") + 1);

      const docToText = new DocToText();

      docToText
        .extractToText(file, ext)
        .then(function (text) {
          var characters = text.length;
          var words = countWords(text);

          if (words > 2000) {
            var step_text = 'Lo siento, tu documento es muy extenso para mi. Por favor acórtalo e intenta de nuevo o súbelo como un anexo de tu publicación para que lo pueda procesar con tiempo. Esto tomará un par de días para que tu información esté disponible.';
            var html = `<div class="row loading chat-message-line">
						<div class="col-12">
							<div class="pxc-ai-body-message pxc-ai-body-message-machine">
								<div class='texto'>${step_text}</div>
							</div>
						</div>
          </div>`;

            jQuery(chat).append(html);
            jQuery(el).removeClass("loading");
          } else {
            let html = `<div class="row justify-content-end chat-message-line" data-role="document">
						<div class="col-9">
							<div class="pxc-ai-body-message pxc-ai-body-message-document documento">
								<span class="pxc-ai-body-pad-persona pxc-ai-body-pad-persona-ai">Documento: ${name}</span>
								<div class='texto'>${text}</div>
							</div>
						</div>
					</div>`;

            jQuery(chat).append(html);

            var loading = `<div class="row loading chat-message-line">
						<div class="col-12">
							<div class="pxc-ai-body-message pxc-ai-body-message-machine">
								<div class='texto'>Leyendo</div>
							</div>
						</div>
          </div>`;
            jQuery(chat).append(loading);
            _askChat();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  const _askChat = function () {
    jQuery(input).val('');
    jQuery(input_file).val('');
    // agregarTexto(texto, 'chatgpt');
    const messages = jQuery.map(jQuery(chat).find(".chat-message-line[data-role]"), function (val, i) {
      var role = jQuery(val).attr('data-role');
      var content = filterTagText(jQuery(val).find('div.texto').html());
      return {
        'role': role,
        'content': content
      };
    })

    const data = {
      chat: messages
    };

    if (csrf_token != '') {
      askAI(csrf_token, data, max_intentos);
    } else {
      getCsrfToken(function (csrfToken) {
        askAI(csrfToken, data, max_intentos);
      });
    }
  }

  const askChat = function () {
    const texto = jQuery(input).val().trim();
    if (texto == '') return;

    jQuery(el).addClass("loading");
    jQuery(chat).find(".row.loading").remove();
    agregarTexto(texto, 'user', false);

    _askChat();
  }

  const formatChat = async function (element, step, messages, intentos) {
    let step_text = 'Paso 1 de 3: Buscando palabras clave';
    if (step == 2) {
      step_text = 'Paso 2 de 3: Buscando organizaciones'
    } else if (step == 3) {
      step_text = 'Paso 3 de 3: Buscando sinónimos'
    } else {
      step = 1;
    }

    jQuery(el).addClass("loading");
    jQuery(chat).find(".row.loading").remove();

    var loading = `<div class="row loading chat-message-line">
						<div class="col-12">
							<div class="pxc-ai-body-message pxc-ai-body-message-machine">
								<div class='texto'>${step_text}</div>
							</div>
						</div>
          </div>`;
    jQuery(element).parent().before(loading);

    let data = {
      'step': step,
      'messages': messages
    };

    return jQuery.ajax({
      url: '/api/pixel-azure/format?_format=json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf_token
      },
      data: JSON.stringify(data),
      success: function (node) {
        jQuery(chat).find(".row.loading").remove();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (intentos <= 1) {
          jQuery(chat).find(".row.loading .texto").addClass('warning').html(mensaje_error_500);
          jQuery(el).removeClass("loading");
        } else {
          setTimeout(function () {
            formatChat(element, step, messages, intentos - 1);
          }, 40000);
        }
      }
    });
  }

  const usarSearch = function (el) {
    var respuesta = jQuery(el).parents('.pxc-ai-body-message')[0];
    var texto = filterTagText(jQuery(respuesta).find('.pxc-ai-body-message-machine-response-text.texto').html());
    var documentos = [];
    jQuery(respuesta).find('.quotes .row > .col-1 a').each((index, element) => {
      var link = jQuery(element).attr('href');
      documentos.push(link);
    });

    jQuery(respuesta).append('<form action="/node/add/foam" name="form_search_data" method="post" style="display:none;"><input type="text" name="texto" value="'+ texto + '" /></form>');
    jQuery.each(documentos, function(index, value) {
      jQuery('form[name=form_search_data]').append('<input type="text" name="documentos[]" value="'+ value + '" />');
    })

    document.forms['form_search_data'].submit();
  }

  const usarChat = function(el) {
    var respuesta = jQuery(el).parents('.pxc-ai-body-message')[0];
    var texto = filterTagText(jQuery(respuesta).find('.pxc-ai-body-message-machine-response-text.texto').html());
    var citas = [];
    jQuery(respuesta).find('.input-checkbox-usar-cita:checked').each((index, element) => {
      var cita = jQuery(element).parents('.citation_item')[0];
      citas.push(filterTagText(jQuery(cita).find('.texto_cita').html()));
    });

    messages = [...citas];
    messages.unshift(texto);

    var documentos = [];
    jQuery(respuesta).find('.input-checkbox-usar-cita:checked').each((index, element) => {
      var documento = jQuery(element).parents('div[data-link]')[0];
      documentos.push(filterTagText(jQuery(documento).attr('data-link')));
    });

    documentos = [...new Set(documentos)];

    var palabras_clave = [];
    var entidades = [];
    var sinonimos = [];

    formatChat(respuesta, 1, messages, max_intentos).then((data) => {
      palabras_clave = data;

      formatChat(respuesta, 2, messages, max_intentos).then((data) => {
        entidades = data;

        formatChat(respuesta, 3, palabras_clave, max_intentos).then((data) => {
          sinonimos = data;

          const domEditableElement = document.querySelector('.form-item-body-0-value .ck-editor__editable');
          const editorInstance = domEditableElement.ckeditorInstance;
          editorInstance.setData('<p>' + texto + '<p>');

          const keywords_y_entidades = palabras_clave.concat(entidades);

          jQuery('textarea[name^=field_arreglo_de_citas]').html(citas.join("\n\n"));
          jQuery('textarea[name^=field_arreglo_de_keywords_y_enti]').html(keywords_y_entidades.join(", "));
          jQuery('textarea[name^=field_arreglo_de_sinonimos]').html(sinonimos.join(", "));
          jQuery('textarea[name^=field_arreglo_de_links]').html(documentos.join("---"));

          jQuery(".chat-message-line").remove();

          jQuery("#themeModal").modal('hide');
          jQuery("#themeModal").data('modal', null);
        });

      });
    });
  }

  // Enter en el input
  jQuery(el).find('input').keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();
      askChat();
    }
  });

  // Click en el botón
  jQuery(button_ask).on("click", function () {
    askChat();
  });

  // Click en botón de agregar documento
  jQuery(button_document).on("click", function () {
    addDocumentToChat();
  })

  // Click en botón de usar
  jQuery(chat).on('click', '.btn-usar-respuesta', function () {
    if (!ask) {
      usarChat(this);
    } else {
      usarSearch(this);
    }
  });

  // ¿Hay valor de consulta inicial?
  if (ask) {
    jQuery(el).addClass("loading");
    jQuery(chat).find(".row.loading").remove();
    agregarTexto(ask, 'user', false);

    _askChat();
  }
}

function aiVarnish() {
  var csrf_token = '';
  const domEditableElement = document.querySelector('.form-item-body-0-value .ck-editor__editable');
  const editorInstance = domEditableElement.ckeditorInstance;
  const text = editorInstance.getData();

  const data = {
    text: text
  };

  const getCsrfToken = function (callback) {
    jQuery
      .get(Drupal.url('session/token'))
      .done(function (data) {
        var csrfToken = data;
        csrf_token = data;
        callback(csrfToken);
      });
  }

  const askAI = function (csrfToken, data) {
    jQuery.ajax({
      url: '/api/pixel-azure/varnish?_format=json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      data: JSON.stringify(data),
      success: function (node) {
        var choice = node.choices.shift();
        var message = choice.message.content;

        editorInstance.setData(message);
      },
      error: function (jqXHR, textStatus, errorThrown) {

      }
    });
  }

  if (csrf_token != '') {
    askAI(csrf_token, data, max_intentos);
  } else {
    getCsrfToken(function (csrfToken) {
      askAI(csrfToken, data, max_intentos);
    });
  }


}
