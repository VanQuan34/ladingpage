import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from './baseApi'
import { HOST_TAG } from '../common/define/host-domain.define';


@Injectable()
export class MoTagsServices {
  constructor(
    private _baseService: MoWbBaseApiService) { }

  /**
   * @param _role
   * @param _page
   * @param _per_page
   * @param _search_text
   * @returns
 */
  public async getDataTags(_role:string = '' ,_page: number = -1, _per_page: number = 25, _search_text?: string) {
    const query: any = {
      roles: 'assign',
      page: _page,
      per_page: _per_page,
      search_text: _search_text
    }
   
    const hostApi = `${HOST_TAG()}`

    const response = await this._baseService.fetch('tags', 'GET', 'JSON', null, query, hostApi);
    return response
  }
  
}
