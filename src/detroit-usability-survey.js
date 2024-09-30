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
          <button id="prevBtn" disabled>Previous</button>
          <button id="nextBtn">Next</button>
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

    this.prevBtn.addEventListener('click', () => this.changeStep(-1));
    this.nextBtn.addEventListener('click', () => this.changeStep(1));
  }

  connectedCallback() {
    this.render(surveyData);
  }

  changeStep(step) {
    this.currentStep += step;
    this.render(surveyData);
  }

  render(surveyData) {
    const formContainer = this.shadowRoot.querySelector('.survey-form');
    formContainer.innerHTML = ''; // Clear previous form content

    const item = surveyData[this.currentStep];
    if (item) {
      switch(item.inputType) {
        case 'radio': {
          const radioForm = createRadioElement(this.currentStep, item, this.surveyResponse[this.currentStep], 
            (stepNum, value) => {
              this.surveyResponse[stepNum] = value;
            }
          );
          formContainer.appendChild(radioForm);
          break;
        }
        case 'select': {
          const selectForm = createSelectElement(this.currentStep, item, this.surveyResponse[this.currentStep],
            (stepNum, value) => { 
              this.surveyResponse[stepNum] = value; 
            }
          );
          formContainer.appendChild(selectForm);
          break;
        }
        default:
          console.error('Unknown input type:', item.inputType);
          break;
      }
    }

    // Update navigation buttons
    this.prevBtn.disabled = this.currentStep === 0;
    this.nextBtn.disabled = this.currentStep === surveyData.length - 1;
  }
}

customElements.define('detroit-usability-survey', DetroitUsabilitySurvey);
