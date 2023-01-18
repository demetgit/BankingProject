trigger FixedDepositTrigger on FD_Details__c (before insert, before update,after insert,after update) {

    if (Trigger.isBefore && Trigger.isInsert){
        FixedDepositTriggerHandler.populateRelOfficer(Trigger.new);
    }

    if (Trigger.isAfter && Trigger.isInsert){
        FixedDepositTriggerHandler.shareWithRelOfficerAfterInsert(Trigger.new);
    }
    if(Trigger.isAfter && Trigger.isUpdate){
        FixedDepositTriggerHandler.shareWithRelOfficerAfterUpdate (Trigger.new,Trigger.OldMap);
    }
}