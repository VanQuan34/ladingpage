/* eslint-disable @typescript-eslint/no-explicit-any */

import { Subscription } from "rxjs";


export interface IMentionsConfig extends IMentionsItem {
  disableStyle?: boolean;
  mentions?: Array<IMentionsItem>;
}

export interface IMentionsItem {
  triggerChar?: string;

  // option to specify the field in the objects to be used as the item label
  labelKey?: string;

  // option to limit the number of items shown in the pop-up menu
  disableSort?: boolean;

  // option to disable internal filtering. can be used to show the full list returned
  // from an async operation
  disableSearch?: boolean;

  // display menu above text instead of below
  dropUp?: boolean;

  // whether to allow space while mentioning or not
  allowSpace?: boolean;
  limitSpaceSearchQuery?: number;

  // option to include the trigger char in the searchTerm event
  returnTrigger?: boolean;

  // optional function to format the selected item before inserting the text
  mentionSelect?: (item: any, triggerChar?: string) => (string);

  // optional function to customize the search implementation
  mentionFilter?: (searchString: string, items?: any) => (any[]);

  mentionEventName?: 'click' | 'mouseenter';
  mentionActionByEvent?: (item: any, triggerChars?: string) => void,
  items: Array<IMentionsConfigItemData>;
  maxItems?: number
}

export interface IMentionsConfigItemData {
  ngClassWrapper?: Record<string, string>;
  ngClassLabel?: Record<string, string>;
  [key: string]: any;
}

export interface INodeInsert {
  elementSpan: HTMLSpanElement;
  subscription?: Subscription;
  item: IMentionsConfigItemData;
  triggerChar?: string;
  manualAdd?: boolean;
}