import {FormValidator} from "./lib/main/form-validator";

const formOne = new FormValidator(document.querySelector('#base'), ['name', 'lastname', 'email']);
