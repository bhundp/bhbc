// Librería de funcionalidades del Theme Pixel


// PART 1. JQuery
(function($) {
$(document).ready(function () {
    
    waitForElm('#comment-form').then((elm) => {
        
        let uniqueTitle = "";
        let estampaTiempo = Date.now();
        let currentNode = $( "#pxc-hidden-entity").text();
        uniqueTitle = "Comentario "+ estampaTiempo + " para nodo " + currentNode + "";
        $( "input[data-drupal-selector='edit-subject-0-value']" ).val(uniqueTitle);
        $( "input[data-drupal-selector='edit-submit']" ).val("Comentar");
    });
    
    /*$("#tempIframeReply").on('load', function() {
        console.log($("#tempIframeReply").attr("src"));
    });*/
    
    var $myGroup = $('.pxc-comentarios-foam-feed');
    $myGroup.on('show.bs.collapse','.collapse', function() {
        $myGroup.find('.collapse.in').collapse('hide');
        let urlIframeRta = "#" + $(this).attr("data-pxc-comment-w");
        let urlIframeUrl = $(this).attr("data-pxc-url");
        let elemento = $(this);
        console.log(urlIframeRta + urlIframeUrl);
        $("#tempIframeReply").attr('src', urlIframeUrl);
        $('#tempIframeReply').appendTo(urlIframeRta);
    });
    $myGroup.on('hidden.bs.collapse', function () {
        if($("#tempIframeReply").length > 0) {
           $("#tempIframeReply").attr('src', "about:blank");
        }
    });
    
    $( ".pxc-comentario-respuesta" ).each(function( index ) {
        let dataUserCurrent = $(this).attr("data-user-current");
        let dataUserComment = $(this).attr("data-user-comment");
        if (dataUserCurrent == dataUserComment) {
            $(this).addClass("oculto");
        }
    });
    
// End of Part 1
});
})(jQuery); 

// https://stackoverflow.com/questions/2429045/iframe-src-change-event-detection