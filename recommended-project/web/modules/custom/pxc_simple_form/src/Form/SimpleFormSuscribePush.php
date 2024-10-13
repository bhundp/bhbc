<?php

namespace Drupal\pxc_simple_form\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Our simple form class.
 */
class SimpleFormSuscribePush extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pxc_simple_form_suscribe_push';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
      
    $current_user = \Drupal::currentUser();
    $current_user_s = (string)$current_user->id();
    
    $auth_token = 'Yw2tYWFlcgFJlvdXOWZpMPinJWTUX61hNozgBwFB';
    $project_id = 8644;
    $signature = hash_hmac('sha256', $current_user_s, $auth_token);

    $form['userid'] = [
      '#id' => 'sus_userid',
      '#type' => 'hidden',
      '#title' => $this->t('Usuario'),
      '#value' => $current_user->id(),
    ];
    
    $form['projectid'] = [
      '#id' => 'sus_projectid',
      '#type' => 'hidden',
      '#title' => $this->t('Project ID'),
      '#value' => $project_id,
    ];
    
    $form['signature'] = [
      '#id' => 'sus_signature',    
      '#type' => 'hidden',
      '#title' => $this->t('Signature'),
      '#value' => $signature,
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Suscribirse a las notificaciones'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  $this->messenger()->addStatus($form_state->getValue('userid'));
  }

}
