<?php

namespace Drupal\pixel_azure_openai;

use stdClass;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Client as GuzzleClient;
use Exception;
use Drupal\siigo_localities\LocalityResolver;
use Drupal\commerce_stock\StockTransactionsInterface;
use Drupal\commerce_stock\StockServiceManager;
use Drupal\commerce_shipping\Entity\ShippingMethod;
use Drupal\commerce_shipping\Entity\Shipment;
use Drupal\commerce_product_tax\Resolver\TaxRateResolver;
use Drupal\commerce_product\Entity\ProductVariation;
use Drupal\commerce_product\Entity\ProductInterface;
use Drupal\commerce_price\Price;
use Drupal\commerce_order\Entity\Order;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Session\AccountProxy;
use Drupal\Core\Logger\LoggerChannelFactory;
use Drupal\Core\Datetime\DateFormatter;
use Drupal\Core\Config\ConfigFactory;
use Drupal\Component\Datetime\Time;
use Drupal;

/**
 * Class AzureOpenAi
 * @package Drupal\pixel_azure_openai
 */
class AzureOpenAi
{
	use StringTranslationTrait;

	public const ERROR_TIMEOUT = 28;

	protected $configFactory;
	protected $httpClient;
	protected $loggerFactory;
	protected $azure_url;

	/**
	 * AzureOpenAI constructor.
	 *
	 * @param ConfigFactory $configFactory
	 * @param GuzzleClient $httpClientFactory
	 * @param LoggerChannelFactory $loggerFactory
	 * @param TranslationInterface $string_translation
	 */
	public function __construct(
		ConfigFactory $configFactory,
		GuzzleClient $httpClientFactory,
		LoggerChannelFactory $loggerFactory,
		TranslationInterface $string_translation
	) {
		$this->configFactory     = $configFactory;
		$this->loggerFactory     = $loggerFactory;
		$this->httpClient        = $httpClientFactory;
		$this->stringTranslation = $string_translation;
	}

	/*
	 * Enviar mensajes al chat.
	 *
	 * @return array
	 */
	public function chat($messages)
	{
		$config           = $this->configFactory->get('pixel_azure.admin_settings');
		$perfil           = $config->get('profile');
		$message_document = $config->get('message_document');

		$url = sprintf(
			'https://%s.openai.azure.com/openai/deployments/%s/chat/completions?api-version=%s',
			$config->get('resource'),
			$config->get('deployment'),
			$config->get('api_version')
		);

		$headers = [
			'Content-Type' => 'application/json',
			'api-key'      => $config->get('resource_key'),
		];

		// Mensajes
		array_unshift(
			$messages,
			[
				'role'    => 'system',
				'content' => $perfil,
			]
		);

		// Formato de mensajes de documento
		$messages = array_map(function ($value) use ($message_document) {
			if($value['role'] == 'document') {
				return [
					'role'    => 'user',
					'content' => sprintf($message_document, $value['content']),
				];
			}

			return $value;
		}, $messages);

		$args = [
			'data_sources' => [
				[
					'type'       => 'azure_search',
					'parameters' => [
						'endpoint'               => $config->get('search_endpoint'),
						'index_name'             => $config->get('search_index'),
						'semantic_configuration' => 'default',
						'query_type'             => 'simple',
						'fields_mapping'         => [
							'title_field' => 'metadata_storage_name',
							'url_field'   => 'url_field',
						],
						'in_scope'         => true, // Solo buscar ne los documentos de la biblioteca
						'role_information' => $perfil,
						'filter'           => null,
						'strictness'       => 3,
						'top_n_documents'  => 2,
						'authentication'   => [
							'type' => 'api_key',
							'key'  => $config->get('search_key'),
						],
					],
				],
			],
			'messages'    => $messages,
			'deployment'  => $config->get('deployment'),
			'temperature' => 0,
			'top_p'       => 1,
			'max_tokens'  => 600,
			'stop'        => null,
			'stream'      => false,
		];

		$json = str_replace('[]', '{}', json_encode($args));

		$options = [
			'headers' => $headers,
			'verify'  => true,
			'body'    => $json,
			'timeout' => 60,
		];

		$request = $this->httpClient->request('POST', $url, $options);

		$response = json_decode($request->getBody()->getContents(), true);

		return $response;
	}

	/*
	 * Enviar mensajes al chat.
	 *
	 * @return array
	 */
	public function format($messages, $step)
	{
		$config = $this->configFactory->get('pixel_azure.admin_settings');
		$perfil = $config->get('profile_format');
		$format = $config->get('format_format');
		$order  = $config->get('order_format');
		$step1  = $config->get('step1_format');
		$step2  = $config->get('step2_format');
		$step3  = $config->get('step3_format');

		// Consulta según el paso
		$step_query = $step1;
		if($step == 2) {
			$step_query = $step2;
		} elseif($step == 3) {
			$step_query = $step3;
		}

		// Mensajes
		if(!is_array($messages)) {
			$messages[] = $messages;
		}

		$url = sprintf(
			'https://%s.openai.azure.com/openai/deployments/%s/chat/completions?api-version=%s',
			$config->get('resource'),
			$config->get('deployment'),
			$config->get('api_version')
		);

		$headers = [
			'Content-Type' => 'application/json',
			'api-key'      => $config->get('resource_key'),
		];

		$chat = [
			[
				'role'    => 'system',
				'content' => $perfil,
			],
			[
				'role'    => 'system',
				'content' => $format,
			],
			[
				'role'    => 'user',
				'content' => $step_query,
			],
		];

		foreach($messages as $message) {
			$chat[] = [
				'role'    => 'user',
				'content' => $message,
			];
		}

		if(strlen(trim($order)) > 0) {
			$chat[] = [
				'role'    => 'user',
				'content' => $order,
			];
		}

		$args = [
			'messages'    => $chat,
			'temperature' => 0,
			'top_p'       => 1,
			'max_tokens'  => 600,
			'stop'        => null,
			'stream'      => false,
		];

		$json = str_replace('[]', '{}', json_encode($args));

		$options = [
			'headers' => $headers,
			'verify'  => true,
			'body'    => $json,
			'timeout' => 60,
		];

		$request = $this->httpClient->request('POST', $url, $options);

		$response = json_decode($request->getBody()->getContents(), true);

		$lista = $response['choices'][0]['message']['content'];
		preg_match_all('/\[[^[]*\]/', $lista, $groups);

		$items = [];
		foreach($groups[0] as $group) {
			$json = json_decode($group);
			if(!empty($json)) {
				$items = array_merge($items, $json);
			}
		}

		sort($items);
		$items = array_unique($items);
		$items = array_values($items);

		return $items;
	}

	/*
	 * Mejorar la escritura d eun texto.
	 *
	 * @return array
	 */
	public function varnish($text)
	{
		$config = $this->configFactory->get('pixel_azure.admin_settings');
		$perfil = $config->get('profile_varnish');
		$query  = $config->get('message_varnish');

		$url = sprintf(
			'https://%s.openai.azure.com/openai/deployments/%s/chat/completions?api-version=%s',
			$config->get('resource'),
			$config->get('deployment'),
			$config->get('api_version')
		);

		$headers = [
			'Content-Type' => 'application/json',
			'api-key'      => $config->get('resource_key'),
		];

		$message = sprintf($query, $text);

		// Mensajes
		$messages = [
			[
				'role'    => 'system',
				'content' => $perfil,
			],
			[
				'role'    => 'user',
				'content' => $message
			],
		];

		$args = [
			'messages'    => $messages,
			'temperature' => 0,
			'top_p'       => 1,
			'max_tokens'  => 600,
			'stop'        => null,
			'stream'      => false,
		];

		$json = str_replace('[]', '{}', json_encode($args));

		$options = [
			'headers' => $headers,
			'verify'  => true,
			'body'    => $json,
			'timeout' => 60,
		];

		$request = $this->httpClient->request('POST', $url, $options);

		$response = json_decode($request->getBody()->getContents(), true);

		return $response;
	}
}
