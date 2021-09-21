import {ValidationError} from "./validation-error";

export interface Validator {
    validate(value: string): ValidationError | null
}
