import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

export default class ContactForm extends LightningElement {
    @track contact = {};
    @track isLoading = false;

    handleChange(event) {
        this.contact[event.target.name] = event.target.value;
    }

    handleSave() {
        this.isLoading = true;
        const fields = {};
        fields.FirstName = this.contact.firstName;
        fields.LastName = this.contact.lastName;
        fields.Email = this.contact.email;
        fields.Phone = this.contact.phone;
        fields.AccountId = this.contact.accountId;

        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields };

        createRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact created',
                        variant: 'success',
                    }),
                );
                this.contact = {};
                this.isLoading = false;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating contact',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                this.isLoading = false;
            });
    }
}
