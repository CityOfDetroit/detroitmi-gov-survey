'use strict';

const API_URL = 'https://apis.detroitmi.gov/surveys/detroitmi_usability/';

export default class Connector {
  static formatData(rawData) {
    let formattedData = {
      answers: {
        section_1: {}
      }
    };

    for (let stepNum in rawData) {
      if (rawData.hasOwnProperty(stepNum)) {
        formattedData.answers.section_1[`question_${stepNum}`] = rawData[stepNum];
      }
    }

    return JSON.stringify(formattedData);
  }

  static buildRequest(rawData, credentials){
    const data = Connector.formatData(rawData);
    const req = new Request(API_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-type': 'application/json',
      }),
      redirect: 'follow'
    });
    req.headers.append('Auth-Token', credentials['Auth-Token']);
    return req;
  }

  static start(rawData, credentials, success, fail){
    let request = Connector.buildRequest(rawData, credentials);
    console.info('Sending request:', request);
    request.text().then((bodyAsText) => {
      console.info('Request body as text:', bodyAsText);
    });
    // fetch(request)
    // .then((res) => {
    //     success(res);
    // })
    // .catch((error) => {
    //     fail(error);
    // });
  }
}