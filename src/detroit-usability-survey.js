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
    this.isLoading = false;
    this.isSubmitted = false;
    this.surveyID = null;

    const template = document.createElement('template');
    // TODO: Audit the HTML for accessibility.
    template.innerHTML = `
      <div class="survey-container">
        <div class="survey-header">
          <p class="display-4 fw-bold">Share Your Thoughts</p>
          <p>Your feedback is anonymous, and we will use it to improve our website.</p>
        </div>
        <div class="survey-body">
          <div class="survey-form">
            <!-- Form content goes here -->
          </div>
          <div class="survey-navigation">
            <!-- Navigation buttons will be dynamically added here -->
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Apply styles from the imported SCSS
    const style = document.createElement('style');
    style.textContent = `${bootstrapStyles}\n${componentStyles}`;
    this.shadowRoot.appendChild(style);

    this.navigationContainer = this.shadowRoot.querySelector('.survey-navigation');
    this.formContainer = this.shadowRoot.querySelector('.survey-form');

    this.prevBtn = this.createButton('prevBtn', 'secondary', 'Previous', () => this.changeStep(-1));
    this.nextBtn = this.createButton('nextBtn', 'primary', 'Next', () => this.changeStep(1));
    this.submitBtn = this.createButton('submitBtn', 'primary', 'Submit Feedback', () => this.handleSubmit());
  }

  connectedCallback() {
    this.render();
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
    this.render();
  }

  handleSubmitSuccess(surveyID) {
    this.surveyID = surveyID;
    this.isLoading = false;
  }

  handleSubmitFailure(error) {
    this.isLoading = false;
    console.error(error);
    this.render();
  }

  handleFormChange(stepNum, value) {
    this.isLoading = true;
    this.surveyResponse[stepNum] = value;
    if (surveyData[stepNum].isPosting) {
      Connector.start(
        this.surveyID,
        this.surveyResponse, 
        {'Auth-Token': 'foo'}, 
        (surveyID) => {
          this.handleSubmitSuccess(surveyID);
          if (surveyData[stepNum].isFinalStep) {
            this.render();
          } else {
            this.changeStep(1);
          }
        }, 
        this.handleSubmitFailure.bind(this),
      );
    }
    this.render();
  }

  handleSubmit() {
    this.isLoading = true;
    Connector.start(
      this.surveyID,
      this.surveyResponse, 
      {'Auth-Token': 'foo'}, 
      (surveyID) => {
        this.handleSubmitSuccess(surveyID);
        this.isSubmitted = true;
        this.render();
      }, 
      this.handleSubmitFailure.bind(this),
    );
    this.render();
  }

  renderNavigationButtons() {
    const { isFinalStep } = surveyData[this.currentStep];
    const hasResponse = !!this.surveyResponse[this.currentStep];

    if (this.isSubmitted) {
      const surveyContainer = this.shadowRoot.querySelector('.survey-body')
      if (surveyContainer.contains(this.navigationContainer)) {
        surveyContainer.removeChild(this.navigationContainer);
      }
      return;
    }

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

  renderConfirmation() {
    if (!this.isSubmitted) {
      return;
    }

    const confirmation = document.createElement('div');
    confirmation.classList.add('survey-confirmation');
    confirmation.innerHTML = `
      <p class="fw-bold">Thank you for sharing your feedback!</p>
      <p>Your responses have been submitted.</p>
    `;
    const surveyContainer = this.shadowRoot.querySelector('.survey-body')
    surveyContainer.appendChild(confirmation);
  }

  renderLoading() {
    const surveyContainer = this.shadowRoot.querySelector('.survey-body')
    let spinnerOverlay = surveyContainer.querySelector('.spinner-overlay');

    if (!this.isLoading) {
      if (spinnerOverlay) {
        surveyContainer.removeChild(spinnerOverlay);
      }
      return;
    }

    spinnerOverlay = document.createElement('div');
    spinnerOverlay.classList.add('spinner-overlay');
    spinnerOverlay.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
    surveyContainer.appendChild(spinnerOverlay);
  }

  renderForm() {
    if (this.isSubmitted) {
      const surveyContainer = this.shadowRoot.querySelector('.survey-body')
      if (surveyContainer.contains(this.formContainer)) {
        surveyContainer.removeChild(this.formContainer);
      }
      return;
    }

    // Otherwise, continue on rendering the survey.
    this.formContainer.innerHTML = ''; // Clear previous form content

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
          this.formContainer.appendChild(radioForm);
          break;
        }
        case 'select': {
          const selectForm = createSelectElement(
            this.currentStep, 
            item, 
            this.surveyResponse[this.currentStep], 
            this.handleFormChange.bind(this),
          );
          this.formContainer.appendChild(selectForm);
          break;
        }
        default:
          console.error('Unknown input type:', item.inputType);
          break;
      }
    }
  }

  render() {
    this.renderForm();
    this.renderNavigationButtons();
    this.renderConfirmation();
    this.renderLoading();
  }
}

customElements.define('detroit-usability-survey', DetroitUsabilitySurvey);
