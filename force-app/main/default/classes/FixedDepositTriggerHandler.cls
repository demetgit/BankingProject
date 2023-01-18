public with sharing class FixedDepositTriggerHandler {

    public static void populateRelOfficer (List<FD_Details__c> fdList){
        Set<String> branchNames = new Set<String>();

        // Branch-Relationship Officer objectinden sorgulanacak Branch lar collection haline getirilir.
        for (FD_Details__c fd:fdList){
            if(String.isNotBlank (fd.Branch__c)){
                branchNames.add(fd.Branch__c);
            }
        }

        // İlgili branchlarda görevli Relationship Officer bilgileri sorgu ile çekilir
        List<Branch_Relationship_Officer__c> broList = [SELECT Id, Branch_Name__c, Relationship_Officer__c
                                                        FROM Branch_Relationship_Officer__c
                                                        WHERE Branch_Name__c IN :branchNames];
        
        // Branch-RO eşleştirmesini Map formatına çevirelim. Bu sayede Map'in kullanışlı metotlarını kullanabiliriz. Örn: get ()
        Map<String, String> branchRelMap = new Map<String, String>();
        for(Branch_Relationship_Officer__c bro:broList){
            branchRelMap.put(bro.Branch_Name__c, bro.Relationship_Officer__c);
        }

        // FD Details objectindeki Relationship Officer fieldine, Master Objectten çekilen Relationship Officer bilgisini atayalım
        for (FD_Details__c fd:fdList){
            if(String.isNotBlank (fd.Branch__c)){
                fd.Relationship_Officer__c = branchRelMap.get(fd.Branch__c);
                
            }
        }
    }
    public static void shareWithRelOfficerAfterInsert(List<FD_Details__c> fdList){
        List<FD_Details__Share> fdShare = new List<FD_Details__Share>();
        // Yeni oluşturulan record'lar için teker teker share kaydı oluşturulur ve shareObj listesine eklenir
        for(FD_Details__c fd : fdList){
            if(String.isNotBlank(fd.Relationship_Officer__c) ){
                FD_Details__Share fds = new FD_Details__Share();
                fds.ParentId = fd.Id;
                fds.UserOrGroupId = fd.Relationship_Officer__c;
                fds.AccessLevel = 'Read';
                fds.RowCause = 'Manual';
                fdShare.add(fds);    
            }
        }
        // Döngü bittikten sonra share objecti insert edilir
        Database.insert(fdShare,false);
        
    }

    public static void shareWithRelOfficerAfterUpdate(List<FD_Details__c> fdList, Map<Id,FD_Details__c> fdOldMap){
//yeni RSOffcer a yetki verilir


        List<FD_Details__Share> fdShare = new List<FD_Details__Share>();
        // Yeni oluşturulan record'lar için teker teker share kaydı oluşturulur ve shareObj listesine eklenir
        for(FD_Details__c fd : fdList){
            if(String.isNotBlank(fd.Relationship_Officer__c) && 
            fd.OwnerId != fd.Relationship_Officer__c &&
            fdOldMap.get(fd.Id).Relationship_Officer__c != fd.Relationship_Officer__c){
            
                 fdShare.add(createShareIns(fd.Id,fd.Relationship_Officer__c));
            }

            if(String.isNotBlank(fd.Sales_Representative__c) && 
            fd.OwnerId != fd.Sales_Representative__c &&
            fdOldMap.get(fd.Id).Sales_Representative__c != fd.Relationship_Officer__c){
            
                 fdShare.add(createShareIns(fd.Id,fd.Sales_Representative__c));
            }
//eski RsOffcer yetkisi kaldrlır

if(fd.Relationship_Officer__c != fdOldMap.get(fd.Id).Relationship_Officer__c){


List<FD_Details__Share> fdsOld= [SELECT Id,Rowcause,ParentId,UserOrGroupId
                                    FROM FD_Details__Share 
                                    WHERE UserOrGroupId=: fdOldMap.get(fd.Id).
                                    Relationship_Officer__c
                                    AND ParentId=:fd.Id
                                    AND RowCause='Manual'];
            if(!fdsOld.isEmpty()){ // eger yukardaki liste doluysa silsin
                    Database.delete(fdsOld,false);
            }
        }
//yeni sales representetive yetkisi verilir
            if(String.isNotBlank(fd.Sales_Representative__c) && 
            fd.OwnerId != fd.Sales_Representative__c &&
            fdOldMap.get(fd.Id).Sales_Representative__c != fd.Sales_Representative__c){
            
                 fdShare.add(createShareIns(fd.Id,fd.Sales_Representative__c));
            }
//eski sales representetve  kaldrlır
if(fd.Sales_Representative__c != fdOldMap.get(fd.Id).Sales_Representative__c){



List<FD_Details__Share> fdsSROld= [SELECT Id,Rowcause,ParentId,UserOrGroupId
                                    FROM FD_Details__Share 
                                    WHERE UserOrGroupId=: fdOldMap.get(fd.Id).
                                    Sales_Representative__c
                                    AND ParentId=:fd.Id
                                    AND RowCause='Manual'];
            if(!fdsSROld.isEmpty()){ // eger yukardaki liste doluysa silsin
                    Database.delete(fdsSROld,false);
            }


        }

        }
        // Döngü bittikten sonra share objecti insert edilir
        Database.insert(fdShare,false);
        


    }
    private static FD_Details__Share createShareIns(String recId,String UserOrGroupId){
        FD_Details__Share fds = new FD_Details__Share();
        fds.ParentId = recId;
        fds.UserOrGroupId = UserOrGroupId;
        fds.AccessLevel = 'Read';
        fds.RowCause = 'Manual';
        return fds;
    }
}