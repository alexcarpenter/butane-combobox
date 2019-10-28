const element = document.querySelector('.combobox');
new ButaneCombobox(element, {
  onSelectedOption: option => console.log(option),
  onShowMenu: () => console.log('Menu shown'),
  onHideMenu: () => console.log('Menu hidden'),
});
