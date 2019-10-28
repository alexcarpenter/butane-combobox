---
layout: layout.njk
---

## Install

```bash
$ npm install butane-combobox --save
```

## Usage

```html
<div class="combobox">
  <label for="combobox">Search</label>
  <select name="combobox" id="combobox">
    <option value="0">Red</option>
    <option value="1">Blue</option>
    <option value="2">Green</option>
    <option value="3">Purple</option>
  </select>
</div>
```

```js
import ButaneCombobox from 'butane-combobox';
const element = document.querySelector('.combobox');
new ButaneCombobox(element);
```

## Options

### showOnClick

When the input is clicked, show options list immediately.

```js
new ButaneCombobox(element, {
  showOnClick: true,
});
```

### onSelectedOption

Returns the selected option.

```js
new ButaneCombobox(element, {
  onSelectOption: option => console.log(option),
});
```

### onShowMenu

Callback for when the menu is shown.

```js
new ButaneCombobox(element, {
  onShowMenu: () => console.log('Menu shown'),
});
```

### onHideMenu

Callback for when the menu is hidden.

```js
new ButaneCombobox(element, {
  onHideMenu: () => console.log('Menu hidden'),
});
```
