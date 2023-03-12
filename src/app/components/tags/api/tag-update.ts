export interface IUpdateTagsProfile {
  profile_id?: string;
  staff_id?: string;
  phone_number?: string;
  social_id?: string;
  tags: Array<ITagsUpdate>;
  social_info?: ITagsUpdateSocial;
}


export interface ITagsUpdate {
  id?: string;
  name?: string;
  num_increase?: number;
}


export interface ITagsUpdateSocial {
  social_id?: string;
  social_type?: number;
  social_id_type?: number;
  social_name?: string;
}
