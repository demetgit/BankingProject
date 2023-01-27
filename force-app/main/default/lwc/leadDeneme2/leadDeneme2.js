import { LightningElement } from 'lwc';

export default class leadDeneme2 extends LightningElement {

    
    successMessage;

    successHandler(event){
        this.successMessage= 'a new lead created:' + event.detail.id;
    }




}