import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  Output,
  Input,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Injector,
  ViewRef,
} from "@angular/core";
import { MoWbDetectionComponent } from "../../../../components/detection.component";
import * as $ from "jquery";
import { GLOBAL } from "../../editor-wrapper";

@Component({
  selector: "mo-wb-landing-editor-inspector-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoLandingEditorInspectorLayoutComponent extends MoWbDetectionComponent {
  moType: string;
  @Input() classInclude: string = "";
  override ngOnInit() {}

  override ngAfterViewInit() {
    setTimeout(() => {
      GLOBAL.editor.getEditor().on('component:toggled', this.handleOnCompToggled);
      this.setValue();
      this.detectChanges();
    }, 0);
  }

  override ngOnDestroy() {
    GLOBAL.editor.getEditor().off('component:toggled', this.handleOnCompToggled);
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
  handleOnCompToggled = (comp: any) => {
    if (!comp) {
      return;
    }
    this.setValue();
  }
}
