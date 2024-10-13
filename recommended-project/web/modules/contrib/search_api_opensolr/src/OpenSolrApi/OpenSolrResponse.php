<?php

namespace Drupal\search_api_opensolr\OpenSolrApi;

use Drupal\Component\Serialization\Json;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use GuzzleHttp\Psr7\Response;

/**
 * Class RestResponse.
 *
 * @package Drupal\search_api_opensolr\OpenSolrApi
 */
class OpenSolrResponse extends Response {
  use StringTranslationTrait;

  /**
   * The original Response used to build this object.
   *
   * @var \GuzzleHttp\Psr7\Response
   * @see __get()
   */
  protected $response;

  /**
   * The json-decoded response body.
   *
   * @var mixed
   * @see __get()
   */
  protected $data;

  /**
   * {@inheritdoc}
   *
   * @throws \Drupal\search_api_opensolr\OpenSolrApi\OpenSolrException
   *   If body cannot be json-decoded.
   */
  public function __construct(Response $response) {
    $this->response = $response;
    parent::__construct($response->getStatusCode(), $response->getHeaders(), $response->getBody(), $response->getProtocolVersion(), $response->getReasonPhrase());
    $this->handleJsonResponse();
  }

  /**
   * Magic getter method to return the given property.
   *
   * @param string $key
   *   A string representing the key name from the response object.
   *
   * @return mixed
   *   Returns the value of the associated key, otherwise it throws an
   *   exception.
   *
   * @throws \Exception
   *   Ff $key is not a property.
   */
  public function __get($key) {
    if (!property_exists($this, $key)) {
      throw new \Exception("Undefined property $key");
    }
    return $this->$key;
  }

  /**
   * Helper function to eliminate repetitive json parsing.
   *
   * @return $this
   *
   * @throws \Drupal\search_api_opensolr\OpenSolrApi\OpenSolrException
   */
  private function handleJsonResponse() {
    $this->data = '';
    $response_body = $this->getBody()->getContents();
    if (empty($response_body)) {
      return NULL;
    }

    // Allow any exceptions here to bubble up:
    try {
      $data = Json::decode($response_body);
    }
    catch (\Exception $e) {
      throw new OpenSolrException($this, $e->getMessage(), $e->getCode(), $e);
    }

    if (empty($data)) {
      throw new OpenSolrException($this, 'Invalid response');
    }

    if (!empty($data['error'])) {
      throw new OpenSolrException($this, $data['error']);
    }

    if (!empty($data['error'])) {
      throw new OpenSolrException($this, $data['error']);
    }

    if (!empty($data['errorCode'])) {
      throw new OpenSolrException($this, $data['errorCode']);
    }
    $this->data = $data;
    return $this;
  }

  /**
   * Returns request status.
   *
   * @return bool
   *   If the request was successful returns TRUE, FALSE otherwise.
   */
  public function isSuccess() {
    return isset($this->data['status']) && $this->data['status'] === TRUE;
  }

  /**
   * Retrieves full response data.
   *
   * @return mixed
   *   Returns the response data from this object.
   */
  public function getFullResponseData() {
    return $this->data;
  }

  /**
   * Retrieves a part of data by key.
   *
   * @param string $key
   *   A valid response data key.
   *
   * @return mixed|null
   *   Returns data if it exists, NULL otherwise.
   */
  public function getResponseData($key = 'msg') {
    return $this->data[$key] ?? NULL;
  }

}
