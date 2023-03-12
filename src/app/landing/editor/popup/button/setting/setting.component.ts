
import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild
} from '@angular/core';

interface ITag {
  tag_id?: string;
  tag_name: string;
  tag_type?: number;
}
interface IButtonSetting {
  name?: string;
  tags?: ITag[]
}
import { DomComponent, GLOBAL } from '../../../editor-wrapper';
import { MoWbPopupWrapperComponent } from '../../../../../components/popup/popup_wrap.component';
@Component({
  selector: 'mo-wb-landing-editor-popup-button-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorPopupButtonSettingComponent extends MoWbPopupWrapperComponent {
  
  selectedComp: DomComponent;
  moType: string;
  buttonSetting: IButtonSetting | undefined = undefined;
  tagNameList: string[] = [];
  error: boolean = false;
  selectedKey: string = 'success-message';

  @Input() viewType: string = '';
  @Input() titlePopup: string = 'Thiết lập nút';
  @Input() optAfterAction: any[] =[];

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.initData();
    this.detectChanges();
  }

  override ngOnDestroy() {
  }

  initData() {
    const selectedModel = GLOBAL.editor.getSelected();
    if (!selectedModel) {
      return;
    }
    const comps = GLOBAL.editor.getSelected().find('.mo-content-inner');

    const comp = comps.length && comps[0];


    const compChild = comp.view.$el.children();
    const content = $(compChild).text();
    const attrs = selectedModel.getAttributes();
    this.moType = attrs['mo-type'];
    console.log('this.motype:', this.moType);
    const tags = attrs['tags'] ? JSON.parse(attrs['tags']) : [];
    console.log('tags:', tags);
    this.buttonSetting = {
      name: content,
      tags: tags
    }
    this.tagNameList = tags.map( (tag: any) => {
      return tag.tag_name;
    });
  }

  handleOnContentChange(val: any){
    this.buttonSetting.name = val;
    this.error = false;
    this.detectChanges();
  }

  async handlerOnAgreePopup(e: any){
    if(this.error){
      return;
    }
    const comps = GLOBAL.editor.getSelected().find('.mo-content-inner');
    const comp = comps.length && comps[0];
    const child = comp.view.$el.children();
    const newText = this.buttonSetting.name;
    $(child).text(`${newText}`);

    //add tag to button
    if(!this.buttonSetting.tags){
      return;
    }
    const tags = await this.createNewTags(this.buttonSetting.tags);
    const attrs = GLOBAL.editor.getSelected().getAttributes();
    attrs['tags'] = JSON.stringify(tags);
    GLOBAL.editor.getSelected().setAttributes(attrs, {});
    this.detectChanges();
  }

  async createNewTags(tags: any[]) {
    let newTags = tags.filter(tag => {
      if (tag.tag_id) {
        return false;
      }
      return true;
    });
    if (!newTags.length) {
      return tags;
    }

    newTags = newTags.map(tag => {
      return {
        tag_name: tag.tag_name
      }
    });
    const response = await this._buttonService.createTag(newTags);
    if (!response || response.code !== 200) {
      this._toast.show('error', response.message);
      return tags;
    }
    response.data.forEach((newTag: any) => {
      const tag = tags.find(ele => {
        if (ele.tag_name === newTag.tag_name) {
          return true;
        }
        return false;
      });
      tag.tag_id = newTag.tag_id;
    });
    return tags;
  }

  handleOnInputContentError(event: any){
    this.error = true;
    this.detectChanges();
  }

  convertTags(tags: any[]){
    let newTags: any[] = tags.map((item: any) => {
      return {
        tag_id: item.tag_id ? item.tag_id : undefined,
        tag_name: item.tag_name ? item.tag_name : undefined,
        tag_type: item.tag_type ? item.tag_type : undefined
      }
    })
    return newTags;
  }

  handlerSelectOption(event: any){
    console.log('event: ', event);
    this.selectedKey = event.key;
    this.detectChanges();
  }


  handleOnSelectTags(tags: any[]){
    this.buttonSetting.tags = [...this.convertTags(tags)];
    
  }
}
