import { Injectable } from '@angular/core';

import { MoTextBlock }  from './text/text-bock';
import { MoButtonBlock } from './button/button-block';
import { MoRepeaterBlock } from './repeater/repeater';
import { HTMLComp } from 'src/app/utils/compUtil';
import { MoRepeaterItemBlock } from './repeater/repeater-item';
import { MoContainerBlock } from './container/container';
import { MoGalleryBlock } from './gallery/gallery';
import { MoCarouselBlock } from './carousel/carousel';
import { MoMenuBlock } from './menu/menu';
import { MoFormBlock } from './form/form-block';
import { MoFieldButtonBlock } from './form/field-button';
import { MoFieldInputBlock } from './form/field-input';
import { MoSectionBlock } from './section/section';
import { MoHeaderBlock } from './header/header';
import { MoFooterBlock } from './footer/footer';
import { MoTabsBlock } from './tabs/tabs';
import { MoTabsContentBlock } from './tabs/tab-content';
import { MoAccordionBlock } from './accordion/accordion';
import { MoAccordionContentBlock } from './accordion/content';
import { MoTableBlock } from './table/tables';

interface IBlockSize {
  isEnable: boolean;
  value?: any;
  unit?: '%' | 'auto' | 'px' | 'none' | any;
  units?: any[];
}

interface IBlock {
  id: string,
  content: HTMLComp,
  dragContent: {
    width: string,
    height: string,
    content: string
  },
  width: IBlockSize,
  minWidth: IBlockSize,
  maxWidth: IBlockSize,
  height: IBlockSize,
  minHeight: IBlockSize,
  maxHeight: IBlockSize,
  
}

@Injectable()
class MoBlocksService {

	constructor() {
	}

  getContentBlock(id: string): IBlock {
    switch (id) {
      case 'title':
        return MoTextBlock.getBlock(true);
      case 'text':
        return MoTextBlock.getBlock();
      case 'form':
        return MoFormBlock.getBlock();
      case 'field-button':
        return MoFieldButtonBlock.getBlock();
      case 'field-input':
        return MoFieldInputBlock.getBlock();
      case 'button':
        return MoButtonBlock.getBlock();
      case 'repeater':
        return MoRepeaterBlock.getBlock();
      case 'repeater-item':
        return MoRepeaterItemBlock.getBlock();
      case 'container':
        return MoContainerBlock.getBlock();
      case 'gallery': 
        return MoGalleryBlock.getBlock();
      case 'carousel':
        return MoCarouselBlock.getBlock();
      case 'tabs' :
        return MoTabsBlock.getBlock();
      case 'tab-content':
        return MoTabsContentBlock.getBlock();
      case 'accordion':
        return MoAccordionBlock.getBlock();
      case 'accordion-content':
        return MoAccordionContentBlock.getBlock();
      case 'table':
        return MoTableBlock.getBlock();          
      case 'section':
        return MoSectionBlock.getBlock();
      case 'header':
        return MoHeaderBlock.getBlock();
      case 'footer':
        return MoFooterBlock.getBlock();
      case 'menu':
        return MoMenuBlock.getBlock();
      default:
        break;
    }
    return null;
  }
}

export {
  MoBlocksService,
  IBlockSize,
  IBlock
}
