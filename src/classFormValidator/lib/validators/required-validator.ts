import {ValidationError} from "../models/validation-error";
import {Validator} from "../models/validator";

export class RequiredValidator implements Validator {
    validate(value: string): ValidationError | null {
        if (this.isEmpty(value)) {
            return {
                required: true
            }
        }
        return null;
    }

    private isEmpty(value: string): boolean {
        return value.trim().length === 0;
    }
}