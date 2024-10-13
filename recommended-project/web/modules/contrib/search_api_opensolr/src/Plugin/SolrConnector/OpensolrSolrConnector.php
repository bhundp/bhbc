<?php

namespace Drupal\search_api_opensolr\Plugin\SolrConnector;

use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;
use Drupal\search_api_opensolr\OpenSolrApi\OpenSolrException;
use Drupal\search_api_solr\Plugin\SolrConnector\StandardSolrConnector;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * OpenSolr connector.
 *
 * @SolrConnector(
 *   id = "opensolr",
 *   label = @Translation("Opensolr (deprecated)"),
 *   description = @Translation("A connector usable for Solr installations managed through opensolr.")
 * )
 */
class OpensolrSolrConnector extends StandardSolrConnector {

  /**
   * A connection to the Solr server.
   *
   * @var \Drupal\search_api_opensolr\OpenSolrApi\Components\OpenSolrIndex
   */
  protected $openSolrIndex;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    $plugin = parent::create($container, $configuration, $plugin_id, $plugin_definition);

    $plugin->openSolrIndex = $container->get('search_api_opensolr.client_index');

    return $plugin;
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    // First, check if we have a valid OpenSolr connection.
    try {
      $options = $this->openSolrIndex->getIndexList();
    }
    catch (OpenSolrException $exception) {
      $this->messenger()->addError($this->t('Failed to retrieve opensolr indexes (<em>@message</em>). Please make sure that you have <strong>at least one index</strong> available in opensolr before creating a server.', [
        '@message' => $exception->getMessage(),
      ]));
      return $form;
    }

    if (isset($options['status']) && $options['status'] === FALSE) {
      $linkToSettingsPage = Link::createFromRoute($this->t('here'), 'search_api_opensolr.opensolr_config_form')->toString()->getGeneratedLink();
      $this->messenger()->addError($this->t('The connection to OpenSolr services could not be established. Please check your settings @here.', [
        '@here' => new FormattableMarkup($linkToSettingsPage, []),
      ]));
    }
    else {
      $form['opensolr'] = [
        '#type' => 'details',
        '#title' => $this->t('OpenSolr'),
        '#open' => TRUE,
        '#weight' => -10,
      ];
      $form['opensolr']['index'] = [
        '#type' => 'select',
        '#title' => $this->t('Select your core'),
        '#description' => $this->t('If you do not have any indexes available, please visit your account at opensolr.com and create one'),
        '#options' => $options,
        '#empty_option' => $this->t('-- Select --'),
        '#empty_value' => NULL,
        '#required' => TRUE,
        '#default_value' => $this->configuration['opensolr']['index'] ?? '_none',
      ];
      $form['opensolr']['index_type'] = [
        '#type' => 'hidden',
      ];
      // Add the parent form items and hide the ones that are set by OpenSolr.
      $form = parent::buildConfigurationForm($form, $form_state);
      foreach ($this->getOpenSolrConfigs() as $configName) {
        $form[$configName]['#access'] = FALSE;
      }
    }

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    if (!isset($values['opensolr'])) {
      // @todo Add the name of the element.
      $form_state->setErrorByName('', $this->t('Something went wrong. Please check your opensolr settings.'));
    }
    elseif (!empty($values['opensolr']['index'])) {
      $index = $values['opensolr']['index'];
      $this->setOpenSolrDefaultValues($index, $form_state);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getServerInfo($reset = FALSE) {
    // We want to call CORE_NAME/admin/system instead of admin/info/system when
    // getting the server information due to access restrictions.
    return $this->getCoreInfo($reset);
  }

  /**
   * Sets default values for solr configs that are managed by OpenSolr.
   */
  protected function setOpenSolrDefaultValues($index, FormStateInterface $form_state) {
    $indexInfo = $this->openSolrIndex->getCoreInfo($index);

    // Set the index type on the server.
    $opensolrValue = $form_state->getValue('opensolr');
    $opensolrValue['index_type'] = $indexInfo['info']['type'];
    $form_state->setValue('opensolr', $opensolrValue);

    if (!empty($indexInfo['info']['connection_url'])) {
      $solrUrl = parse_url($indexInfo['info']['connection_url']);
      $openSolrConfigs = $this->getOpenSolrConfigs();
      foreach ($openSolrConfigs as $configName) {
        switch ($configName) {
          case 'port':
            $value = $solrUrl['scheme'] === 'https' ? 443 : 80;
            break;

          case 'core':
            $value = str_replace('/solr/', '', $solrUrl['path']);
            break;

          case 'path':
            $value = '/';
            break;

          default:
            $value = $solrUrl[$configName];
            break;
        }
        $form_state->setValue($configName, $value);
      }
    }
    else {
      // @todo Add the name of the element.
      $form_state->setErrorByName('', $this->t('Could not set the default values for the selected index.'));
    }
  }

  /**
   * Gets the keys of the form items that should be managed by OpenSolr.
   */
  protected function getOpenSolrConfigs() {
    return [
      'scheme',
      'host',
      'port',
      'core',
      'path',
    ];
  }

}
