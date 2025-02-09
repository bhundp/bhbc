<?php

namespace Drupal\pixel_file_from_data\Plugin\Action;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Exception;
use Drupal\file\Entity\File;
use Drupal\eca\Plugin\Action\ConfigurableActionBase;
use Drupal\eca\Plugin\Action\ActionBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\File\FileExists;

/**
 * Saves a file from string data.
 *
 * @Action(
 *   id = "eca_save_file_data",
 *   label = @Translation("File: save (from base64)"),
 *   description = @Translation("Saves a new file from a base64 encoded string."),
 * )
 */
class SaveFileFromData extends ConfigurableActionBase
{
	/**
	 * The file system service.
	 *
	 * @var \Drupal\Core\File\FileSystemInterface
	 */
	protected $fileSystem;

	/**
	 * Replace file
	 */
	const REPLACE_FILE = 1;

	/*
	 * Rename file
	 */
	const RENAME_FILE  = 2;

	/**
	 * {@inheritdoc}
	 */
	public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): ActionBase
	{
		$instance             = parent::create($container, $configuration, $plugin_id, $plugin_definition);
		$instance->fileSystem = $container->get('file_system');

		return $instance;
	}

	/**
	 * {@inheritdoc}
	 */
	public function defaultConfiguration(): array
	{
		return [
			'token_input'    => '',
			'token_result'   => '',
			'stream_wrapper' => 'public://',
			'directory'      => '',
			'filename'       => '',
			// 'extension'      => '',
			'replace' => self::REPLACE_FILE,
		] + parent::defaultConfiguration();
	}

	/**
	 * {@inheritdoc}
	 */
	public function buildConfigurationForm(array $form, FormStateInterface $form_state): array
	{
		$form = parent::buildConfigurationForm($form, $form_state);

		$form['token_input'] = [
			'#type'                => 'textfield',
			'#title'               => $this->t('Token input'),
			'#default_value'       => $this->configuration['token_input'],
			'#description'         => $this->t('The base64 encoded string to save as a file in Drupal.'),
			'#weight'              => -10,
			'#eca_token_reference' => true,
		];

		$form['token_result'] = [
			'#type'                => 'textfield',
			'#title'               => $this->t('Token result'),
			'#default_value'       => $this->configuration['token_result'],
			'#description'         => $this->t('The file ID of the result will be stored in this token for future steps.'),
			'#weight'              => -9,
			'#eca_token_reference' => true,
		];

		$streams = [
			'public://' => $this->t('Public'),
		];

		if (\Drupal::hasService('stream_wrapper.private')) {
			$streams['private://'] = $this->t('Private');
		}

		$form['stream_wrapper'] = [
			'#type'          => 'select',
			'#title'         => $this->t('Public or private storage'),
			'#options'       => $streams,
			'#default_value' => $this->configuration['stream_wrapper'],
			'#required'      => true,
			'#description'   => $this->t('Store the file in either the public or private file system. To use private files, Drupal must be set up first to store files in the private:// directory.'),
		];

		$form['directory'] = [
			'#type'          => 'textfield',
			'#title'         => $this->t('Directory/path'),
			'#default_value' => $this->configuration['directory'],
			'#required'      => true,
			'#description'   => $this->t('Where would you like to save this file in the file system? Leave blank to use the base path.'),
		];

		$form['filename'] = [
			'#type'          => 'textfield',
			'#title'         => $this->t('File name'),
			'#default_value' => $this->configuration['filename'],
			'#required'      => true,
			'#description'   => $this->t('What would you like the filename to be? Do not use spaces. Example: my_file_name.'),
		];

		// $form['extension'] = [
		// 	'#type'          => 'textfield',
		// 	'#title'         => $this->t('File extension'),
		// 	'#default_value' => $this->configuration['extension'],
		// 	'#required'      => true,
		// 	'#description'   => $this->t('What will the file extension of this file be? Do not use a leading dot. Example: mp3.'),
		// ];

		$form['replace'] = [
			'#type'    => 'select',
			'#title'   => $this->t('Handle existing file behavior'),
			'#options' => [
				self::REPLACE_FILE => $this->t('Replace'),
				self::RENAME_FILE  => $this->t('Rename'),
			],
			'#default_value' => $this->configuration['replace'],
			'#required'      => true,
			'#description'   => $this->t('How to handle if a file already exists by the name above'),
		];

		return $form;
	}

	/**
	 * {@inheritdoc}
	 */
	public function submitConfigurationForm(array &$form, FormStateInterface $form_state): void
	{
		$this->configuration['token_input']    = $form_state->getValue('token_input');
		$this->configuration['token_result']   = $form_state->getValue('token_result');
		$this->configuration['stream_wrapper'] = $form_state->getValue('stream_wrapper');
		$this->configuration['directory']      = $form_state->getValue('directory');
		$this->configuration['filename']       = $form_state->getValue('filename');
		$this->configuration['file_handling']  = $form_state->getValue('file_handling');
		parent::submitConfigurationForm($form, $form_state);
	}

	/**
	 * {@inheritdoc}
	 */
	public function execute()
	{
		try {
			$stream = $this->tokenServices->getTokenData($this->configuration['token_input']);
			if(empty($stream)) {
				throw new Exception('Empty stream');
			}

			$base64_string = $stream->getValue(); // Esta última acción difiere del elemento en desarrollo

			if(empty($base64_string)) {
				throw new Exception('Empty stream');
			}

			// Data
			$data = explode(';base64,', $base64_string);

			if(count($data) != 2) {
				throw new Exception('Empty stream');
			}

			// Extension
			$type = explode('/', $data[0]);
			if(count($type) != 2) {
				throw new Exception("Can't get file type");
			}
			$file_extension = $type[1];

			// Configuration
			$stream_wrapper = $this->configuration['stream_wrapper'];
			$directory      = $this->configuration['directory'];
			$filename       = $this->configuration['filename'];
			$replace        = ($this->configuration['file_handling'] == self::RENAME_FILE) ? FileExists::Rename : FileExists::Replace;
			$destination    = $stream_wrapper . $directory;

			$this->fileSystem->prepareDirectory($destination);

			$filename = $filename . '.' . $file_extension;
			$file_uri = $this->fileSystem->saveData(base64_decode($data[1]), $destination . '/' . $filename, $replace);
			$file     = File::create(['uri' => $file_uri]);
			$file->setOwnerId($this->currentUser->id());
			$file->setPermanent();
			$file->save();
			$fields = $file->getFields();
			$fid    = $fields['fid'][0]->getString();

			$this->tokenServices->addTokenData($this->configuration['token_result'], $fid);
		} catch (Exception $e) {
			// @todo: Log exception details
			$this->tokenServices->addTokenData($this->configuration['token_result'], false);
		}
	}

}
