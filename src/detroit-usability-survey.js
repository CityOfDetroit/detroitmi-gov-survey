import bootstrapStyles from './styles/css/bootstrap.base.css';
import componentStyles from './styles/css/survey/detroitusabilitysurvey.css';
import surveyData from './formData/usability-form.json';
import {createRadioElement, createSelectElement} from './utilities/formBuilder.js';

class DetroitUsabilitySurvey extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
      <div class="survey-container">
        <div class="survey-header">
          <h2>Share Your Thoughts</h2>
          <p>Your feedback is anonymous, and we will use is to improve our website.</p>
        </div>
        <div class="survey-form">
          <!-- Form content goes here -->
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Apply styles from the imported SCSS
    const style = document.createElement('style');
    style.textContent = `${bootstrapStyles}\n${componentStyles}`;
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    this.render(surveyData);
  }

  render(surveyData) {
    const formContainer = this.shadowRoot.querySelector('.survey-form');
    
    surveyData.forEach(item => {
      switch(item.inputType) {
        case 'radio':
          const radioForm = createRadioElement(item);
          formContainer.appendChild(radioForm);
          break;
        case 'select':
          const selectForm = createSelectElement(item);
          formContainer.appendChild(selectForm);
          break;
        default:
          console.error('Unknown input type:', item.inputType);
          break;
      }
    });
  }
}

customElements.define('detroit-usability-survey', DetroitUsabilitySurvey);
