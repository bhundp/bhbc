<?php
/**
 * @file
 * Contains \Drupal\pxc_simple_form\Plugin\Block\SimpleFormFollowContentBlock.
 */

namespace Drupal\pxc_simple_form\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;

/**
 * Provides a 'simple form' block.
 *
 * @Block(
 *   id = "simple_form_follow_content_block",
 *   admin_label = @Translation("Simple Form Follow Content block"),
 *   category = @Translation("Custom follow content block")
 * )
 */
class SimpleFormFollowContentBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $form = \Drupal::formBuilder()->getForm('Drupal\pxc_simple_form\Form\SimpleFormFollowContent');

    return $form;
   }
}