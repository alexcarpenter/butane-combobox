import matchSorter from 'match-sorter';
import { visuallyHide, setAttributes } from './utils';

class ButaneCombobox {
  constructor(container, options) {
    this.container = container;
    this.config = {
      ...{
        openOnFocus: false,
        onSelectedOption: () => {},
        onShowMenu: () => {},
        onHideMenu: () => {},
      },
      ...options,
    };
    this.label = this.container.querySelector('label');
    this.select = this.container.querySelector('select');
    if (!this.select)
      throw new Error('ButaneCombobox requires a label element');
    if (!this.select)
      throw new Error('ButaneCombobox requires a select element');
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

  get menuIsVisible() {
    return this.list.getAttribute('hidden') ? false : true;
  }

  addEventListeners() {
    document.addEventListener('click', e => this.handleClicks(e), false);
    document.addEventListener('keydown', e => this.handleKeydown(e), false);
    document.addEventListener('input', e => this.handleInput(e), false);
  }

  handleClicks(e) {
    if (!e.target.closest('[data-butane-combobox]') && this.menuIsVisible) {
      this.hideMenu();
    }

    if (
      e.target.closest('[data-butane-combobox-input]') &&
      this.config.openOnFocus
    ) {
      this.showMenu();
    }

    if (e.target.closest('[data-butane-combobox-option]')) {
      this.input.value = e.target.innerText;
      this.setSelectedOption(e.target);
      this.hideMenu();
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.menuIsVisible) {
      this.hideMenu();
    }

    if (
      e.target.closest('[data-butane-combobox-input]') &&
      e.key === 'ArrowDown' &&
      !this.menuIsVisible
    ) {
      this.showMenu();
    }
  }

  handleInput(e) {
    this.renderMenuItems(e);
  }

  createInput() {
    this.input = document.createElement('input');
    setAttributes(this.input, {
      'data-butane-combobox-input': '',
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
    this.list.setAttribute('hidden', 'true');
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
    this.renderMenuItems();
    this.input.setAttribute('aria-expanded', 'true');
    this.list.removeAttribute('hidden');
    if (this.config.onShowMenu) {
      this.config.onShowMenu();
    }
  }

  hideMenu() {
    this.input.setAttribute('aria-expanded', 'false');
    this.list.setAttribute('hidden', 'true');
    if (this.config.onHideMenu) {
      this.config.onHideMenu();
    }
  }

  setSelectedOption(option) {
    option.setAttribute('aria-selected', 'true');
    if (this.config.onSelectedOption) {
      this.config.onSelectedOption(option);
    }
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
    Array.from(this.select.options).forEach(option => {
      this.defaultOptions.push(option.label);
    });
  }

  noOptionsTemplate() {
    return `<li>No results found.</li>`;
  }

  optionTemplate(option) {
    return `<li data-butane-combobox-option tabindex="-1" aria-selected="false" role="option">${option}</li>`;
  }

  renderMenuItems(event) {
    this.filteredOptions = this.defaultOptions;
    this.filteredOptions = matchSorter(
      this.defaultOptions,
      event ? event.target.value : '',
    );
    if (this.filteredOptions.length) {
      this.list.innerHTML = this.filteredOptions
        .map(option => this.optionTemplate(option))
        .join('');
    } else {
      this.list.innerHTML = this.noOptionsTemplate();
    }
    this.updateStatus();
  }
}

export default ButaneCombobox;
