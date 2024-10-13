<?php

namespace Drupal\search_api_opensolr\OpenSolrApi;

use Drupal\Component\Serialization\Json;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\key\KeyInterface;
use Drupal\key\KeyRepositoryInterface;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\RequestException;

/**
 * The core of the opensolr API calls.
 *
 * @package Drupal\search_api_opensolr\OpenSolrApi
 */
class OpenSolrBase {

  use StringTranslationTrait;

  const OPENSOLR_ENDPOINT_URL = 'https://opensolr.com/solr_manager/api';

  /**
   * GuzzleHttp client.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected $httpClient;

  /**
   * The OpenSolr API credentials as key valued array.
   *
   * @var array
   */
  protected $apiCredentials;

  /**
   * The JSON serializer service.
   *
   * @var \Drupal\Component\Serialization\Json
   */
  protected $json;

  /**
   * The key repository.
   *
   * @var \Drupal\key\KeyRepositoryInterface
   */
  protected $keyRepository;

  /**
   * The file URL generator.
   *
   * @var \Drupal\Core\File\FileUrlGeneratorInterface
   */
  protected $fileUrlGenerator;

  /**
   * Constructs a new OpenSolrBase object.
   *
   * @param \GuzzleHttp\ClientInterface $http_client
   *   The http client service.
   * @param \Drupal\Component\Serialization\Json $json
   *   The json service.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   * @param \Drupal\key\KeyRepositoryInterface $key_repository
   *   The key repository service.
   * @param \Drupal\Core\File\FileUrlGeneratorInterface $file_url_generator
   *   The file url generator service.
   */
  public function __construct(ClientInterface $http_client, Json $json, ConfigFactoryInterface $config_factory, KeyRepositoryInterface $key_repository, FileUrlGeneratorInterface $file_url_generator) {
    $this->httpClient = $http_client;
    $this->json = $json;
    $this->fileUrlGenerator = $file_url_generator;
    $this->apiCredentials = $config_factory->get('search_api_opensolr.opensolrconfig')->get('opensolr_credentials');
    $this->keyRepository = $key_repository;
    // Override with key credential if it exists.
    $key = $this->keyRepository->getKey($this->apiCredentials['api_key']);
    if ($key instanceof KeyInterface) {
      $this->apiCredentials['api_key'] = $key->getKeyValue();
    }
  }

  /**
   * General api call method.
   *
   * @param string $path
   *   The path of the api endpoint.
   * @param string $method
   *   The HTTP method. E.g. GET, POST, etc.
   * @param array $params
   *   An array of params to add to the request.
   * @param bool $returnObject
   *   A boolean indicating if we want the object as response or not.
   * @param bool $useMultipart
   *   A boolean indicating if we use multipart arguments or not.
   *
   * @return \Drupal\search_api_opensolr\OpenSolrApi\OpenSolrResponse|mixed|\Psr\Http\Message\ResponseInterface|null
   *   Returns the response from the API.
   *
   * @throws \GuzzleHttp\Exception\GuzzleException
   */
  protected function apiCall($path, $method = 'GET', array $params = [], $returnObject = FALSE, $useMultipart = FALSE) {
    $options = [];
    // Add API credentials.
    $params = array_merge($this->apiCredentials, $params);
    if ($useMultipart == FALSE) {
      // Add necessary headers.
      $headers = [
        'Content-type' => 'application/json',
      ];
      $data = !empty($params) ? $this->json->encode($params) : NULL;
      // Build the request, including path and headers. Internal use.
      $options['headers'] = $headers;
      $options['body'] = $data;
    }
    else {
      $this->attachMultipart($options, $params);
    }
    $url = self::OPENSOLR_ENDPOINT_URL . $path;
    if ($method == 'GET' && !empty($params)) {
      $url .= '?' . UrlHelper::buildQuery($params);
    }
    try {
      $response = new OpenSolrResponse($this->httpClient->request($method, $url, $options));
      if ($returnObject) {
        return $response;
      }
      else {
        return $response->__get('data');
      }
    }
    catch (RequestException $e) {
      // RequestException gets thrown for any response status.
      $response = $e->getResponse();
      if (!isset($response) || !$response) {
        throw new OpenSolrException($response, $e->getMessage(), $e->getCode(), $e);
      }
    }

  }

  /**
   * Attaches the multipart values for requests that send files.
   *
   * @param array $options
   *   An array with the extra options for the API request.
   * @param array $params
   *   An array of params to add to the request.
   */
  protected function attachMultipart(array &$options, array $params) {
    $multipart = [];
    foreach ($params as $key => $value) {
      // If it's a file, we need to add the filename and create a url for it.
      if (file_exists($value)) {
        $multipart[] = [
          'name' => $key,
          'contents' => file_get_contents($this->fileUrlGenerator->generateAbsoluteString($value)),
          'filename' => substr($value, strrpos($value, '/') + 1),
        ];
      }
      else {
        $multipart[] = [
          'name' => $key,
          'contents' => $value,
        ];
      }
    }
    $options['multipart'] = $multipart;
    $options['decode_content'] = FALSE;
  }

}
