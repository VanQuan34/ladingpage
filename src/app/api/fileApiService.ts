import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from './baseApi';
import { HOST_MEDIA } from 'src/app/common/define/host-domain.define';

@Injectable()
export class MoWbFileApiService {
  startKey: string;
  host: string;
  constructor(private _baseService: MoWbBaseApiService) {
    this.startKey = `${_baseService.host}gallery`;
    this.host = `${HOST_MEDIA()}`;
  }
  
  public async fetchFileList(groupId: string, 
    searchValue: string,
    page: number = 1,
    sortItem: {
      key: 'created_time' | 'origin_capacity' | 'expire' | 'updated_time',
      order : 'asc' | 'desc'
    },
    mode: 'FILE' | 'IMAGE' | 'ALL' = 'ALL') {
    const query = {
      'per_page': 50,
      'page': page,
      'search': searchValue
    }
    const body: any = {
      'search': searchValue,
      'sort': sortItem.key,
      'order': sortItem.order
    }

    if (groupId !== '') {
      body.group_id = groupId;
    }

    if (mode === 'FILE') {
      body.type_select = 'file';
    }

    if (mode === 'IMAGE') {
      body.type_select = 'image';
    }

    const response = await this._baseService.fetch('gallery', 'POST', 'JSON', body, query, this.host, false);
    return response;
  }

  public async moveFiles(fromFolderId: string, toFolderId: string, fileUrls: string[]) {
    const body = {
      'urls': fileUrls,
      'from': fromFolderId,
      'to': toFolderId
    }
    const response = await this._baseService.fetch('file/actions/move', 'PUT', 'JSON', body, null, this.host);
    this._baseService.deleteCacheStartWith(this.startKey);
    return response;
  }

  public async deleteFiles(fileUrls: string[]) {
    const body = {
      'urls': fileUrls
    }
    const response = await this._baseService.fetch('file/actions/delete', 'POST', 'JSON', body, null,this.host);
    this._baseService.deleteCacheStartWith(this.startKey);
    return response;
  }

  public async uploadFile(file: any, folderId: string, fileName: string) {
    const isImage = file.type.match(/image.*/) ? true : false;
    var formData = new FormData();

		formData.append('file', file);
		formData.append('with_extension', 'true');
    formData.append('group_ids', JSON.stringify([folderId]));
    formData.append('use_name', 'true');
    formData.append('do_not_delete', 'true');
    formData.append('filename', fileName);
    // formData.append('expire', moment().add(1, 'days').format('YYYY-MM-DD HH:mm'));
    formData.append('filetype', file.type);
    
    if (isImage) {
      formData.append('option', 'thumb');
		  formData.append('size', "[{'width': '200', 'height': '200'}]");
    }
    const response = await this._baseService.fetch('file', 'POST', 'FILE', formData, null ,this.host);
    this._baseService.deleteCacheStartWith(this.startKey);
    return response;
  }

  public async saveFile(file: any, url: string) {
    const formData = new FormData();
		formData.append('file', file);
		formData.append('url', url);
    const response = await this._baseService.fetch('override', 'POST', 'FILE', formData, null,this.host);
    this._baseService.deleteCacheStartWith(this.startKey);
    return response;
  }

  public async fetchFilesSize(urls: string[]) {
    const response = await this._baseService.fetch('files/actions/calculate_capacity_by_url', 'POST', 'JSON', {urls: urls}, null,this.host);
    return response;
  }

}
