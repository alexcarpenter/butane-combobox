const form  = document.querySelector('form');
const message = form.querySelector('#toast-form-message');
const timeout = form.querySelector('#toast-form-timeout');
const type = form.querySelector('select');
const button = form.querySelector('button');

ButaneToasts.init();

form.addEventListener('submit', event => {
  event.preventDefault();
  ButaneToasts.add(message.value, timeout.value, type.value);
  form.reset();
}, false);
