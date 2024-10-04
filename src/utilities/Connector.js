'use strict';

const API_URL = 'https://apis.detroitmi.gov/surveys/detroitmi_usability/';

export default class Connector {
  static formatData(surveyID, rawData) {
    let formattedData = {
      answers: {
      }
    };

    if (surveyID !== null) {
      formattedData.survey_id = surveyID;
    }

    for (let stepNum in rawData) {
      if (rawData.hasOwnProperty(stepNum)) {
        // TODO: Change stepNum to a more description string.
        formattedData.answers[`question_${stepNum}`] = rawData[stepNum];
      }
    }

    return JSON.stringify(formattedData);
  }

  static buildRequest(surveyID, rawData, credentials){
    const data = Connector.formatData(surveyID, rawData);
    const req = new Request(API_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-type': 'application/json',
      }),
    });
    req.headers.append('Auth-Token', credentials['Auth-Token']);
    return req;
  }

  static start(surveyID, rawData, credentials, success, fail){
    let request = Connector.buildRequest(surveyID, rawData, credentials);
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