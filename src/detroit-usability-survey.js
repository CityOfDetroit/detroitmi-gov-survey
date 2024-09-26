import styles from './styles/detroitusabilitysurvey.css';

class DetroitUsabilitySurvey extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
      <div class="survey-container">
        <div class="survey-header">
          <h2>Share Your Thoughts</h2>
        </div>
        <form class="survey-form">
          <!-- Form content goes here -->
        </form>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Apply styles from the imported SCSS
    const style = document.createElement('style');
    style.textContent = styles;
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    const surveyData = this.getSurveyData();
    this.render(surveyData);
  }

  getSurveyData() {
    return [
      { type: 'text', question: 'What is your name?' },
      { type: 'email', question: 'What is your email?' },
      { type: 'textarea', question: 'Tell us about yourself' }
    ];
  }

  render(surveyData) {
    const form = this.shadowRoot.querySelector('.survey-form');
    
    surveyData.forEach(item => {
      const label = document.createElement('label');
      label.textContent = item.question;
    
      let input;
      if (item.type === 'text' || item.type === 'email') {
        input = document.createElement('input');
        input.type = item.type;
      } else if (item.type === 'textarea') {
        input = document.createElement('textarea');
      }
    
      form.appendChild(label);
      form.appendChild(input);
    });
  }
}

customElements.define('detroit-usability-survey', DetroitUsabilitySurvey);
