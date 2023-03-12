import { Injectable } from '@angular/core';
import { ToastTranslateService } from './common/toast-translate.service';
import { MoWbBaseApiService } from './baseApi'


@Injectable()

export class MoFontApiService {
  startKey: string;
  constructor(
    private _baseService: MoWbBaseApiService,
    private _toast: ToastTranslateService
  ) {
    this.startKey = `${_baseService.host}fonts/templates`;
  }

  /**
 * get all font list
 * @param _page
 * @param _per_page
 * @param _applier_type
 * @returns
 */

  public async getListFont(_page: number = 1, _per_page: number = 20, _applier_type: string, name_search?: string) {
    const query: any = {
      page: _page,
      per_page: _per_page,
    }
    if(_applier_type !=='all'){
      query.applier_type =  _applier_type
    }
    if (name_search) {
      query.search = name_search
    }
    const response = await this._baseService.fetch('fonts/templates', 'GET', 'JSON', null, query, null, true);
    return response;
  }
  /**
  * get list font default
  * @param _page
  * @param _applier_type
  * @returns
  */
   public async getAllFontDefault(_page: number = -1, _applier_type: string){
    const query: any = {
      page: _page,
      applier_type: _applier_type
    }

    const response = await this._baseService.fetch('font-default', 'GET', 'JSON', null, query, null, true);
    return response;
  }

  /**
   * create font
  * @param font_default_id
  * @param title
  * @param font_type
  * @param applier_type
  * @param url
  * @param font_weight
  * @param merchant_id
  * @param light
  * @param normal
  * @param bold
  *
  * @returns
  */
  public async createFont(font_type: 'google_font' | 'custom_font', font_default_id?: string, title?: string, applier_type?: '3' | '2',
    light?: File, normal?: File, bold?: File) {
    var formData = new FormData();
    formData.append('font_type', font_type);
    if (font_type === 'google_font') {
      font_default_id && formData.append('font_default_id', font_default_id);
    }
    if (font_type === 'custom_font') {
      title && formData.append('title', title);
      applier_type && formData.append('applier_type', applier_type);
      light && formData.append('light', light);
      normal && formData.append('normal', normal);
      bold && formData.append('bold', bold);
    }
    const response = await this._baseService.fetch('fonts/templates', 'POST', 'FILE', formData, null);
    if (response.code !== 200 && !response) {
      this._toast.show('error', response.message);
      return;
    }
    this._baseService.deleteCacheStartWith(this.startKey);
    return response;
  }



  /**
  * Delete list font
  * @param ids
  * @returns
  */
  public async deleteListFont(ids: Array<any>) {
    const body = {
      'ids': ids
    };
    const response = await this._baseService.fetch('fonts/templates', 'DELETE', 'JSON', body, null);
    if (response.code === 200) {
      this._baseService.deleteCacheStartWith(this.startKey);
    }
    return response;
  }

  /**
   * Delete one list font default
   * @param ids
   * @returns
   */
  public async deleteFontDefault(ids: Array<any>) {
    const body = {
      'ids': ids
    };
    const response = await this._baseService.fetch('font-default', 'DELETE', 'JSON', body, null);
    if (response.code === 200) {
      this._baseService.deleteCacheStartWith(this.startKey);
    }
    return response;
  }



}
