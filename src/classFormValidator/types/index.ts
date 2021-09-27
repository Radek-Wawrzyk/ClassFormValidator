interface Validator {
  formNode: HTMLFormElement,
  controls: {
    [key: string]: Control,
  },
  isValid: boolean,
};

interface Control {
  validated: boolean,
  nodeElement: HTMLInputElement,
  model: string,
  errors: string[],
  rules: string[],
}

interface Options {
  disableSubmitButtonOnSave: boolean,
};

export {
  Validator,
  Options,
  Control,
};