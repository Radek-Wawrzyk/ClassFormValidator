import { emailRule } from './rules/email';
import { requiredRule } from './rules/required';
import { getRules, getName } from './helpers/';
import { Validator, Options } from './types/';

class FormValidator {
  public validator: Validator;
  readonly options: Options = {
    disableSubmitButtonOnSave: true,
  }

  constructor(formNode: HTMLFormElement, options?:any|object) {
    this.options = options ? options : this.options;
    this.validator = {
      formNode: formNode,
      isValid: false,
      controls: {},
    };

    this.initialize();
  }

  initialize(): void {
    this.setValidator();
    this.validateOnCreated();
    this.validateOnSubmit();
  }

  setValidator(): void {
    const self = this;
    const fields:NodeList = this.validator.formNode.querySelectorAll('[data-validator-name]');

    fields.forEach((field:HTMLInputElement) => {
      const fieldName = getName(field);

      self.validator.controls[fieldName] = {
        validated: false,
        nodeElement: field,
        model: '',
        errors: [],
        rules: getRules(field),
      };
    });
  }

  validateOnCreated(): void {
    const self = this;
    const fields:NodeList = this.validator.formNode.querySelectorAll('[data-validator-name]');

    fields.forEach((field:HTMLInputElement) => {
      field.addEventListener('input', () => {
        self.validateField(field);
      });
    })
  }

  validateOnSubmit(): void {
    const self = this;

    this.validator.formNode.addEventListener('submit', (event: Event) => {
      event.preventDefault();

      for (const field in this.validator.controls) {
        const input:HTMLInputElement = this.validator.formNode.querySelector(`[data-validator-name=${field}]`);
        self.validateField(input);
      }
    });
  }

  validateField(inputField:HTMLInputElement): void {
    const rules = getRules(inputField)
    const self = this;

    rules.forEach((rule) => {
      self.interpreteRule(rule, inputField);
    });
  }

  interpreteRule(rule:string, inputField:HTMLInputElement): void {
    const fieldValue:string|number = inputField.value;

    switch (rule) {
      case 'required': {
        if (requiredRule(fieldValue)) {
          this.validateStatus(rule, inputField, false, `The ${inputField.name} field is required.`)
        } else {
          this.validateStatus(rule, inputField, true, null);
        }

        break;
      }
      case 'email': {
        if (!emailRule(fieldValue)) {
          this.validateStatus(rule, inputField, false, `The ${inputField.name} field is not email type.`)
        } else {
          this.validateStatus(rule, inputField, true, null);
        }

        break;
      }
      default: {
        if (requiredRule(fieldValue)) {
          this.validateStatus(rule, inputField, false, `The ${inputField.name} field is required.`)
        } else {
          this.validateStatus(rule, inputField, true, null);
        }
        
        break;
      }
    }
  }

  validateStatus(rule:string, field:HTMLInputElement, status:boolean, message: string|null): void {
    const errorTextDOMElement:HTMLSpanElement = field.parentElement.querySelector('.validator-form-field__error-message');
    
    if (status) {
      this.validator.controls[field.name] = {
        ...this.validator.controls[field.name],
        validated: status,
        errors: [],
      };

      errorTextDOMElement.classList.remove('validator-form-field__error-message--active');
      errorTextDOMElement.innerHTML = message;
      field.classList.remove('validator-form-field__input--error');
    } else {
      const duplicatedArray:string[] = [...this.validator.controls[field.name].errors, message];
      const errors:string[] = Array.from(new Set(duplicatedArray));

      this.validator.controls[field.name] = {
        ...this.validator.controls[field.name],
        validated: status,
        errors: errors,
      };

      errorTextDOMElement.classList.add('validator-form-field__error-message--active');
      errorTextDOMElement.innerHTML = this.validator.controls[field.name].errors[0];
      field.classList.add('validator-form-field__input--error');
    }

    this.validator.isValid = this.getValidStatus();
    
    if (this.options.disableSubmitButtonOnSave) {
      this.handleSubmitButton();
    }
    
    console.log(this.validator);
  }

  getValidStatus(): boolean {
    let status = true;
    const self = this;

    for (let field in this.validator.controls) {
      if (!self.validator.controls[field].validated) {
        status = false;
        break;
      }
    }

    return status;
  }

  handleSubmitButton(): void {
    const submitButton:HTMLButtonElement|HTMLInputElement = this.validator.formNode.querySelector('[type="submit"]');
    const validStatus = this.getValidStatus();

    if (!validStatus) {
      submitButton.classList.add('validator-form__submit-button--disabled');
      submitButton.disabled = true;
    } else {
      submitButton.classList.remove('validator-form__submit-button--disabled');
      submitButton.disabled = false;
    }
  }
};

const formOne = new FormValidator(document.querySelector('#base'));