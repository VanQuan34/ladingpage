export interface ITag {
    tag_id?: any;
    tag_type?: number; // 100 - xoa duoc, 200 - khong xoa duoc
    tag_name?: string;
    display_tag?: any;
    display_suggest?: any;
    icon?: Array<IconTooltip>;
}

export interface IconTooltip {
    iconClass: string;
    content?: string;
    direction?: number;
    width: number;
}