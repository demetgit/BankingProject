import { LightningElement, wire, api } from 'lwc';
import fetchCusTypeLocal from '@salesforce/apex/SelectSchemeController.fetchCusType';
import InterestSchemeFetch from '@salesforce/apex/SelectSchemeController.fetchInScheme';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import FdDetailLocal from '@salesforce/schema/FD_Details__c';
import depTypeLocal from '@salesforce/schema/FD_Details__c.Deposit_Type__c';
import payFreqLocal from '@salesforce/schema/FD_Details__c.Payout_Frequency__c';

export default class SelectScheme extends LightningElement {

    @api recordId
    customerOptions = []
    selectedCusType = ''
    depTypeOptions = []
    selectedDepType = ''
    payFreqData
    payFreqOptions = []
    selectedPayFreq = ''
    selectedMonth = ''
    selectedDay = ''
    FdAmount = 0
    listScheme= []

    // Customer Type Combobox
    @wire(fetchCusTypeLocal, {
        fdId: '$recordId'
    }) wiredData({ data, error }) {
        if (data) {
            let options = []
            options.push({ label: data.Customer_Type__c, value: data.Customer_Type__c })
            this.customerOptions = options
        } else if (error) {
            console.log('Customer Type bilgisi sorgulanirken hata alindi');
        }
    }

    cusTypeChange(event) {
        this.selectedCusType = event.detail.value
        console.log('SelectedCusType  = ' + this.selectedCusType);
    }

    // Deposit Type Combobox
    @wire(getObjectInfo, { objectApiName: FdDetailLocal })
    fdObjectInfo;

    @wire(getPicklistValues, { recordTypeId: '$fdObjectInfo.data.defaultRecordTypeId', fieldApiName: depTypeLocal })
    wiredDataDep({ data, error }) {
        if (data) {
            let options = []
            data.values.forEach(element => {
                options.push({ label: element.label, value: element.value })
            });
            
            this.depTypeOptions = options
        } else if (error) {
            console.log('Deposit Type bilgisi sorgulanirken hata alindi');
        }
    }

    depTypeChange(event) {
        this.selectedDepType = event.detail.value
        console.log('Selected Deptype : ' + this.selectedDepType);
        // Field Dependency
        let key = this.payFreqData.controllerValues[event.detail.value]
        this.payFreqOptions = this.payFreqData.values.filter(opt=>opt.validFor.includes(key))
        
    }

    // Payout Frequency
    @wire(getPicklistValues, { recordTypeId: '$fdObjectInfo.data.defaultRecordTypeId', fieldApiName: payFreqLocal })
    wiredDataPay({ data, error }) {
        if (data) {
            this.payFreqData = data
        }
        else if(error) {
            console.log('Payout Frequency bilgisi sorgulanirken hata alidi');
        }
    }
    
    payoutFreqChange(event) {
        this.selectedPayFreq = event.detail.value
    }
    
    // Tenor in Month
    get tenorMonthOptions() {
        let options = []
        for (var i = 0; i < 85; i++) {
           options.push({ label: i.toString() , value:i.toString() })
        }
        return options
    }

    tenorMonthChange(event) {
        this.selectedMonth = event.detail.value 
    }

    // Tenor in Day
    get tenorDayOptions() {
        let options = []
        for (var i = 0; i < 30; i++) {
           options.push({ label: i.toString() , value:i.toString() })
        }
        return options
    }

    tenorDayChange(event) {
        this.selectedDay = event.detail.value 
    }

    // FD Amount
    fdAmountChange(event) {
        this.FdAmount = event.detail.value
        console.log('FD Amount : ' + this.FdAmount);
    }

    // Fetch Scheme Button
    fetchSchemeClick(event) {
        let isValid = true
        let inputFields = this.template.querySelectorAll('.clsFrmFetchSchm');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity()
                isValid = false
            }
        })
        if (isValid) {
            // call Apex Method to Fetch Interest Scheme Data
            fetchInterestScheme ({
                fdId:this.recordId, 
                 cusType:this.selectedCusType, 
                  depType:this.selectedDepType, 
                  tnrMonth:this.selectedMonth,
                tnrDay:this.selectedDay, 
                 fdAmount:fdAmount
            }).then(result =>{

                var lstSchm=[]
                if(result){
                    for(var i=0; i<result.length; i++){
                            var tempObj={}
                            tempObj.label= result [i].Name
                            tempObj.label= result [i].id
                            tempObj.label= result [i].Interest_Rate__c
                            lstSchm.push(tempObj)
                    }
                }
                this.listScheme= lstSchm
            }).catch(error => {
                console.log('scheme datasi ceklrken hata olustu.hata mesaji:' + error.message)
            })

//bu bzm yaptgmz impretavively call apex, butona basnca calısır
        }

    }

}