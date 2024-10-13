<?php
/**
 * @file
 * Contains \Drupal\pxc_simple_form\Plugin\Block\SimpleFormSaveMediaBlock.
 */

namespace Drupal\pxc_simple_form\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;

/**
 * Provides a 'simple form' block.
 *
 * @Block(
 *   id = "simple_form_save_media_block",
 *   admin_label = @Translation("Simple Form Save Media block"),
 *   category = @Translation("Custom save media block")
 * )
 */
class SimpleFormSaveMediaBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $form = \Drupal::formBuilder()->getForm('Drupal\pxc_simple_form\Form\SimpleFormSaveMedia');

    return $form;
   }
}