import { Injectable, SimpleChanges } from '@angular/core';
import { ToastTranslateService } from './common/toast-translate.service';
import { MoWbBaseApiService } from './baseApi'




@Injectable()



export class MoReportService {
  constructor(
    private _baseService: MoWbBaseApiService,
    private _toast: ToastTranslateService
  ) { }

  /**
   *  widget_1
   * @param _since
   * @param _until
   * @param popup_builder_id
   * @returns
   */

   public async getProfileForm(popup_builder_id: string, _since?:any, _until?: any ){
    const query: any = {
      
    }
    if(_since){
      query.since = _since;
    }
    if(_until){
      query.until = _until;
    }

    const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/widget-1`, 'GET', 'JSON', null, query);
    return response;
  }

  /**
   * widget_2(Tổng quan)
   * @param _since
   * @param _until
   * @param popup_builder_id
   * @returns
   */

  public async getListViewAndClick(popup_builder_id: string, _since?:any, _until?: any){
    
    const query: any = {
    }
    if(_since){
      query.since = _since;
    }
    if(_until){
      query.until = _until;
    }
    const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/widget-2`, 'GET', 'JSON', null, query);
    return response;
  }

   /**
   * widget_3(lượt đóng popup)
   * @param _since
   * @param _until
   * @param popup_builder_id
   * @returns
   */

    public async getCountCloseButton(popup_builder_id: string, _since?: any, _until?:any){
      const query: any = {
        
      }
      if(_since){
        query.since = _since;
      }
      if(_until){
        query.until = _until;
      }
      const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/widget-3`, 'GET', 'JSON', null, query);
      return response;
    }

     /**
   * get widget_4(Hiệu quả tiếp cận)
   * @param _since
   * @param _until
   * @param popup_builder_id
   * @returns
   */

      public async getEffectiveApproach(popup_builder_id: string, _since?: any, _until?:any){
        const query: any = {
        
        }
        if(_since){
          query.since = _since;
        }
        if(_until){
          query.until = _until;
        }
        const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/widget-4`, 'GET', 'JSON', null, query);
        return response;
      }
  
  /**
   * Hiệu quả tương tác widget_5
   * @param _since
   * @param _until
   * @param popup_builder_id
   * @returns
   * 
   */
   public async getInteractiveEffect(popup_builder_id: string, _since?: any, _until?:any){
    const query: any = {
      
    }
    if(_since){
      query.since = _since;
    }
    if(_until){
      query.until = _until;
    }
    const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/widget-5`, 'GET', 'JSON', null, query);
    return response;
  }

  /**
   * hiệu quả áp dụng trên từng kênh  widget_6
   * @param _since
   * @param _until
   * @param popup_builder_id
   * @returns
   * 
   */
  public async getEffectiveChanel(popup_builder_id: string, _since?: any, _until?:any){
    const query: any = {
    
    }
    if(_since){
      query.since = _since;
    }
    if(_until){
      query.until = _until;
    }
    const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/widget-6`, 'GET', 'JSON', null, query);
    return response;
  }


  /**
   * Lượt xem kênh Web push theo thiết bị widget_7
   * @param _since
   * @param _until
   * @param popup_builder_id
   * @returns
   * 
   */
   public async getViewDevice(popup_builder_id: string, _since?: any, _until?:any){
    const query: any = {
   
    }
    if(_since){
      query.since = _since;
    }
    if(_until){
      query.until = _until;
    }
    const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/widget-7`, 'GET', 'JSON', null, query);
    return response;
  }


  /**
   * lượt chuyển đổi kênh Web push theo thiết bị widget_8
   * @param _since
   * @param _until
   * @param popup_builder_id
   * @returns
   * 
   */
   public async getSwitchDevice(popup_builder_id: string,  _since?: any, _until?:any){
    const query: any = {
     
    }
    if(_since){
      query.since = _since;
    }
    if(_until){
      query.until = _until;
    }
    const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/widget-8`, 'GET', 'JSON', null, query);
    return response;
  }


   /**
   * get list profile điền form
   * @param _since
   * @param _until
   * @param _page
   * @param _per_page
   * @param _filter
   * @param popup_builder_id
   * @param _sort_field
   * @param _order
   * @returns
   * 
   */
    public async getListProfile(_page: number = 1, _per_page:number = 20, popup_builder_id: string, _filter :any , name_search?: string, _since?: any, _until?: any, _sort_field?: any, _order?: 'asc'|'desc'){
      const body:any = {
        "channel": _filter.channel,
        "master_campaign_id": _filter.master_campaign_id,
        "journey_builder_id": _filter.journey_builder_id
      }
     
      const query: any = {
        page: _page,
        per_page: _per_page,
      }
    
      name_search && (query.search = name_search);
      _since && (query.since = _since);
      _until && (query.until = _until);
      _sort_field && (query.sort = _sort_field)
      _order && (query.order = _order)
      const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/profile`, 'POST', 'JSON', body, query);
      return response;
    }


    /**
   * downloadFile báo cáo chung
   * @param popup_builder_id
   * @param _since
   * @param _until
   * @returns
   * 
   */
    public async downloadReportGeneral(popup_builder_id: string, _since?:any, _until?:any){
      const query: any = {
      }
      _since && (query.since = _since)
      _until && (query.until = _until)
      
      const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/actions/download-summary`, 'GET', 'JSON', null, query);
      return response;
    }

     /**
   * downloadFile profile form
   * @param _since
   * @param _until
   * @param _sort
   * @param _search
   * @param _order
   * @param _filter
   * @param popup_builder_id
   * @returns
   * 
   */
      public async downloadReportProfileForm(popup_builder_id: string, _filter:any, _since:any, _until: any, _sort:any, _order: any){
        const query: any = {
        }
        _since && (query.since = _since)
        _until && (query.until = _until)
        _sort && (query.sort = _sort)
        _order && (query.order = _order)
        
        const body:any = {
          "channel": _filter.channel,
          "master_campaign_id": _filter.master_campaign_id,
          "journey_builder_id": _filter.journey_builder_id
        }
        const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/actions/download-profile`, 'POST', 'JSON', body, query);
        return response;
      }

      /**
   * filter list profle form
   * @param _since
   * @param _until
   * @param popup_builder_id
   * @returns
   * 
   */
   public async getDataFilterProfileForm(popup_builder_id: string,  _since?: any, _until?:any){
    const query: any = {
     
    }
    if(_since){
      query.since = _since;
    }
    if(_until){
      query.until = _until;
    }
    const response = await this._baseService.fetch(`popups/${popup_builder_id}/reports/actions/get-data-for-filter`, 'GET', 'JSON', null, query);
    return response;
  }

   /**
   * get journey list
   * @param _master_campaign_id
   * @param _journey_ids
   * @param _page
   * @param _search
   * @returns
   * 
   */
    public async getJourneyCommon(_master_campaign_id: any, _journey_ids: any, _page:number , _filter?: any, _search?:string){
      const query: any = {
        page: _page
      }
      
      const hostApi = 'https://api-test1.mobio.vn/journey/api/v1.0';
      const body: any = {
        "master_campaign_id": _master_campaign_id,
        "journey_ids": _journey_ids,
        "next_page": "",
        "per_page": 20,
        "search": ""
      }
      if(_search){
        body.search = _search;
      }

      if(_filter.master_campaign_id.length !==0){
        body.master_campaign_id =  _filter.master_campaign_id;
      }
      
      const response = await this._baseService.fetch('/journeys/common', 'POST', 'JSON', body, query, hostApi);
      return response;
    }

    /**
   * get master list
   * @param _master_campaign_ids
   * @param _page
   * @param _per_page
   * @param _search
   * @returns
   */
     public async getMasterList(_master_campaign_ids: any, _page:number = 1, _per_page: number = 20, _search?:string){
      const query: any = {
        page: _page,
        per_page: _per_page,
        master_campaign_ids: _master_campaign_ids,
        use_for: "journey-builder"
      }
      
      const hostApi = 'https://api-test1.mobio.vn/adm/api/v2.1';
    
      if(_search){
        query.search = _search;
      }

      const response = await this._baseService.fetch('/master-campaigns/list', 'GET', 'JSON', null, query, hostApi);
      return response;
    }
    
}