<?php

namespace Drupal\pixel_azure_openai\Form;

use Exception;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal;

/**
 * Defines a form that configures forms module settings.
 */
class ModuleConfigurationForm extends ConfigFormBase
{
	/**
	 * {@inheritdoc}
	 */
	public function getFormId()
	{
		return 'pixel_azure_admin_settings';
	}

	/**
	 * {@inheritdoc}
	 */
	protected function getEditableConfigNames()
	{
		return [
			'pixel_azure.admin_settings',
		];
	}

	/**
	 * {@inheritdoc}
	 */
	public function buildForm(array $form, FormStateInterface $form_state)
	{
		$config           = $this->config('pixel_azure.admin_settings');
		$form['resource'] = [
			'#type'          => 'textfield',
			'#title'         => $this->t('Azure OpenAI resource'),
			'#default_value' => $config->get('resource'),
		];

		$form['resource_key'] = [
			'#type'          => 'textfield',
			'#title'         => $this->t('Resource OpenAI key'),
			'#default_value' => $config->get('resource_key'),
		];

		$form['deployment'] = [
			'#type'          => 'textfield',
			'#title'         => $this->t('Chat deployment'),
			'#default_value' => $config->get('deployment'),
		];

		$form['api_version'] = [
			'#type'          => 'textfield',
			'#title'         => $this->t('Api version'),
			'#default_value' => $config->get('api_version'),
		];

		$form['search_endpoint'] = [
			'#type'          => 'textfield',
			'#title'         => $this->t('Search endpoint'),
			'#description'   => $this->t('Endpoint to data source'),
			'#default_value' => $config->get('search_endpoint'),
		];

		$form['search_index'] = [
			'#type'          => 'textfield',
			'#title'         => $this->t('Search index'),
			'#default_value' => $config->get('search_index'),
		];

		$form['search_key'] = [
			'#type'          => 'textfield',
			'#title'         => $this->t('Search key'),
			'#default_value' => $config->get('search_key'),
		];

		$form['profile'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('OpenAI profile'),
			'#default_value' => $config->get('profile'),
		];

		$form['message_document'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('Message to import a document'),
			'#default_value' => $config->get('message_document'),
		];

		$form['profile_varnish'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('Open AI profile to varnish'),
			'#default_value' => $config->get('profile_varnish'),
		];

		$form['message_varnish'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('Order to describe action to varnish text'),
			'#default_value' => $config->get('message_varnish'),
		];

		$form['profile_format'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('Open AI profile during last steps'),
			'#default_value' => $config->get('profile_format'),
		];

		$form['format_format'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('Order to describe the format of the lists'),
			'#default_value' => $config->get('format_format'),
		];

		$form['order_format'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('Reinforcement order during last steps'),
			'#default_value' => $config->get('order_format'),
		];

		$form['step1_format'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('Order to extract keywords'),
			'#default_value' => $config->get('step1_format'),
		];

		$form['step2_format'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('Order to extract organizations'),
			'#default_value' => $config->get('step2_format'),
		];

		$form['step3_format'] = [
			'#type'          => 'textarea',
			'#title'         => $this->t('Order to extract synonyms'),
			'#default_value' => $config->get('step3_format'),
		];

		return parent::buildForm($form, $form_state);
	}

	/**
	 * {@inheritdoc}
	 */
	public function submitForm(array &$form, FormStateInterface $form_state)
	{
		$config = $this->config('pixel_azure.admin_settings');
		$config
			->set('resource', trim($form_state->getValue('resource')))
			->set('resource_key', trim($form_state->getValue('resource_key')))
			->set('deployment', trim($form_state->getValue('deployment')))
			->set('api_version', trim($form_state->getValue('api_version')))
			->set('search_endpoint', trim($form_state->getValue('search_endpoint')))
			->set('search_index', trim($form_state->getValue('search_index')))
			->set('search_key', trim($form_state->getValue('search_key')))
			->set('profile', trim($form_state->getValue('profile')))
			->set('message_document', trim($form_state->getValue('message_document')))
			->set('profile_varnish', trim($form_state->getValue('profile_varnish')))
			->set('message_varnish', trim($form_state->getValue('message_varnish')))
			->set('profile_format', trim($form_state->getValue('profile_format')))
			->set('format_format', trim($form_state->getValue('format_format')))
			->set('order_format', trim($form_state->getValue('order_format')))
			->set('step1_format', trim($form_state->getValue('step1_format')))
			->set('step2_format', trim($form_state->getValue('step2_format')))
			->set('step3_format', trim($form_state->getValue('step3_format')))
			->save();

		parent::submitForm($form, $form_state);
	}
}
