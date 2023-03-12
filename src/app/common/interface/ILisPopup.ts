export interface IPopupItem {
  active: string;
  avatar_info: avatar_info;
  created_by: string;
  created_time: string;
  id: string;
  lead: number;
  merchant_id: string;
  popup_builder_info: avatar_info;
  popup_draft_id: string;
  popup_template_id: string;
  second_page: string;
  session: string;
  title: string;
  update_by: string;
  update_time: string;
  using_by: string;
  view: string;
  _id: string;
  avatar?: string;
  percent?: string;
  dynamic?: string;
}
export interface avatar_info {
  filename: string;
  format: string;
  url: string;
}
