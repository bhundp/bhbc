(function ($) {
  let generic_text = '¿Qué sabes del PNUD Colombia?';

  $(document).ready(function () {

    window.pixelSearch = function () {
      // Texto de consulta
      var text = $('input[data-drupal-selector=edit-search-api-fulltext]').val();

      if(text == '') text = generic_text;

      // Obtener el elemento del chat
      var el = $('.pxc-ai-search-chat');

      // Inicializar chat
      uiChat(el, text);
    }

    window.newQuerySearch = function() {
      // Texto de consulta
      var text = $('input[data-drupal-selector=edit-search-api-fulltext]').val();

      if(text == '') text = generic_text;

      jQuery('.form-control').val(text);

      jQuery('#button-addon2').click();
    }

    // Bandera para indicar si ya se ha usado la consulta
    let searched = false;

    // Lanzar cuando el acordeón está por abrirse
    $('#collapseLago').on('show.bs.collapse', function (e) {

      if (!searched) {
        pixelSearch();

        // Indicar que ya se hizo la consulta
        searched = true;
      }
    });

    // End of Part 1
  });
})(jQuery);
