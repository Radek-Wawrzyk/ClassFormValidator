import {ValidationError} from "./validation-error";

export interface Form {
    controls: {
        [key: string]: {
            valid: boolean;
            errors: ValidationError;
            value: unknown;
        }
    };
    valid: boolean;
    errors: ValidationError;
}
