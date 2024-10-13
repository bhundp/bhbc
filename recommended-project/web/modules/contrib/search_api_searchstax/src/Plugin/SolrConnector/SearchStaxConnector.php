<?php

namespace Drupal\search_api_searchstax\Plugin\SolrConnector;

use Drupal\Core\Form\FormStateInterface;
use Drupal\search_api_solr\Plugin\SolrConnector\StandardSolrConnector;
use Solarium\Core\Client\Endpoint;
use Solarium\Core\Client\Response;

/**
 * The SearchStaxConnector is a connector plugin for search_api_solr.
 *
 * @package Drupal\search_api_searchstax\Plugin\SolrConnector
 *
 * @SolrConnector(
 *   id = "searchstax",
 *   label = @Translation("SearchStax Cloud with Token Auth"),
 *   description = @Translation("Index items protected by token authentication for SearchStax.")
 * )
 */
class SearchStaxConnector extends StandardSolrConnector {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'scheme' => 'https',
      'host' => '',
      'port' => 443,
      'context' => '',
      'core' => '',
      'update_endpoint' => '',
      'update_token' => '',
    ] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['update_endpoint'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Endpoint'),
      '#description' => $this->t('Just copy &amp; paste the “Update endpoint” value of the SearchStax app / index as shown in your SearchStax account.'),
      '#default_value' => $this->configuration['update_endpoint'] ?? '',
      '#required' => TRUE,
    ];

    $form['update_token'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Read &amp; write token key'),
      '#description' => $this->t('Just copy &amp; paste the “Read & Write token key” value of the SearchStax app / index as shown in your SearchStax account.'),
      '#default_value' => $this->configuration['update_token'] ?? '',
      '#required' => TRUE,
    ];

    $form += parent::buildConfigurationForm($form, $form_state);

    $form['scheme'] = [
      '#type' => 'value',
      '#value' => 'https',
    ];

    $form['host'] = [
      '#type' => 'value',
      '#value' => '',
    ];

    $form['port'] = [
      '#type' => 'value',
      '#value' => '443',
    ];

    $form['path'] = [
      '#type' => 'value',
      '#value' => '/',
    ];

    $form['core'] = [
      '#type' => 'value',
      '#value' => '',
    ];

    $form['context'] = [
      '#type' => 'value',
      '#value' => '',
    ];

    $form['advanced']['jmx'] = [
      '#type' => 'value',
      '#value' => FALSE,
    ];

    $form['advanced']['solr_install_dir'] = [
      '#type' => 'value',
      '#value' => '',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $values['update_endpoint'] = trim($values['update_endpoint']);
    $form_state->setValue('update_endpoint', $values['update_endpoint']);
    $values['update_token'] = trim($values['update_token']);
    $form_state->setValue('update_token', $values['update_token']);

    if (preg_match('@https://([^/:]+)/([^/]+)/([^/]+)/(update|select)$@', $values['update_endpoint'], $matches)) {
      $form_state->setValue('host', $matches[1]);
      $form_state->setValue('context', $matches[2]);
      $form_state->setValue('core', $matches[3]);
    }
    else {
      $form_state->setErrorByName('update_endpoint', $this->t('Invalid endpoint format'));
    }

    if (empty($values['update_token'])) {
      $form_state->setErrorByName('update_token', $this->t('Invalid token format'));
    }
  }

  /**
   * {@inheritdoc}
   */
  protected function connect() {
    if (!$this->solr) {
      parent::connect();
      $this->solr->getEndpoint('search_api_solr')
        ->setAuthorizationToken('Token', $this->configuration['update_token']);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function pingServer() {
    return $this->pingCore();
  }

  /**
   * {@inheritdoc}
   */
  public function getServerInfo($reset = FALSE) {
    // @todo the required APIs to auto-detect the Solr version are blocked by
    //   SearchStax. So we have to hardcode a better minimal version number
    //   unless an API becomes available. That's better than falling back to
    //   6.0.0 which will result in the usage of deprecated field types in the
    //   config-set.
    return ['lucene' => ['solr-spec-version' => '8.11.1']];
  }

  /**
   * {@inheritdoc}
   */
  public function getSchemaVersionString($reset = FALSE) {
    static $version_string = NULL;

    if (!$version_string) {
      $version_string = 'drupal-0.0.0-solr-8.x';

      $this->connect();
      $query = $this->solr->createApi([
        'handler' => $this->configuration['core'] . '/schema',
      ]);

      if ($response = $this->execute($query)->getResponse()) {
        if ($body = json_decode($response->getBody(), TRUE)) {
          $version_string = $body['schema']['name'] ?? $version_string;
        }
      }
    }

    return $version_string;
  }

  /**
   * {@inheritdoc}
   */
  public function coreRestGet($path, ?Endpoint $endpoint = NULL) {
    return ['fieldTypes' => [['name' => 'Information about fieldTypes is not provided by SearchStax']]];
  }

  /**
   * {@inheritdoc}
   */
  public function reloadCore() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function getLuke() {
    return [
      'fields' => [],
      'index' => ['numDocs' => -1],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getStatsSummary() {
    $summary = [
      '@pending_docs' => 0,
      '@index_size' => 0,
      '@schema_version' => $this->getSchemaVersionString(),
    ];

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function getFile($file = NULL) {
    static $files = NULL;

    if (!$files) {
      $config_set_controller = \Drupal::service('search_api_solr.configset_controller');
      $files = $config_set_controller->getConfigFiles();
      foreach ($files as $name => $content) {
        $files[$name] = preg_replace('/"drupal-\d+\.\d+\.\d+[^"]+"/m', '"' . $this->getSchemaVersionString() . '"', $content);
      }
      ksort($files);
    }

    if (!$file) {
      return $files;
    }

    return new Response($files[$file]);
  }

  /**
   * {@inheritdoc}
   */
  public function alterConfigFiles(array &$files, string $lucene_match_version, string $server_id = '') {
    parent::alterConfigFiles($files, $lucene_match_version, $server_id);

    if (strpos($files['solrconfig.xml'], 'numVersionBuckets') === FALSE) {
      $files['solrconfig.xml'] = str_replace('</updateLog>', '<int name="numVersionBuckets">${solr.ulog.numVersionBuckets:65536}</int>' . "\n</updateLog>", $files['solrconfig.xml']);
    }
    $files['solrconfig.xml'] = str_replace('{solr.autoCommit.MaxTime:15000}', '{solr.autoCommit.MaxTime:600000}', $files['solrconfig.xml']);
    $files['solrconfig.xml'] = str_replace('{solr.autoSoftCommit.MaxTime:5000}', '{solr.autoSoftCommit.maxTime:300000}', $files['solrconfig.xml']);

    // Leverage the implicit Solr request handlers with default settings for
    // Solr Cloud.
    // @see https://lucene.apache.org/solr/guide/8_0/implicit-requesthandlers.html
    $files['solrconfig_extra.xml'] = preg_replace("@<requestHandler\s+name=\"/replication\".*?</requestHandler>@s", '', $files['solrconfig_extra.xml']);
    $files['solrconfig_extra.xml'] = preg_replace("@<requestHandler\s+name=\"/get\".*?</requestHandler>@s", '', $files['solrconfig_extra.xml']);

    // Set the StatsCache.
    // @see https://lucene.apache.org/solr/guide/8_0/distributed-requests.html#configuring-statscache-distributed-idf
    if (!empty($this->configuration['stats_cache'])) {
      $files['solrconfig_extra.xml'] .= '<statsCache class="' . $this->configuration['stats_cache'] . '" />' . "\n";
    }

    // solrcore.properties won’t work in SolrCloud mode (it is not read from
    // ZooKeeper). Therefore we go for a more specific fallback to keep the
    // possibility to set the property as parameter of the virtual machine.
    // @see https://lucene.apache.org/solr/guide/8_6/configuring-solrconfig-xml.html
    $files['solrconfig.xml'] = preg_replace('/solr.luceneMatchVersion:LUCENE_\d+/', 'solr.luceneMatchVersion:' . $this->getLuceneMatchVersion(), $files['solrconfig.xml']);
    unset($files['solrcore.properties']);
  }

}
