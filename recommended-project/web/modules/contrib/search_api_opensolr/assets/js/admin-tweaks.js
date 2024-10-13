(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.searchApiOpenSolrPassword = {
    attach: function (context, settings) {
      var $passwordInput = $('.pass-show');

      if ($passwordInput.length > 0) {
        $passwordInput.once().after('<span class="opensolr-toggle-password">' + Drupal.t('Show') + '</span>');
        $('.opensolr-toggle-password', context).on('click', function () {
          $(this).text($(this).text() === Drupal.t('Show') ? 'Hide' : 'Show');
          $(this).prev().attr('type', function (index, attr) {
            return attr === 'password' ? 'text' : 'password';
          });
        });
      }
    }
  };

})(jQuery, Drupal);
