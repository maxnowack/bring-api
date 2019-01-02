import fetch from 'node-fetch';
import formEncode from './formEncode';

const baseUrl = 'https://api.getbring.com/rest/';
const apiKey = 'cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp';
const version = '3.12.5';
const client = 'iOS';
const userAgent = `Bring!/${version} (ch.publisheria.bring; build:190; iOS 11.2.2) Alamofire/4.2.0`;


export default class Base {
  getRefreshToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token present. Please login first!');
    }
    return this.refreshToken;
  }

  getAccessToken() {
    if (!this.accessToken) {
      throw new Error('No access token present. Please login first!');
    }
    return this.accessToken;
  }

  call({
    path,
    method = 'GET',
    data,
    auth = true,
  }) {
    return fetch(`${baseUrl}${path}`, {
      method,
      body: data ? formEncode(data) : null,
      headers: Object.assign({
        'X-BRING-API-KEY': apiKey,
        'X-BRING-CLIENT': client,
        'X-BRING-VERSION': version,
        'User-Agent': userAgent,
      }, data && { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth && {
        Cookie: `refresh_token=${this.getRefreshToken()}`,
        Authorization: `Bearer ${this.getAccessToken()}`,
        'X-BRING-USER-UUID': this.uuid,
      }),
    }).then(t => t.text()).then((result) => {
      if (!result) return null;
      return JSON.parse(result);
    });
  }

  login(email, password) {
    return this.call({
      path: 'v2/bringauth/',
      method: 'POST',
      data: { email, password },
      auth: false,
    }).then((result) => {
      if (result.token_type !== 'Bearer') {
        throw new Error(`unknown token type '${result.token_type}'`);
      }
      this.uuid = result.uuid;
      this.publicUuid = result.publicUuid;
      this.email = result.email;
      this.name = result.name;
      this.photoPath = result.photoPath;
      this.bringListUUID = result.bringListUUID;
      this.accessToken = result.access_token;
      this.refreshToken = result.refresh_token;
      this.tokenType = result.token_type;
      return true;
    });
  }
}
