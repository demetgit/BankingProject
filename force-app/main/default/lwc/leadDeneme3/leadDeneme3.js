import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LEAD_OBJECT from '@salesforce/schema/Lead';

export default class LeadForm extends LightningElement {
    @track lead = {};
    @track isLoading = false;

    handleChange(event) {
        this.lead[event.target.name] = event.target.value;
    }

    handleSave() {
        this.isLoading = true;
        const fields = {};
        fields.FirstName = this.lead.firstName;
        fields.LastName = this.lead.lastName;
        fields.Company = this.lead.company;
        fields.Email = this.lead.email;
        fields.Phone = this.lead.phone;

        const recordInput = { apiName: LEAD_OBJECT.objectApiName, fields };

        createRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Lead created',
                        variant: 'success',
                    }),
                );
                this.lead = {};
                this.isLoading = false;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating lead',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                this.isLoading = false;
            });
    }
}
