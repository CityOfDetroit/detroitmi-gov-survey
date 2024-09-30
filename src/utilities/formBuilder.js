/**
 * @module formBuilder
 */

/**
 * Creates a form with radio input element.
 * TODO: Make the form required.
 * @param {Number} stepNum - The order that this form appears in the app.
 * @param {Object} data - The definition of the radio input.
 * @param {string} data.legendOrLabel - The legend for the input.
 * @param {string} data.id - The name for the radio input.
 * @param {Array<Object>} data.options - The options for the radio input.
 * @param {string} data.options[].value - The value attribute for an option.
 * @param {string} data.options[].label - The label for an option.
 * @param {Function} handleUpdate - The callback function to handle form input changes.
 * @returns {HTMLElement} The constructed radio input element.
 */
function createRadioElement(stepNum, data, handleUpdate) {
  const form = document.createElement('form');
  const fieldset = document.createElement('fieldset');
  form.appendChild(fieldset);
  const legend = document.createElement('legend');
  legend.textContent = data.legendOrLabel;
  fieldset.appendChild(legend);
  const container = document.createElement('div');
  fieldset.appendChild(container);
  data.options.forEach(option => {
    const optionID = `${data.id}-${option.value}`;
    const input = document.createElement('input');
    input.type = 'radio';
    input.id = optionID;
    input.name = data.id;
    input.value = option.value;
    input.addEventListener('change', () => {
      handleUpdate(stepNum, input.value);
    });
    container.appendChild(input);
    const label = document.createElement('label');
    label.htmlFor = optionID;
    label.textContent = option.label;
    container.appendChild(label);
  });
  return form;
}

/**
 * Creates a form with select element.
 * TODO: Make the form required.
 * @param {Number} stepNum - The order that this form appears in the app.
 * @param {Object} data - The definition for the select element.
 * @param {string} data.legendOrLabel - The label for the input.
 * @param {string} data.id - The name and id attribute for the select element.
 * @param {Array<Object>} data.options - The options for the select element.
 * @param {string} data.options[].value - The value attribute for an option.
 * @param {string} data.options[].label - The label for an option.
 * @param {Function} handleUpdate - The callback function to handle form input changes.
 * @returns {HTMLElement} The constructed select element.
 */
function createSelectElement(stepNum, data, handleUpdate) {
  const form = document.createElement('form');
  const label = document.createElement('label');
  label.textContent = data.legendOrLabel;
  label.htmlFor = data.id;
  form.appendChild(label);

  const select = document.createElement('select');
  select.id = data.id;
  select.name = data.id;
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '--Please select an option--';
  select.appendChild(defaultOption);
  data.options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    handleUpdate(stepNum, select.value);
  });

  form.appendChild(select);
  return form;
}

export { createRadioElement, createSelectElement };