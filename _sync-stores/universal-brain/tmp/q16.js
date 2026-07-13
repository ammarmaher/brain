var sysadmin="6a085915164fb80e0b9df8a3";
var ids=["CTR-6A3D028C","CTR-6A3D02D7","CTR-6A3D02D9"];
db.Contracts.updateMany({contractId:{$in:ids}},{$set:{createdBy:sysadmin,updatedBy:sysadmin}});
print("Re-stamped author on 3 contracts.\n");
db.Contracts.find({contractId:{$in:ids}}).sort({startDate:1}).forEach(function(c){
  var t=c.tariffPlan;
  print(c.contractId+"  "+c.contractName+"  | status="+c.status+" | committed="+c.committedValue.toString()
    +" | rates="+t.rates.length+" unitConv="+t.unitConversions.length+" quotas="+t.quotas.length+" overage="+t.overageRates.length
    +" | createdBy="+c.createdBy);
});
print("\n=== a11001 now prices these VISIBLE services ===");
var n=db.Nodes.findOne({_id:ObjectId("000000000000000000a11001")});
print("Basic Send App d0dc visible="+n.applications.find(a=>a._id=="695a304f901bb7d4a830d0dc").visibility);
print("WhatsApp      d0e2 visible="+n.commChannels.find(c=>c._id=="695a304f901bb7d4a830d0e2").visibility);
