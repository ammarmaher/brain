print("=== Contracts indexes ===");
printjson(db.Contracts.getIndexes());
print("=== count per accountId (top) ===");
printjson(db.Contracts.aggregate([{$group:{_id:"$accountId",n:{$sum:1}}},{$sort:{n:-1}}]).toArray());
print("=== contracts for a11001 now ===");
db.Contracts.find({accountId:"000000000000000000a11001"},{contractId:1,contractName:1,status:1,farabiReferenceId:1,startDate:1,endDate:1}).forEach(c=>printjson(c));
