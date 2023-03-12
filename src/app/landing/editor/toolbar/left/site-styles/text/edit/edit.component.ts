import {
  Component, OnInit, ChangeDetectorRef, ViewRef, EventEmitter, Input,
  ChangeDetectionStrategy, Output, ElementRef
} from '@angular/core';
import { MoWbBaseComponent } from '../../../../../../../components/base.component';
import { Fonts, IColorVar } from '../../../../../../../common/common-types';
import { MoWbColorSetComponent } from '../../../../../../../components/color/set/set.component';
import { IThemeFontItem } from '../text.component';
import { FontUtils } from 'src/app/utils/fontUtils';

@Component({
  selector: 'mo-wb-landing-editor-toolbar-site_styles-text-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorSiteStylesTextEditComponent extends MoWbBaseComponent {

  top: number = 0;
  left: number = 0;
  fontList: any[] = [];
  fontStyleList: any[] = [];

  @Input() width: number = 550;
  @Input() height: number = 450;
  @Input() zIndex: number = 2500;
  @Input() classInclude: string;
  @Input() isShow: boolean = false;
  @Input() fontItem: IThemeFontItem;

  @Output() onClose = new EventEmitter<any>();
  @Output() onApply = new EventEmitter<any>();

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.fontList = Fonts.AllFonts;
    this.initFontStyle();
    this.detectChanges();
  }

  override ngOnDestroy() {
  }
  /**
   * init font style
   * @returns 
   */
  initFontStyle() {
    const foundFont = this.fontList.find((item: any) => {
      if (item.title === this.fontItem.fontFamily) {
        return true;
      }
      return false;
    });
    if (!foundFont || !foundFont.fontStyle.length) {
      return;
    }
    const fontStyles = foundFont.fontStyle[0].weight;
    this.fontStyleList = fontStyles.map((weight: any) => {
      const newItem: any = {
        id: `${weight}`
      };
      newItem.name = FontUtils.getFontWeightName(newItem.id);
      return newItem;
    });
    console.log('initFontStyle = ', this.fontStyleList, foundFont);
    this.detectChanges();
  }

  show(target: HTMLElement) {
    const targetRect = target.getBoundingClientRect();
    this.top = Math.min(targetRect.top - 20, window.innerHeight - this.height - 20);
    this.left = targetRect.left + targetRect.width + 10;
    this.isShow = true;
    this.detectChanges();
  }

  close() {
    this.isShow = false;
    this.detectChanges();
    setTimeout(() => {
      this.onClose.emit();
    }, 50);
  }

  changeFontFamily(item: any) {
    this.fontItem.fontFamily = item.title;
    this.fontItem.font = `'${item.title}', sans-serif`;
    this.initFontStyle();

    const foundWeight = this.fontStyleList.find( item => {
      if (item.id === this.fontItem.fontWeight) {
        return true;
      }
      return false;
    });

    if (!foundWeight && this.fontStyleList.length) {
      this.fontItem.fontWeight = this.fontStyleList[this.fontStyleList.length - 1].id;
    }
    this.detectChanges();
  }

  changeFontWeight(item: any) {
    this.fontItem.fontWeight = item.id;
    this.detectChanges();
  }

  changeFontSize(fontSize: number) {
    this.fontItem.fontSize = `${fontSize}px`;
    this.fontItem.fontSizeNumber = fontSize;
    this.detectChanges();
  }

  toggleFontStyle() {
    this.fontItem.fontStyle = this.fontItem.fontStyle === 'normal' ? 'italic' : 'normal';
    this.detectChanges();
  }

  showSetColor(targetEl: HTMLElement) {
    const modalRef =  this._componentFactoryResolver.resolveComponentFactory(MoWbColorSetComponent).create(this._injector);
    modalRef.instance.inputColor = this.fontItem.colorVar;
    console.log('show set color=',  this.fontItem.colorVar);
    modalRef.instance.onClose.subscribe((event: any) => { 
      this._domService.removeComponentFromBody(modalRef);
    });
    modalRef.instance.onSelectColor.subscribe((selectedColor: IColorVar) => { 
      this.updateSelectedColor(selectedColor);
    });
    this._domService.addDomToBody(modalRef);
    modalRef.instance.show(targetEl);
  }

  updateSelectedColor(selectedColor: IColorVar) {
    this.fontItem.color = selectedColor.color;
    this.fontItem.colorVar = selectedColor;

    this.detectChanges();
  }

  /**
   * handle overlay click
   * @param event 
   */
  handleOnOverlayClick(event: any) {
    this.close();
  }

  handleOnCloseClick(event: any) {
    this.close();
  }

  /**
   * handle on menu click
   * @param event 
   */
  handleOnMenuClick(event: any) {
    event.stopPropagation();
  }

  handleOnCancelClick(event: any) {
    this.close();
  }

  handleOnApplyClick(event: any) {
    this.onApply.emit(this.fontItem);
    this.close();
  }

  handleOnSelectedFontFamily(item: any) {
    console.log('handleOnSelectedFontFamily ', item);
    this.changeFontFamily(item);
  }

  handleOnSelectedFontWeight(item: any) {
    console.log('handleOnSelectedFontWeight ', item);
    this.changeFontWeight(item);
  }

  handleOnFontSizeChange(value: number) {
    this.changeFontSize(value);
  }

  handleOnFontStyleClick(event: any) {
    this.toggleFontStyle();
  }

  handleOnClickFontColor(event: any, fontColorEl: HTMLElement){
    this.showSetColor(fontColorEl);
  }
}
