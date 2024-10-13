(function ($) {
  $(document).ready(function () {

    // 1. Add Button
    if ($('#edit-field-stream-wrapper, .field--type-media-capture-field-type').length > 0) {
      $("#edit-field-stream-wrapper, .field--type-media-capture-field-type").each(function (el) {
        let rand = parseInt(Math.random() * (99999 - 10000) + 10000);
        let type = jQuery(this).find('input, textarea').attr('data-media_type');
        if (type == undefined) type = 'video';
        $(this).append("<div><button id='botonStreamVideo" + rand + "' type='button' class='btn btn-primary' data-media_type='" + type + "' data-bs-toggle='modal' data-bs-target='#themeModal1'>Grabar</button></div>");
      })
    }

    //triggered when modal is about to be shown
    $('#themeModal1').on('show.bs.modal', function (e) {
      //get data-id attribute of the clicked element
      var target_id = $(e.relatedTarget).attr('id');
      var media_type = $(e.relatedTarget).attr('data-media_type');

      //populate the textbox
      var el = $(e.currentTarget).find('.stream_container');
      $(el).attr('data-media_type', media_type);
      $(el).attr('data-target_id', target_id);
      $(el).attr('data-modal', 'themeModal1');

      if($("#pxc-main").attr("data-pxc-cur-id"))  {
          $("#edit-ecasfnid").val($("#pxc-main").attr("data-pxc-cur-id"));
      }else{
          $("#edit-ecasfnid").val("0");
      }
      
      $("#edit-ecasftipo").val(media_type);
      $("#themeModalLabel1").text("Grabar desde tu dispositivo");
      $("#themeModalLabel1").append("<br><small class='pxc-micro-aviso'><strong>Importante:</strong> Tu navegador te solicitará tu permiso para grabar</small>");

      // INicializar captura de medio
      pixelMediaElement(el);

    });

    //triggered when modal is about to be shown
    $('#themeModal').on('show.bs.modal', function (e) {
      // populate the textbox
      var el = $(e.currentTarget).find('.modal-content');

      // Inicializar chat
      uiChat(el);

    });

    // End of Part 1
  });
})(jQuery);
