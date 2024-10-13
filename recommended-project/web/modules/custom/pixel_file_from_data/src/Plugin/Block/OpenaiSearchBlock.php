<?php

namespace Drupal\pixel_file_from_data\Plugin\Block;

use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * Provides a 'OpenaiSearch' Block.
 */
#[Block(
	id: 'openai_search',
	admin_label: new TranslatableMarkup('Openai Search'),
	category: new TranslatableMarkup('Openai Block')
)]

class OpenaiSearchBlock extends BlockBase
{
	/**
	 * {@inheritdoc}
	 */
	public function build()
	{
		return [
			'#attached' => [
				'library' => [
					'pixel_file_from_data/search',
				],
			]
		];
	}

}
