import { LightningElement } from 'lwc';

export default class YutupRenderDom extends LightningElement {

// status=true; 1.ornek ici


display=true;
firstName;
lastName;
phone;

firstNameHandler(event){
this.firstName=event.target.value;
}

lastNameHandler(event){
    this.lastName=event.target.value;
    }
    phoneHandler(event){
        this.phone=event.target.value;
        }

showButtonHandler(){
    this.display=false;
}
}