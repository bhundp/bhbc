<?php

namespace Drupal\pixel_file_from_data\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Define the "media capture field type".
 *
 * @FieldType(
 *   id = "media_capture_field_type",
 *   label = @Translation("Media Capture Field"),
 *   description = @Translation("Desc for Media Capture Field Type"),
 *   category = @Translation("Media Capture"),
 *   default_widget = "media_capture_field_widget",
 *   default_formatter = "media_capture_field_formatter",
 * )
 */
class MediaCaptureFieldType extends FieldItemBase
{
	/**
	 * {@inheritdoc}
	 */
	public static function schema(FieldStorageDefinitionInterface $field_definition)
	{
		return [
			'columns' => [
				'value' => [
					'type'     => 'text',
					'size'     => 'big',
					'not null' => false,
				],
			],
		];
	}

	/**
	 * {@inheritdoc}
	 */
	public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition)
	{
		$properties['value'] = DataDefinition::create('string')
			->setLabel(t('Stream'))
			->setRequired(false);

		return $properties;
	}

	/**
	 * {@inheritdoc}
	 */
	public function isEmpty()
	{
		$value = $this->get('value')->getValue();

		return $value === null || $value === '';
	}

	/**
	 * {@inheritdoc}
	 */
	public static function defaultFieldSettings()
	{
		return [
			'media_type' => 'video',
		] + parent::defaultFieldSettings();
	}

	/**
	 * {@inheritdoc}
	 */
	public function fieldSettingsForm(array $form, FormStateInterface $form_state)
	{

		$element = [];
		// The key of the element should be the setting name
		$element['media_type'] = [
			'#title'   => $this->t('Media type'),
			'#type'    => 'select',
			'#options' => [
				'video' => $this->t('Video'),
				'audio' => $this->t('Audio'),
				'image' => $this->t('Image'),
			],
			'#default_value' => $this->getSetting('media_type'),
		];

		return $element;
	}

}
