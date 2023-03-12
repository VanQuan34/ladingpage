import { DefineFunction } from "../../../common/define/function.define";
import { IMentionsConfig } from "../interfaces/mention-config.interface";
export const PATTERN_INSERT = '\ufeff';

export const buildTemplate = (value: string, id: string, feId: string, color: string): string => {
  return `<strong contenteditable="false" style="color:${color || 'blue'}" id="${id}" feId="${feId}"><strong>${value}</strong></strong>&nbsp;`;
};

export const DEFAULT_CONFIG: IMentionsConfig = {
  items: [],
  triggerChar: '@',
  labelKey: 'email',
  allowSpace: true,
  returnTrigger: false,
  limitSpaceSearchQuery: 3,
  mentionEventName: 'click',
  mentionActionByEvent: (item, trigger) => {
    console.log(item, trigger);
  },
  mentionSelect: (item: any) => {
    return `@${item['email']}`;
  },
  mentionFilter: (search: string, items: any[]) => {
    const searchString = DefineFunction.convertCitationVietnameseUnsigned(search.toLowerCase());

    return items.filter(item => {
      const name = DefineFunction.convertCitationVietnameseUnsigned(item.name.toLowerCase());
      const userName = DefineFunction.convertCitationVietnameseUnsigned(item.username.toLowerCase());
      return name.includes(searchString) || userName.includes(searchString);
    });
  }
};