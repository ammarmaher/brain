var sysadmin="6a085915164fb80e0b9df8a3";
var ids=["CTR-6A3D028C","CTR-6A3D02D7","CTR-6A3D02D9"];
db.Contracts.updateMany({contractId:{$in:ids}}, {$set:{createdBy:sysadmin, updatedBy:sysadmin}});
print("Re-stamped createdBy/updatedBy=sysadmin on "+ids.length+" contracts.\n");
db.Contracts.find({contractId:{$in:ids}}).sort({startDate:1}).forEach(function(c){
  print("==================================================");
  print(c.contractId+"  |  "+c.contractName+"  |  status="+c.status+"  |  currency="+c.currency+"  |  committed="+c.committedValue.toString());
  print("  window: "+c.startLocalDateTime+"  ->  "+c.endLocalDateTime+"  ("+c.businessTimeZone+")   farabiRef="+c.farabiReferenceId);
  print("  createdBy="+c.createdBy+"  updatedBy="+c.updatedBy);
  print("  RATES ("+c.tariffPlan.rates.length+"):");
  c.tariffPlan.rates.forEach(r=>print("    - "+r.applicationName.en+" x "+r.channelName.en+" | "+r.priority+" | "+r.destination+" | "+r.unit+" @ "+r.ratePerUnit.toString()));
  print("  UNIT CONVERSIONS ("+c.tariffPlan.unitConversions.length+"):");
  c.tariffPlan.unitConversions.forEach(u=>print("    - "+u.code+" ("+u.name+") "+u.priceUnit+" -> "+u.ratingUnit+" @ "+u.priceValue.toString()));
  print("  QUOTAS ("+c.tariffPlan.quotas.length+"):");
  c.tariffPlan.quotas.forEach(q=>print("    - "+q.quotaCode+" | "+q.channelName.en+" | "+q.quotaCategory+"/"+q.quotaType+" | amount="+q.includedAmount.toString()+" units="+q.includedUnits.toString()+" "+q.unit+" | scope="+q.scope+" sub="+q.subService));
  print("  OVERAGE RATES ("+c.tariffPlan.overageRates.length+"):");
  c.tariffPlan.overageRates.forEach(o=>print("    - "+o.subService+" | "+o.channelName.en+" | "+o.unit+" @ "+o.unitPrice.toString()+" | "+o.billingCycle));
});
