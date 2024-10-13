<?php

namespace Drupal\azure_mailer\Plugin\Mail;

use Drupal\Component\Render\MarkupInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Mail\MailInterface;
use Drupal\Core\Messenger\MessengerTrait;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Request;
use Mobomo\AzureHmacAuth\AzureHMACMiddleware;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * A Drupal mail backend to support Azure Communication Services.
 *
 * @Mail(
 *   id = "azure_mailer",
 *   label = @Translation("Azure Communication Service"),
 *   description = @Translation("Sends emails through the Azure Communication
 *   Service")
 * )
 */
class AzureMailer implements MailInterface, ContainerFactoryPluginInterface {

  use MessengerTrait;

  /**
   * Constructor.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $configFactory
   *   The config factory service.
   */
  public function __construct(array $configuration, string $plugin_id, mixed $plugin_definition, protected ConfigFactoryInterface $configFactory) {
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): static {
    // @phpstan-ignore-next-line
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('config.factory'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function format(array $message): array {
    return $message;
  }

  /**
   * {@inheritdoc}
   */
  public function mail(array $message): bool {
    $config = $this->configFactory->get('azure_mailer.settings');
    $endpoint = $config->get('endpoint');
    $secret = $config->get('secret');

    $azureMessage = [
      'recipients' => [
        'to' => [
          [
            'address' => $message['to'],
          ],
        ],
      ],
      'senderAddress' => $message['from'],
      'headers' => $message['headers'],
      'replyTo' => [
        [
          'address' => $message['reply-to'] ?? $message['from'],
        ],
      ],
    ];

    if ($message['body'] instanceof MarkupInterface) {
      $azureMessage['content'] = [
        'html' => $message['body'],
        'plainText' => strip_tags($message['body']),
        'subject' => $message['subject'],
      ];
    }
    else {
      $azureMessage['content'] = [
        'html' => '<html><head><title>' . $message['subject'] . '</title></head><body>' . str_replace("\n", "\n<br/>", $message['body'][0]) . '</body></html>',
        'plainText' => $message['body'][0],
        'subject' => $message['subject'],
      ];
    }

    $serializedBody = json_encode($azureMessage);

    $azureHMACMiddleware = new AzureHMACMiddleware($secret);

    $handlerStack = HandlerStack::create();
    $handlerStack->push($azureHMACMiddleware, 'hmac-auth');

    try {
      $client = new Client([
        'handler' => $handlerStack,
      ]);
      $requestMessage = new Request(
        'POST',
        'https://' . $endpoint . '/emails:send?api-version=2023-03-31',
        [
          'Content-Type' => 'application/json',
        ],
        $serializedBody
      );

      $client->send($requestMessage);
    }
    catch (GuzzleException $e) {
      // $this->messenger->addError('Azure Communication Services error: ' . $e->getMessage());
      return FALSE;
    }
    return TRUE;
  }

}
