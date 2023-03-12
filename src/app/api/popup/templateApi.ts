import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from '../baseApi';


interface IListTemplateInfo {
  id: string;
  title: string;
  description?: string;
  bodyTemplate: string;
  categoryId: string;
  session: string;
  avatarInfo: any;
  applierType: number;
}
@Injectable()

export class MoTemplateService {
  startKey: string;
  constructor(
    private _templateService: MoWbBaseApiService,
    private _baseService: MoWbBaseApiService,
  ) {
    this.startKey = `${_baseService.host}popups/templates`;
  }

  /**
   * get popup template list
   * @param applierType
   * @param page
   * @param per_page
   * @returns
   */
  public async getListPopupTemplate(
    applierType: number = 3,
    page: number = -1,
    per_page: number = 20,
    valueSearch?: string,
    category_id?: any
  ) {
    let query: any = {
      'applier_type': applierType,
      'page': page,
      'per_page': per_page,
      category_id
    };
    if (valueSearch) {
      query.title = valueSearch;
    }
    if (valueSearch) {
      this._baseService.deleteCacheStartWith(this.startKey);
    }
    const response = await this._templateService.fetch(
      'popups/templates',
      'GET',
      'JSON',
      null,
      query,
      null,
      false
    );

    return response;
  }

  /**
   * get detail popup template
   * @param templateId
   * @returns
   */
  public async getDetailPopupTemplate(templateId: string) {
    const query = {
      // 'template_id': templateId,
    };

    const response = await this._templateService.fetch(
      `popups/templates/${templateId}`,
      'GET',
      'JSON',
      null,
      query,
    );
    return response;
  }

  /**
   * create popup template
   * @param applier_type
   * @param title
   * @param body_template
   * @param category_id
   * @param account_id
   * @param avatar
   * @param second_page
   * @returns
   */
  public async createPopupTemplate(
    applier_type: string,
    title: string,
    body_template: string,
    category_id: string,
    account_id: string,
    avatar: File,
    second_page: any,
    build_template: string
  ) {
    let formData = new FormData();
    formData.append('applier_type', applier_type);
    formData.append('title', title);
    // formData.append('description',description);
    formData.append('body_template', body_template);
    formData.append('category_id', category_id);
    formData.append('build_template', build_template);
    formData.append('avatar', avatar);
    formData.append('second_page', second_page);

    const response = await this._templateService.fetch('popups/templates', 'POST', 'FILE', formData, null);
    this._baseService.deleteCacheStartWith(this.startKey);
    return response;
  }

  /**
   * update popup template
   * @param templateId
   * @param applierType
   * @param title
   * @param bodyTemplate
   * @param categoryId
   * @param avatar
   * @param session
   * @returns
   */
  public async updatePopupTemplate(templateId: string, applierType: string, title: string, bodyTemplate: string,
    categoryId: string, avatar: File, session: string = '', second_page: string, category_id: string,
    build_template: string
  ) {
    const query = {
      'template': templateId,
    };
    const body = {
      'applier_type': applierType,
      'title': title,
      // 'description': templateInfo.description,
      'body_template': bodyTemplate,
      'category_id': categoryId,
      'session': session,
      'avatar': avatar,
    };
    let formData = new FormData();
    formData.append('applier_type', applierType);
    formData.append('title', title);
    // formData.append('description',description);
    formData.append('body_template', bodyTemplate);
    formData.append('category_id', category_id);
    formData.append('build_template', build_template);
    formData.append('avatar', avatar);
    formData.append('second_page', second_page);

    const response = await this._templateService.fetch(
      `popups/templates/${templateId}`,
      'PATCH',
      'FILE',
      formData,
      query
    );
    this._baseService.deleteCacheStartWith(this.startKey);
    return response;
  }
}
