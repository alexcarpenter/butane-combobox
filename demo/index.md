---
layout: layout.njk
---

## Install

```bash
$ npm install butane-combobox
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
const element = document.querySelector('.combobox');
new ButaneCombobox(element);
```

## API

### openOnFocus

```js
new ButaneCombobox(element, {
  openOnFocus: true,
});
```

### onSelectedOption

```js
new ButaneCombobox(element, {
  onSelectOption: option => console.log(option),
});
```

### onShowMenu

```js
new ButaneCombobox(element, {
  onShowMenu: () => console.log('Menu shown'),
});
```

### onHideMenu

```js
new ButaneCombobox(element, {
  onHideMenu: () => console.log('Menu hidden'),
});
```
