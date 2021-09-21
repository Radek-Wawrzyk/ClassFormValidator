import {Rule} from "../types/rule";
import {Validator} from "./validator";

export interface ValidatorFactoryModel {
    getFactory(rule: Rule): Validator
}
