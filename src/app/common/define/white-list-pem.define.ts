import { DefineConstants } from "./constants.define";

export const WHITE_LIST_PEM: Array<{ pathCheck: Array<string>, pathURL: string }> = [
  // MODULE DASHBOARD
  {
    pathURL: DefineConstants.ROOT_PATH_DASHBOARD,
    pathCheck: [
      DefineConstants.ROOT_PATH_CALL_CENTER,
      DefineConstants.SUB_PATH_SOCIAL_FACEBOOK
    ]
  },
  // MODULE SOCIAL
  {
    pathURL: '',
    pathCheck: ['']
  }
];