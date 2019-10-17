import matchSorter from 'match-sorter';
import { debounce, wrap, visuallyHide, setAttributes, keyCodes } from './utils';

class ButaneCombobox {
  constructor(container, options) {
    this.container = container;
    this.config = {
      ...{
        openOnFocus: false,
        onSelectedOption: () => {},
      },
      ...options,
    };
    this.label = this.container.querySelector('label');
    this.select = this.container.querySelector('select');
    if (!this.select) throw new Error('ButaneCombobox requires a label element');
    if (!this.select) throw new Error('ButaneCombobox requires a select element');
    this.init();
  }

  init() {
    visuallyHide(this.select);
    this.select.removeAttribute('id');
    this.id = this.label.getAttribute('for');
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('data-butane-combobox', '');
    this.container.appendChild(this.wrapper);
    this.getDefaultOptions();
    this.createInput();
    this.createMenu();
    this.renderMenuItems();
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener(
      'click',
      event => {
        const target = event.target;

        if (!target.closest('[data-butane-combobox]')) {
          return;
        }

        if (target.closest(`[data-butane-combobox-option]`)) {
          this.setSelectedOption(target);
          this.setInputValue(target.innerText);
        }
      },
      false,
    );
    this.input.addEventListener('input', event => this.renderMenuItems(event), false);
  }

  createInput() {
    this.input = document.createElement('input');
    setAttributes(this.input, {
      'data-butante-combobox-input': '',
      id: this.id,
      type: 'text',
      autocapitalize: 'none',
      autocomplete: 'off',
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-owns': `butane-combobox-${this.id}`,
    });
    const selectedVal = this.select.options[this.select.selectedIndex].value;
    if (selectedVal.length > 0) this.input.value = selectedVal;
    this.wrapper.appendChild(this.input);
  }

  createMenu() {
    this.list = document.createElement('ul');
    setAttributes(this.list, {
      'data-butane-combobox-list': '',
      role: 'listbox',
      id: `butane-combobox-${this.id}`,
    });
    // this.list.setAttribute('hidden', 'true');
    this.status = document.createElement('div');
    setAttributes(this.status, {
      'data-butane-combobox-status': '',
      'aria-live': 'polite',
      role: 'status',
    });
    visuallyHide(this.status);
    this.wrapper.appendChild(this.list);
    this.wrapper.appendChild(this.status);
  }

  showMenu() {
    this.input.setAttribute('aria-expanded', 'true');
    this.list.removeAttribute('hidden');
  }

  hideMenu() {
    this.input.setAttribute('aria-expanded', 'false');
    this.list.setAttribute('hidden', 'true');
  }

  setSelectedOption(option) {
    option.setAttribute('aria-selected', 'true');
    if (this.config.onSelectedOption) this.config.onSelectedOption(option.innerText);
  }

  setInputValue(value) {
    this.input.value = value;
  }

  updateStatus() {
    if (this.filteredOptions.length === 0) {
      this.status.innerText = 'No results.';
    } else {
      this.status.innerText = `${this.filteredOptions.length} results available`;
    }
  }

  getDefaultOptions() {
    this.defaultOptions = [];
    Array.from(this.select.options).forEach(option => this.defaultOptions.push(option.label));
  }

  noResultsTemplate() {
    return `<li>No results found.</li>`;
  }

  optionTemplate(option) {
    return `<li data-butane-combobox-option tabindex="-1" aria-selected="false" role="option">${option}</li>`;
  }

  renderMenuItems(event) {
    this.filteredOptions = this.defaultOptions;
    this.filteredOptions = matchSorter(this.defaultOptions, event ? event.target.value : '');
    if (this.filteredOptions.length) {
      this.list.innerHTML = this.filteredOptions.map(option => this.optionTemplate(option)).join('');
    } else {
      this.list.innerHTML = this.noResultsTemplate();
    }
    this.updateStatus();
  }
}

export default ButaneCombobox;
