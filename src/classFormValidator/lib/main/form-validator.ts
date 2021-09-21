import {Form} from "../models/form";
import {Rule} from "../types/rule";
import {ValidationError} from "../models/validation-error";
import {ValidatorFactory} from "../factories/validator-factory";
import {ErrorClassName} from "../types/error-class-name";
import {getValidateMessage} from "../types/validate-messages";

export class FormValidator {
    public form: Form = {
        valid: false,
        errors: {},
        controls: {}
    };

    constructor(readonly formElement: HTMLFormElement,
                readonly fields: string[]) {
        this.initialize(fields);
    }

    private initialize(fields: string[]) {
        this.validateOnCreated();
        this.setFormDataObject(fields);
        this.validateOnSubmit();
    }

    private setFormDataObject(fields: string[]): void {
        const self = this;

        fields.forEach((field) => {
            const input: HTMLInputElement = document.querySelector(`#${field}`);
            self.form.controls[field] = {
                value: input.value,
                valid: false,
                errors: {}
            }
        });
    }

    private validateOnCreated(): void {
        const self = this;

        this.fields.forEach((field: string) => {
            const input: HTMLInputElement = document.querySelector(`#${field}`);

            input.addEventListener('input', () => {
                self.validateField(input);
            });
        })
    }

    private validateOnSubmit(): void {
        const self = this;

        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();

            self.fields.forEach((field) => {
                const input: HTMLInputElement = document.querySelector(`#${field}`);
                self.validateField(input);
            });
        });
    }

    private validateField(inputField: HTMLInputElement): void {
        const {validatorRules} = inputField.dataset;
        const rules: Rule[] = validatorRules.split(',') as Rule[];
        const self = this;
        let validateErrors: ValidationError = {};

        rules.forEach((rule) => {
            const validateError = self.interpretRule(rule, inputField);
            validateErrors = {
                ...validateErrors,
                ...validateError
            }
        });

        this.validateStatus(inputField, validateErrors);
    }

    private interpretRule(rule: Rule, inputField: HTMLInputElement): ValidationError | null {
        const validator = new ValidatorFactory().getFactory(rule);
        return validator.validate(inputField.value);
    }

    private validateStatus(field: HTMLInputElement, validateErrors: ValidationError): void {
        const errorTextDOMElement = field.parentElement.querySelector('.validator-form-field__error-message');
        if (Object.keys(validateErrors).length === 0) {
            this.manageDomElementsClasses(field);
        } else {
            if (validateErrors.required) {
                errorTextDOMElement.innerHTML = getValidateMessage(field.name, Rule.required);
            } else {
                const rule = Object.keys(validateErrors)[0] as Rule;
                errorTextDOMElement.innerHTML = getValidateMessage(field.name, rule);
            }
            this.manageDomElementsClasses(field, validateErrors);
        }

        this.form.valid = this.isValid();
    }

    private isValid(): boolean {
        let status = true;

        for (let field in this.form.controls) {
            if (!this.form.controls[field].valid) {
                status = false;
                break;
            }
        }
        return status;
    }

    private manageDomElementsClasses(field: HTMLInputElement, validateErrors?: ValidationError) {
        const errorTextDOMElement = field.parentElement.querySelector('.validator-form-field__error-message');
        if (!validateErrors) {
            errorTextDOMElement.classList.remove(ErrorClassName.errorText);
            errorTextDOMElement.innerHTML = null;
            field.classList.remove(ErrorClassName.formField);
            this.form.controls[field.name].valid = true;
            this.form.controls[field.name].errors = {};
        } else {
            errorTextDOMElement.classList.add(ErrorClassName.errorText);
            field.classList.add(ErrorClassName.formField);
            this.form.controls[field.name].valid = false;
            this.form.controls[field.name].errors = validateErrors;
        }
    }
}
