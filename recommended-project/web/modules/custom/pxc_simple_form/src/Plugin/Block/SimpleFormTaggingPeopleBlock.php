<?php
/**
 * @file
 * Contains \Drupal\pxc_simple_form\Plugin\Block\SimpleFormTaggingPeopleBlock.
 */

namespace Drupal\pxc_simple_form\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;

/**
 * Provides a 'simple form' block.
 *
 * @Block(
 *   id = "simple_form_tagging_people_block",
 *   admin_label = @Translation("Simple Form Tagging People block"),
 *   category = @Translation("Custom tagging people block")
 * )
 */
class SimpleFormTaggingPeopleBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $form = \Drupal::formBuilder()->getForm('Drupal\pxc_simple_form\Form\SimpleFormTaggingPeople');

    return $form;
   }
}