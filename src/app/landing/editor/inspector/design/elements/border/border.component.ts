import {
  Component,  Input, ChangeDetectionStrategy
} from '@angular/core';
import { MoLandingEditorInspectorBaseComponent } from '../../../base.component';
import { IColorVar } from '../../../../../../common/common-types';
import { Utils } from 'src/app/utils/utils';
import { GLOBAL } from 'src/app/landing/editor/editor-wrapper';
import { EditorConstants } from 'src/app/landing/editor/constants';

interface IBorder {
  type: 't' | 'b' | 'l' | 'r';
  colorVar: IColorVar;
  style: string;
  width: number;
} 

@Component({
  selector: 'mo-wb-landing-editor-inspector-design-elements-border',
  templateUrl: './border.component.html',
  styleUrls: ['./border.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorInspectorDesignElementsBorderComponent extends MoLandingEditorInspectorBaseComponent {
  
  isAll: boolean = true;
  borderStyles: any[] =[];
  borders: IBorder[] = [];

  selBorder: IBorder;
  selBorderType: 't' | 'b' | 'l' | 'r';

  @Input() brwVar: string;
  @Input() brsVar: string;
  @Input() brcVar: string;
  @Input() override isOpen: boolean = false;

  override onInit(): void {
    this.borderStyles = [
      {
        id: 'solid',
        name: ``,
        html: '<div style="height:0px; width: 55px; border: none; border-top: 6px solid #333;"></div>'
      },
      {
        id: 'dashed',
        name: ``,
        html: `<div style="height:0px; width: 55px; border-top: 6px dashed #333"> </div>`
      },
      {
        id: 'dotted',
        name: ``,
        html: `<div style="height:0px; width: 55px; border-top: 6px dotted #333"> </div>`,
      },
      {
        id: 'double',
        name: ``,
        html: `<div style="height:0px; width: 55px; border-top: 6px double #333"> </div>`,
      },
      {
        id: 'groove',
        name: ``,
        html: `<div style="height:0px; width: 55px; border-top: 6px groove #333"> </div>`
      },
      {
        id: 'ridge',
        name: ``,
        html: `<div style="height:0px; width: 55px; border-top: 6px ridge #333"> </div>`,
      },
      {
        id: 'inset',
        name: ``,
        html: `<div style="height:0px; width: 55px; border-top: 6px inset #333"> </div>`
      },
      {
        id: 'outset',
        name: ``,
        html: `<div style="height:0px; width: 55px; border-top: 6px outset #333"> </div>`,
      },
    ];
    this.setCssVar();
    this.initValues();
  }

  /**
   * init values
   */
  initValues() {
    const cssVar = '--c15';
    const rgb =  GLOBAL.rootStyles[cssVar];
    const color: string = Utils.rgbToHex(rgb);
    this.borders = [
      {
        type: 't',
        colorVar: {
          color: color,
          rgbColor: rgb,
          alpha: 1,
          cssVar: cssVar
        },
        style: 'solid',
        width: 0
      },
      {
        type: 'r',
        colorVar: {
          color: color,
          rgbColor: rgb,
          alpha: 1,
          cssVar: cssVar
        },
        style: 'solid',
        width: 0
      },
      {
        type: 'b',
        colorVar: {
          color: color,
          rgbColor: rgb,
          alpha: 1,
          cssVar: cssVar
        },
        style: 'solid',
        width: 0
      },
      {
        type: 'l',
        colorVar: {
          color: color,
          rgbColor: rgb,
          alpha: 1,
          cssVar: cssVar
        },
        style: 'solid',
        width: 0
      }
    ];
  }

  /**
   * set css var
   */
  setCssVar() {
    if (this.state === 'REGULAR') {
      this.brcVar = !this.brcVar ? '--brc' : this.brcVar;
      this.brwVar = !this.brwVar ? '--brw' : this.brwVar;
      this.brsVar = !this.brsVar ? '--brs' : this.brsVar;
    } else if(this.state === 'HOVER') {
      this.brcVar = !this.brcVar ? '--brc-h' : this.brcVar;
      this.brwVar = !this.brwVar ? '--brw-h' : this.brwVar;
      this.brsVar = !this.brsVar ? '--brs-h' : this.brsVar;
    }
  }

  override setValue() {
    super.setValue();
    if (!this.selectedComp) {
      return;
    }
    // get selected comp style
    const styles = this.getStyle('-1');
    // parse border style
    this.parserBorderStyle(styles);
    // parse border width
    this.parseBorderWidth(styles);
    // parse border color
    this.parseBorderColor(styles);

    // check border is all
    this.checkIsAllBorder();

    this.selBorderType = 't';
    this.selBorder = this.borders[0];
    
    this.detectChanges();
  }

  /**
   * parse border style
   * border style = solid solid solid solid
   * @param styles 
   * @returns 
   */
  parserBorderStyle(styles: any) {
    const borderStyle = styles[this.brsVar];
    const arr = borderStyle && borderStyle.split(' ');
    if (!arr || arr.length < 4) {
      return;
    }
    this.borders.forEach((border: IBorder, index: number) => {
      border.style = arr[index].trim();
    });
  }

  /**
   * parse border width
   * @param styles 
   */
  parseBorderWidth(styles: any) {
    const borderWidth = styles[this.brwVar];
    const arr = borderWidth && borderWidth.split(' ');
    if (!arr || arr.length < 4) {
      return;
    }
    this.borders.forEach((border: IBorder, index: number) => {
      border.width = parseInt(arr[index].trim());
    });
  }

  /**
   * parse border color
   * @param styles 
   */
  parseBorderColor(styles: any) {
    const borderColor = styles[this.brcVar];
    const arr = borderColor && borderColor.split(' ');
    if (!arr || arr.length < 4) {
      return;
    }
    this.borders.forEach((border: IBorder, index: number) => {
      border.colorVar = Utils.parseColorVar(arr[index].trim());
    });
  } 

  getOnlyBorderValue(border: IBorder) {
    return {
      cssVar: border.colorVar,
      style: border.style,
      width: border.width
    };
  }

  /**
   * check if border is all
   */
  checkIsAllBorder() {
    const bt = JSON.stringify(this.getOnlyBorderValue(this.borders[0]));
    const br = JSON.stringify(this.getOnlyBorderValue(this.borders[1]));
    const bl = JSON.stringify(this.getOnlyBorderValue(this.borders[2]));
    const bb = JSON.stringify(this.getOnlyBorderValue(this.borders[3]));
    
    if ((bt === br) && (bt === bb) && (bt === bl)) {
      this.isAll = true;
    } else {
      this.isAll = false;
    }
  }

  /**
   * generate border line
   * @param type 
   */
  generateBorderLine(type: 't' | 'b' | 'r' | 'l' ) {
    const border: IBorder = this.borders.find(item => {
      if (item.type === type) {
        return true;
      }
      return false;
    });
    // console.log('generateBorderLine border=', border, this.borders, ' type=', type);
    if (!border) {
      return '';
    }
    const b = `${border.style} ${border.width}px rgba(${border.colorVar.rgbColor}, ${border.colorVar.alpha})`;
    // console.log('generateBorderLine b=', b, border);
    return b;
  }
  
  /**
   * change border
   * @param isInline 
   */
  changeBorder(isInline: boolean, borders: IBorder[]) {
    let bw = '';
    let bs = '';
    let bc = '';
    borders.forEach((border: IBorder, index: number) => {
      bw = index === 0 ? `${border.width}px` : `${bw} ${border.width}px`;
      bs = index === 0 ? `${border.style}` : `${bs} ${border.style}`;

      const color =   `rgba(${Utils.generateRgbColor(border.colorVar)},${border.colorVar.alpha})`;
      bc = index === 0 ? `${color}` : `${bc} ${color}`;
    });

    if (isInline) {
      this.selectedComp.view.$el.attr('style', `${this.brwVar} : ${bw}; ${this.brcVar} : ${bc}; ${this.brsVar} : ${bs}`);
      GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
      return;
    }
    // remove inline styles
    this.selectedComp.view.$el.removeAttr('style');
    // set selected comp
    this.setStyles([
      {
        value: bw,
        property: this.brwVar
      },
      {
        value: bs,
        property: this.brsVar
      },
      {
        value: bc,
        property: this.brcVar
      },
    ],[], '-1');

    this.setStyles([
      {
        value: `var(${this.brwVar})`,
        property: 'border-width'
      },
      {
        value: `var(${this.brsVar})`,
        property: 'border-style'
      },
      {
        value: `var(${this.brcVar})`,
        property: 'border-color'
      },
    ],[]);
    GLOBAL.editor.getModel().trigger(EditorConstants.COMP_SELECTED_UPDATED_EVENT);
  }

  /**
   * update for all borders
   * @param borders 
   */
  updateForAllBorders(borders: IBorder[], copyBorder: IBorder) {
    borders.forEach(border => {
      border.colorVar = copyBorder.colorVar;
      border.style = copyBorder.style;
      border.width = copyBorder.width;
    });
  }
  
  handleOnSelectBorderColor(colorVar: IColorVar) {
    this.selBorder.colorVar = colorVar;
    if (this.isAll) {
      this.updateForAllBorders(this.borders, this.selBorder);
    }
    this.changeBorder(false, this.borders);
    this.detectChanges();
  }

  handleOnOverBorderColor(colorVar: IColorVar) {
    const tempBorders: IBorder[] = Utils.copyObject(this.borders);
    const border = tempBorders.find(item => {
      return (item.type === this.selBorderType) ? true : false;
    });
    border.colorVar = colorVar;
    if (this.isAll) {
      this.updateForAllBorders(tempBorders, border);
    }
    this.changeBorder(true, tempBorders);
    this.detectChanges();
  }

  /**
   * handle width changed
   * @param value 
   */
  handleOnWidthChange(value: number) {
    this.selBorder.width = value;
    if (this.isAll) {
      this.updateForAllBorders(this.borders, this.selBorder);
    }
    this.changeBorder(false, this.borders);
    this.detectChanges();
  }

  /**
   * handle slider width changed
   * @param value 
   */
  handleOnInputWidthSliderValueChanged(value: number) {
    this.selBorder.width = value;
    if (this.isAll) {
      this.updateForAllBorders(this.borders, this.selBorder);
    }
    //console.log('handleOnInputWidthSliderValueChanged borders=', this.borders);
    this.changeBorder(true, this.borders);
    this.detectChanges();
  }

  /**
   * handle on all value click
   * @param event 
   */
  handleOnAllValueClick(event: any) {
    this.isAll = !this.isAll;
    this.detectChanges();
  }

  /**
   * handle on select border style
   * @param borderStyle 
   */
  handleOnSelectBorderStyle(borderStyle: any) {
    this.selBorder.style = borderStyle.id;
    if (this.isAll) {
      this.updateForAllBorders(this.borders, this.selBorder);
    }
    this.changeBorder(false, this.borders);
    this.detectChanges();
  }

  /**
   * handle on border item click    
   * @param event 
   * @param type 
   */
  handleOnBorderItemClick(event: MouseEvent, type: any) {
    if (type === this.selBorderType) {
      return;
    }
    this.selBorderType = type;
    this.selBorder = this.borders.find(border => {
      return border.type === type ? true : false;
    });

    this.detectChanges();
  }

  /**
   * cancel border color
   * @param event 
   */
  handleOnCancelBorderColor(event: any) {
    this.deleteInlineStyle();   
  }
  
}
