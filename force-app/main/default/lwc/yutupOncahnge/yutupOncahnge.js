import { LightningElement,track } from 'lwc';

export default class YutupOncahnge extends LightningElement {

   @track message='this message';  //lightning içindeki mesajı almas ıcın track
    
    messageHandler(event){
        this.message='this message is:' +  event.target.value;
    }
}