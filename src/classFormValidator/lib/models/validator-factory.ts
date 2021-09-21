import {Rule} from "../types/rule";
import {Validator} from "./validator";

export interface ValidatorFactoryModel {
    getValidator(rule: Rule): Validator
}
