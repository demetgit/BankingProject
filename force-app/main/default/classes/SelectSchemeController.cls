@AuraEnabled (Cacheable=true)
public static List<Interest_Scheme__c> fetchInterestScheme (String fdId, String cusType, String depType, Integer tnrMonth, Integer tnrDay, Integer fdAmount){
    
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