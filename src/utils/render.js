import DOMPurify from "dompurify/dist/purify.min.js";

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = DOMPurify.sanitize(template);

  return newElement.firstChild;
};

const renderElement = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN: container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND: container.append(component.getElement());
      break;
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export {RenderPosition, createElement, renderElement, remove, replace};
