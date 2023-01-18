import { LightningElement } from 'lwc';

export default class FirstnameOnchange extends LightningElement {

firstname='';
lastname='';
isimHandler(event){
       this.firstname   =event.target.value;
}
lastname;
soyadHandler(event){
this.lastname=event.target.value;
}

get fullName(){
    return `${this.firstname} ${this.lastname}`;
}


}