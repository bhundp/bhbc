<?php
/**
 * @file
 * Contains \Drupal\pxc_simple_form\Plugin\Block\SimpleFormApplyBenefitBlock.
 */

namespace Drupal\pxc_simple_form\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;

/**
 * Provides a 'simple form' block.
 *
 * @Block(
 *   id = "simple_form_apply_benefit_block",
 *   admin_label = @Translation("Simple Form Apply Benefit block"),
 *   category = @Translation("Custom apply benefit block")
 * )
 */
class SimpleFormApplyBenefitBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $form = \Drupal::formBuilder()->getForm('Drupal\pxc_simple_form\Form\SimpleFormApplyBenefit');

    return $form;
   }
}