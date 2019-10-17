(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ButaneToasts = factory());
}(this, function () { 'use strict';

  const ButaneToasts = (() => {
    let config;
    let container;

    const createContainer = () => {
      container = document.createElement('div');
      container.className = `${config.prefix}-toast-container ${config.prefix}-toast-container--${config.position}`;
      container.dataset.testid = 'butane-toast-container';
      document.body.appendChild(container);
    };

    const createToast = (message, timeout, type) => {
      const _toast = document.createElement('div');
      const _message = document.createElement('div');
      const _button = document.createElement('button');

      _toast.dataset.testid = 'butane-toast';
      _toast.className = `${config.prefix}-toast`;
      if (type) {
        _toast.classList.add(`${config.prefix}-toast--${type}`);
      }
      _message.className = `${config.prefix}-toast__message`;
      _button.className = `${config.prefix}-toast__dismiss`;

      if (typeof message === 'string') {
        _message.textContent = message;
      } else {
        _message.appendChild(message);
      }
      _button.textContent = 'Dismiss';

      _toast.appendChild(_message);
      _toast.appendChild(_button);

      container.appendChild(_toast);

      if (timeout) autoDismiss(_toast, timeout);
    };

    const add = (message, timeout, type) => createToast(message, timeout, type);

    const remove = async toast => {
      toast.classList.add(`${config.prefix}-toast--exit`);
      await new Promise(resolve => {
        const animationName = window.getComputedStyle(toast).animationName;
        const eventName = whichAnimationEvent(toast);
        if (animationName !== 'none') {
          toast.addEventListener(eventName, () => resolve());
        } else {
          resolve();
        }
      });
      toast.parentNode.removeChild(toast);
    };

    const autoDismiss = (toast, timeout) => {
      setTimeout(() => {
        remove(toast);
      }, timeout);
    };

    const dismiss = event => {
      if (!event.target.closest(`.${config.prefix}-toast__dismiss`)) return;
      remove(event.target.parentNode);
    };

    const init = options => {
      config = {
        ...{
          prefix: 'butane',
          position: 'bottom-right',
        },
        ...options,
      };
      createContainer();
      document.addEventListener('click', dismiss, false);
    };

    const dispose = () => {
      container.remove();
      document.removeEventListener('click', dismiss, false);
    };

    const whichAnimationEvent = element => {
      const animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'Animationend',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (const key of Object.keys(animations)) {
        if (element.style[key] !== undefined) {
          return animations[key];
        }
      }
      return;
    };

    return { init, add, dispose };
  })();

  return ButaneToasts;

}));
