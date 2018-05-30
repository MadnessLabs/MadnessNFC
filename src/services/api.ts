/**
 * @module Services
 */
declare var firebase;
export class APIService {
  public host: string;
  public shouldBeAsync = true;
  public apiKey: string;

  public constructor(options: any = {}) {
    this.host = options.host;
  }

  public async makePromise(method: string, endpoint: string, params?: any) {
    return new Promise(async (resolve, reject) => {
      const request = new XMLHttpRequest();
      const token = firebase.auth().currentUser ? await firebase.auth().currentUser.getIdToken(true) : localStorage.getItem('tmg:token');
      request.onload = async () => {
        const responseData: any = JSON.parse(request.responseText);
        if (responseData && responseData.data && responseData.success) {
          localStorage.setItem('tmg:token', await firebase.auth().currentUser.getIdToken(true));
          resolve(responseData.data);
        } else {
          reject(responseData);
        }
      };

      request.open(method, `${this.host}/${endpoint}`, this.shouldBeAsync);

      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      if (token) {
        request.setRequestHeader('Authorization', token);
      }

      request.send(params ? JSON.stringify(params) : '{}');
    });
  }

  public get(endpoint: string, params?: any): Promise<any> {
    return this.makePromise('GET', endpoint, params);
  }

  public post(endpoint: string, params?: any): Promise<any> {
    return this.makePromise('POST', endpoint, params);
  }

  public delete(endpoint: string, params?: any): Promise<any> {
    return this.makePromise('DELETE', endpoint, params);
  }
}
