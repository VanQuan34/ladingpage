import { DefineConstants } from './constants.define';

export class DefineSocket {
    public static readonly SENDER_TYPE_MOBIO: number = 1;
    public static readonly SENDER_TYPE_MERCHANT: number = 2;
    public static readonly SENDER_TYPE_STAFF: number = 3;
    public static readonly SENDER_TYPE_CUSTOMER: number = 4;
    public static readonly SENDER_TYPE_FB_USER: number = 5;

    public static readonly RECEIVER_TYPE_MOBIO: number = 1;
    public static readonly RECEIVER_TYPE_MERCHANT: number = 2;
    public static readonly RECEIVER_TYPE_STAFF: number = 3;
    public static readonly RECEIVER_TYPE_CUSTOMER: number = 4;
    public static readonly RECEIVER_TYPE_FB_USER: number = 5;

    public static readonly BODY_TYPE_DISCONNECT_PAGE: number = 1;
    public static readonly BODY_TYPE_ADD_PAGE: number = 2;
    public static readonly BODY_TYP_NEW_TOPIC: number = 3;
    public static readonly BODY_TYPE_NEW_COMMENT: number = 4;
    public static readonly BODY_TYPE_NEW_MESSAGE: number = 5;
    public static readonly BODY_TYPE_NEW_EVSLUATE: number = 6;

    public static readonly GET_TOAST_CLASS_BY_SOCIAL_TYPE: Function = (socialType: number) => {
        switch (socialType) {
            case DefineConstants.SOCIAL_TYPE_FACEBOOK:
                return 'toast toast-social toast-facebook';
            case DefineConstants.SOCIAL_TYPE_INSTAGRAM:
                return 'toast toast-social toast-instagram';
            case DefineConstants.SOCIAL_TYPE_ZALO:
                return 'toast toast-social toast-zalo';
            case DefineConstants.SOCIAL_TYPE_YOUTUBE:
                return 'toast toast-social toast-youtube';
            case DefineConstants.SOCIAL_TYPE_MOBILE_APP:
                return 'toast toast-social toast-mobio';
            case DefineConstants.SOCIAL_TYPE_LINE:
                return 'toast toast-social toast-line';
            case DefineConstants.SOCIAL_TYPE_WEB_LIVE_CHAT:
                return 'toast toast-social toast-web-live-chat';
        }
    }
}
