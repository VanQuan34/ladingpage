import { Injectable } from '@angular/core';
import { ToastTranslateService } from './common/toast-translate.service';
import { MoWbBaseApiService } from './baseApi'
@Injectable()
export class MoCounterService {
  constructor(
    private _baseService: MoWbBaseApiService,
    private _toast: ToastTranslateService
  ) { }

  public async getListCounterTemplate(_page: number = 1, _per_page: number = 20, _applier_type: string, name_search?: string) {
    const query: any = {
      page: _page,
      per_page: _per_page,
      applier_type: _applier_type
    }
    if (name_search) {
      query.title = name_search
    }
    const response = await this._baseService.fetch('counters/templates', 'GET', 'JSON', null, query);
    return response
  }
  public async createCounterTemplate(applier_type: '2' | '3', title: string, body_template: string, avatar: File, element_ids: string[]) {
    var formData = new FormData();
    formData.append('applier_type', applier_type)
    formData.append('title', title)
    formData.append('body_template', body_template)
    formData.append('avatar', avatar)
    formData.append('merchant_id', this._baseService.merchantID)
    formData.append('element_ids', element_ids.toString());
    const response = await this._baseService.fetch('counters/templates', 'POST', 'FILE', formData, null);
    return response;
  }
}
