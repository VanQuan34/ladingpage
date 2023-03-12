import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from './baseApi';
import { HOST_TAG } from '../common/define/host-domain.define';

@Injectable()

export class MoFormService {
  constructor(private _baseService: MoWbBaseApiService) { }

  public async createTag(tags: any[]) {
    const body = {
      tags: tags
    }

    const response = await this._baseService.fetch('tags/bulk', 'POST', 'JSON', body, null, HOST_TAG());
    return response;
  }

  /**
   * get list template
   * @param page
   * @param per_page
   * @param applier_type
   * @param form_layout
   * @returns
   */
  public async getListTemplate(page: number, per_page: number, applier_type: string, form_layout: '1' | '2') {
    const query: any = {
      page: page,
      per_page: per_page,
      applier_type: applier_type,
      title: '',
      form_layout: form_layout
    }

    const response = await this._baseService.fetch('forms/templates', 'GET', 'JSON', null, query);
    return response
  }

  /**
   * create new template form
   * @param applier_type
   * @param formLayout
   * @param body_template
   * @param avatar
   * @param element_ids
   * @param title
   * @returns
   */
  public async createTemplate(applier_type: '2' | '3', formLayout: '1' | '2', body_template: string, avatar: File, element_ids: string[], title: string = '') {

    var formData = new FormData();
    formData.append('applier_type', applier_type)
    formData.append('title', title)
    formData.append('body_template', body_template)
    formData.append('avatar', avatar)
    formData.append('merchant_id', this._baseService.merchantID)
    formData.append('element_ids', element_ids.toString());
    formData.append('form_layout', formLayout);

    const response = await this._baseService.fetch('forms/templates', 'POST', 'FILE', formData, null);
    return response;
  }

  /**
   * delete forms
   * @param ids
   * @returns
   */
  public async deleteForm(ids: string) {
    const response = await this._baseService.fetch(`forms/templates/${ids}`, 'DELETE', 'FILE', null, null);
    return response;
  }

  /**
   * delete form list
   * @param ids
   * @param object
   * @returns
   */
  public async deleteListForms(ids: Array<any>, object: string) {
    const body = {
      'ids': ids
    };
    const response = await this._baseService.fetch(object, 'DELETE', 'JSON', body, null)
    return response;
  }
}
