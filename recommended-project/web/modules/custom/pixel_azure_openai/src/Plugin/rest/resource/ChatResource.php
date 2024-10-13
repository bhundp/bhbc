<?php

namespace Drupal\pixel_azure_openai\Plugin\rest\resource;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\KeyValueStore\KeyValueFactoryInterface;
use Drupal;

/**
 * Represents AzureOpenAI records as resources.
 *
 * @RestResource (
 *   id = "pixel_azure_chat",
 *   label = @Translation("AzureOpenAI"),
 *   uri_paths = {
 *     "canonical" = "/api/pixel-azure/chat",
 *     "create" = "/api/pixel-azure/chat"
 *   }
 * )
 *
 * @see \Drupal\rest\Plugin\rest\resource\EntityResource
 */
class ChatResource extends ResourceBase
{
	/**
	 * A current user instance which is logged in the session.
	 * @var \Drupal\Core\Session\AccountProxyInterface
	 */
	protected $loggedUser;

	/**
	 * {@inheritdoc}
	 */
	public function __construct(
		array $config,
		$module_id,
		$module_definition,
		array $serializer_formats,
		LoggerInterface $logger,
		AccountProxyInterface $current_user
	) {
		parent::__construct($config, $module_id, $module_definition, $serializer_formats, $logger);
		$this->loggedUser = $current_user;

	}

	/**
	 * {@inheritdoc}
	 */
	public static function create(ContainerInterface $container, array $config, $module_id, $module_definition)
	{
		return new static(
			$config,
			$module_id,
			$module_definition,
			$container->getParameter('serializer.formats'),
			$container->get('logger.factory')->get('sample_rest_resource'),
			$container->get('current_user')
		);
	}

	/**
	 * Responds to POST requests and saves the new record.
	 *
	 * @param array $data
	 *   Data to write into the database.
	 *
	 * @return \Drupal\rest\ModifiedResourceResponse
	 *   The HTTP response object.
	 */
	public function post(Request $request)
	{
		$data = json_decode($request->getContent(), true);

		$azure_api = Drupal::service('pixel_azure_openai.azure_api');

		if (!$this->loggedUser->hasPermission('access content')) {
			throw new AccessDeniedHttpException();
		}

		$chat = $data['chat'];
		$answer = $azure_api->chat($chat);

		return new ResourceResponse($answer);

	}

	/*
	 * {@inheritdoc}
	 */
	public function permissions()
	{
		$permissions = [];
		$definition  = $this->getPluginDefinition();
		foreach ($this->availableMethods() as $method) {
			$lowered_method                                             = strtolower($method);
			$permissions["restful {$lowered_method} {$this->pluginId}"] = [
				'title' => $this->t('Access @method on %label resource', [
					'@method' => $method,
					'%label'  => $definition['label'],
				]),
			];
		}

		return $permissions;

	}
}
