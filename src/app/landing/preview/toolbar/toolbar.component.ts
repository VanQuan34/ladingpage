import {
  Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild
} from '@angular/core';
import { MoWbBaseComponent } from '../../../components/base.component';
import { ILandingPage, IPage } from '../../editor/root.service';
import { MoLandingPreviewDevicesComponent } from './devices/devices.component';

@Component({
  selector: 'mo-wb-landing-preview-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoLandingPreviewToolbarComponent extends MoWbBaseComponent {

  @Input() selectedPageId: string = '';
  @Input() isOpen: boolean = false;
  @Input() zIndex: number = 5000;
  @Input() canvasEl: HTMLElement;
  @Input() landingPage: ILandingPage;

  @Output() onBack = new EventEmitter<any>();
  @Output() onSelectedItemChanged = new EventEmitter<any>();
  @Output() onSelectedPageChanged = new EventEmitter<any>();

  @ViewChild('deviceEl') deviceRef: MoLandingPreviewDevicesComponent;

  override onInit() {
  }

  override async onAfterInit() {
    this.detectChanges();
  }

  override onDestroy() {
  }

  setCanvasWidth(width: number) {
    this.deviceRef.setCanvasWidth(width);
  }

  close() {
    this.onBack.emit({});
  }

  /**
   * handle on back click
   * @param event 
   */
  handleOnBackClick(event: MouseEvent) {
    this.close();
  }

  /**
   * handle on selected device changed
   * @param device 
   */
  handleOnSelectedDeviceChanged(device: any) {
    this.onSelectedItemChanged.emit(device);
  }

  /**
   * handle on public button click
   * @param event 
   */
  handleOnPublicButtonClick(event: MouseEvent) {
  }

  /**
   * handle on selected page change
   * @param page 
   */
  handleOnSelectedPageChanged(page: IPage) {
    this.onSelectedPageChanged.emit(page);
  }

  
}
