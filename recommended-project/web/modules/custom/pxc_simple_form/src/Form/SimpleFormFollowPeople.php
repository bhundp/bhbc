<?php

namespace Drupal\pxc_simple_form\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Our simple form class.
 */
class SimpleFormFollowPeople extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pxc_simple_form_follow_people';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['persona'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Persona'),
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Seguir persona'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  $this->messenger()->addStatus("---pxc-ajax-response-ini---" . $form_state->getValue('persona') . "---pxc-ajax-response-end");
  }

}
