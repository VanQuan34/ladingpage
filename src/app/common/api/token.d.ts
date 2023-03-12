export interface IToken {
  id?: string;                    // mã nhân viên
  adminAccountID?: string;        // thuộc tính cũ không sử dụng nữa thay bằng thuộc tính ID
  xPointJoinState?: number;       // TrangThaiThamGiaxPoint
  supplierCode?: string;          // Mã nhà cung cấp
  avatar?: string;                // avatar merchart
  avatarCollapse?: string;        // avatar merchart collapse
  accessName?: string;            // Ten truy cap
  merchantName?: string;          // Ten nha cung cap
  merchantID?: string;            // Nhà cung cấp ID
  merchantCode?: string;          // Nhà cung cấp code
  permissions?: string[];         // Danh sach quyen
  typeSupplier?: number;          // Kieu nha cung cap
  typeCumulativePoint?: number;   // KieuTichLuyDiem (chi hien thi khi xPointJoinState !== 3)
  statusUseCallCenter?: number;   // SuDungTongDai
  staff_avatar?: string;
  group?: string;                 // MaNhom
  isAdmin?: number;               // 1: Admin, 2: Normal
  isMobio?: number;               // 1: Mobio, 2: Others
  role_group?: string;            // 'owner or admin or manager or user'
  // new key
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  status?: number;
  callCenter?: {
    auth_username?: string;
    extension?: string;
    extension_id?: string;
    ip_address?: string;
    password?: string;
    pbx_number?: string;
    port?: number;
  };
  function?: any[];
  is_sub_brand?: boolean;
  type?: Array<string>; // merchant thuộc loại gì? Bank ....
}
