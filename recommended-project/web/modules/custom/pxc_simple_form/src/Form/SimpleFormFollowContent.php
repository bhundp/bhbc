<?php

namespace Drupal\pxc_simple_form\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Our simple form class.
 */
class SimpleFormFollowContent extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pxc_simple_form_follow_content';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['nid'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Contenido'),
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Seguir este contenido'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  $this->messenger()->addStatus("---pxc-ajax-response-ini---" . $form_state->getValue('nid') . "---pxc-ajax-response-end");
  }

}
