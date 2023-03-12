import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoGalleryBlock {
  constructor() {

  }

  static getBlock() {
    const newId: string = `b${uid()}`;
    const blockItem: IBlock = this.getBlockItem(newId);
    
    this.setBlockContent(blockItem, newId);

    return blockItem;
  }

  /**
   * get block item
   * @param newId
   * @returns 
   */
  static getBlockItem(newId: string): IBlock {
    const blockItem: IBlock = {
      id: `comp-${newId}`,
      width: {
        isEnable: true,
        value: '50',
        unit: '%',
        units: GLOBAL.unit.getUnits(['%', 'px', 'auto', 'line', 'vw', 'vh', 'line', 'max-content'])
      },
      minWidth: {
        isEnable: true,
        value: 300,
        unit: 'px',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      maxWidth: {
        isEnable: true,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      height: {
        isEnable: true,
        value: '400',
        unit: 'px'
      },
      minHeight: {
        isEnable: false,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },

      maxHeight: { isEnable: false, unit: 'none' },
      content :  null,
      dragContent: {
        content: '',
        width: '300px',
        height: '200px'
      }
    };

    return blockItem;
  }

  /**
   * set block content
   * @param blockItem 
   * @param newId 
   */
  static setBlockContent(blockItem: IBlock, newId: string) {
  
    blockItem.content =  {
      style: `
        #${newId} {
          height: 400px;
          width: 50%;
          overflow: hidden;
          --rd: 0px 0px 0px 0px;
          --trans1: border-color 0.4s ease 0s, background-color 0.4s ease 0s;
          --shd: none;
          --horizontalPadding: 0px;
          --verticalPadding: 0px;
          --trans2: color 0.4s ease 0s;
          --txt: var(--c11);
          --bg: rgba(var(--c11) ,1);
          --bgh: rgba(var(--c22) ,1);
          --brd: var(--c15);
          --brw: 0px;
          --bgh: var(--c23);
          --txth: var(--c15);
          --txtd: 255,255,255;
          --label-align: center;
          --theme-font: font-8;
          --margin-left: 0px;
          --margin-right: 0px;
          --shd: none;
          --on-thumb: true;
          --arrow: default;
          --position: bottom;
          --size-icon: 40px;
          --width-thumb: 120px;
          --height-thumb: 90px;
          --height-gallery: 300px;
          --gap-thumb: 10px;
          --gap-gallery: 10px;
          --btn-color: rgba(var(--c15), 1);
          --width-position: 0px;
          
          border-width: var(--brw);
          border-style: var(--brs);
          border-color: var(--brc);
          border-radius: var(--rd,5px);
          background: var(--bg);
          box-shadow: var(--shd);
          border-radius: var(--rd,5px);
          transition: var(--trans1,border-color .4s ease 0s,background-color .4s ease 0s);
        }

        .mo-gallery-item-container {  
          display: flex;
          flex-flow: row nowrap;
          position: absolute;
          top: 0;
          left: 0;  
          overflow: hidden;
          width: 100%;
        }

        #${newId} .mo-gallery-item-container .gallery-item{
        height: var(--height-gallery);
        }

        .gallery-item {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform .5s ease-in-out;
        }
        .mo-gallery-item-container .gallery-item {
          min-width: 100%;
        }

        .mo-gallery-control{
          display: inline-flex;
          display: -webkit-inline-flex;
          row-gap: var(--gap-thumb);
          position: absolute;
          bottom: 0;
          left: 0;
        }
        
        .mo-gallery-item-container.flickity-enabled:not(.is-fullscreen), 
        .mo-gallery-control.flickity-enabled:not(.is-fullscreen){
          position: relative !important;
          display: block !important;
         }

        #${newId} .mo-gallery-control-item {
          width: var(--width-thumb);
          height: var(--height-thumb);
          margin-right: var(--gap-thumb);
        }

        .gallery-item svg {
          top: 50%;
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .gallery-item svg path{
          fill: rgb(0 0 0 / 80%);
        }
        .mo-gallery-control .gallery-item svg{
          width: 35px;
        }
        .gallery-video iframe{
          height: var(--height-gallery);
        }

        #${newId} .flickity-prev-next-button .arrow{
          fill: var(--btn-color);
        }

        #${newId} .mo-gallery-item-container .gallery-item[data-index="0"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }

        #${newId} .mo-gallery-item-container .gallery-item[data-index="1"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${newId} .mo-gallery-item-container .gallery-item[data-index="2"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${newId} .mo-gallery-item-container .gallery-item[data-index="3"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${newId} .mo-gallery-item-container .gallery-item[data-index="4"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${newId} .mo-gallery-control .gallery-item[data-index="0"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }

        #${newId} .mo-gallery-control .gallery-item[data-index="1"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${newId} .mo-gallery-control .gallery-item[data-index="2"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${newId} .mo-gallery-control .gallery-item[data-index="3"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${newId} .mo-gallery-control .gallery-item[data-index="4"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        [data-position="left"] .mo-gallery-control, [data-position="right"] .mo-gallery-control  {
          display: inline-grid;
          bottom: auto;
        }
        [data-position="left"] .mo-gallery-item-container{
          width: calc(100% - var(--width-thumb) - var(--gap-gallery));
          right:0;
          left: auto;
          top: 0;
        }
        [data-position="left"] .mo-gallery-control{
          right:auto;
          left: 0;
          top: 0;
        }
        [data-position="right"] .mo-gallery-item-container{
          width: calc(100% - var(--width-thumb) - var(--gap-gallery));
          right:auto;
          left: 0;
          top: 0;
        }
        [data-position="right"] .mo-gallery-control{
          right:0;
          left: auto;
          top: 0;
        }
        [data-position="top"] .mo-gallery-item-container{
          width: 100%;
          bottom:0;
          left: 0;
          top: auto;
        }
        [data-position="top"] .mo-gallery-control{
          left:0;
          right: auto;
          top: 0;
        }


      `,
      html: `
    <div id="${newId}" mo-type="gallery" class="mo-comp mo-comp-bg mo-comp-container" data-thumb="true">
      <div class="mo-gallery-item-container" data-flickity='{"pageDots": false , "cellSelector" : ".gallery-item" , "asNavFor" : ".mo-gallery-item-container"}'>
        <div id="gl-item-${uid()}" class="gallery-item gallery-item-preview" data-index="0"></div>
        <div id="gl-item-${uid()}" class="gallery-item gallery-item-preview" data-index="1"></div>
        <div id="gl-item-${uid()}" class="gallery-item gallery-item-preview" data-index="2"></div>
        <div id="gl-item-${uid()}" class="gallery-item gallery-item-preview" data-index="3"></div>
        <div id="gl-item-${uid()}" class="gallery-item gallery-item-preview" data-index="4"></div>
      </div>

      <div class="mo-gallery-control"
        data-flickity='{ "asNavFor": ".mo-gallery-item-container", "contain": true, "pageDots": false }'>
        <div class="mo-gallery-control-item gallery-item" data-index="0"></div>
        <div class="mo-gallery-control-item gallery-item" data-index="1"></div>
        <div class="mo-gallery-control-item gallery-item" data-index="2"></div>
        <div class="mo-gallery-control-item gallery-item" data-index="3"></div>
        <div class="mo-gallery-control-item gallery-item" data-index="4"></div>
      </div>
    </div>
      `,
      ids: [newId]
    };
    
    // drag content 
    blockItem.dragContent.content = ``;
  }
}



export {
  MoGalleryBlock
}