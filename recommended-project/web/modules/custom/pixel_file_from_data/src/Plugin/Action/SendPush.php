<?php

namespace Drupal\pixel_file_from_data\Plugin\Action;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Exception;
use Drupal\eca\Plugin\Action\ConfigurableActionBase;
use Drupal\eca\Plugin\Action\ActionBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Utility\Error;

/**
 * Sends a web push notification.
 *
 * @Action(
 *   id = "eca_send_push",
 *   label = @Translation("Push notifications"),
 *   description = @Translation("Sends a push notification"),
 * )
 */
class SendPush extends ConfigurableActionBase
{

	/**
	 * {@inheritdoc}
	 */
	public function defaultConfiguration(): array
	{
		return [
			'llave'    => '',
			'projectid'    => '',
			'usuario'    => NULL,
			'texto'    => NULL,
			'resultado'   => '',
		] + parent::defaultConfiguration();
	}

	/**
	 * {@inheritdoc}
	 */
	public function buildConfigurationForm(array $form, FormStateInterface $form_state): array
	{
		$form = parent::buildConfigurationForm($form, $form_state);

		$form['llave'] = [
			'#type'                => 'textfield',
			'#title'               => $this->t('Llave de Auth'),
			'#default_value'       => $this->configuration['llave'],
			'#description'         => $this->t('Auth Key.'),
			'#weight'              => -10,
			'#eca_token_reference' => true,
		];
		
		
		$form['projectid'] = [
			'#type'                => 'textfield',
			'#title'               => $this->t('Project ID'),
			'#default_value'       => $this->configuration['projectid'],
			'#description'         => $this->t('Project ID from platform.'),
			'#weight'              => -10,
			'#eca_token_reference' => true,
		];
		
		$form['usuario'] = [
			'#type'                => 'textfield',
			'#title'               => $this->t('Usuario ID'),
			'#default_value'       => $this->configuration['usuario'],
			'#description'         => $this->t('User to notify.'),
			'#weight'              => -10,
		];
		
		$form['texto'] = [
			'#type'                => 'textfield',
			'#title'               => $this->t('Mensaje'),
			'#default_value'       => $this->configuration['texto'],
			'#description'         => $this->t('Message to deliver.'),
			'#weight'              => -10,
		];

		$form['resultado'] = [
			'#type'                => 'textfield',
			'#title'               => $this->t('Resultado'),
			'#default_value'       => $this->configuration['resultado'],
			'#description'         => $this->t('Result token.'),
			'#weight'              => -9,
			'#eca_token_reference' => true,
		];

		return $form;
	}

	/**
	 * {@inheritdoc}
	 */
	public function submitConfigurationForm(array &$form, FormStateInterface $form_state): void
	{
		$this->configuration['projectid']    = $form_state->getValue('projectid');
		$this->configuration['usuario']    = $form_state->getValue('usuario');
		$this->configuration['texto']   = $form_state->getValue('texto');
		$this->configuration['llave']   = $form_state->getValue('llave');
		$this->configuration['resultado']  = $form_state->getValue('resultado');
		parent::submitConfigurationForm($form, $form_state);
	}

	/**
	 * {@inheritdoc}
	 */
	public function execute()
	{
		try {

			// 0. Define values from tokens
			$usuario  = (string) $this->tokenServices->replaceClear($this->configuration['usuario']);
			$texto  = (string) $this->tokenServices->replaceClear($this->configuration['texto']);
			$projectid = $this->configuration['projectid'];
			$llave = $this->configuration['llave'];
			
			
			// 1. Define headers
			$headers = array(
                'Authorization: Token token="' . $llave . '"',
                'Content-Type: application/json;charset=UTF-8',
                'Accept: application/json'
            );
			
			
			// 2. Get the users suscriptions.
			$endpoint = "https://pushpad.xyz/api/v1/projects/$projectid/subscriptions?uids[]=$usuario";
			$req = curl_init($endpoint);
            curl_setopt($req, CURLOPT_CUSTOMREQUEST, 'GET');
            curl_setopt($req, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($req, CURLOPT_HTTPHEADER, $headers);

            $res = curl_exec($req);
            
            $fid = "";
            $error = 0;
            if ($res === false) {
                $status_code = curl_getinfo($req, CURLINFO_HTTP_CODE);
                $fid = "1. No Curl connection on subscriptions: " . $status_code;
                $error++;
                curl_close($req);
            }else{
                $status_code = curl_getinfo($req, CURLINFO_HTTP_CODE);
                if ($status_code != '200') {
                    $fid = "2. No Curl Response on subscriptions: $status_code: $res";
                    $error++;
                }else{
                    $resp = json_decode($res, true);
                    if (empty($resp)) {
                        $fid = "3. Response is empty";
                        $error++;
                    }
                }
            }
			
			// 3. If the user has a suscription, it tries to send the push notification.
			if($error == 0) {
    			$endpoint = "https://pushpad.xyz/api/v1/projects/$projectid/notifications";
                $req = curl_init($endpoint);
                curl_setopt($req, CURLOPT_CUSTOMREQUEST, 'POST');
                $body = array(
                        'notification' => array(
                        'body' => $texto
                    )
                );
                $config = \Drupal::config('system.site');
                $body['notification']['title'] = $config->get('name');
                $body['uids'][0] = $usuario;
                $json = json_encode($body);
                curl_setopt($req, CURLOPT_POSTFIELDS, $json);
                curl_setopt($req, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($req, CURLOPT_HTTPHEADER, $headers);
    
                $res = curl_exec($req);
                
                if ($res === false) {
                    $status_code = curl_getinfo($req, CURLINFO_HTTP_CODE);
                    $fid = "4. No Curl connection on notifications: " . $status_code;
                    $error++;
                    curl_close($req);
                }else{
                    $status_code = curl_getinfo($req, CURLINFO_HTTP_CODE);
                    if ($status_code != '201') {
                        $fid = "5. No Curl Response on notifications: $status_code: $res";
                        $error++;
                    }else{
                        $resp = json_decode($res, true);
                        $fid = $resp["id"] . ":" . $resp["uids"][0];
                    }
                }
    			
			}
			
			// $fid = $usuario . "--" . $texto;

			$this->tokenServices->addTokenData($this->configuration['resultado'], $fid);
		} catch (Exception $e) {
			// @todo: Log exception details
			\Drupal::logger('pixel_file_from_data')->notice($e);
		}
	}

}
