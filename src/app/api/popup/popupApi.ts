import { Injectable } from '@angular/core';
import { MoWbBaseApiService } from '../baseApi';


@Injectable()

export class MoPopupService {
  constructor(private _popupService: MoWbBaseApiService) { }

  /**
   * get popup list
   * @param _page
   * @param _per_page
   * @returns
   */
  public async getListPopupBuilder(_page: number = -1, _per_page: number = 100, name_search?: string, isActive?: number) {
    const query: any = {
      page: _page,
      per_page: _per_page,
    };
    if (name_search) {
      query.title = name_search
    }
    if (isActive && isActive !== 1) {
      query.active = isActive === 2 ? 1 : 0
    }
    const response = await this._popupService.fetch('popups', 'GET', 'JSON', null, query);
    console.log()
    return response;
  }

  /**
   * create popup
   * @param title
   * @returns
   */
  public async createPopupBuilder(title: string) {
    const body = {
      'title': title
    };
    const response = await this._popupService.fetch('popups', 'POST', 'JSON', body, null);
    return response;
  }

  /**
   * Get detail popup
   * @param id
   * @returns
   */
  public async getDetail(id: string) {
    const response = await this._popupService.fetch(`popups/${id}`, 'GET', 'JSON', null, null);
    return response;
  }

  public async getDetailDraft(id: string) {
    // const response = await this._popupService.fetch(`popup/drafts/${id}`, 'GET', 'JSON', null, null);
    const response = await this._popupService.fetch(`popups/drafts/${id}`, 'GET', 'JSON', null, null);
    return response;
  }

  public async updateTitlePopupBuilder(id: string, title: string) {
    var formData = new FormData();
    formData.append('title', title);
    // const response = await this._popupService.fetch(`popups/title/${id}`, 'PATCH', 'FILE', formData, null);
    const response = await this._popupService.fetch(`popups/${id}/actions/update-title`, 'PATCH', 'FILE', formData, null);
    return response;
  }
  /**
   * Delete popup
   * @param id
   * @returns
   */
  public async deletePopupBuilder(id: string) {
    const response = await this._popupService.fetch(`popups/${id}`, 'DELETE', 'JSON', null, null);
    return response;
  }

  /**
   * update popup
   * @param popupId
   * @param title
   * @param body_template
   * @param build_template
   * @param avatar
   * @param second_page
   * @param session
   * @param popup_template_id
   * @returns
   */
  public async updatePopupBuilder(
    popupId: string,
    title: string,
    body_template: string,
    build_template: string,
    avatar: File,
    second_page: string,
    session: string,
    popup_template_id: string,
    dynamic: string,
    current_field: string,
    current_button: string
  ) {

    const query = { popup_builder_id: popupId };
    var formData = new FormData();
    formData.append('title', title);
    formData.append('second_page', second_page);
    formData.append('session', session);
    formData.append('popup_template_id', popup_template_id);
    formData.append('body_template', body_template);
    formData.append('avatar', avatar);
    formData.append('build_template', build_template);
    formData.append('dynamic', dynamic);
    formData.append('current_field', current_field);
    formData.append('current_button', current_button);
    const response = await this._popupService.fetch(`popups/${popupId}`, 'PATCH', 'FILE', formData, query);
    return response;
  }

  public async getNewDetail(popupId: string, popup_draft_id: string, session: string) {
    const body = {
      popup_draft_id,
      session
    };
    // const response = await this._popupService.fetch(`popups/edit/${popupId}`, 'PATCH', 'JSON', body, null);
    const response = await this._popupService.fetch(`popups/${popupId}/actions/edit-with-main/`, 'PATCH', 'JSON', body, null);
    return response;
  }

  public async activePopupBuilder(popup_builder_id: string, session: string) {
    var formData = new FormData();
    formData.append('session', session);
    // const response = await this._popupService.fetch(`popups/active_in_list/${popup_builder_id}`, 'POST', 'FILE', formData, null);
    const response = await this._popupService.fetch(`popups/${popup_builder_id}/actions/active`, 'POST', 'FILE', formData, null);
    return response;
  }

  public async deleteDraft(popup_builder_id: string) {
    // const response = await this._popupService.fetch(`popups/delete_draft/${popup_builder_id}`, 'DELETE', 'JSON', null, null);
    const response = await this._popupService.fetch(`popups/${popup_builder_id}/actions/delete-draft`, 'DELETE', 'JSON', null, null);
    return response;
  }

  public async activePopup(
    popup_builder_id: string,
    popup_template_id: string,
    title: string,
    body_template: string,
    build_template: string,
    session: string,
    avatar: any,
    second_page: string,
    dynamic: string,
    current_field: string,
    current_button: string
  ) {
    var formData = new FormData();
    // formData.append('popup_draft_id', popup_draft_id);
    formData.append('popup_template_id', popup_template_id);
    formData.append('title', title);
    formData.append('body_template', body_template);
    formData.append('build_template', build_template);
    formData.append('session', session);
    formData.append('avatar', avatar);
    formData.append('second_page', second_page);
    formData.append('dynamic', dynamic);
    formData.append('current_field', current_field);
    formData.append('current_button', current_button);
    // const response = await this._popupService.fetch(`popups/active/${popup_builder_id}`, 'POST', 'FILE', formData, null);
    const response = await this._popupService.fetch(`popups/${popup_builder_id}/actions/active-and-update`, 'POST', 'FILE', formData, null);
    return response;
  }

  public async connectPopupWithJB(
    popup_builder_id: string,
    journey_builder_using: string,
    master_campaign_using: string
  ) {
    let body = {
      journey_builder_using,
      master_campaign_using
    }
    // const response = await this._popupService.fetch(`popups/${popup_builder_id}/connect-with`, 'PATCH', 'JSON', body, null);
    const response = await this._popupService.fetch(`popups/${popup_builder_id}/actions/connect-with`, 'PATCH', 'JSON', body, null);
    return response;
  }

  public async disconnectPopupWithJB(
    popup_builder_id: string,
    journey_builder_using: string,
    master_campaign_using: string
  ) {
    let body = {
      journey_builder_using,
      master_campaign_using
    }
    // const response = await this._popupService.fetch(`popups/${popup_builder_id}/disconnect-with`, 'PATCH', 'JSON', body, null);
    const response = await this._popupService.fetch(`popups/${popup_builder_id}/actions/disconnect-with`, 'PATCH', 'JSON', body, null);
    return response;
  }

  public async getListCategoryPopupTemplate() {
    const response = await this._popupService.fetch('categories', 'GET', 'JSON', null, null);
    return response;
  }

  public async checkPopupIsUsed(popup_builder_id: string) {
    const response = await this._popupService.fetch(`popups/${popup_builder_id}/actions/check-is-used`, 'GET', 'JSON', null, null);
    return response;
  }
}
