const element = document.querySelector('.combobox');
new ButaneCombobox(element, {
  openOnFocus: true,
  onSelectedOption: option => console.log(option),
  onShowMenu: () => console.log('Menu shown'),
  onHideMenu: () => console.log('Menu hidden'),
});
