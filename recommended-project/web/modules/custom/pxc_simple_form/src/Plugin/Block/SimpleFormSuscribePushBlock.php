<?php
/**
 * @file
 * Contains \Drupal\pxc_simple_form\Plugin\Block\SimpleFormSuscribePushBlock.
 */

namespace Drupal\pxc_simple_form\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;

/**
 * Provides a 'simple form' block.
 *
 * @Block(
 *   id = "simple_form_suscribe_push_block",
 *   admin_label = @Translation("Simple Form Suscribe Push block"),
 *   category = @Translation("Custom suscribe push block")
 * )
 */
class SimpleFormSuscribePushBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $form = \Drupal::formBuilder()->getForm('Drupal\pxc_simple_form\Form\SimpleFormSuscribePush');

    return $form;
   }
}