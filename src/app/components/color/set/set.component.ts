import {
  Component, EventEmitter, Input,
  ChangeDetectionStrategy, Output, ViewChild, ElementRef
} from '@angular/core';
import { MoWbDetectionComponent } from '../../../components/detection.component';
import { IColorVar} from '../../../common/common-types';;
import { MoWbColorSetColorComponent } from './color/color.component';
import { IGradient } from './gradient/gradient.component';
import { uid } from 'uid';
@Component({
  selector: 'mo-wb-components-color-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoWbColorSetComponent extends MoWbDetectionComponent {

  top: number = 0;
  left: number = 0;

  selectedColor: IColorVar;
  @Input() direction: 'left' | 'top' | 'right' | 'bottom' = 'left';
  @Input() isOnlyColor: boolean = true;
  @Input() type: 'color' | 'gradient' | 'image' = 'color';
  @Input() width: number = 300;
  @Input() height: number = 660;
  @Input() zIndex: number = 3500;
  @Input() classInclude: string;
  @Input() isShow: boolean = false;
  @Input() inputColor: IColorVar = null;
  @Input() gradient: IGradient;

  @Output() onClose = new EventEmitter<any>();
  @Output() onSelectColor = new EventEmitter<IColorVar>();
  @Output() onColorChanged = new EventEmitter<IColorVar>();
  @Output() onGradientColorChanged = new EventEmitter<IGradient>();
  @Output() onSelectGradientColor = new EventEmitter<IGradient>();

  @ViewChild('colorSet') colorSetRef: MoWbColorSetColorComponent;

  override ngOnInit() {
  }

  override ngAfterViewInit() {
    this.selectedColor = this.inputColor;
    this.detectChanges();
  }

  override ngOnDestroy() {
  }
  
  show(target: HTMLElement) {
    const targetRect = target.getBoundingClientRect();
    this.top = Math.min(targetRect.top, window.innerHeight - this.height - 20);
    this.left = Math.min(targetRect.left - this.width - 40, window.innerWidth - this.width - 20);
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
    if (this.type === 'color') {
      const selectedColor = this.colorSetRef.getSelectedColor();
      this.onSelectColor.emit(selectedColor);
    }
    if (this.type === 'gradient') {
      this.onSelectGradientColor.emit(this.gradient);
    }
    this.close();
  }

  handleOnTypeChange(type: 'color' | 'image' | 'gradient') {
    this.type = type;
    if (this.type === 'color' && !this.inputColor) {
      this.inputColor = {
        color: '#ffffff',
        rgbColor: '255, 255, 255',
        alpha: 1,
        cssVar: '--c11'
      }
    }

    if (this.type === 'gradient' && !this.gradient) {
      this.gradient = {
        id: uid(),
        type: 'line',
        angle: 30,
        alpha: 1,
        colors: [
          {
            id: uid(),
            percent: 0,
            left: 0,
            color: {
              color: '#999999',
              rgbColor: '153, 153, 153',
              cssVar: '--c13',
              alpha: 1,
            }
          },
          {
            id: uid(),
            percent: 100,
            left: 0,
            color: {
              color: '#149FDC',
              rgbColor: '20, 159, 220',
              cssVar: '--c22',
              alpha: 1,
            }
          }
        ]
      };
    }
    this.detectChanges();
  }

  handleOnColorChanged(colorVar: IColorVar) {
    this.onColorChanged.emit(colorVar);
  }

  handleOnGradientColorChanged(gradient: IGradient) {
    this.gradient = gradient;
    this.onGradientColorChanged.emit(gradient);
  }
}
