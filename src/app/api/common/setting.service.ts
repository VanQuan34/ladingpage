import { IPem } from '../../common/api/pem';
import { Injectable } from '@angular/core';

import { CacheService } from './cache.service';
import { AuthenticateService } from './authenticate.service';
import { CacheKeys } from '../../common/define/cache-keys.define';
import { ISetting } from '../../common/api/setting';
import { BUILD_PEM_OBJECT } from '../../common/define/crypto.define';
import { MoWbBaseApiService } from '../baseApi';
import { HOST_ADM } from 'src/app/common/define/host-domain.define';

@Injectable()
export class SettingService {
	public host: string;

	constructor(
		private _cacheService: CacheService,
		private _authService: AuthenticateService,
		private _baseService: MoWbBaseApiService) {
		
		this.host = HOST_ADM();

	}

	public async getAllSettings(pem: IPem) {
		this._baseService.updateToken();
		const pemString = BUILD_PEM_OBJECT(pem);
		const allSetting = this._cacheService.get(CacheKeys.KEY_CACHE_SETTING_ALL);
		if (allSetting && allSetting.length) {
			// Promise.resolve(allSetting);
			return allSetting;
		}
		const url = `merchants/${this._authService.jwtDecode().merchantID}/accounts/settings/get`;
		const result = await this._baseService.fetch(url, 'GET', 'JSON', null, { pem: pemString }, this.host);
		console.log('getAllSettings=', result);
		this._cacheService.set(CacheKeys.KEY_CACHE_SETTING_ALL, result, CacheService.CACHE_EXPIRE_NONE);
		return result;
		// return new Promise((resolve, reject) => {
		// 	this._apiApiRequestAdminService.get(url, { pem: pemString }).subscribe((result) => {
		// 		this._cacheService.set(CacheKeys.KEY_CACHE_SETTING_ALL, result, CacheService.CACHE_EXPIRE_NONE);
		// 		resolve(result);
		// 	}, err => {
		// 		reject(err);
		// 	});
		// });
	}

	public async getSetting(pem: IPem, key: String) {
		this._baseService.updateToken();
		const pemString = BUILD_PEM_OBJECT(pem);
		const url = `merchants/${this._authService.jwtDecode().merchantID}/accounts/settings/key/${key}`;
		const result = await this._baseService.fetch(url, 'GET', 'JSON', null, { pem: pemString }, this.host);
		console.log('getSetting key=', key, ' result=',result);
		return result;
		// return new Promise((resolve, reject) => {
		// 	this._apiApiRequestAdminService.get(url, { pem: pemString }).subscribe((result) => {
		// 		resolve(result);
		// 	}, err => {
		// 		reject(err);
		// 	});
		// });
	}

	public async createSetting(pem: IPem, body: ISetting) {
		const pemString = BUILD_PEM_OBJECT(pem)
		const url = `merchants/${this._authService.jwtDecode().merchantID}/accounts/settings/add`;
		const result = await this._baseService.fetch(url, 'POST', 'JSON', body, { pem: pemString }, this.host);
		console.log('createSetting  result=',result);
		return result;
		// return new Promise((resolve, reject) => {
		// 	this._apiApiRequestAdminService.post(url, body).subscribe((result) => {
		// 		resolve(result);
		// 	}, err => {
		// 		reject(err);
		// 	});
		// });
	}

	public async updateSetting(pem: IPem, body: ISetting) {
		const pemString = BUILD_PEM_OBJECT(pem)
		const url = `merchants/${this._authService.jwtDecode().merchantID}/accounts/settings/update`;
		const result = await this._baseService.fetch(url, 'POST', 'JSON', body, { pem: pemString }, this.host);
		console.log('updateSetting  result=',result);
		return result;
		// return new Promise((resolve, reject) => {
		// 	this._apiApiRequestAdminService.post(url, body).subscribe((result) => {
		// 		resolve(result);
		// 	}, err => {
		// 		reject(err);
		// 	});
		// });
	}

	public async deleteSetting(pem: IPem, key: string) {
		const pemString = BUILD_PEM_OBJECT(pem)
		const url = `merchants/${this._authService.jwtDecode().merchantID}/accounts/settings/key/${key}/delete`;
		const body: any = null;
		const result = await this._baseService.fetch(url, 'DELETE', 'JSON', body, { pem: pemString }, this.host);
		console.log('deleteSetting  result=',result);
		return result;
		// return new Promise((resolve, reject) => {
		// 	this._apiApiRequestAdminService.delete(url, body).subscribe((result) => {
		// 		resolve(result);
		// 	}, err => {
		// 		reject(err);
		// 	});
		// });
	}

	public async upsertSetting(pem: IPem, body: any) {
		const pemString = BUILD_PEM_OBJECT(pem)
		const url = `merchants/${this._authService.jwtDecode().merchantID}/accounts/settings/upsert`;
		const result = await this._baseService.fetch(url, 'POST', 'JSON', body, { pem: pemString }, this.host);
		console.log('upsertSetting  result=',result);
		return result;
		// return new Promise((resolve, reject) => {
		// 	this._apiApiRequestAdminService.post(url, body).subscribe((result) => {
		// 		resolve(result);
		// 	}, err => {
		// 		reject(err);
		// 	});
		// });
	}

	public async getPathConfig() {
		const pemString =  BUILD_PEM_OBJECT({ isCheck: 0, pathCheck: '/other', action: 1 });
		const merchantId = this._authService.jwtDecode().merchantID;
		const url = `merchants/${merchantId}/public-configs`;
		const result = await this._baseService.fetch(url, 'GET', 'JSON', null, { pem: pemString }, this.host);

		console.log('getPathConfig =', result, ' merchantId=', this._authService.jwtDecode());
		return result;
	}
}
