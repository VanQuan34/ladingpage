
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
import { MoWbPopupWrapperComponent } from 'src/app/components/popup/popup_wrap.component';
@Component({
  selector: 'mo-wb-landing-editor-comp-popup-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupLayoutComponent extends MoWbPopupWrapperComponent {
  
  selectedComp: DomComponent;
  moType: string;
  isFill: boolean = true;
  textAlign : 'left' | 'center' | 'right' = 'center';
  marginVal: number = 0;

  @Input() title:string = '';

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.setValue();
   
  }

  override ngOnDestroy() {
  }

  setValue(){
    this.selectedComp = GLOBAL.editor.getSelected();
    const attrs = GLOBAL.editor.getSelected().getAttributes();
    this.moType = attrs['mo-type'];
    console.log('this.motype:', this.moType);
    if(this.moType === 'button'){
      console.log('attrs:', attrs);
      const id = this.selectedComp.getId();
      const styles = GLOBAL.editor.getStyles(`#${id}`, {});
      console.log('style:', styles);
      this.textAlign = styles['--label-align'];
      if( styles['--label-align'] === 'left'){
        this.marginVal = styles['--margin-left'].slice(0,-2);
      }else if( styles['--label-align'] === 'right'){
        this.marginVal = styles['--margin-right'].slice(0,-2);
      }else{
        this.marginVal = styles['--init-mc'];
      }
    }
    this.detectChanges();
  }


  changeMarginWidth(val: number, isInline: boolean, clearAllMarginValue: boolean = false){
    console.log('this.marginVal', this.marginVal)
    this.marginVal = val;
    const id = this.selectedComp.getId();
    const styles = GLOBAL.editor.getStyles(`#${id}`, {});
    const marginVar = this.textAlign === 'left' ? '--margin-left' : '--margin-right';
    const clearValVar = this.textAlign ==='left' ? '--margin-right' : '--margin-left';
    if(isInline) {
      this.selectedComp.view.$el.attr('style', `${marginVar}: ${val}px`);
      return;
    }
    this.deleteInlineStyle();
    styles[marginVar] = `${val}px`;
    styles['--init-mc'] = val;
    if(clearAllMarginValue){
      styles['--margin-left'] = '0px';
      styles['--margin-right'] = '0px';
    }else{
      styles[clearValVar] = '0px';
    }
    GLOBAL.editor.setStyles(`#${id}`, styles , {});
    this.detectChanges();
  }


   /**
   * delete inline style
   */
   deleteInlineStyle() {
    this.selectedComp.view.$el.removeAttr('style');
  }

  handlerItemsFillMenu(event: any){
    this.isFill = event.active;
    this.detectChanges();
    const id = GLOBAL.editor.getSelected().getId();
    let styles = GLOBAL.editor.getStyles(id, {});
      styles['--wItem'] = event.active ? '50%' : 'auto';
    
    console.log('event:', event);
    GLOBAL.editor.setStyles(id, styles , {});
    this.detectChanges(); 
  }

  handlerSelectTextAlign(e: any, typeAlign: 'left' | 'center' | 'right'){
    this.textAlign = typeAlign;
    console.log('selectedComp:', this.selectedComp);
    if(!this.selectedComp){
      return;
    }
    this.changeMarginWidth(this.marginVal, false, this.textAlign==='center' ? true : false);
    const id = this.selectedComp.getId();
    const styles = GLOBAL.editor.getStyles(`#${id}`, {});

    styles['--label-align'] = `${typeAlign}`;
    GLOBAL.editor.setStyles(`#${id}`, styles , {});
    this.detectChanges();
  }

  handlerClickItemsAlign(e: any, typeAlign: string){
    const id = GLOBAL.editor.getSelected().getId();
    let styles = GLOBAL.editor.getStyles(id, {});
    styles['--item-align'] = `${typeAlign}`;
    GLOBAL.editor.setStyles(id, styles , {});
    this.detectChanges();
  }

  handlerClickDirection(event: any, direction: string){
    const id = GLOBAL.editor.getSelected().getId();
    let styles = GLOBAL.editor.getStyles(id, {});
    styles['--direction-item'] = direction === 'left' ? 'row' : 'row-reverse';
    GLOBAL.editor.setStyles(id, styles, {});
    this.detectChanges();
  }

  handleOnWidthChange(val: any){
    this.changeMarginWidth(val, false)
  }
 


  handleOnInputWidthSliderValueChanged(val: any){
    this.changeMarginWidth(val, true);
  }



}
