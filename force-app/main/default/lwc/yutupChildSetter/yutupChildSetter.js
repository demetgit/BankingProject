import { api, LightningElement } from 'lwc';

export default class YutupChildSetter extends LightningElement {


      myTitle;
@api //dısaridan veri alnca api eklenr
get title(){
    return this.myTitle  //get ile title alyrm,yeni degere estliyoru,asagidaki set ile yeni deger ataycm
}

set title(value){
    this.myTitle = value.toUpperCase();
    this.setAttribute('title', this.myTitle);
}

}