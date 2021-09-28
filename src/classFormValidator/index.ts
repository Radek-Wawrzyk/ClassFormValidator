import { emailRule } from './rules/email';
import { requiredRule } from './rules/required';
import { getRules, getName, getValue } from './helpers/';
import { Validator, Options } from './types/';

class FormValidator {
  public validator: Validator;
  public form: HTMLFormElement;
  public events: any;
  readonly options: Options = {
    disableSubmitButtonOnSave: true,
  }

  constructor(formNode: HTMLFormElement, options?: any|object) {
    this.options = options ? options : this.options;
    this.form = formNode;
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

  addEventListener(listenerName: string, callback:any): void {
    this.form.addEventListener(listenerName, callback);
  }

  dispatchEvent(eventName:string, value?:any): any {
    this.form.dispatchEvent(new CustomEvent(eventName, {
      detail: value,
    }));
  }

  setValidator(): void {
    const self = this;
    const fields: NodeList = this.validator.formNode.querySelectorAll('[data-validator-name]');

    fields.forEach((field: HTMLInputElement) => {
      const fieldName = getName(field);

      self.validator.controls[fieldName] = {
        validated: false,
        nodeElement: field,
        model: field.value,
        errors: [],
        rules: getRules(field),
      };
    });
  }

  validateOnCreated(): void {
    const self = this;
    
    for (const field in this.validator.controls) {
      this.validator.controls[field].nodeElement.addEventListener('input', () => {
        self.validateField(this.validator.controls[field].nodeElement);
      });
    }
  }

  validateOnSubmit(): void {
    const self = this;

    this.validator.formNode.addEventListener('submit', (event: Event) => {
      event.preventDefault();

      for (const field in this.validator.controls) {
        self.validateField(this.validator.controls[field].nodeElement, 'onSubmit');
      }

      this.dispatchEvent('onSubmit', this.getValidStatus());
    });
  }

  validateField(inputField: HTMLInputElement, typeEvent?: string): void {
    const rules = getRules(inputField)
    const self = this;

    rules.forEach((rule) => {
      self.interpreteRule(rule, inputField);
    });

    if (typeEvent !== 'onSubmit') {
      this.updateFieldModel(inputField);
    }
  }

  interpreteRule(rule:string, inputField: HTMLInputElement): void {
    const fieldValue: string|number = inputField.value;

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

  validateStatus(rule: string, field: HTMLInputElement, status: boolean, message: string|null): void {    
    if (status) {
      this.validator.controls[field.name] = {
        ...this.validator.controls[field.name],
        validated: status,
        errors: [],
      };
    } else {
      const duplicatedArray: string[] = [...this.validator.controls[field.name].errors, message];
      const errors: string[] = Array.from(new Set(duplicatedArray));

      this.validator.controls[field.name] = {
        ...this.validator.controls[field.name],
        validated: status,
        errors: errors,
      };

      this.dispatchEvent('onFieldError', {
        field: this.validator.controls[field.name],
        error: message,
      });
    }

    this.validator.isValid = this.getValidStatus();
    this.manageDOMElementClasses(status, message, field);
    // this.updateFieldModel(field);

    if (this.options.disableSubmitButtonOnSave) {
      this.handleSubmitButton();
    }
    
    console.log(this.validator);
  }

  manageDOMElementClasses(status: boolean, errorMessage: string, field: HTMLInputElement): void {
    const errorTextDOMElement:HTMLSpanElement = field.parentElement.querySelector('.validator-form-field__error-message');
    const classMethod = !status ? 'add' : 'remove';

    errorTextDOMElement.innerHTML = errorMessage;
    errorTextDOMElement.classList[classMethod]('validator-form-field__error-message--active');
    field.classList[classMethod]('validator-form-field__input--error');
  }

  getValidStatus(): boolean {
    let status: boolean = true;
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
    const submitButton: HTMLButtonElement|HTMLInputElement = this.validator.formNode.querySelector('[type="submit"]');
    const validStatus = this.getValidStatus();

    if (!validStatus) {
      submitButton.classList.add('validator-form__submit-button--disabled');
      submitButton.disabled = true;
    } else {
      submitButton.classList.remove('validator-form__submit-button--disabled');
      submitButton.disabled = false;
    }
  }

  updateFieldModel(field: HTMLInputElement): void {
    this.validator.controls[getName(field)].model = getValue(field);
    this.dispatchEvent('onModelChange', getValue(field));
  }
};

const formOne = new FormValidator(document.querySelector('#base'));

formOne.form.addEventListener('onModelChange', (event:CustomEvent) => {
  console.log(event.type, event.detail);
});

formOne.form.addEventListener('onSubmit', (event:CustomEvent) => {
  console.log(event.type, event.detail);
});

formOne.form.addEventListener('onFieldError', (event:CustomEvent) => {
  console.log(event.type, event.detail);
});