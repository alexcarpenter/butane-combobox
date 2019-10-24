import matchSorter from 'match-sorter';
import { visuallyHide, setAttributes } from './utils';

class ButaneCombobox {
  constructor(container, options) {
    this.container = container;
    this.config = {
      ...{
        showOnClick: false,
        onSelectedOption: () => {},
        onShowMenu: () => {},
        onHideMenu: () => {},
      },
      ...options,
    };
    this.label = this.container.querySelector('label');
    this.select = this.container.querySelector('select');
    this.id = this.label.getAttribute('for');
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('data-butane-combobox', '');
    this.container.appendChild(this.wrapper);
    this.hideSelect();
    this.createInput();
    this.createList();
    this.createStatus();
    this.handleClicks = this.handleClicks.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.getDefaultOptions();
    this.addEventListeners();
  }

  get menuIsVisible() {
    return this.list.getAttribute('hidden') ? false : true;
  }

  hideSelect() {
    visuallyHide(this.select);
    this.select.removeAttribute('id');
  }

  createInput() {
    this.input = document.createElement('input');
    setAttributes(this.input, {
      'data-butane-combobox-input': '',
      'id': this.id,
      'type': 'text',
      'autocapitalize': 'none',
      'autocomplete': 'off',
      'role': 'combobox',
      'aria-autocomplete': 'list',
      'aria-owns': `butane-combobox-${this.id}`,
    });
    const selectedIndex = this.select.options[this.select.selectedIndex];
    if (selectedIndex.hasAttribute('selected')) {
      this.input.value = selectedIndex.innerText;
    } else {
      this.select.value = '';
    }
    this.wrapper.appendChild(this.input);
  }

  createList() {
    this.list = document.createElement('ul');
    setAttributes(this.list, {
      'data-butane-combobox-list': '',
      'role': 'listbox',
      'id': `butane-combobox-${this.id}`,
    });
    this.list.setAttribute('hidden', 'true');
    this.wrapper.appendChild(this.list);
  }

  createStatus() {
    this.status = document.createElement('div');
    setAttributes(this.status, {
      'data-butane-combobox-status': '',
      'aria-live': 'polite',
      'role': 'status',
    });
    this.wrapper.appendChild(this.status);
    visuallyHide(this.status);
  }

  addEventListeners() {
    document.addEventListener('click', this.handleClicks, false);
    document.addEventListener('keydown', this.handleKeydown, false);
    document.addEventListener('input', this.handleInput, false);
  }

  removeEventListeners() {
    document.removeEventListener('click', this.handleClicks, false);
    document.removeEventListener('keydown', this.handleKeydown, false);
    document.removeEventListener('input', this.handleInput, false);
  }

  handleClicks(e) {
    if (!e.target.closest('[data-butane-combobox]') && this.menuIsVisible) {
      this.hideMenu();
    }

    if (e.target.closest('[data-butane-combobox-input]') && this.config.showOnClick) {
      this.showMenu();
    }

    if (e.target.closest('[data-butane-combobox-option]')) {
      this.setSelectedOption(e.target);
      this.hideMenu();
      this.input.focus();
    }
  }

  handleInput() {
    if (this.menuIsVisible) {
      this.renderMenuItems();
    } else {
      this.showMenu();
    }
  }

  handleKeydown(e) {
    switch (e.code) {
      case 'Escape':
        this.onOptionEscape();
        break;
      case 'ArrowDown':
        this.onOptionArrowDown(e);
        break;
      case 'ArrowUp':
        this.onOptionArrowUp(e);
        break;
      case 'Space':
      case 'Enter':
        this.onOptionSelect(e);
        break;
      case 'Tab':
        this.onOptionTab();
        break;
      default:
    }
  }

  onOptionEscape() {
    if (this.menuIsVisible) {
      this.hideMenu();
      this.input.focus();
    }
  }

  onOptionArrowDown(e) {
    if (e.target.closest('[data-butane-combobox-input]')) {
      e.preventDefault();
      if (!this.menuIsVisible) this.showMenu();
      this.focusFirstOption();
    } else if (e.target.closest('[data-butane-combobox-option]')) {
      e.preventDefault();
      this.focusNextOption(e.target);
    }
  }

  onOptionArrowUp(e) {
    if (e.target.closest('[data-butane-combobox-option]') && this.menuIsVisible) {
      this.focusPreviousOption(e.target);
    }
  }

  onOptionSelect(e) {
    if (e.target.closest('[data-butane-combobox-option]') && this.menuIsVisible) {
      e.preventDefault();
      this.setSelectedOption(e.target);
      this.hideMenu();
      this.input.focus();
    }
  }

  onOptionTab() {
    if (this.menuIsVisible) {
      this.hideMenu();
    }
  }

  showMenu() {
    this.renderMenuItems();
    this.input.setAttribute('aria-expanded', 'true');
    this.list.removeAttribute('hidden');
    if (this.config.onShowMenu) this.config.onShowMenu();
  }

  hideMenu() {
    this.input.setAttribute('aria-expanded', 'false');
    this.list.setAttribute('hidden', 'true');
    if (this.config.onHideMenu) this.config.onHideMenu();
  }

  setSelectedOption(option) {
    Array.from(this.list.children).forEach(child =>
      child.setAttribute('aria-selected', child === option ? 'true' : 'false'),
    );
    this.input.value = option.innerText;
    this.select
      .querySelector(`[value="${option.getAttribute('data-butane-combobox-option-value')}"]`)
      .setAttribute('selected', 'true');
    if (this.config.onSelectedOption) this.config.onSelectedOption(option);
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

  updateStatusText() {
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
    }" role="option" data-butane-combobox-option-value="${option.value}">${option.label}</li>`;
  }

  renderMenuItems() {
    this.filteredOptions = this.defaultOptions;
    this.filteredOptions = matchSorter(this.defaultOptions, this.input.value, {
      keys: ['label'],
    });
    if (this.filteredOptions.length) {
      this.list.innerHTML = this.filteredOptions
        .map(option => this.optionTemplate(option))
        .join('');
    } else {
      this.list.innerHTML = this.noOptionsTemplate();
    }
    this.updateStatusText();
  }

  dispose() {
    this.removeEventListeners();
    this.wrapper.removeChild(this.input);
    this.wrapper.removeChild(this.list);
    this.wrapper.removeChild(this.status);
    this.container.removeChild(this.wrapper);
    this.select.removeAttribute('style');
    this.select.removeAttribute('aria-hidden');
    this.select.removeAttribute('tabindex');
    this.select.setAttribute('id', this.id);
  }
}

export default ButaneCombobox;
