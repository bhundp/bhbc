<?php

namespace Drupal\pxc_simple_form\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Our simple form class.
 */
class SimpleFormSaveMedia extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pxc_simple_form_save_media';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['ecasfstream'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Stream'),
    ];
    
    $form['ecasfnid'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Nid'),
    ]; 
    
    $form['ecasftipo'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Tipo'),
    ]; 

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Subir'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  $this->messenger()->addStatus($form_state->getValue('stream'));
  }

}
