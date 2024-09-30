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
    // TODO: Audit the HTML for accessibility.
    template.innerHTML = `
      <div class="survey-container">
        <div class="survey-header">
          <p class="display-4 fw-bold">Share Your Thoughts</p>
          <p>Your feedback is anonymous, and we will use it to improve our website.</p>
        </div>
        <div class="survey-form">
          <!-- Form content goes here -->
        </div>
        <div class="survey-navigation">
          <!-- Navigation buttons will be dynamically added here -->
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Apply styles from the imported SCSS
    const style = document.createElement('style');
    style.textContent = `${bootstrapStyles}\n${componentStyles}`;
    this.shadowRoot.appendChild(style);

    this.navigationContainer = this.shadowRoot.querySelector('.survey-navigation');

    this.prevBtn = this.createButton('prevBtn', 'secondary', 'Previous', () => this.changeStep(-1));
    this.nextBtn = this.createButton('nextBtn', 'primary', 'Next', () => this.changeStep(1));
    this.submitBtn = this.createButton('submitBtn', 'primary', 'Submit Feedback', () => this.handleSubmit());
  }

  connectedCallback() {
    this.render(surveyData);
  }

  createButton(id, type, text, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.classList.add('btn', `btn-${type}`);
    button.addEventListener('click', onClick);
    return button;
  }

  changeStep(step) {
    this.currentStep += step;
    this.render(surveyData);
  }

  renderNavigationButtons() {
    this.navigationContainer.innerHTML = ''; // Clear previous buttons

    const { isFinalStep } = surveyData[this.currentStep];
    const hasResponse = !!this.surveyResponse[this.currentStep];

    if (this.currentStep > 0) {
      this.navigationContainer.appendChild(this.prevBtn);
    } else if (this.navigationContainer.contains(this.prevBtn)) {
      this.navigationContainer.removeChild(this.prevBtn);
    }

    if (isFinalStep && hasResponse) {
      this.navigationContainer.appendChild(this.submitBtn);
    } else if (this.navigationContainer.contains(this.submitBtn)) {
      this.navigationContainer.remove(this.submitBtn);
    }

    if (!isFinalStep && hasResponse) {
      this.navigationContainer.appendChild(this.nextBtn);
    } else if (this.navigationContainer.contains(this.nextBtn)) {
      this.navigationContainer.removeChild(this.nextBtn);
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
    if (surveyData[stepNum].isFinalStep) {
      this.renderNavigationButtons();
    } else {
      this.changeStep(1);
    }
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

    this.renderNavigationButtons();
  }
}

customElements.define('detroit-usability-survey', DetroitUsabilitySurvey);
