<?php

/**
 * Implements hook_menu().
 */
function pxc_simple_form_menu() {
  $items['pxc_simple/get/taxos'] = array(
    'page callback' => 'pxc_simple_get_taxos_ajax',
    'type' => MENU_CALLBACK,
    'access arguments' => array('access content'),
  );
  return $items;
}

/**
 * Callback to return JSON encoded image for given nid.
 */
function pxc_simple_get_taxos_ajax($nid) {
  $photo = "su mama"; // returns the filepath of my photo
  $image = theme($photo);
  drupal_json_output(array('status' => 0, 'data' => $image));
}