import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from './baseApi';
import { HOST_MEDIA, HOST_TAG } from '../common/define/host-domain.define';

@Injectable()

export class MoButtonService {
  constructor(private _baseService: MoWbBaseApiService) { }

  public async uploadFile(file: any, folderId: string, fileName: string) {

    const isImage = file.type.match(/image.*/) ? true : false;
    var formData = new FormData();

    formData.append('file', file);
    formData.append('with_extension', 'true');
    formData.append('group_ids', JSON.stringify([folderId]));
    formData.append('use_name', 'true');
    formData.append('do_not_delete', 'true');
    formData.append('filename', fileName);
    formData.append('filetype', file.type);

    if (isImage) {
      formData.append('option', 'thumb');
      formData.append('size', "[{'width': '200', 'height': '200'}]");
    }

    const response = await this._baseService.fetch('file', 'POST', 'FILE', formData, null, HOST_MEDIA());
    return response;
  }

  public async createTag(tags: any[]) {
    const body = {
      tags: tags
    }

    const response = await this._baseService.fetch('tags/bulk', 'POST', 'JSON', body, null, HOST_TAG());
    return response;
  }
  public async createButtonTemplate(applier_type: '2' | '3', title: string, body_template: string, avatar: File, element_ids: string[]) {
    var formData = new FormData();
    formData.append('applier_type', applier_type)
    formData.append('title', title)
    formData.append('body_template', body_template)
    formData.append('avatar', avatar)
    formData.append('merchant_id', this._baseService.merchantID)
    formData.append('element_ids', element_ids.toString());
    const response = await this._baseService.fetch('buttons/templates', 'POST', 'FILE', formData, null);
    return response;
  }

  public async getListButtonTemplate(_page: number = 1, _per_page: number = 20, _applier_type: string, name_search?: string) {
    const query: any = {
      page: _page,
      per_page: _per_page,
      applier_type: _applier_type
    }
    if (name_search) {
      query.title = name_search
    }
    const response = await this._baseService.fetch('buttons/templates', 'GET', 'JSON', null, query);
    return response
  }
}
