import { uid } from 'uid';
import { GLOBAL } from '../../editor-wrapper';
import { IBlock } from '../blocks.service';

class MoCarouselBlock {
  constructor() {

  }

  static getBlock() {
    const newUid: string = `${uid()}`;
    const blockItem: IBlock = this.getBlockItem(newUid);
    this.setBlockContent(blockItem, newUid);
    return blockItem;
  }

  /**
   * get block item
   * @param newUid
   * @returns 
   */
  static getBlockItem(newUid: string): IBlock {
    const blockItem: IBlock = {
      id: `comp-${newUid}`,
      width: {
        isEnable: true,
        value: '50',
        unit: '%',
        units: GLOBAL.unit.getUnits(['%', 'px', 'auto', 'line', 'vw', 'vh', 'line', 'max-content'])
      },
      minWidth: {
        isEnable: true,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      maxWidth: {
        isEnable: false,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      height: {
        isEnable: false,
        value: '',
        unit: 'none'
      },
      minHeight: {
        isEnable: false,
        value: '',
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
      maxHeight: { 
        isEnable: false,
        value: 0,
        unit: 'none',
        units: GLOBAL.unit.getUnits(['%', 'px', 'none', 'line', 'vw', 'vh'])
      },
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
   * @param uId 
   */
  static setBlockContent(blockItem: IBlock, uId: string) {
    const id = `comp-${uId}`;

    blockItem.content = {
      style: `
        #${id} {
          width: 50%;
          display: grid;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;

          --bg: rgba(var(--c11) ,1);
          --rd: 0px 0px 0px 0px;
          --shd: none;
          --boxShadowToggleOn-shd: none;
          --width: 250px;
          --height: 250px;
          --column-gap: 30px;
          --btn-color: rgba(var(--c15), 1);
          --on-dots: false;

          --autoplay: true;
          --time-play: 5;
          --arrow: default;
          --size-icon: 40px;
          --size-item: 170px;

          border-radius: var(--rd);
          background: var(--bg);
          border-width: var(--brw);
          border-style: var(--brs);
          border-color: var(--brc);
          box-shadow: var(--shd);
          overflow: hidden;
        }
        
        #${id} .mo-carousel-container .item-carousel[data-index="0"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${id} .mo-carousel-container .item-carousel[data-index="1"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${id} .mo-carousel-container .item-carousel[data-index="2"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${id} .mo-carousel-container .item-carousel[data-index="3"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        #${id} .mo-carousel-container .item-carousel[data-index="4"] {
          background-image: url("./assets/images/thumb-gallery.png");
        }
        
        #${id} .item-carousel{
          min-width: var(--width);
          height: var(--height);
          margin-right: var(--column-gap);
        }

        .item-carousel{
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          position: relative;
          transition: transform 0.5s ease-in-out 0s;
          display:inline-block;
        }

        .mo-carousel-container:not(.flickity-enabled) {
          width: 1000%;
        }
        #${id} .flickity-enabled{
          padding-bottom: 30px;
        }
        .flickity-page-dots {
          position: absolute;
          width: 100%;
          bottom: 0px;
          padding: 0;
          margin: 0;
          list-style: none;
          text-align: center;
          line-height: 1;
        }
        .flickity-page-dots .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin: 0 8px;
          background: #9f9f9f;
          border-radius: 50%;
          cursor: pointer;
        }
        .flickity-page-dots .dot.is-selected{
          background: var(--btn-color);
        }
        .flickity-button path{
          fill: var(--btn-color);
        }
        .flickity-enabled.is-fullscreen {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: hsla(0, 0%, 0%, 0.9);
          padding-bottom: 35px;
          z-index: 1;
        }
        
        .flickity-enabled.is-fullscreen .flickity-page-dots {
          bottom: 10px;
        }
        html.is-flickity-fullscreen {
          overflow: hidden;
        }
        .flickity-fullscreen-button {
          display: block;
          right: 10px;
          top: 10px;
          width: 24px;
          height: 24px;
          border-radius: 4px;
        }
        .flickity-fullscreen-button.flickity-fullscreen-button-exit { display: none; }
        .is-fullscreen .flickity-fullscreen-button-exit { display: block; }
        .is-fullscreen .flickity-fullscreen-button-view { display: none; }
        .flickity-fullscreen-button .flickity-button-icon {
          position: absolute;
          width: 16px;
          height: 16px;
          left: 4px;
          top: 4px;
        }
        .flickity-fullscreen-button-view {
          position: absolute;
          background: hsla(0,0%,100%,.75);
          border: none;
          color: #333;
        }
        .flickity-fullscreen-button-exit{
          position: absolute;
          background: hsla(0,0%,100%,.75);
          border: none;
          color: #333;
        }
        .is-fullscreen .item-carousel{
          width: 100vw;
          height: 100vh !important;
          background-size: contain !important;
        }
        .flickity-button[disabled] {
          opacity: .3;
        }
      `,
      html: ` 
        <div id="${id}" mo-type="carousel" class="mo-comp mo-comp-bg mo-comp-container">
          <div class="mo-carousel-container" data-flickity='{ "groupCells": true, "contain": true, "fullscreen": true }'>
            <div class="item-carousel" data-index="0"></div>
            <div class="item-carousel" data-index="1"></div>
            <div class="item-carousel" data-index="2"></div>
            <div class="item-carousel" data-index="3"></div>
            <div class="item-carousel" data-index="4"></div>
          </div>
        </div>
      `,
      ids: [id]
    };
  }
}

export {
  MoCarouselBlock 
}