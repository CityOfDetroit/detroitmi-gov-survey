import Connector from './utilities/Connector';
import bootstrapStyles from './styles/css/bootstrap.base.css';
import componentStyles from './styles/css/survey/detroitusabilitysurvey.css';
import surveyData from './formData/usability-form.json';
import {createRadioElement, createSelectElement} from './utilities/formBuilder.js';

class DetroitUsabilitySurvey extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentStep = 0;
    this.surveyResponse = {};

    const template = document.createElement('template');
    template.innerHTML = `
      <div class="survey-container">
        <div class="survey-header">
          <h2>Share Your Thoughts</h2>
          <p>Your feedback is anonymous, and we will use it to improve our website.</p>
        </div>
        <div class="survey-form">
          <!-- Form content goes here -->
        </div>
        <div class="survey-navigation">
          <button id="prevBtn" style="display: none;">Previous</button>
          <button id="nextBtn" style="display: none;">Next</button>
          <button id="submitBtn" style="display: none;">Submit</button>
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Apply styles from the imported SCSS
    const style = document.createElement('style');
    style.textContent = `${bootstrapStyles}\n${componentStyles}`;
    this.shadowRoot.appendChild(style);

    this.prevBtn = this.shadowRoot.querySelector('#prevBtn');
    this.nextBtn = this.shadowRoot.querySelector('#nextBtn');
    this.submitBtn = this.shadowRoot.querySelector('#submitBtn');

    this.prevBtn.addEventListener('click', () => this.changeStep(-1));
    this.nextBtn.addEventListener('click', () => this.changeStep(1));
    this.submitBtn.addEventListener('click', () => this.handleSubmit());
  }

  connectedCallback() {
    this.render(surveyData);
  }

  changeStep(step) {
    this.currentStep += step;
    this.render(surveyData);
  }

  updateNavigationButtons() {
    this.prevBtn.style.display = this.currentStep === 0 ? 'none' : 'inline-block';

    if (surveyData[this.currentStep].isFinalStep) {
      this.submitBtn.style.display = 'inline-block';
      this.nextBtn.style.display = 'none';
    } else {
      this.submitBtn.style.display = 'none';
      this.nextBtn.style.display = this.surveyResponse[this.currentStep] ? 'inline-block' : 'none';
    }
  }

  handleFormChange(stepNum, value) {
    this.surveyResponse[stepNum] = value;
    if (surveyData[stepNum].isPosting) {
      Connector.start(
        this.surveyResponse, 
        {'Auth-Token': 'foo'}, 
        (res) => {console.info(res)}, 
        (res) => {console.error(res)}
      );
    }
    this.updateNavigationButtons();
  }

  handleSubmit() {
    Connector.start(
      this.surveyResponse, 
      {'Auth-Token': 'foo'}, 
      (res) => {console.info(res)}, 
      (res) => {console.error(res)}
    );
  }

  render(surveyData) {
    const formContainer = this.shadowRoot.querySelector('.survey-form');
    formContainer.innerHTML = ''; // Clear previous form content

    const item = surveyData[this.currentStep];
    if (item) {
      switch(item.inputType) {
        case 'radio': {
          const radioForm = createRadioElement(
            this.currentStep, 
            item, 
            this.surveyResponse[this.currentStep], 
            this.handleFormChange.bind(this),
          );
          formContainer.appendChild(radioForm);
          break;
        }
        case 'select': {
          const selectForm = createSelectElement(
            this.currentStep, 
            item, 
            this.surveyResponse[this.currentStep], 
            this.handleFormChange.bind(this),
          );
          formContainer.appendChild(selectForm);
          break;
        }
        default:
          console.error('Unknown input type:', item.inputType);
          break;
      }
    }

    this.updateNavigationButtons();
  }
}

customElements.define('detroit-usability-survey', DetroitUsabilitySurvey);
