import {Rule} from "../types/rule";
import {EmailValidator} from "../validators/email-validator";
import {Validator} from "../models/validator";
import {RequiredValidator} from "../validators/required-validator";
import {ValidatorFactoryModel} from "../models/validator-factory";

export class ValidatorFactory implements ValidatorFactoryModel {
   getFactory(rule: Rule): Validator {
        switch (rule) {
            case Rule.email:
                return new EmailValidator();
            case Rule.required:
                return new RequiredValidator();
            default:
                return null;
        }
    }
}
