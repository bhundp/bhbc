<?php

namespace Drupal\search_api_opensolr;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\search_api\ServerInterface;
use Drupal\search_api_opensolr\Services\ZipManager;
use Drupal\search_api_opensolr\Traits\OpensolrServerTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Defines a class for reacting to server events.
 *
 * @internal
 */
class ServerOperations implements ContainerInjectionInterface {
  use OpensolrServerTrait;

  /**
   * The opensolr zip manager service.
   *
   * @var \Drupal\search_api_opensolr\Services\ZipManager
   */
  protected $zipManager;

  /**
   * The messenger service.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * Constructs a new EntityOperations object.
   *
   * @param \Drupal\search_api_opensolr\Services\ZipManager $zipManager
   *   The opensolr zip manager service.
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger service.
   */
  public function __construct(ZipManager $zipManager, MessengerInterface $messenger) {
    $this->zipManager = $zipManager;
    $this->messenger = $messenger;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('search_api_opensolr.zip_manager'),
      $container->get('messenger')
    );
  }

  /**
   * Reacts on server insert events.
   *
   * @param \Drupal\search_api\ServerInterface $server
   *   The newly created server.
   *
   * @throws \Drupal\search_api\SearchApiException
   *
   * @see hook_entity_insert()
   */
  public function serverInsert(ServerInterface $server) {
    if ($this->isOpenSolrServer($server)) {
      $indexType = $this->getServerIndexType($server);
      if ($indexType < 0) {
        $this->zipManager->importConfigZip($server);
      }
      else {
        $this->messenger->addWarning('Please make sure to manually upload the config zip to opensolr as the automatic upload is temporarily disabled for clusters.');
      }
    }
  }

}
