var sysadmin = "6a085915164fb80e0b9df8a3"; // sysadmin Falcon user _id == token user-id metadata
var ids = ["CTR-6A3D028C","CTR-6A3D02D7","CTR-6A3D02D9"];
print("=== Stamping createdBy=sysadmin on the 3 new contracts ===");
ids.forEach(function(cid){
  // set createdBy always; set updatedBy=sysadmin only if it is currently null (do not clobber lifecycle-worker)
  var doc = db.Contracts.findOne({contractId:cid},{updatedBy:1});
  var set = { createdBy: sysadmin };
  if (doc && (doc.updatedBy === null || doc.updatedBy === undefined)) { set.updatedBy = sysadmin; }
  var r = db.Contracts.updateOne({contractId:cid}, {$set:set});
  print(cid + " -> matched=" + r.matchedCount + " modified=" + r.modifiedCount + " (updatedBy set=" + (set.updatedBy?("yes"):"kept") + ")");
});
print("=== Verify ===");
db.Contracts.find({contractId:{$in:ids}},{contractId:1,contractName:1,status:1,createdBy:1,updatedBy:1}).forEach(c=>printjson(c));
