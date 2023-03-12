import {
  Component,  Input, ChangeDetectionStrategy
} from '@angular/core';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../../base.component';


@Component({
  selector: 'mo-wb-landing-editor-inspector-design-elements-padding-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignElementsPaddingFullComponent extends MoLandingEditorInspectorBaseComponent {
  
  tl: number = 0;
  tr: number = 0;
  bl: number = 0;
  br: number = 0;

  isAll: boolean = true;

  @Input() paVar: string = '--pad';
  @Input() override title: string = 'Khoảng đệm';

  override onInit(): void {
  }

  /**
   * set value
   * @returns 
   */
  override setValue() {
    super.setValue();
    if (!this.selectedComp) {
      return;
    }
    this.isOpen = false;

    const styles = this.getStyle('-1');
    const pa = styles[this.paVar];
    
    if (!pa || !pa.trim() || pa.split(' ').length < 4) {
      this.tl = 0;
      this.tr = 0;
      this.bl = 0;
      this.br = 0;
      this.checkIsAll();
      this.detectChanges();
      return;
    }

    const arr = pa.split(' ');
    this.tl = parseInt(arr[0].trim());
    this.tr = parseInt(arr[1].trim());  
    this.br = parseInt(arr[2].trim());
    this.bl = parseInt(arr[3].trim());
    this.checkIsAll();
    this.detectChanges();
  }

  checkIsAll() {
    if (this.tl === this.tr && this.tl === this.br 
      && this.tl === this.bl) {
      this.isAll = true;
      return;
    }
    this.isAll = false;
  }

  /**
   * change value radius
   * @param value 
   * @param type 
   */
  changeRadius(value: number, type: 'tl' | 'tr' | 'bl' | 'br') {
    let pa = '';
    if (this.isAll) {
      this.tl = value;
      this.tr = value;
      this.bl = value;
      this.br = value;
    } 
    else {
      switch(type) {
        case 'tl':
          this.tl = value;
          break;
        case 'bl':
          this.bl = value;
          break;
        case 'br':
          this.br = value;
          break;
        case 'tr':
          this.tr = value;
          break;
      }
    }
    
    pa = `${this.tl}px ${this.tr}px ${this.br}px ${this.bl}px`;
    // set style selected comp
    this.setStyle(pa, this.paVar, '-1');
    // set var padding
    this.setStyle(`var(${this.paVar})`, 'padding');
    // update selected comp
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
  }

  handleOnValueChange(value: number, type: 'tl' | 'tr' | 'bl' | 'br') {
    this.changeRadius(value, type);
  }

  handleOnAllValueClick(event: any) {
    this.isAll = !this.isAll;
    this.detectChanges();
  }
  
}
