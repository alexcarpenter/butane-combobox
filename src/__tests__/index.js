const ButaneCombobox = require('../..');
const {
  fireEvent,
  getByLabelText,
  getByRole,
} = require('@testing-library/dom');
require('@testing-library/jest-dom/extend-expect');

function getExampleDOM() {
  const combobox = document.createElement('div');
  combobox.classList.add('combobox');
  combobox.innerHTML = `
    <label for="combobox">Search</label>
    <select name="combobox" id="combobox">
      <option value="0">Red</option>
      <option value="1">Blue</option>
      <option value="2">Green</option>
      <option value="3">Purple</option>
      <option value="4">Gray</option>
    </select>
  `;
  return combobox;
}

test('renders list options on click', () => {
  const container = getExampleDOM();
  document.body.appendChild(container);
  new ButaneCombobox(container, {
    openOnFocus: true,
  });
  fireEvent.click(getByLabelText(document.body, 'Search'));
  expect(getByRole(document.body, 'listbox')).toBeVisible();
  expect(getByRole(document.body, 'listbox').children.length).toEqual(5);
});
