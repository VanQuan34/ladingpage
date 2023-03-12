import {
    Component, OnInit, EventEmitter, ViewChild, ComponentFactoryResolver,ViewContainerRef,
    Output, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewRef, SimpleChanges
  } from '@angular/core';
  import { MoWbDetectionComponent } from '../../../components/detection.component';
import { EditorConstants } from '../constants';
  import { DomComponent, GLOBAL } from '../editor-wrapper';
  
  @Component({
    selector: 'mo-wb-landing-editor-inspector',
    templateUrl: './inspector.component.html',
    styleUrls: ['./inspector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class MoLandingEditorInspectorComponent extends MoWbDetectionComponent {
    
    selectedComp: DomComponent;
    selectedTab: 'LAYOUT' | 'DESIGN' = 'DESIGN';
    isPage: boolean;
    moType: string;
    @Input() classInclude: string = '';
    @Input() isOpen: boolean = false;
    
    override ngOnInit() {
      GLOBAL.editor.getEditor().on(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
      GLOBAL.editor.getEditor().on(EditorConstants.SELECTED_COMP_REMOVED_EVENT, this.handleOnSelectedCompRemoved);
    }
  
    override ngAfterViewInit() {
      setTimeout(() => {

        this.selectedComp = GLOBAL.editor.getEditor() && GLOBAL.editor.getSelected();
      }, 0);
    }

    setValue() {
      const selectedModel = GLOBAL.editor.getSelected();
      if (!selectedModel) {
        return;
      }
      const attrs = selectedModel.getAttributes();
      this.moType = attrs["mo-type"];
      this.detectChanges();
    }
  
    override ngOnDestroy() {
      GLOBAL.editor.getEditor().off(EditorConstants.COMP_TOGGLED_EVENT, this.handleOnCompToggled);
      GLOBAL.editor.getEditor().off(EditorConstants.SELECTED_COMP_REMOVED_EVENT, this.handleOnSelectedCompRemoved);
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['isOpen']) {
        this.selectedComp = GLOBAL.editor.getEditor() && GLOBAL.editor.getSelected();
        this.detectChanges();
      }
    }
    
    handleOnCompToggled = (comp: any) => {
      if (!comp) {
        return;
      }
      const selectedComp = GLOBAL.editor.getSelected();
      if (!selectedComp) {
        this.selectedComp = null;
        this.detectChanges();
        return;
      }
      this.selectedComp = selectedComp;
      this.isPage = selectedComp.getAttributes()['mo-type'] === 'page' ? true : false;
      this.setValue();
      this.detectChanges();
    }

    handleOnSelectedCompRemoved = () => {
      this.selectedComp = null;
      this.detectChanges();
    }

    handleOnTabClick(tabId: 'LAYOUT' | 'DESIGN') {
      if (this.selectedTab === tabId) {
        return;
      }

      this.selectedTab = tabId;
      this.detectChanges();
    }
    
  }
  