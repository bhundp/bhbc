<?php

namespace Drupal\pxc_simple_form\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Our simple form class.
 */
class SimpleFormTaggingContent extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pxc_simple_form_tagging_content';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
      
    $nid = \Drupal::request()->query->get('nid');

    $form['tags'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Temas'),
    ];
    
    $form['nid'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Nodo'),
      '#value' => $nid,
    ];    
    
    $form['tags-array'] = [
      '#type' => 'hidden',
      '#title' => $this->t('Arreglo de temas'),
    ];    

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Publicar'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  //$this->messenger()->addStatus($form_state->getValue('tags'));
  }

}
