import {ValidationError} from "../models/validation-error";
import {Validator} from "../models/validator";

export class EmailValidator implements Validator {
     validate(value: string): ValidationError | null {
        if (this.isNotEmail(value)) {
            return {
                email: true
            }
        }
        return null;
    }

    private isNotEmail(value: string): boolean {
        const emailRule:RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !emailRule.test(String(value).toLowerCase());
    }
}
