<?php

namespace Drupal\pxc_simple_form\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Our simple form class.
 */
class SimpleFormApplyBenefit extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'pxc_simple_form_apply_benefit';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['beneficio'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Beneficio'),
    ];
    
    $form['puntos'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Puntos'),
    ];    

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Aplicar beneficio'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  //$this->messenger()->addStatus($form_state->getValue('beneficio'));
  }

}
