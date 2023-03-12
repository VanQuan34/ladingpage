import { uid } from 'uid';
import { MoWbColorComponent } from '../components/color/color.component';

interface IColorVar {
  color: string,
  rgbColor?: string,
  cssVar?: string;
  alpha?: number;
}


interface IColorModal {
  Instance: MoWbColorComponent | undefined,
  ColorChangedEventSubscription: any,
  ColorSubmitEventSubscription: any,
  ColorCloseEventSubscription: any,
  Modal: any
}

let ColorPickerModal: IColorModal = {
  Instance: undefined,
  Modal: undefined,
  ColorChangedEventSubscription: undefined,
  ColorSubmitEventSubscription: undefined,
  ColorCloseEventSubscription: undefined
}

interface IFontItem {
  id: string;
  title: string;
  value: string;
  html: string;
  url?: string;
  fontStyle: Array<any>,
  url_info?: any;
}

interface IFont {
  DefaultFonts: IFontItem[];
  AllFonts: IFontItem[];
  MoreFonts: IFontItem[];
  IgnoreFonts: string[];
  IframeFonts: IFontItem[];
}

let Fonts: IFont = {
  AllFonts: [],
  IgnoreFonts: ['Lato', 'Poppins', 'Open Sans', 'Roboto'],
  DefaultFonts: [
    {
      id: 'Arial',
      title: 'Arial',
      value: 'Arial',
      html: `<span style="font-family: Arial">Arial</span>`,
      fontStyle: [{ style: 'normal', weight: [400, 700] }, { style: 'italic', weight: [400, 700] }],
    },
    {
      id: 'Tahoma',
      title: 'Tahoma',
      value: 'Tahoma',
      html: `<span nstyle="font-family: Tahoma">Tahoma</span>`,
      fontStyle: [{ style: 'normal', weight: [400, 700] }, { style: 'italic', weight: [400, 700] }],
    },
    {
      id: 'Times New Roman',
      title: 'Times New Roman',
      value: 'Times New Roman',
      html: `<span style="font-family: 'Times New Roman'">Times New Roman</span>`,
      fontStyle: [{ style: 'normal', weight: [400, 700] }, { style: 'italic', weight: [400, 700] }],
    },

  ],
  MoreFonts: [
    // {
    //   id: 'Lato',
    //   title: 'Lato',
    //   html: `<span style="font-family: Lato">Lato</span>`,
    //   fontStyle: [{ style: 'normal', weight: [300, 400, 700] }, { style: 'italic', weight: [300, 400, 700] }],
    //   url: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300&family=Sen:wght@800&display=swap',
    //   url_info: {
    //     url: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300&family=Sen:wght@800&display=swap',
    //   }
    // },
    // {
    //   id: 'Poppins',
    //   title: 'Poppins',
    //   html: `<span style="font-family: Poppins">Poppins</span>`,
    //   fontStyle: [{ style: 'normal', weight: [300, 400,500, 600, 700, 800] }, { style: 'italic', weight: [300, 400,500, 600, 700, 800] }],
    //   url: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
    //   url_info: {
    //     url: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
    //   }
    // },
    {
      id: 'Roboto',
      title: 'Roboto',
      value: 'Roboto',
      html: `<span style="font-family: Roboto, sans-serif;">Roboto</span>`,
      fontStyle: [{ style: 'normal', weight: [300, 400,500, 600, 700, 800] }, { style: 'italic', weight: [300, 400,500, 600, 700, 800] }],
      url: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&display=swap',
      url_info: {
        url: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&display=swap',
      }
    },
    {
      id: 'Open Sans',
      title: 'Open Sans',
      value: 'Open Sans',
      html: `<span style="font-family: 'Open Sans', sans-serif;">Open Sans</span>`,
      fontStyle: [{ style: 'normal', weight: [300, 400,500, 600, 700, 800] }, { style: 'italic', weight: [300, 400,500, 600, 700, 800] }],
      url: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
      url_info: {
        url: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
      }
    },
  ],
  IframeFonts: []
}

const MoCompLabel: any = {
  'text': 'Văn bản',
  'button': 'Nút bấm',
  'section': 'Phần',
  'page': 'Trang',
  'container': 'Vùng chứa',
  'header': 'Đầu trang',
  'footer': 'Chân trang',
  'repeater': 'Bố cục lặp',
  'repeater-item': 'Mục',
  'gallery' : 'Bộ sưu tập',
  'tabs' : 'Tabs',
  'tab-content' : 'Nội dung tab',
  'accordion': 'Accordion',
  'accordion-content': 'Nội dung Accordion',
  'carousel': 'Thanh trượt',
  'field-button': 'Trường nút',
  'field-input': 'Trường nhập thông tin',

  'menu': 'Menu'
};

export {
  ColorPickerModal,
  Fonts,
  IFontItem,
  IColorVar,
  MoCompLabel
}