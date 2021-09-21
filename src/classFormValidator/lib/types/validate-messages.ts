import {Rule} from "./rule";

type ValidateMessages = {
    [key in Rule]: string;
}

export const validateMessages: ValidateMessages = {
    [Rule.email]: 'not email type.',
    [Rule.required]: 'required.'
}

export function getValidateMessage(fieldName: string, fieldType: Rule) {
    return `The ${fieldName} field is ${validateMessages[fieldType]}`
}
