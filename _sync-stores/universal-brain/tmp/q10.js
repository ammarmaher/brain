print("=== Contracts with NON-EMPTY quotas / overage / unitConversions ===");
var found = db.Contracts.find({$or:[
  {"tariffPlan.quotas.0":{$exists:true}},
  {"tariffPlan.overageRates.0":{$exists:true}},
  {"tariffPlan.unitConversions.0":{$exists:true}}
]}).limit(3).toArray();
print("count="+found.length);
found.forEach(c=>printjson({contractId:c.contractId, quotas:c.tariffPlan.quotas, overage:c.tariffPlan.overageRates, uc:c.tariffPlan.unitConversions}));
print("=== distinct rate priorities / units / destinations seen across all contracts ===");
printjson({
  priorities: db.Contracts.distinct("tariffPlan.rates.priority"),
  units: db.Contracts.distinct("tariffPlan.rates.unit"),
  destinations: db.Contracts.distinct("tariffPlan.rates.destination")
});
