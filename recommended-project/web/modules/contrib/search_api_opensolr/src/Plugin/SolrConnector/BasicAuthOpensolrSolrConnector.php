<?php

namespace Drupal\search_api_opensolr\Plugin\SolrConnector;

use Drupal\search_api_solr\SolrConnector\BasicAuthTrait;

/**
 * OpenSolr connector.
 *
 * @SolrConnector(
 *   id = "basic_auth_opensolr",
 *   label = @Translation("Opensolr with Basic Auth (recommended)"),
 *   description = @Translation("A connector usable for Solr installations managed through opensolr that uses basic auth.")
 * )
 */
class BasicAuthOpensolrSolrConnector extends OpensolrSolrConnector {

  use BasicAuthTrait;

}
