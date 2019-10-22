export function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

export function wrap(element, wrapper) {
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
}

export function visuallyHide(element) {
  const visuallyHidden = {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  };
  for (const key in visuallyHidden) {
    element.style[key] = visuallyHidden[key];
  }
  element.setAttribute('aria-hidden', 'true');
  element.setAttribute('tabindex', '-1');
}
