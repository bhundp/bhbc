<?php

namespace Drupal\pixel_file_from_data\Plugin\Field\FieldFormatter;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Define the "media capture field formatter".
 *
 * @FieldFormatter(
 *   id = "media_capture_field_formatter",
 *   label = @Translation("Media Capture Field Formatter"),
 *   description = @Translation("Desc for Media Capture Field Formatter"),
 *   field_types = {
 *     "media_capture_field_type"
 *   }
 * )
 */
class MediaCaptureFieldFormatter extends FormatterBase
{
	/**
	 * {@inheritdoc}
	 */
	public function viewElements(FieldItemListInterface $items, $langcode)
	{
		$element = [];

		foreach ($items as $delta => $item) {
			$element[$delta] = [
				'#markup' => $item->value,
			];
		}

		return $element;
	}

	/**
	 * {@inheritdoc}
	 */
	public static function defaultSettings()
	{
		return [
			// Declare a setting named 'text_length', with
			// a default value of 'short'
			'media_type' => 'video',
		] + parent::defaultSettings();
	}

	/**
	 * {@inheritdoc}
	 */
	public function settingsForm(array $form, FormStateInterface $form_state)
	{
		$form = parent::settingsForm($form, $form_state);

		$form['media_type'] = [
			'#title'   => $this->t('Media type'),
			'#type'    => 'select',
			'#options' => [
				'video' => $this->t('Video'),
				'audio'  => $this->t('Audio'),
				'image'  => $this->t('Image'),
			],
			'#default_value' => $this->getSetting('media_type'),
		];

		return $form;
	}

}
