'use strict';

// const SURVEY_NAME = 'detroitmi_usability';
const SURVEY_NAME = 'test_survey';
const API_URL = `https://apis.detroitmi.gov/surveys/${SURVEY_NAME}/`;
const TEST_RESPONSE = '{"survey_id": "123"}';

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
    fetch(request)
      .then(res => {
        if (!res.ok) {
            throw new Error(`Failed to post survey data. HTTP status ${res.status}. Message: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        success(data.survey_id);
      })
      .catch(error => {
        fail(error);
      });
  }
}