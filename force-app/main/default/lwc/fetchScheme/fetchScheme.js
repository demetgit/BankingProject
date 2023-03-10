import { LightningElement, wire, api } from 'lwc';
import fetchCusTypeLocal from '@salesforce/apex/FdDetailsService.fetchCusType';
import fetchInterestScheme from '@salesforce/apex/FdDetailsService.fetchInterestScheme';
import updateFD from '@salesforce/apex/FdDetailsService.updateFD';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import FdDetailLocal from '@salesforce/schema/FD_Details__c';
import depTypeLocal from '@salesforce/schema/FD_Details__c.Deposit_Type__c';
import payFreqLocal from '@salesforce/schema/FD_Details__c.Payout_Frequency__c';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

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
    listScheme = []
    selectedIntRate
    selectedIntSchmId

    // Customer Type Combobox
    @wire(fetchCusTypeLocal, {
        fdId: '$recordId'
    }) wiredData({ data, error }) {
        if (data) {
            let options = []
            options.push({ label: data.Customer_Type__c, value: data.Customer_Type__c })
            this.customerOptions = options
        } else if (error) {
            console.log('Customer Type bilgisi sorgulanirken hata alndi');
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
            console.log('Payout Frequency bilgisi sorgulanrken hata alindi');
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
            fetchInterestScheme({
                fdId: this.recordId,
                cusType: this.selectedCusType,
                depType: this.selectedDepType,
                tnrMonth: this.selectedMonth,
                tnrDay: this.selectedDay,
                fdAmount: this.FdAmount
            }).then(result => {
                var lstSchm = []
                if (result) { 
                    for (var i = 0; i < result.length; i++){
                        var tempObj = {}
                        tempObj.label = result[i].Name
                        tempObj.value = result[i].Id
                        tempObj.interestRate = result[i].Interest_Rate__c
                        lstSchm.push(tempObj)
                    }
                }
                this.listScheme = lstSchm
            }).catch(error => {
                console.log('Interest Scheme sorgulanirken hata olu??tu: hata mesaji: ' + error.message)
            })
        }

    }

    schmChange(event) {
        var schemeRecId = event.detail.value
        for (var i = 0; i < this.listScheme.length; i++){
            if (schemeRecId == this.listScheme[i].value) {
                this.selectedIntRate = this.listScheme[i].interestRate
                this.selectedIntSchmId = schemeRecId
                console.log('Selected Int rate: ' + this.selectedIntRate)
            }
        }
    }

    saveClick() {
        // Validate inputs
        let isValid = true
        let inputFields = this.template.querySelectorAll('.clsFrmFetchSchm');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity()
                isValid = false
            }
        }) 

        inputFields = this.template.querySelectorAll('.classForSaveButton');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity()
                isValid = false
            }
        }) 

        if (isValid) {
            // imperatively call Apex Method to Fetch Interest Scheme Data
            console.log('fd Id= ' + this.recordId);
            updateFD({
                fdId: this.recordId,
                depType: this.selectedDepType,
                tnrMonth: this.selectedMonth,
                tnrDay: this.selectedDay,
                fdAmount: this.FdAmount,
                schmId: this.selectedIntSchmId, 
                intRate: this.selectedIntRate,
                payFreq: this.selectedPayFreq
            }).then(result => {
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Kaydetme i??lemi ba??arili',
                    variant: 'Success'
                });
                this.dispatchEvent(event);
    
            }).catch(error => {
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'Kaydetme i??lemi esnas??nda hata olu??tu: hata mesaji:' + JSON.stringify(error),
                    variant: 'Error'
                });
                this.dispatchEvent(event);
            })
        }
    }

}
