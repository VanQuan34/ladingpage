import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from './baseApi'

@Injectable()
export class MoIconService {
  constructor(
    private _baseService: MoWbBaseApiService) { }

  /**
   * get all icon list
   * @param _page
   * @param _per_page
   * @param _applier_type
   * @returns
 */
  public async getListIcon(_page: number = -1, _per_page: number = 20, _applier_type: string = '3', name_search?: string) {
    const query: any = {
      page: _page,
      per_page: _per_page,
      applier_type: _applier_type
    }
    if (name_search) {
      query.title = name_search
    }
    const response = await this._baseService.fetch('icons/templates', 'GET', 'JSON', null, query);
    return response
  }
  /**
   * create icon
  * @param title
  * @param body_template
  * @param applier_type
  * @param avatar
  * @returns
  */
  public async createIcon(title: string, body_template: string, applier_type: string) {
    var formData = new FormData();
    formData.append('title', title)
    formData.append('merchant_id', this._baseService.merchantID);
    formData.append('body_template', body_template)
    formData.append('applier_type', applier_type)
    const response = await this._baseService.fetch('icons/templates', 'POST', 'FILE', formData, null);
    return response;
  }
  /**
   * get detail icon
   * @param id;
   * @returns
  */
  public async getDetailsIcon(id: string) {
    const response = await this._baseService.fetch(`icons/templates/${id}`, 'GET', 'JSON', null, null);
    return response;
  }

  /**
 * Delete icon
 * @param id
 * @returns
 */
  public async deleteIcon(id: string) {
    const response = await this._baseService.fetch(`icons/templates/${id}`, 'DELETE', 'FILE', null, null)
    return response;
  }
  /**
  * Delete list icon
  * @param ids
  * @returns
  */
  public async deleteListIcon(ids: Array<any>, object: string) {
    const body = {
      'ids': ids
    };
    const response = await this._baseService.fetch(`${object}/templates`, 'DELETE', 'JSON', body, null)
    return response;
  }

}
