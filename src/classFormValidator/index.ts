import { emailRule } from './rules/email';
import { requiredRule } from './rules/required';

class FormValidator {
  readonly form: HTMLElement;
  readonly fields: string[];
  public errors: object;
  public validator: any;

  constructor(form: HTMLElement, fields: string[]) {
    this.form = form;
    this.fields = fields;
    this.validator = {};
    this.initialize(fields);
  }

  initialize(fields:string[]) {
    this.validateOnCreated();
    this.validateOnSubmit();
    this.setFormDataObject(fields);
  }

  setFormDataObject(fields:string[]):void {
    const self = this;

    fields.forEach((field) => {
      self.validator[field] = {
        validated: true,
        errors: [],
      };
    });
  }

  validateOnCreated():void {
    const self = this;

    this.fields.forEach((field:string) => {
      const input:HTMLInputElement = document.querySelector(`#${field}`);
    
      input.addEventListener('input', () => {
        self.validateField(input);
      });
    })
  }

  validateOnSubmit():void {
    const self = this;

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();

      self.fields.forEach((field) => {
        const input:HTMLInputElement = document.querySelector(`#${field}`);
        self.validateField(input);
      });

      console.log(self.isValid());
    });

    
  }

  validateField(inputField:HTMLInputElement):void {
    const { validatorRules } = inputField.dataset;
    const rules:string[] = validatorRules.split(',');
    const self = this;

    rules.forEach((rule) => {
      self.interpreteRule(rule, inputField);
    });
  }

  interpreteRule(rule:string, inputField:HTMLInputElement):void {
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

  validateStatus(rule:string, field:HTMLInputElement, status:boolean, message: string|null):void {
    const errorTextDOMElement = field.parentElement.querySelector('.validator-form-field__error-message');
    if (status) {
      errorTextDOMElement.classList.remove('validator-form-field__error-message--active');
      errorTextDOMElement.innerHTML = message;
      field.classList.remove('validator-form-field__input--error');

      this.validator[field.name] = {
        validated: status,
        errors: [],
      };

    } else {
      errorTextDOMElement.classList.add('validator-form-field__error-message--active');
      errorTextDOMElement.innerHTML = message;
      field.classList.add('validator-form-field__input--error');

      const duplicatedArray:string[] = [...this.validator[field.name].errors, message];
      const errors:string[] = Array.from(new Set(duplicatedArray));

      this.validator[field.name] = {
        validated: status,
        errors: errors,
      };
    }
  }
  isValid():boolean {
    let status = true;
    const self = this;

    for (let field in this.validator) {
      if (!self.validator[field].validated) {
        status = false;
        break;
      }
    }

    return status;
  }
};

const formOne = new FormValidator(document.querySelector('#base'), ['name', 'lastname', 'email']);