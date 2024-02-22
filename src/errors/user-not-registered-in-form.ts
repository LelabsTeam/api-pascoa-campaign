export class UserNotRegisteredInForm extends Error{
    constructor(){
        super();
        this.message = "user not registered in form"
    }
}