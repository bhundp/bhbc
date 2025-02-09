function pixelMediaElement(el) {
  // Variables
  var me = this;
  var button = jQuery('#' + jQuery(el).attr('data-target_id'));
  var input = jQuery('#' + jQuery(el).attr('data-target_id')).parent().prev().find('input, textarea');
  var modal = jQuery('#' + jQuery(el).attr('data-modal'));
  var media_type = jQuery(el).attr('data-media_type');
  var video = jQuery(el).find('video');
  var recordTimeout;
  var timeLimit = (60 * 2) * 1000;
  var blob_string = false;
  var global_stream = false;
  var ecastream_field = jQuery('#edit-field-stream-audio-0-value');
  var eca_form = jQuery('#pxc-simple-form-save-media');

  async function checkUserMedia(type) {
    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    return !!navigator.getUserMedia;
  }

  // Inicializar
  jQuery(input).val('');

  // Determinar el mime/type
  var mime = false;
  var codec = false;
  if (media_type == 'video') {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      mime = 'video/webm';
      codec = 'video/webm;codecs=vp9';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
      mime = 'video/webm';
      codec = 'video/webm;codecs=h264';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mime = 'video/webm';
      codec = 'video/webm';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mime = 'video/mp4';
      codec = 'video/mp4';
    }
  } else {
    if (MediaRecorder.isTypeSupported('video/webm')) {
      mime = 'audio/webm';
      codec = 'audio/webm';
    } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
      mime = 'audio/mp4';
      codec = 'audio/mp4';
    } else if (MediaRecorder.isTypeSupported('audio/mp3')) {
      mime = 'audio/mp3';
      codec = 'audio/mp3';
    }
  }

  if(!mime) {
    alert("Dispositivo de captura incompatible.");
    return;
  }

  var constraints = {
    audio: true,
    video: {
      width: { min: 320 },
      height: { min: 240 },
    },
    advanced: [
      { width: 320 },
      { width: { min: 320 } },
      { frameRate: 30 },
      { width: { max: 320 } }
    ]
  };

  var blob_type = { type: mime };
  var recorder_options = {
    audioBitsPerSecond: 64000,
    videoBitsPerSecond: 1250000,
    mimeType: codec,
  };

  if (media_type == 'audio') {
    constraints = {
      audio: true,
      video: false,
    };

    recorder_options = {
      audioBitsPerSecond: 128000,
      mimeType: codec,
    };
  }

  if (!checkUserMedia(media_type)) {
    jQuery(button).attr("disabled", true);
    jQuery(el).removeClass('recording');
    hideModal();
    alert("No tiene dispositivo de captura.");
    return;
  }

  // Eventos
  jQuery(el).find('.record').on('click', function (e) {
    jQuery(video).prop("muted", true);
    jQuery(el).addClass('recording');
    init(e);
  });

  jQuery(el).find('.stop_record').on('click', function (e) {
    jQuery(video).prop("muted", false);
    jQuery(el).removeClass('recording');
  });

  jQuery(el).find('.use_record').on('click', function (e) {
    jQuery(el).removeClass('with_record');
    if (blob_string) {
      jQuery(input).val(blob_string);
      jQuery(ecastream_field).val(blob_string);
      // jQuery(eca_form).submit();
      // jQuery(modal).modal('hide');
      hideModal();
    }
    blob_string = false;
  });

  function stopClickHandler(evt) {
    clearTimeout(recordTimeout);
  }


  function recLimit() {
    jQuery(el).find('.stop_record').trigger("click");
    alert('Alcanzaste el tiempo máximo permitido para la grabación.');
  }

  function startClickHandler(evt) {
    stopClickHandler();
    recordTimeout = setTimeout(recLimit, timeLimit);
  }

  function blobToBase64(blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  }

  function preview(blob) {
    clearTimeout(recordTimeout);
    var url = window.URL.createObjectURL(blob);
    jQuery(video).prop('srcObject', null);
    jQuery(video).prop("controls", "controls");
    jQuery(video).prop("autoplay", null);
    display(blob, video);
    jQuery(video).val(url);
    blobToBase64(blob).then(res => {
      blob_string = res;
      jQuery(el).addClass('with_record');
    });
  }

  function display(videoFile, videoEl) {

    if (!(videoFile instanceof Blob)) throw new Error('`videoFile` must be a Blob or File object.'); // The `File` prototype extends the `Blob` prototype, so `instanceof Blob` works for both.

    const newObjectUrl = window.URL.createObjectURL(videoFile);

    const oldObjectUrl = jQuery(videoEl).prop('currentSrc');
    if (oldObjectUrl && oldObjectUrl.startsWith('blob:')) {
      jQuery(videoEl).prop('src', '');
      URL.revokeObjectURL(oldObjectUrl);

      jQuery(el).removeClass('with_record');
    } else {
      jQuery(el).addClass('with_record');
    }

    jQuery(videoEl).prop('src', newObjectUrl);
    setTimeout(function () {
      jQuery(videoEl).trigger('pause');
      jQuery(videoEl)[0].currentTime = 0;
    }, 100);
  }

  // Funciones
  async function init(e) {
    jQuery(input).value = "";
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        global_stream = stream;
        jQuery(video).prop('srcObject', stream);
        jQuery(video).on('loadedmetadata', function (e) {
          e.target.play();
        });

        let blobs = [];
        let recorder = new MediaRecorder(stream, recorder_options);
        recorder.ondataavailable = e => { if (e.data && e.data.size > 0) blobs.push(e.data) };
        recorder.onstop = (e) => preview(new Blob(blobs, blob_type));

        // Start recording.
        startClickHandler();
        recorder.start(); // collect 10ms chunks of data

        jQuery(el).find('.stop_record').on('click', function (e) {
          recorder.stop();
        });
      })
      .catch((err) => {
        jQuery(el).removeClass('recording');
        jQuery(button).attr("disabled", true);
        hideModal();
        alert("No tiene dispositivo de captura.");
      });
  }

  function hideModal() {
    jQuery(video).prop('srcObject', null);
    jQuery(video).removeAttr('src');
    if (global_stream) {
      global_stream.getTracks().forEach(function (track) {
        global_stream.removeTrack(track);
      });
    }

    jQuery(modal).modal('hide');
    jQuery(modal).data('modal', null);

    jQuery(el).find('.record').off();
    jQuery(el).find('.stop_record').off();
    jQuery(el).find('.use_record').off();
  }
}
