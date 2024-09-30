/**
 * @module formBuilder
 */

/**
 * Creates a form with radio input element.
 * TODO: Pass in callback for handling form input.
 * @param {Object} data - The definition of the radio input.
 * @param {string} data.legendOrLabel - The legend for the input.
 * @param {string} data.id - The name for the radio input.
 * @param {Array<Object>} data.options - The options for the radio input.
 * @param {string} data.options[].value - The value attribute for an option.
 * @param {string} data.options[].label - The label for an option.
 * @returns {HTMLElement} The constructed radio input element.
 */
function createRadioElement(data) {
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
    container.appendChild(input);
    const label = document.createElement('label');
    label.for = optionID;
    label.textContent = option.label;
    container.appendChild(label);
  });
  return form;
}

/**
 * Creates a form with select element.
 * TODO: Pass in callback for handling form input.
 * @param {Object} data - The definition for the select element.
 * @param {string} data.legendOrLabel - The label for the input.
 * @param {string} data.id - The name and id attribute for the select element.
 * @param {Array<Object>} data.options - The options for the select element.
 * @param {string} data.options[].value - The value attribute for an option.
 * @param {string} data.options[].label - The label for an option.
 * @returns {HTMLElement} The constructed select element.
 */
function createSelectElement(data) {
  const form = document.createElement('form');
  const label = document.createElement('label');
  label.textContent = data.legendOrLabel;
  label.for = data.id;
  form.appendChild(label);

  const select = document.createElement('select');
  select.id, select.name = data.id;
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
  form.appendChild(select);
  return form;
}

export { createRadioElement, createSelectElement };