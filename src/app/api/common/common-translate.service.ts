import {
  Injectable,
} from '@angular/core';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DefineFunction } from '../../common/define/function.define';
import * as moment from 'moment';
import { CURRENT_LANG } from '../../common/define/language.define';

@Injectable()
export class MoCommonTranslateService {
  private language;
  constructor(private translateService: TranslateService,) {
    this.language = CURRENT_LANG();
    this.translateService.onLangChange
      .subscribe((evt: LangChangeEvent) => {
        this.language = evt.lang;
      });
  }

  public formatNumber(value: number) {
    if (value) {
      return DefineFunction.formatNumberValue(value, false, 0);
    }
    return value;

  }

  public translate(key: string) {
    if (key) {
      return this.translateService.instant(`${key}`);
    }
    return key;

  }

  public translateInstant(key: string, value: any) {
    if (key && value) {
      return this.translateService.instant(key, value);
    }
    return {};

  }

  public formatRange(fromVal: number, toVal: number, unit: string) {
    if (fromVal && toVal) {
      return this.translateService.instant('118n_content_from_to', { from: `${this.formatNumber(fromVal)} ${unit}`, to: ` ${this.formatNumber(toVal)} ${unit}` });
    }

    if (fromVal) {
      return this.translateService.instant('118n_content_value_and_above', { from: `${this.formatNumber(fromVal)} ${unit}` });
    }

    if (toVal) {
      return this.translateService.instant('118n_content_upto_value', { value: `${this.formatNumber(toVal)} ${unit}` });
    }
  }

  public getTimeLabel(key: string) {
    let label = '';
    switch (key) {
      case 'minute':
        label = this.translate('minute');
        break;
      case 'hour':
        label = this.translate('hours');
        break;
      case 'day':
        label = this.translate('date');
        break;
      default:
        break;
    }

    return label;
  }

  public formatDateTime(datetime: string) {
    if (datetime) {
      const date = moment(datetime).format('DD/MM/YYYY HH:mm');
      if (date !== 'Invalid date') {
        datetime = date;
      }
    }
    return datetime;
  }

  public formatDtRange(fromDate: string, toDate: string) {
    // console.log('formatDtRange fromDate = '+fromDate+" toDate = "+toDate);
    if (fromDate && toDate) {
      return this.translateService.instant('118n_content_from_to', { from: `${this.formatDateTime(fromDate)}`, to: `${this.formatDateTime(toDate)}` });
    }

    if (fromDate) {
      return this.translateService.instant('118n_datetime_from', { from: `${this.formatDateTime(fromDate)}` });
    }
  }

  public getService() {
    return this.translateService;
  }

}
