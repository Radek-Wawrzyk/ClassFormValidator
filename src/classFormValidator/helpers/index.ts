function getRules(inputField: HTMLInputElement): string[] {
  const { validatorRules } = inputField.dataset;
  const rules: string[] = validatorRules.split(',');

  return rules;
};

function getName(inputField: HTMLInputElement): string {
  const { validatorName } = inputField.dataset;
  return validatorName;
};

function getValue(inputField: HTMLInputElement, type: string|null = 'input'): string {
  if (type === 'input') {
    return inputField.value;
  }
};

export {
  getRules,
  getName,
  getValue,
};