import { LightningElement } from 'lwc';

export default class YutupFullname extends LightningElement {

firstname;
lastname;
title;
nameHandler(event){
       const field= event.target.name;

       if(field=== 'firstname'){
                this.firstname=event.target.value;
       }else if(field==='lastname'){
                this.lastname=event.target.value;
       

}else if(field==='title'){
    this.title=event.target.value;
}
}
}
