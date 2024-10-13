<?php
/**
 * @file
 * Contains \Drupal\pxc_simple_form\Plugin\Block\SimpleFormFollowPeopleBlock.
 */

namespace Drupal\pxc_simple_form\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;

/**
 * Provides a 'simple form' block.
 *
 * @Block(
 *   id = "simple_form_follow_people_block",
 *   admin_label = @Translation("Simple Form Follow People block"),
 *   category = @Translation("Custom follow people block")
 * )
 */
class SimpleFormFollowPeopleBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $form = \Drupal::formBuilder()->getForm('Drupal\pxc_simple_form\Form\SimpleFormFollowPeople');

    return $form;
   }
}