import { Component, OnInit, Input, TemplateRef, EventEmitter, ViewChild, Output, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mo-wb-components-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, OnChanges, OnDestroy {
  public class: string = '';

  @Input() type: 'blue-solid' | 'blue-border' | 'dark' |  'transparent' | 'red' | 'red-border' 
    | 'text-blue' | 'text-dark' | 'text-red' | 'gray' |  'icon' | 'icon-only' |  'text-selected' | string = 'blue-solid';
  @Input() label: string = '';
  @Input() disable: boolean = false;
  @Input() isPending: boolean = false;
  @Input() classInclude: string;
  @Input() classIconLeft: string;
  @Input() classIconRight: string;
  @Input() classLabel: string;
  @Input() tooltipContent: string = '';
  @Input() timeHideTooltipOnMouseout: number;
  @Input() maxWidthTooltip: number = 0;
  @Input() maxHeightTooltip: number = 0;
  @Input() templateOutlet!: TemplateRef<any>;
  @Input() direction: string = '';
  @Input() noContentTooltipPadding: boolean = false;
  @Input() ignoreCaculatorMaxHeightTooltipContent: boolean = false;

  @Output() onPropsEle: EventEmitter<any> = new EventEmitter();
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('buttonEl') buttonEl!: ElementRef;

  constructor(
  ) {
    this.type = 'blue-solid';
    this.classLabel = '';
    this.classInclude = '';
    this.classIconLeft = '';
    this.classIconRight = '';
    this.timeHideTooltipOnMouseout = 50;
  }

  ngOnInit() {
    this.setClassButton();
  }

  ngOnChanges(change: SimpleChanges) {
    if (change && change['type'] && change['type'].previousValue && change['type'].currentValue) {
      this.setClassButton();
    }
  }

  private setClassButton() {
    switch (this.type) {
      case 'blue-solid':
        this.class = 'mo-wb-button mo-wb-button-blue-solid';
        break;
      case 'blue-border':
        this.class = 'mo-wb-button mo-wb-button-blue-border';
        break;
      case 'dark':
        this.class = 'mo-wb-button mo-wb-button-dark';
        break;
      case 'transparent':
        this.class = 'mo-wb-button mo-wb-button-transparent';
        break;
      case 'red':
        this.class = 'mo-wb-button mo-wb-button-red';
        break;
      case 'red-border':
        this.class = 'mo-wb-button mo-wb-button-red-border';
        break;
      case 'text-blue':
        this.class = 'mo-wb-button-text mo-wb-button-text-blue';
        break;
      case 'text-dark':
        this.class = 'mo-wb-button-text mo-wb-button-text-dark';
        break;
      case 'text-red':
        this.class = 'mo-wb-button-text mo-wb-button-text-red';
        break;
      case 'gray':
        this.class = 'mo-wb-button mo-wb-button-gray';
        break;
      case 'icon':
        this.class = 'mo-wb-button mo-wb-button-icon';
        break;
      case 'icon-only':
        this.class = 'mo-wb-button mo-wb-button-icon-only';
        break;
      case 'text-selected':
        this.class = 'mo-wb-button mo-wb-button-selected';
        break;
      case 'text-bg-selected':
        this.class = 'mo-wb-button mo-wb-button-selected mo-wb-button-icon-selected';
        break;
      case 'icon-selected':
        this.class = 'mo-wb-button mo-wb-button-icon mo-wb-button-icon-selected';
        break;
      default:
        this.class = 'mo-wb-button mo-wb-button-blue-solid';
        break;
    }

    this.class = `${this.class}`;
  }

  clickButton(e: any) {
    if (this.disable || this.isPending) {
      return;
    }
    // this.renderer.invokeElementMethod(this.buttonEl.nativeElement, 'blur', []);
    this.onPropsEle.emit(this.buttonEl.nativeElement);
    this.onClick.emit(e);
  }

  ngOnDestroy() {
  }

}
