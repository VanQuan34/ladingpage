import {
  Component, Input, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy, Injector, ViewRef, Output, ViewChild, QueryList, ViewChildren
} from '@angular/core';
import { DomComponent, GLOBAL } from '../../editor-wrapper';
// import { MoWbPopupWapperComponent } from '../../../../../components/popup/popup_wapper.component';
import { BASE_PATH } from 'src/app/common/define/host-domain.define';
import { MoWbDropdownComponent } from 'src/app/components';
import { MoWbPopupWrapperComponent } from 'src/app/components/popup/popup_wrap.component';

@Component({
  selector: 'mo-wb-landing-editor-comp-popup-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingEditorCompPopupEventComponent extends MoWbPopupWrapperComponent {
  
  selectedComp: DomComponent;
  moType: string;
  apiFetchList: any;
  events: any[] = [];
  
  ignoreKeys: string[] = [];

  @ViewChildren('eventDropdown') eventDropdownListRef!: QueryList<MoWbDropdownComponent>;
  
  

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.initData();
    this.setData();
    this.detectChanges();
    }

  override ngOnDestroy() {
  }


  setData(){
    const selectedModel = GLOBAL.editor.getSelected();
    if (!selectedModel) {
      return;
    }
    const attrs= selectedModel.getAttributes();
    this.events = attrs['events'] ? JSON.parse(attrs['events']) : [];

    this.events = this.events.length ? this.events : [
      {
        eventKey: '',
        eventData: undefined
      }
    ];

    console.log('this.event:', this.events);
    this.detectChanges();

  }

  initData(){
    this.apiFetchList = {
      hostApi: `${BASE_PATH()}dynamic-event/api/v1.0/`,
      method: 'GET',
      needCache: true,
      query: {
        only_action_time_required: true,
      },
      paging: {
        token: 'after_token',
        perPage: 20,
        search: 'search'
      },
      path: 'events'
    }


    this.events = [
      {
        eventKey: '',
        eventData: undefined
      }
    ];
    this.detectChanges();
  }
  handleOnEventSelected(item: any, index: number) {
    if (this.events.length - 1 < index) {
      return;
    }
    if (!item) {
      this.events[index].eventKey = undefined;
      this.detectChanges();
      return;
    }
    this.events[index].eventKey = item['event_key'];
    this.events[index].eventData = {
      key: item['event_key'],
      name: item['name'],
      fields: [
        {
          key: item['fields'][0]['field_key'],
          name: item['fields'][0]['field_name'],
          property: item['fields'][0]['field_property'],
          value: ''
        }
      ]
    }
    this.updateIgnoreKeys();
    this.detectChanges();
  }


  updateIgnoreKeys() {
    for (let i = 0; i < this.eventDropdownListRef.toArray().length; i++) {
      const ignoreKeys: any[] = [];
      for (let j = 0; j < this.events.length; j++) {
        if (j === i || !this.events[j].eventKey) {
          continue;
        }
        ignoreKeys.push(this.events[j].eventKey);
      }
      this.eventDropdownListRef.toArray()[i].setIgnoreKeys(ignoreKeys);
    };
    
    this.detectChanges();
  }


  handleOnRemoveEventClick(e: any, i: number) {
    if (this.events.length - 1 < i) {
      return;
    }
    this.events.splice(i, 1);
    this.detectChanges();
  }

  handleOnAddEventClick(e: any) {
    this.events.push({
      eventKey: '',
      eventData: undefined
    });

    setTimeout(() => {
      this.updateIgnoreKeys();
    }, 150);
  }



  handlerOnAgreePopup(event: any){
    const modal = GLOBAL.editor.getSelected();
    if(!modal){
      return;
    }
    const attrs = modal.getAttributes();
    attrs['events'] = JSON.stringify(this.events);

    modal.setAttributes(attrs, {});
    this.detectChanges();
  }

 

}