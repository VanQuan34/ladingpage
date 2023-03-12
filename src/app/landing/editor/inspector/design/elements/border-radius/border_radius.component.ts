import {
  Component,  Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';


@Component({
  selector: 'mo-wb-landing-editor-inspector-design-elements-border_radius',
  templateUrl: './border_radius.component.html',
  styleUrls: ['./border_radius.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignElementsBorderRadiusComponent extends MoLandingEditorInspectorBaseComponent {
  
  tl: number = 0;
  tr: number = 0;
  bl: number = 0;
  br: number = 0;
  isAll: boolean = true;
  @Input() override selectorAdd: string;

  @Input() rdVar: string = '--rd';
  
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
    const rd = styles[this.rdVar];
    
    if (!rd || !rd.trim() || rd.split(' ').length < 4) {
      this.tl = 0;
      this.tr = 0;
      this.bl = 0;
      this.br = 0;
      this.detectChanges();
      return;
    }

    const arr = rd.split(' ');
    this.tl = parseInt(arr[0].trim());
    this.tr = parseInt(arr[1].trim());  
    this.br = parseInt(arr[2].trim());
    this.bl = parseInt(arr[3].trim());

    this.detectChanges();
  }

  /**
   * change value radius
   * @param value 
   * @param type 
   */
  changeRadius(value: number, type: 'tl' | 'tr' | 'bl' | 'br') {
    let rd = '';
    if (this.isAll) {
      this.tl = value;
      this.tr = value;
      this.bl = value;
      this.br = value;
    } else {
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
    
    rd = `${this.tl}px ${this.tr}px ${this.br}px ${this.bl}px`;
    // update selected comp styles
    this.setStyle(rd, this.rdVar, '-1');
    if (rd) {
      if(this.selectorAdd){
        this.setStyle(`var(${this.rdVar})`, 'border-radius', this.selectorAdd);
      } else{
        this.setStyle(`var(${this.rdVar})`, 'border-radius');
      }
    } else {
      this.setStyles([],['border-radius']);
    }
  }

  handleOnValueChange(value: number, type: 'tl' | 'tr' | 'bl' | 'br') {
    this.changeRadius(value, type);
  }

  handleOnAllValueClick(event: any) {
    this.isAll = !this.isAll;
    this.detectChanges();
  }
  
}
