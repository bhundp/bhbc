<?php

namespace Drupal\search_api_opensolr\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\key\KeyInterface;
use Drupal\key\KeyRepositoryInterface;
use Drupal\search_api_opensolr\OpenSolrApi\Components\OpenSolrIndex;
use Drupal\search_api_opensolr\OpenSolrApi\OpenSolrException;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Form builder for the opensolr configuration form.
 *
 * @package Drupal\search_api_opensolr\Form
 */
class OpenSolrConfigForm extends ConfigFormBase {

  /**
   * OpenSolr Index api component.
   *
   * @var \Drupal\search_api_opensolr\OpenSolrApi\Components\OpenSolrIndex
   */
  protected $searchApiOpensolrClient;

  /**
   * The key repository.
   *
   * @var \Drupal\key\KeyRepositoryInterface
   */
  protected $keyRepository;

  /**
   * Constructs a new OpenSolrConfigForm object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   * @param \Drupal\search_api_opensolr\OpenSolrApi\Components\OpenSolrIndex $search_api_opensolr_index
   *   The OpenSolr Index client.
   * @param \Drupal\key\KeyRepositoryInterface $key_repository
   *   The key repository service.
   */
  public function __construct(ConfigFactoryInterface $config_factory, OpenSolrIndex $search_api_opensolr_index, KeyRepositoryInterface $key_repository) {
    parent::__construct($config_factory);
    $this->searchApiOpensolrClient = $search_api_opensolr_index;
    $this->keyRepository = $key_repository;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('search_api_opensolr.client_index'),
      $container->get('key.repository')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'search_api_opensolr.opensolrconfig',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'opensolr_config_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('search_api_opensolr.opensolrconfig')->get('opensolr_credentials');

    $form['opensolr_credentials'] = [
      '#type' => 'details',
      '#title' => $this->t('Opensolr API Credentials'),
      '#tree' => TRUE,
      '#open' => TRUE,
    ];
    $form['opensolr_credentials']['email'] = [
      '#type' => 'email',
      '#title' => $this->t('Email'),
      '#default_value' => $config['email'] ?? '',
      '#required' => TRUE,
    ];
    $form['opensolr_credentials']['api_key'] = [
      '#type' => 'key_select',
      '#title' => $this->t('Secret key'),
      '#required' => TRUE,
      '#description' => $this->t('Also, the key has to belong to the <strong>authentication</strong> group'),
      '#key_filters' => ['type_group' => 'authentication'],
      '#default_value' => $config['api_key'] ?? '',
    ];

    $form = parent::buildForm($form, $form_state);
    $form['actions']['connection'] = [
      '#type' => 'submit',
      '#value' => $this->t('Test connection'),
      '#submit' => ['::testConnectionSubmit'],
    ];

    return $form;
  }

  /**
   * Submission handler to test the opensolr connection.
   */
  public function testConnectionSubmit(array &$form, FormStateInterface $form_state) {
    $credentials = $form_state->getValue('opensolr_credentials');
    $key = $this->keyRepository->getKey($credentials['api_key']);
    if ($key instanceof KeyInterface) {
      $credentials['api_key'] = $key->getKeyValue();
    }

    // Make a test call to the API to make sure that the credentials are
    // correct. We keep this here for now because of fallback to previous
    // development.
    try {
      $result = $this->searchApiOpensolrClient->getIndexList($credentials);

      if (isset($result['status']) && $result['status'] === FALSE) {
        $this->messenger()->addError($this->t('The OpenSolr test connection failed with the message <em>@message</em>. Please verify your credentials and try again.', [
          '@message' => $result['msg'] ?? '',
        ]));
      }
      else {
        // If we reached this point, it means that the test connection was
        // successful.
        $this->messenger()->addStatus($this->t('The test connection to OpenSolr services was successful.'));
      }
    }
    catch (OpenSolrException $exception) {
      $this->messenger()->addError($this->t('The OpenSolr test connection failed with the message <em>@message</em>. Please make sure that you have <strong>at least one index</strong> available before testing the connection.', [
        '@message' => $exception->getMessage(),
      ]));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    // Save the configuration.
    $this->config('search_api_opensolr.opensolrconfig')
      ->set('opensolr_credentials', $form_state->getValue('opensolr_credentials'))
      ->save();
  }

}
