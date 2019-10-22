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
    this.getDefaultOptions();
    this.createInput();
    this.createList();
    this.createStatus();
    this.container.appendChild(this.wrapper);
    this.wrapper.appendChild(this.input);
    this.wrapper.appendChild(this.list);
    this.wrapper.appendChild(this.status);
    this.addEventListeners();
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
      this.setSelectedOption(e.target);
      this.hideMenu();
      this.input.focus();
    }
  }

  handleKeydown(e) {
    if (e.code === 'Escape' && this.menuIsVisible) {
      this.hideMenu();
      this.input.focus();
    }

    if (
      e.target.closest('[data-butane-combobox-input]') &&
      e.code === 'ArrowDown'
    ) {
      e.preventDefault();
      if (!this.menuIsVisible) this.showMenu();
      this.focusFirstOption();
    }

    if (
      e.target.closest('[data-butane-combobox-option]') &&
      e.code === 'ArrowDown' &&
      this.menuIsVisible
    ) {
      e.preventDefault();
      this.focusNextOption(e.target);
    }

    if (
      e.target.closest('[data-butane-combobox-option]') &&
      e.code === 'ArrowUp' &&
      this.menuIsVisible
    ) {
      e.preventDefault();
      this.focusPreviousOption(e.target);
    }

    if (
      e.target.closest('[data-butane-combobox-option]') &&
      (e.code === 'Enter' || e.code === 'Space') &&
      this.menuIsVisible
    ) {
      e.preventDefault();
      this.setSelectedOption(e.target);
      this.hideMenu();
      this.input.focus();
    }

    if (e.code === 'Tab' && this.menuIsVisible) {
      this.hideMenu();
    }
  }

  handleInput(e) {
    if (this.menuIsVisible) {
      this.renderMenuItems(e);
    } else {
      this.showMenu();
    }
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
    const selectedIndex = this.select.options[this.select.selectedIndex];
    if (selectedIndex.hasAttribute('selected')) {
      this.input.value = selectedIndex.innerText;
    } else {
      this.select.value = '';
    }
  }

  createList() {
    this.list = document.createElement('ul');
    setAttributes(this.list, {
      'data-butane-combobox-list': '',
      role: 'listbox',
      id: `butane-combobox-${this.id}`,
    });
    this.list.setAttribute('hidden', 'true');
  }

  createStatus() {
    this.status = document.createElement('div');
    setAttributes(this.status, {
      'data-butane-combobox-status': '',
      'aria-live': 'polite',
      role: 'status',
    });
    visuallyHide(this.status);
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
    Array.from(this.list.children).forEach(child =>
      child.setAttribute('aria-selected', child === option ? 'true' : 'false'),
    );
    this.input.value = option.innerText;
    this.select.value = option.innerText;
    this.select
      .querySelector(
        `[value="${option.getAttribute('data-butane-combobox-option-value')}"]`,
      )
      .setAttribute('selected', 'true');
    if (this.config.onSelectedOption) {
      this.config.onSelectedOption(option);
    }
  }

  focusFirstOption() {
    this.list.firstChild.focus();
  }

  focusLastOption() {
    this.list.lastChild.focus();
  }

  focusNextOption(currentEl) {
    if (currentEl.nextElementSibling !== null) {
      currentEl.nextElementSibling.focus();
    } else {
      this.focusFirstOption();
    }
  }

  focusPreviousOption(currentEl) {
    if (currentEl.previousElementSibling !== null) {
      currentEl.previousElementSibling.focus();
    } else {
      this.focusLastOption();
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
      this.defaultOptions.push(option);
    });
  }

  noOptionsTemplate() {
    return `<li>No results found.</li>`;
  }

  optionTemplate(option) {
    return `<li data-butane-combobox-option tabindex="-1" aria-selected="${
      this.input.value === option.innerText ? true : false
    }" role="option" data-butane-combobox-option-value="${option.value}">${
      option.label
    }</li>`;
  }

  renderMenuItems(event) {
    this.filteredOptions = this.defaultOptions;
    this.filteredOptions = matchSorter(
      this.defaultOptions,
      event ? event.target.value : '',
      {
        keys: ['label'],
      },
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

  get menuIsVisible() {
    return this.list.getAttribute('hidden') ? false : true;
  }
}

export default ButaneCombobox;
