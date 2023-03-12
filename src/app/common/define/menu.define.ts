import { IMenu } from '../api/menu';

export const MENU_GROUP: Array<IMenu> = [
  {
    label: 'i18n_home_page',
    link: '/dashboard',
    icon: 'mo-icn-Home',
    idFE: '9da6de70-8a26-11ec-a8a3-0242ac120001',
    level: 1
  },
  {
    label: 'i18n_cdp',
    icon: 'mo-icn-personal-n-brand',
    level: 1,
    group: [
      {
        label: 'i18n_profiles',
        level: 2,
        group: [
          {
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120002',
            level: 3,
            label: 'i18n_profiles',
            link: '/manage-customer/profiles',
          }, {
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120003',
            level: 3,
            label: 'i18n_menu_merge_profiles',
            link: '/manage-customer/merge-profiles',
          }, {
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120004',
            level: 3,
            label: 'i18n_check_exist_email',
            link: '/manage-customer/validator-email',
          }, {
            idFE: '9da6de70-8a26-11ec-a8a3-142303032022',
            level: 3,
            label: 'i18n_profiles_information_is_blocked',
            link: '/manage-customer/spam-contact',
          }
        ]
      },
      {
        level: 2,
        label: 'i18n_label_company',
        group: [
          {
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120005',
            level: 3,
            label: 'i18n_label_company',
            link: '/manage-company/companies',
          }
        ]
      }
    ]
  }, {
    level: 1,
    label: 'i18n_marketing',
    icon: 'mo-icn-Marketing',
    group: [
      {
        level: 2,
        label: 'i18n_journey_builder',
        group: [{
          idFE: '9da6de70-8a26-11ec-a8a3-0242ac120006',
          level: 3,
          label: 'i18n_journey_builder',
          link: '/journey-builder/list',
        },
        {
          idFE: '9da6de70-8a26-11ec-a8a3-0242ac120007',
          level: 3,
          label: 'i18n_master_campaign',
          link: '/journey-builder/master-campaign',
        },
        {
          idFE: '9da6de70-8a26-11ec-a8a3-0242ac120008',
          level: 3,
          label: 'Mẫu e-mail',
          link: '/journey-builder/template-email',
        },
        {
          idFE: '9da6de70-8a26-11ec-a8a3-0242ac120009',
          level: 3,
          label: 'i18n_config_personalized',
          link: '/journey-builder/config-personalized',
        }]
      },
      {
        level: 2,
        label: 'i18n_popup_builder',
        group: [{
          idFE: '9da6de70-8a26-11ec-a8a3-101518052022',
          level: 3,
          label: 'i18n_popup_builder',
          link: '/popup-builder/list',
        }]
      },
      {
        level: 2,
        label: 'i18n_ads_automation',
        group: [
          {
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120010',
            level: 3,
            label: 'i18n_advertising_object',
            link: '/ads/target-audience',
          }
        ]
      },
      {
        level: 2,
        label: 'i18n_sms_brand_name',
        group: [{
          idFE: '9da6de70-8a26-11ec-a8a3-0242ac120012',
          level: 3,
          label: 'i18n_template_sms',
          link: '/sms-brandname/template-sms',
        }]
      },
      {
        level: 2,
        label: 'i18n_landing_page',
        group: [{
          idFE: '9da6de70-8a26-11ec-a8a3-0242ac120013',
          level: 3,
          label: 'i18n_create_url_landing_page',
          link: '/landing-page/create-url',
        }]
      }],
  }, {
    level: 1,
    label: 'i18n_menu_sales',
    icon: 'mo-icn-deal-activity',
    group: [{
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120014',
      level: 2,
      label: 'i18n_deal',
      link: '/sales/order',
    }, {
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120015',
      level: 2,
      label: 'i18n_set_target_kpi',
      link: '/sales/config-kpi-target',
    }]
  }, {
    level: 1,
    label: 'i18n_services',
    icon: 'mo-icn-Services',
    group: [{
      level: 2,
      label: 'i18n_online_social',
      group: [{
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120016',
        label: 'i18n_overview',
        link: '/social/dashboard',
      }, {
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120017',
        label: 'i18n_chat_and_reply_to_customers',
        link: '/social/chat',
        subsLink: [
          '/social/chat/facebook',
          '/social/chat/instagram',
          '/social/chat/zalo',
          '/social/chat/youtube',
          '/social/chat/web-live-chat',
          '/social/chat/line'
        ],
      }]
    }, {
      level: 2,
      label: 'i18n_call_center',
      group: [{
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120018',
        label: 'i18n_call_management',
        link: '/call-center/manage-calls',
      }]
    }, {
      level: 2,
      label: 'i18n_ticket',
      group: [{
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120019',
        label: 'i18n_ticket',
        link: '/ticket/dashboard',
      }],
    },
    {
      level: 2,
      label: 'i18n_loyalty',
      group: [{
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120020',
        label: 'i18n_membership_card_code_storage',
        link: '/loyalty/membership-card-code-storage',
      }]
    }],
  }, {
    level: 1,
    label: 'i18n_cms',
    icon: 'mo-icn-CMS',
    group: [{
      level: 2,
      label: 'i18n_voucher',
      group: [{
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120021',
        label: 'i18n_voucher',
        link: '/voucher/list',
      }, {
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120022',
        label: 'i18n_voucher_code_storage',
        link: '/voucher/code-storage',
      },
      {
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120024',
        level: 3,
        label: 'i18n_reward_by_purchase',
        link: '/voucher/reward-by-purchase',
      }, {
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120023',
        level: 3,
        label: 'i18n_voucher_verification',
        link: '/voucher/verification',
      }]
    }, {
      level: 2,
      label: 'i18n_product_library',
      group: [{
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120025',
        label: 'i18n_product_library',
        link: '/product-library/product',
      }, {
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120026',
        label: 'i18n_product_category',
        link: '/product-library/category',
      }, {
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120027',
        label: 'i18n_producer',
        link: '/product-library/supplier',
      }]
    }, {
      level: 2,
      label: 'i18n_products',
      group: [{
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-145408062022',
        label: 'i18n_products',
        link: '/product-bank/product',
      }]
    },
    {
      level: 2,
      label: 'App',
      group: [{
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120028',
        label: 'Banner',
        link: `/app/mobio/banner`,
      }, {
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120029',
        label: 'i18n_news',
        link: `/app/mobio/news`,
      }, {
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120030',
        label: 'Video',
        link: `/app/mobio/video`,
      }, {
        level: 3,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120031',
        label: 'i18n_app_notification',
        link: `/app/mobio/send-in-app-notification`,
      }]
    },
    {
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120032',
      label: 'i18n_form_survey',
      link: '/survey/list',
    },
    {
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120033',
      label: 'i18n_media_library',
      link: '/media-store',
    }],
  }, {
    level: 1,
    label: 'i18n_statistics',
    icon: 'mo-icn-Report-MKT',
    group: [{
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120034',
      label: 'i18n_voucher_report',
      link: '/statistics/voucher-report',
    }, {
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120035',
      label: 'i18n_vote_transaction',
      link: '/statistics/rated-transactions',
    }]
  }, {
    level: 1,
    label: 'i18n_samsung',
    icon: 'mo-icn-Tenant',
    group: [{
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120036',
      label: 'i18n_import_samsung',
      link: '/samsung/import',
    }, {
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120037',
      label: 'i18n_menu_export_comments_fb_fanpage',
      link: '/samsung/export-fanpage',
    }]
  }, {
    level: 1,
    label: 'i18n_bank',
    icon: 'mo-icn-bank',
    group: [{
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120038',
      label: 'i18n_import_profile_get_offers',
      link: '/bank/profiles',
    }, {
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120039',
      label: 'i18n_filter_config',
      link: '/bank/filter',
    }, {
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120040',
      label: 'i18n_effective_report_from_marketing',
      link: '/bank/report-marketing',
    }, {
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-0242ac120aa1',
      label: 'i18n_export_report',
      link: '/bank/export-report',
    }, {
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-141707032022',
      label: 'i18n_manage_mcc_merchant_files',
      link: '/bank/manage-mcc-merchant'
    }, {
      level: 2,
      idFE: '9da6de70-8a26-11ec-a8a3-150117032022',
      label: 'i18n_spreadsheet_bank',
      link: '/bank/spreadsheet'
    }]
  },
];


export const MENU_PERSONAL: Array<IMenu> = [
  {
    level: 1,
    label: 'i18n_general_setting',
    isLabel: true,
  },
  {
    level: 1,
    label: 'i18n_account_information',
    link: '/setting/personal/account-information',
    icon: ' mo-icn-personal-n-brand',
    idFE: '9da6de70-8a26-11ec-a8a3-0242ac120041',
  },
  {
    level: 1,
    label: 'i18n_label_data_type',
    link: '/setting/personal/display-type',
    icon: 'mo-icn-display_setting',
    idFE: '9da6de70-8a26-11ec-a8a3-0242ac120042',
  },
  {
    level: 1,
    label: 'i18n_accept_notification',
    link: '/setting/personal/notification',
    icon: 'mo-icn-receive_notification_setting',
    idFE: '9da6de70-8a26-11ec-a8a3-0242ac120043',
  },
  {
    level: 1,
    label: 'i18n_personal_intergration',
    icon: 'mo-icn-personal_intergration',
    group: [
      {
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120044',
        level: 2,
        label: 'i18n_integration_work_email',
        link: '/setting/personal/integration/work-email',
      },
      {
        level: 2,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120045',
        label: 'i18n_connect_google_calendar',
        link: '/setting/personal/integration/connect/google-calendar',
      },
    ]
  },
  {
    level: 1,
    label: 'i18n_operating_process_optimization',
    isLabel: true
  },
  {
    level: 1,
    label: 'i18n_form',
    icon: 'mo-icn-File',
    group: [
      {
        level: 2,
        label: 'i18n_personal_feedback_email_template',
        idFE: '9da6de70-8a26-11ec-a8a3-190420221541',
        link: '/setting/personal/form/email-template',
        subsLink: [
          '/setting/personal/form/email-template',
          '/setting/personal/form/email-template/order-display'
        ]
      },
      {
        level: 2,
        label: 'i18n_personal_answer_form_on_social',
        link: '/setting/personal/operator-process/social',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120077',
        subsLink: [
          '/setting/personal/operator-process/social/answer-form',
          '/setting/personal/operator-process/social/topic',
          '/setting/personal/operator-process/social/pattern-order'
        ]
      }
    ]
  }
];


export const MENU_TENANT: Array<IMenu> = [
  {
    level: 1,
    label: 'i18n_general_setting',
    isLabel: true,
  },
  {
    level: 1,
    label: 'i18n_common',
    icon: 'mo-icn-general_setting',
    group: [
      {
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120046',
        level: 2,
        label: 'i18n_name_brand',
        link: '/setting/tenant/brand-and-location/brand',
      },
      {
        level: 2,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120047',
        label: 'i18n_sub_brand',
        link: '/setting/tenant/brand-and-location/sub-brand',
      },
    ]
  },
  {
    level: 1,
    label: 'i18n_decentralized_admin',
    icon: 'mo-icn-divide-administration',
    group: [
      {
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120048',
        level: 2,
        label: 'i18n_name_role',
        link: '/setting/tenant/decentralized-admin/role',
      },
      {
        level: 2,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120049',
        label: 'i18n_permission_role',
        link: '/setting/tenant/decentralized-admin/role-permission',
      },
      {
        level: 2,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120050',
        label: 'i18n_policy_account',
        link: '/setting/tenant/decentralized-admin/policy-account',
      }
    ]
  },
  {
    level: 1,
    label: 'i18n_team',
    link: '/setting/tenant/team',
    icon: 'mo-icn-Team',
    idFE: '9da6de70-8a26-11ec-a8a3-0242ac120051',
  },
  {
    level: 1,
    label: 'i18n_integration',
    icon: 'mo-icn-layer_position',
    group: [
      {
        level: 2,
        label: 'i18n_sync_data',
        group: [
          {
            level: 3,
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120052',
            label: 'i18n_sources',
            link: '/setting/tenant/integration/sync-data/sources',
          }, {
            level: 3,
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120053',
            label: 'i18n_rule_sync_profiles',
            link: '/setting/tenant/integration/sync-data/profile-sync-rule',
          }, {
            level: 3,
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120054',
            label: 'i18n_dynamic_event',
            link: '/setting/tenant/integration/sync-data/event-dynamic',
          }, {
            level: 3,
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120055',
            label: 'i18n_tansaction_loyalty',
            link: '/setting/tenant/integration/loyalty-transaction',
          }
        ]
      },
      {
        level: 2,
        label: 'i18n_data_out',
        idFE: '9da6de70-8a26-11ec-a8a3-140226052022',
        link: `/setting/tenant/integration/data-out`,
      },
      {
        level: 2,
        label: 'i18n_channel_send_message',
        group: [
          {
            level: 3,
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120056',
            label: 'i18n_email',
            link: '/setting/tenant/integration/channel-send-message/email',
          }, {
            level: 3,
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120057',
            label: 'i18n_sms',
            link: '/setting/tenant/integration/channel-send-message/sms',
          }, {
            level: 3,
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120058',
            label: 'i18n_web_push',
            link: '/setting/tenant/integration/channel-send-message/web-push',
          }
        ]
      },
      {
        level: 2,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120059',
        label: 'i18n_social_network',
        link: `/setting/tenant/integration/social`,
      },
      {
        level: 2,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120060',
        label: 'i18n_web_live_chat',
        link: `/setting/tenant/integration/web-live-chat`,
      },
      {
        level: 2,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120011',
        label: 'i18n_ads_account',
        link: `/setting/tenant/integration/ads-connect`,
      },
      {
        level: 2,
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120062',
        label: 'i18n_landing_page',
        link: `/setting/tenant/integration/landing-page`,
      }
    ]
  },
  {
    level: 1,
    label: 'i18n_data_management',
    isLabel: true
  },
  {
    level: 1,
    label: 'i18n_custom_fileds',
    icon: 'mo-icn-Dynamic-Field',
    group: [
      {
        level: 2,
        label: 'i18n_profiles',
        link: '/setting/tenant/custom-field/profiles',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120063',
      }, {
        level: 2,
        label: 'i18n_label_company',
        link: '/setting/tenant/custom-field/company',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120092',
      }, {
        level: 2,
        label: 'i18n_deal',
        link: '/setting/tenant/custom-field/sales',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120064',
      }, {
        level: 2,
        label: 'i18n_ticket',
        link: '/setting/tenant/custom-field/ticket',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120065',
      }, {
        level: 2,
        label: 'i18n_product',
        link: '/setting/tenant/custom-field/product-library',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120066',
      }, {
        level: 2,
        label: 'i18n_product',
        link: '/setting/tenant/custom-field/product-bank',
        idFE: '9da6de70-8a26-11ec-a8a3-150708062022',
      }
    ]
  },
  {
    level: 1,
    label: 'i18n_object',
    icon: 'mo-icn-deal_in_queue',
    group: [
      {
        level: 2,
        label: 'i18n_profiles',
        group: [
          {
            level: 3,
            label: 'i18n_profiles',
            link: '/setting/tenant/object/profiles',
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120067',
          },
          {
            level: 3,
            label: 'i18n_profiles_group',
            link: '/setting/tenant/object/profile-group',
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120068',
          }
        ]
      }, {
        level: 2,
        label: 'i18n_label_company',
        link: '/setting/tenant/object/company',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120069',
      }, {
        level: 2,
        label: 'i18n_deal',
        link: '/setting/tenant/object/sales',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120070',
      }, {
        level: 2,
        label: 'i18n_ticket',
        link: '/setting/tenant/object/ticket',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120071',
      }, {
        level: 2,
        label: 'i18n_product',
        link: '/setting/tenant/object/product-library',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120072',
      }, {
        level: 2,
        label: 'i18n_products',
        group: [
          {
            level: 3,
            label: 'i18n_category',
            link: '/setting/tenant/object/product-line',
            idFE: '9da6de70-8a26-11ec-a8a3-150508062022',
          },
          {
            level: 3,
            label: 'i18n_products',
            link: '/setting/tenant/object/product-bank',
            idFE: '9da6de70-8a26-11ec-a8a3-150608062022',
          }
        ]
      }, {
        level: 2,
        label: 'i18n_locations',
        group: [
          {
            level: 3,
            label: 'i18n_area',
            link: '/setting/tenant/object/location/area',
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120073',
          },
          {
            level: 3,
            label: 'i18n_branch',
            link: '/setting/tenant/object/location/brand-store',
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120074',
          }
        ]
      }, {
        level: 2,
        label: 'i18n_tags',
        group: [
          {
            level: 3,
            label: 'i18n_tags_behavior',
            link: '/setting/tenant/object/tag/activity',
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120075',
          },
          {
            level: 3,
            label: 'i18n_job_classification_tag',
            link: '/setting/tenant/object/tag/job-classification',
            idFE: '9da6de70-8a26-11ec-a8a3-0242ac120076',
          }
        ]
      }
    ]
  },
  {
    level: 1,
    label: 'i18n_operating_process_optimization',
    isLabel: true
  },
  {
    level: 1,
    label: 'i18n_call_center',
    icon: 'mo-icn-Goi-dien',
    group: [
      {
        level: 2,
        label: 'i18n_ext_config',
        link: '/setting/tenant/call-center/config',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120078',
      }
    ]
  },
  {
    level: 1,
    label: 'Sales',
    icon: 'mo-icn-sale_setting',
    group: [
      {
        level: 2,
        label: 'i18n_assign_process_order',
        link: '/setting/tenant/sales/assignment',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120079',
      },
      {
        level: 2,
        label: 'i18n_sales_process',
        link: '/setting/tenant/sales/process',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120080',
        subsLink: ['/setting/tenant/sales/deal-automation']
      }
    ]
  },
  {
    level: 1,
    label: 'i18n_online_social',
    icon: 'mo-icn-reply',
    group: [
      {
        level: 2,
        label: 'i18n_chat_assignment_and_answer',
        link: '/setting/tenant/social/assignment-and-answer',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120081',
      }, {
        level: 2,
        label: 'i18n_auto_reply',
        link: '/setting/tenant/social/auto-reply',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120082',
      }, {
        level: 2,
        label: 'i18n_general_answer_form',
        link: '/setting/tenant/social/answer-form',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120083',
      },
      {
        level: 2,
        label: 'i18n_setting_hidden_show_comment',
        link: '/setting/tenant/social/comment',
        idFE: '9da6de70-8a26-11ec-a8a3-114410032022',
      },
      {
        level: 2,
        label: 'i18n_quick_reply_config',
        link: '/setting/tenant/social/reply',
        idFE: '9da6de70-8a26-11ec-a8a3-160510032022'
      },
      {
        level: 2,
        label: 'i18n_support_assignment',
        link: '/setting/tenant/social/assisted',
        idFE: '9da6de70-8a26-11ec-a8a3-114510032022',
      }
    ]
  }, {
    level: 1,
    label: 'i18n_ticket',
    icon: 'mo-icn-ticket',
    group: [
      {
        level: 2,
        label: 'i18n_assign_process_ticket',
        link: '/setting/tenant/ticket/assisted',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120084',
      }
    ]
  }, {
    level: 1,
    label: 'i18n_journey_builder',
    icon: 'mo-icn-journey_setting',
    group: [
      {
        level: 2,
        label: 'i18n_whitelist_email_domain',
        link: '/setting/tenant/journey-builder/whitelist-domain',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120085',
      }
    ]
  }, {
    level: 1,
    label: 'i18n_form',
    icon: 'mo-icn-File',
    group: [
      {
        level: 2,
        label: 'i18n_general_feedback_email_template',
        link: '/setting/tenant/form/email-template',
        idFE: '9da6de70-8a26-11ec-a8a3-190420221552',
      }
    ]
  },
  {
    level: 1,
    label: 'i18n_voucher',
    icon: 'mo-icn-voucher',
    group: [
      {
        level: 2,
        label: 'i18n_voucher_display_area',
        link: '/setting/tenant/voucher/location-display',
        idFE: '9da6de70-8a26-11ec-a8a3-0242ac120086',
      }
    ]
  },
  {
    level: 1,
    label: 'i18n_loyalty_policy',
    isLabel: true
  },
  {
    level: 1,
    label: 'i18n_earn_points',
    link: '/setting/tenant/loyalty-policy/reward-point-policy',
    icon: 'mo-icn-cs-tich-diem',
    idFE: '9da6de70-8a26-11ec-a8a3-0242ac120087',
  },
  {
    level: 1,
    label: 'i18n_gift_voucher',
    link: '/setting/tenant/loyalty-policy/voucher-offering-policy',
    icon: 'mo-icn-cs-voucher',
    idFE: '9da6de70-8a26-11ec-a8a3-0242ac120088',
  },
  {
    level: 1,
    label: 'i18n_membership_card',
    link: '/setting/tenant/loyalty-policy/membership-card-policy',
    icon: 'mo-icn-cs-mem-card',
    idFE: '9da6de70-8a26-11ec-a8a3-0242ac120089',
  },
  {
    level: 1,
    label: 'i18n_vote_transaction',
    link: '/setting/tenant/loyalty-policy/feedback-notification',
    icon: 'mo-icn-noti-danh-gia',
    idFE: '9da6de70-8a26-11ec-a8a3-0242ac120090',
  },
];
