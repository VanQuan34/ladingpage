import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from './baseApi';
import { HOST_MEDIA } from 'src/app/common/define/host-domain.define';
const GROUP_ID = 'MO_MEDIA_STORE_SELECTED_FOLDER_ID';
@Injectable()
export class MoWbFolderApiService {
  startKey: string;
  host: string;
  constructor(private _baseService: MoWbBaseApiService) {
    this.startKey = `${_baseService.host}group`;
    this.host = `${HOST_MEDIA()}`;
  }
  
  public async getFolderList() {
    const query = {
      'sort': 'created_time',
      'order': 'desc',
      'per_page': 100,
      'page': 1
    }
    const response = await this._baseService.fetch('group', 'GET', 'JSON', null, query, this.host, false);
    return response && response.data;
  }

  public async addNewFolder(folderName: string) {
    const body = {
      name: folderName
    };
    const response = await this._baseService.fetch('group', 'POST', 'JSON', body, this.host);
    this._baseService.deleteCacheStartWith(this.startKey);
    return response ;
  }

  public async editFolder(folderName: string, folderId: string) {
    const body = {
      name: folderName
    };
    const response = await this._baseService.fetch(`group/${folderId}`, 'PUT', 'JSON', body, this.host);
    this._baseService.deleteCacheStartWith(this.startKey);
    return response ;
  }

  public async deleteFolder(folderIds: string[]) {
    const query = {
      ids: folderIds
    };
    const response = await this._baseService.fetch(`group`, 'DELETE', 'JSON', null, query, this.host);
    this._baseService.deleteCacheStartWith(this.startKey);
    return response ;
  }

  setCacheSelectedFolderId(folderId: string) {
    this._baseService.setCacheValue(folderId, GROUP_ID);
  }

  getCacheSelectedFolderId() {
    const folderId = this._baseService.getCache(GROUP_ID);
    // console.log('getCacheSelectedFolderId= folderId=', folderId);
    return folderId;
  }

}
