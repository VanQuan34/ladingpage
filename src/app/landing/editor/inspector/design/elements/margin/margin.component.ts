import {
  Component,  Input, ChangeDetectionStrategy
} from '@angular/core';
import { EditorConstants } from 'src/app/landing/editor/constants';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';


@Component({
  selector: 'mo-wb-landing-editor-inspector-design-elements-margin',
  templateUrl: './margin.component.html',
  styleUrls: ['./margin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignElementsMarginComponent extends MoLandingEditorInspectorBaseComponent {
  
  ml: number = 0;
  mr: number = 0;
  mt: number = 0;
  mb: number = 0;
  @Input() isAll: boolean = true;
  @Input() override selectorAdd: string;

  @Input() mtVar: string = '--mt';
  @Input() mrVar: string = '--mr';
  @Input() mbVar: string = '--mb';
  @Input() mlVar: string = '--ml';
  
  @Input() disabledT: boolean = false;
  @Input() disabledR: boolean = false;
  @Input() disabledB: boolean = false;
  @Input() disabledL: boolean = false;
  
  override onInit(): void {
  }

  override setValue() {
    super.setValue();
    if (!this.selectedComp) {
      return;
    }
    this.isOpen = false;
    // get style selected comp
    const styles = this.getStyle('-1');
    this.mt = styles[this.mtVar] && parseInt(styles[this.mtVar].replace('px', '').trim()) || 0;
    this.mr = styles[this.mtVar] && parseInt(styles[this.mrVar].replace('px', '').trim()) || 0;
    this.mb = styles[this.mtVar] && parseInt(styles[this.mbVar].replace('px', '').trim()) || 0;
    this.ml = styles[this.mtVar] && parseInt(styles[this.mlVar].replace('px', '').trim()) || 0;
    this.detectChanges();
  }

  /**
   * change value radius
   * @param value 
   * @param type 
   */
  changeMargin(value: number, type: 'mt' | 'mr' | 'mb' | 'ml') {
    if (this.isAll) {
      if(!this.disabledL){this.ml = value;}
      if(!this.disabledR){this.mr = value;}
      if(!this.disabledB){this.mb = value;}
      if(!this.disabledT){this.mt = value;}
    } else {
      switch(type) {
        case 'mt':
          if(this.disabledT) return;
          this.mt = value;
          break;
        case 'mr':
          if(this.disabledR) return;
          this.mr = value;
          break;
        case 'mb':
          if(this.disabledB) return;
          this.mb = value;
          break;
        case 'ml':
          if(this.disabledL) return;
          this.ml = value;
          break;
      }
    }

    // update selected comp styles
    this.setStyle(`${this.mt}px`, this.mtVar, '-1');
    this.setStyle(`${this.mr}px`, this.mrVar, '-1');
    this.setStyle(`${this.mb}px`, this.mbVar, '-1');
    this.setStyle(`${this.ml}px`, this.mlVar, '-1');
    // if (rd) {
    //   if(this.selectorAdd){
    //     this.setStyle(`var(${this.mtVar})`, 'margin-top', this.selectorAdd);
    //     this.setStyle(`var(${this.mrVar})`, 'margin-right', this.selectorAdd);
    //     this.setStyle(`var(${this.mbVar})`, 'margin-bottom', this.selectorAdd);
    //     this.setStyle(`var(${this.mlVar})`, 'margin-left', this.selectorAdd);
    //   } else{
    //     this.setStyle(`var(${this.mtVar})`, 'margin-top');
    //     this.setStyle(`var(${this.mrVar})`, 'margin-right');
    //     this.setStyle(`var(${this.mbVar})`, 'margin-bottom');
    //     this.setStyle(`var(${this.mlVar})`, 'margin-left');
    //   }
    // } else {
    //   this.setStyles([],['margin']);
    // }
  }

  handleOnValueChange(value: number, type: 'mt' | 'mr' | 'mb' | 'ml') {
    this.changeMargin(value, type);
    GLOBAL.editor.getEditor().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
  }

  handleOnAllValueClick(event: any) {
    this.isAll = !this.isAll;
    this.detectChanges();
  }
  
}
