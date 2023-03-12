import {
  Component,  Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';

const PAD_HOR = '--horizontalPadding';
const PAD_VER = '--verticalPadding';;


@Component({
  selector: 'mo-wb-landing-editor-inspector-design-elements-padding',
  templateUrl: './padding.component.html',
  styleUrls: ['./padding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignElementsPaddingComponent extends MoLandingEditorInspectorBaseComponent {
  
  paHorVar: string = PAD_HOR;
  paVerVar: string = PAD_VER;

  paHor: number = 0;
  paVer: number = 0;
  
  override onInit(): void {
    
  }

  override setValue() {
    super.setValue();
    if (!this.selectedComp) {
      return;
    }
    this.isOpen = false;
    const styles = this.getStyle();
    const paHor = styles[this.paHorVar];
    const paVer = styles[this.paVerVar];

    this.paVer = parseInt(paVer || '0');
    this.paHor = parseInt(paHor || '0');
    
    this.detectChanges();
  }

  /**
   * change horizontal padding
   * @param value 
   * @param isInline 
   */
  changeHorizontalPadding(value: number, isInline: boolean) {
    this.paHor = value;
    this.detectChanges();
    if (isInline) {
      this.selectedComp.view.$el.attr('style', `${this.paHorVar} : ${value}px`);
      return;
    }
    this.setStyle(`${value}px`, `${this.paHorVar}`);
    this.deleteInlineStyle();
    this.updateDockingPosInfo();
  }

  /**
   * change vertical padding
   * @param value 
   * @param isInline 
   * @returns 
   */
  changeVerticalPadding(value: number, isInline: boolean) {
    this.paVer = value;
    this.detectChanges();
    if (isInline) {
      this.selectedComp.view.$el.attr('style', `${this.paVerVar} : ${value}px`);
      return;
    }
    this.setStyle(`${value}px`, `${this.paVerVar}`);
    this.deleteInlineStyle();
    this.updateDockingPosInfo();
  }

  handleOnVerticalChange(value: number) {
    this.changeVerticalPadding(value, false);
  }

  handleOnInputVerticalSliderValueChanged(value: number) {
    this.changeVerticalPadding(value, true);
  }

  handleOnHorizontalChange(value: number) {
    this.changeHorizontalPadding(value, false);
  }
  
  handleOnInputHorizontalSliderValueChanged(value: number) {
    this.changeHorizontalPadding(value, true);
  }
}
