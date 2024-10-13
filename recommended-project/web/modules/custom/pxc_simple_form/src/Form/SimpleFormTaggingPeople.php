<?php

namespace Drupal\pxc_simple_form\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Our simple form class.
 */
class SimpleFormTaggingPeople extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pxc_simple_form_tagging_people';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['tags'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Temas'),
    ];
    
    $form['tags-array'] = [
      '#type' => 'hidden',
      '#title' => $this->t('Arreglo de temas'),
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Guardar'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $etiquetas = $form_state->getValue('tags');
    if (strlen($etiquetas) < 1) {
    // Set an error for the form element with a key of "title".
    $form_state
      ->setErrorByName('tags', $this
      ->t('Debe haber al menos un tema.'));
    }
  }
  public function submitForm(array &$form, FormStateInterface $form_state) {
  //$this->messenger()->addStatus($form_state->getValue('tags'));
  }

}
