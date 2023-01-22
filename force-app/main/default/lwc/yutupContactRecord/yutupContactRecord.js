import { LightningElement } from 'lwc';

export default class YutupContactRecord extends LightningElement {

    
    successMessage;

    successHandler(event){
        this.successMessage= 'a new contact created:' + event.detail.id;
    }




}