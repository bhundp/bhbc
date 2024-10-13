<?php

namespace Drupal\pixel_file_from_data\Plugin\Field\FieldWidget;

use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Define the "media capture field type".
 *
 * @FieldWidget(
 *   id = "media_capture_field_widget",
 *   label = @Translation("Media Capture Field Widget"),
 *   description = @Translation("Desc for Media Capture Field Widget"),
 *   field_types = {
 *     "media_capture_field_type"
 *   }
 * )
 */
class MediaCaptureFieldWidget extends WidgetBase
{
	/**
	 * {@inheritdoc}
	 */
	public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state)
	{
		$media_type = $this->getFieldSetting('media_type');
		$element += [
			'#type'       => 'textarea',
			'#attributes' => [
				'data-media_type' => $media_type,
			],
			'#attached' => [
				'library' => [
					'pixel_file_from_data/capture',
				],
			]];

		return ['value' => $element];
	}

}
