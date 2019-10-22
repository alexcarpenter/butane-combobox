const ButaneCombobox = require('../..');
const {
  fireEvent,
  getByLabelText,
  getByRole,
} = require('@testing-library/dom');
require('@testing-library/jest-dom/extend-expect');

let testCombobox;

function setupExampleDOM() {
  const combobox = document.createElement('div');
  combobox.classList.add('combobox');
  combobox.innerHTML = `
    <label for="states">Search states</label>
    <select name="states" id="states">
      <option value="AL">Alabama</option>
      <option value="AK">Alaska</option>
      <option value="AZ">Arizona</option>
      <option value="AR">Arkansas</option>
      <option value="CA">California</option>
      <option value="CO">Colorado</option>
      <option value="CT">Connecticut</option>
      <option value="DE">Delaware</option>
      <option value="DC">District Of Columbia</option>
      <option value="FL">Florida</option>
      <option value="GA">Georgia</option>
      <option value="HI">Hawaii</option>
      <option value="ID">Idaho</option>
      <option value="IL">Illinois</option>
      <option value="IN">Indiana</option>
      <option value="IA">Iowa</option>
      <option value="KS">Kansas</option>
      <option value="KY">Kentucky</option>
      <option value="LA">Louisiana</option>
      <option value="ME">Maine</option>
      <option value="MD">Maryland</option>
      <option value="MA">Massachusetts</option>
      <option value="MI">Michigan</option>
      <option value="MN">Minnesota</option>
      <option value="MS">Mississippi</option>
      <option value="MO">Missouri</option>
      <option value="MT">Montana</option>
      <option value="NE">Nebraska</option>
      <option value="NV">Nevada</option>
      <option value="NH">New Hampshire</option>
      <option value="NJ">New Jersey</option>
      <option value="NM">New Mexico</option>
      <option value="NY">New York</option>
      <option value="NC">North Carolina</option>
      <option value="ND">North Dakota</option>
      <option value="OH">Ohio</option>
      <option value="OK">Oklahoma</option>
      <option value="OR">Oregon</option>
      <option value="PA">Pennsylvania</option>
      <option value="RI">Rhode Island</option>
      <option value="SC">South Carolina</option>
      <option value="SD">South Dakota</option>
      <option value="TN">Tennessee</option>
      <option value="TX">Texas</option>
      <option value="UT">Utah</option>
      <option value="VT">Vermont</option>
      <option value="VA">Virginia</option>
      <option value="WA">Washington</option>
      <option value="WV">West Virginia</option>
      <option value="WI">Wisconsin</option>
      <option value="WY">Wyoming</option>
    </select>
  `;
  document.body.appendChild(combobox);
  testCombobox = new ButaneCombobox(combobox, {
    openOnFocus: true,
  });
}

function disposeExampleDom() {
  testCombobox.dispose();
  document.body.innerHTML = '';
}

beforeEach(() => setupExampleDOM());
afterEach(() => disposeExampleDom());

test('renders list options on click', () => {
  fireEvent.click(getByLabelText(document.body, 'Search states'));
  expect(getByRole(document.body, 'listbox')).toBeVisible();
  expect(getByRole(document.body, 'listbox').children.length).toEqual(51);
});

test('filters options based on user input', () => {
  fireEvent.input(getByLabelText(document.body, 'Search states'), {
    target: { value: 'z' },
  });
  expect(getByRole(document.body, 'listbox').children.length).toEqual(1);
});
