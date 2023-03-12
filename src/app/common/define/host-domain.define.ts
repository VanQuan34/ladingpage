import { DefineFunction } from './function.define';
import { CacheKeys } from './cache-keys.define';
import { CacheService } from '../../api/common/cache.service';
import { DefineConstants } from './constants.define';

export const DOMAIN_SITE = (): string => {
    return '#DOMAIN_WEB#';
};

export const DOMAIN_GET_SOURCES_STATIC = (): string => {
    return 'https://test1.mobio.vn/static/';
    // return `${DOMAIN_SITE()}/static/`;
};

export const DOMAIN_GET_SOURCES_STATIC_TEMPLATE_EXCEL = (): string => {
    return `${DOMAIN_SITE()}/static/`;
};

export const DOMAIN_PUBLIC = (): string => {
    return 'https://t1.mobio.vn/';
    //return `#DOMAIN_RESOURCES_PUBLIC#`;
};

export const FE_TOOLS_HOST = () => {
    return '#FE_TOOLS_HOST#';
}

export const DOMAIN_DOWNLOAD_SITE = () => {
    return CacheService.Get(CacheKeys.KEY_CACHE_PATH_PROFILING, '');
};

export const BASE_PATH = (): string => {
    // const domain = localStorage.getItem(CacheKeys.KEY_CACHE_DOMAIN_CONFIG_LOGIN) || '';
    // return DefineFunction.validateUrl(domain) ? domain : '#DOMAIN_API#/';
    // return 'https://api-test1.mobio.vn/';
    return 'https://api.mobio.vn/';
};

export const HOST_BASE = () => {
    return `${BASE_PATH()}api/v1.0/`;
};

export const HOST_ADM = () => {
    return `${BASE_PATH()}adm/api/v2.1/`;
};

export const HOST_MAIL = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_MAIL_CLIENT, BASE_PATH())}mailclient/api/v1.0/`;
};

export const HOST_SMART_WIFI = () => {
    return CacheService.Get(CacheKeys.KEY_CACHE_SMART_WIFI, '');
};

export const HOST_API_SMART_WIFI = () => {
    return CacheService.Get(CacheKeys.KEY_CACHE_SMART_WIFI_API, '');
};

export const HOST_BRANDING_SMART_WIFI = () => {
    return CacheService.Get(CacheKeys.KEY_CACHE_SMART_WIFI_BRAND_ID, '');
};

export const HOST_3RD_CMS = () => {
    return 'https://api.map.pingcom.vn/';
};

export const HOST_API_KEY_3RD_CMS = () => {
    return 'd01f7d6615de1b4415bbbfcd3f4fb021';
};

export const HOST_BRANDING_3RD_CMS = () => {
    return '1e012518-cb66-11e8-b964-0242ac150004';
};

export const HOST_MARKETING = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_MARKETING, BASE_PATH())}mkt/api/v2.0/`;
};

export const HOST_CMS_SAMSUNG = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_SAMSUNG_CMS, BASE_PATH())}cmssamsung/api/v1.0/`;
};

export const HOST_AUDIENCE = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_AUDIENCE, BASE_PATH())}audience/v1.0/`;
};
export const HOST_AUDIENCE_V2 = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_AUDIENCE, BASE_PATH())}audience/api/v2.0/`;
};

export const HOST_MCC_MERCHANT = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_MCC_MERCHANT, BASE_PATH())}mcc-merchant/api/v1.0/`;
};
export const HOST_TEMPLATE = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_TEMPLATE, BASE_PATH())}template/api/v1.0/`;
};

export const PATH_SOCIAL = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_SOCIAL, BASE_PATH())}social`;
};

export const HOST_SOCIAL = (path?: string) => {
    return `${PATH_SOCIAL()}${path ? `/${path}` : ''}/api/v1.0/`;
};

export const HOST_EMK = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_EMK, BASE_PATH())}emk/api/v1.0/`;
};

export const HOST_CALL_CENTER = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_CALL_CENTER, BASE_PATH())}callcenter/api/v2.0/`;
};

export const HOST_NM = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_NM, BASE_PATH())}nm/api/v2.0/`;
};

export const PATH_PROFILING = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_PROFILING, BASE_PATH())}profiling`;
};

export const HOST_PROFILING = () => {
    return `${PATH_PROFILING()}/v3.0/`;
};

export const HOST_PROFILING_EVENT = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_PROFILING, BASE_PATH())}events/api/v1.0/`;
};

export const HOST_PROFILING_INTERNAL = () => {
    return `${PATH_PROFILING()}/internal/v3.0/`;
};

export const PATH_LOYALTY = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_LOYALTY, BASE_PATH())}loyalty`;
};


export const HOST_LOYALTY = (path?: string) => {
    return `${PATH_LOYALTY()}${path ? `/${path}` : ''}/api/v2.1/`;
};

export const PATH_VOUCHER = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_VOUCHER, BASE_PATH())}voucher`;
};

export const HOST_VOUCHER = (path?: string) => {
    return `${PATH_VOUCHER()}${path ? `/${path}` : ''}/api/v1.0/`;
};

export const HOST_CMS = () => {
    return `${PATH_LOYALTY()}/api/v2.0/`;
};

export const HOST_CRM = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_CRM, BASE_PATH())}crm`;
};

export const HOST_DNC = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_DNC, BASE_PATH())}dnc/api/v1.0/`;
};

export const PATH_ADS_AUTOMATION = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_ADS, BASE_PATH())}ads`;
};

export const HOST_ADS_AUTOMATION = () => {
    return `${PATH_ADS_AUTOMATION()}/api/v1.5/`;
};

export const HOST_CHAT_TOOL = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_CHAT_TOOL, BASE_PATH())}chattool/api/v2.0/`;
};

export const HOST_TICKET = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_TICKET, BASE_PATH())}ticket/api/v1.0/`;
};

export const PATH_SALE = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_SALE, BASE_PATH())}sale`;
};

export const HOST_SALE = (path?: string) => {
    return `${PATH_SALE()}${path ? `/${path}` : ''}/api/v1.0/`;
};

export const HOST_PRODUCT_LIBRARY = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_PRODUCT_LIBRARY, BASE_PATH())}product/api/v1.0/`;
};

export const HOST_LICENSE = () => {
    return `${BASE_PATH()}license/api/v1.0/`;
};

export const HOST_LANDING_PAGE = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_LANDING_PAGE, BASE_PATH())}landing/api/v2.0/`;
};

export const HOST_YOUTUBE = () => {
    return `https://www.googleapis.com/youtube/v3/`;
};

export const HOST_ZALO = () => {
    let zaloVersion = '';
    const socialConfig = CacheService.Get(CacheKeys.KEY_CACHE_APP_SOCIAL_CONFIG);
    if (socialConfig && socialConfig.find((x: any) => x.social_type === DefineConstants.SOCIAL_TYPE_ZALO)) {
        zaloVersion = socialConfig.find((x: any) => x.social_type === DefineConstants.SOCIAL_TYPE_ZALO).api_version;
    }
    return `https://openapi.zaloapp.com/oa/${zaloVersion}`;
};

export const HOST_FACEBOOK = () => {
    return `https://graph.facebook.com/`;
};

export const HOST_GOOGLE_TRANSLATE = () => {
    return `https://translate.googleapis.com/translate_a/`;
};

/**  HOST CHO PROJECT TENANT MANAGEMENT **/
export const HOST_LOYALTY_LICENCE = () => {
    return `${BASE_PATH()}loyalty/api/v2.1/`;
};

export const HOST_JOURNEY_BUILDER = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_JOURNEY_BUILDER, BASE_PATH())}journey/api/v1.0/`;
};

export const HOST_RAPPORTEUR = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_RAPPORTEUR, BASE_PATH())}rapporteur/api/v1.0/`;
};

export const HOST_DYNAMIC_EVENT = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_DYNAMIC_EVENT, BASE_PATH())}dynamic-event/api/v1.0/`;
};

export const HOST_MEDIA = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_VOUCHER, BASE_PATH())}media/api/v1.0/`;
};

export const HOST_TAG = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_TAG, BASE_PATH())}tag/api/v1.0/`;
};

export const HOST_STRINGEE = () => {
    return `https://icc-api.stringee.com/v1/`;
};


export const HOST_SURVEY = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_SURVEY, BASE_PATH())}survey/api/v1.0/`;
};

export const HOST_TASK = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_TASK, BASE_PATH())}task/api/v1.0/`;
};

export const HOST_NOTE = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_NOTE, BASE_PATH())}note/api/v1.0/`;
};

export const HOST_COMPANY = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_COMPANY, BASE_PATH())}company/api/v1.0/`;
};

export const IGNORE_REDIRECT_SERVER_MASK = () => {
    return '#VALUE_REDIRECT_SERVER_MASK';
}

export const PATH_TEMPLATE = () => {
    return `${CacheService.Get(CacheKeys.KEY_CACHE_PATH_TEMPLATE, BASE_PATH())}`;
}

export const HOST_WEB_BUILDER = () => {
    return `${PATH_TEMPLATE()}template/api/v1.0/`;
};
