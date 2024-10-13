<?php

namespace Drupal\search_api_opensolr\OpenSolrApi;

use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Psr\Http\Message\ResponseInterface;

/**
 * Class RestException.
 *
 * @package Drupal\search_api_opensolr\OpenSolrApi
 */
class OpenSolrException extends \RuntimeException implements ExceptionInterface {

  /**
   * The opensolr response.
   *
   * @var \Psr\Http\Message\ResponseInterface|null
   */
  protected $response;

  /**
   * RestException constructor.
   *
   * @param \Psr\Http\Message\ResponseInterface|null $response
   *   The request response object.
   * @param string $message
   *   A string with the message(s).
   * @param int $code
   *   The code.
   * @param \Exception|null $previous
   *   Previous Exception if any.
   */
  public function __construct(ResponseInterface $response = NULL, $message = "", $code = 0, \Exception $previous = NULL) {
    $this->response = $response;
    $message .= $this->getResponseBody();
    parent::__construct($message, $code, $previous);
  }

  /**
   * Gets the response.
   *
   * @return null|\Psr\Http\Message\ResponseInterface
   *   An Response object if any, null otherwise.
   */
  public function getResponse() {
    return $this->response;
  }

  /**
   * Gets the response body.
   *
   * @return string|null
   *   The body of the response if any.
   */
  public function getResponseBody() {
    if (!$this->response) {
      return NULL;
    }
    $body = $this->response->getBody();
    if ($body) {
      return $body->getContents();
    }
    return '';
  }

}
