import { LightningElement } from 'lwc';

export default class FirstnameOnchange extends LightningElement {

firstname;

isimHandler(event){
       this.firstname   =event.target.value;
}


}