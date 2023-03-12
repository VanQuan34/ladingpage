export interface IMenu {
  idFE?: string;
  label: string;
  link?: string;
  level?: number;
  icon?: string;
  isLabel?: boolean;
  active?: boolean;
  collapse?: boolean;
  offPermission?: boolean;
  group?: Array<IMenu>;
  mergeToFirstLevel?: Array<IMenu>;
  classLabel?: string;
  subLabelTopRight?: string;
  subsLink?: Array<string>;
  menuHasSubLink?: IMenu; // không cần khai báo trong menu define, chỉ dùng để build dữ liệu trong authen service
  idGroup?: string; // không cần khai báo trong menu define, chỉ dùng để build dữ liệu trong authen service
}
