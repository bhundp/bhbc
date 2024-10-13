<?php

declare(strict_types=1);

namespace Drupal\azure_mailer\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * AzureMailer Settings Form.
 */
class AzureMailerSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'azure_mailer_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {
    $form = parent::buildForm($form, $form_state);
    $config = $this->config('azure_mailer.settings');

    $form['endpoint'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Azure endpoint URL'),
      '#default_value' => $config->get('endpoint'),
      '#description' => $this->t("The URL of the Azure Communication Services endpoint.\n<br/> Example: @url", [
        '@url' => 'yoursite.communication.azure.com',
      ]),
    ];
    // Source text field.
    $form['secret'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Azure secret key'),
      '#default_value' => '',
      '#disabled' => TRUE,
      '#description' => $this->t("The secret key for Azure Communication \Services.\n<br/>Set in @file with @conf", [
        '@file' => 'settings.php',
        '@conf' => "\$config['azure_mailer.settings']['secret'] = 'yoursecret';",
      ]),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {

  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $config = $this->config('azure_mailer.settings');
    $config->set('endpoint', $form_state->getValue('endpoint'));
    $config->set('secret', $form_state->getValue('secret'));
    $config->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames(): array {
    return [
      'azure_mailer.settings',
    ];
  }

}
