import axios from 'axios';

let singletonInstance = null;

const GET_ALL_DEVICES = {type: 'devices', filter: 'all', used: true, order: 'Name'};
const GET_ALL_SCENES = {type: 'scenes'};

class JSONClientSingleton {

  /**
   * A basic JSON API client proxy. Works as a singleton.
   **/

  constructor() {
    if (singletonInstance) {
      return singletonInstance;
    }
    this.throttleTimeout_ = null;
    singletonInstance = this;
    return singletonInstance;
  }

  setServerUrl(url) {
    this.serverUrl = url;
  }

  getAllDevices(callback) {
    this.get(GET_ALL_DEVICES, callback);
  }

  getAllScenesThrottled = (callback) => {
    if (this.throttleTimeout_) {
      return;
    }
    this.getAllScenes(callback);
    this.throttleTimeout_ = global.setTimeout(
      () => { this.throttleTimeout_ = null }, 500);
  }

  getAllScenes = (callback) => {
    this.get(GET_ALL_SCENES, callback);
  }

  objectToQuery(data) {
    const keyvals = [];
    for (const key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        keyvals.push(key + '=' + encodeURIComponent(data[key]));
      }
    }
    return keyvals.join('&');
  }

  get(queryData, opt_callback = function(data) {
    if (data.status !== 'OK') {
      console.debug('JSON query failed', queryData);
    }
  }) {
    if (!this.serverUrl) {
      alert('Server URL is not set, please check the settings');
      return;
    }
    axios.get(this.serverUrl+ '/json.htm?' + this.objectToQuery(queryData)).then(response => {
      opt_callback(response.data);
    }).catch(error => {
      alert('Unable to reach Domoticz server, check the settings and make sure Domoticz is online');
      console.debug('Unable to reach Domoticz', error);
    });
  }

}

export default JSONClientSingleton;
