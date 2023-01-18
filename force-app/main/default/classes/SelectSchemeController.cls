public without sharing class SelectSchemeController{

        @AuraEnabled (Cacheable=true)
        public static fetchCusType(String fdId){
        FD_Details__c fdRec = [SELECT Id,Name,Customer_Type__c 
                                                FROM FD_Details__c
                                                WHERE Id=:fdId];

                    return fdRec;
        }




public static List<Interest_Scheme__c> fetchInScheme (String fdId, String cusType, String depType, Integer tnrMonth, Integer tnrDay, Integer fdAmount){
    
    List<Interest_Scheme__c> listInt = [SELECT Id, Name, Interest_Rate__c 
                                        FROM Interest_Scheme__c
                                        WHERE Customer_Type__c = :cusType
                                            AND Deposit_Type__c = :depType
                                            AND Tenor_From_Months__c <= :tnrMonth 
                                            AND Tenor_To_Months__c >= :tnrMonth
                                            AND Tenor_From_Days__c <= :tnrDay 
                                            AND Tenor_To_Days__c >= :tnrDay
                                            AND From_Amount__c <= :fdAmount
                                            AND To_Amount__c >= :fdAmount
                                            AND Active__c = true];
    
    
    return listInt;
}
}