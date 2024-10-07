'use strict';

// const SURVEY_NAME = 'detroitmi_usability';
const SURVEY_NAME = 'test_survey';
const API_URL = `https://apis.detroitmi.gov/surveys/${SURVEY_NAME}/`;
const TEST_RESPONSE = {"survey_id": "2"};

export default class Connector {
  static formatData(surveyID, rawData, elapsedTime) {
    let formattedData = {
      answers: {
      }
    };

    if (surveyID !== null) {
      formattedData.survey_id = surveyID;
    }

    for (let stepID in rawData) {
      formattedData.answers[`question_${stepID}`] = rawData[stepID];
    }

    formattedData.answers['metadata_timespent_seconds'] = elapsedTime;

    if (typeof window !== 'undefined' && window.location) {
      formattedData.answers['metadata_url'] = window.location.href;
    }

    return formattedData;
  }

  static buildRequest(surveyID, rawData, elapsedTime, credentials){
    const data = Connector.formatData(surveyID, rawData, elapsedTime);
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

  static start(surveyID, rawData, elapsedTime, credentials, success, fail){
    let request = Connector.buildRequest(surveyID, rawData, elapsedTime, credentials);
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