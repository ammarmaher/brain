print("=== createdBy presence across ALL contracts ===");
printjson(db.Contracts.aggregate([
  {$group:{_id:{cb:{$ifNull:["$createdBy","<null>"]}}, n:{$sum:1}}},
  {$sort:{n:-1}}
]).toArray());
print("=== sample existing BMW contract createdBy/updatedBy ===");
db.Contracts.find({accountId:"6a0aeb8abe28a563d80b472e"},{contractId:1,createdBy:1,updatedBy:1}).limit(8).forEach(c=>printjson(c));
