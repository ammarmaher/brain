print("=== Contracts for Test Tenant 001 (a11001) ===");
db.Contracts.find({accountId:"000000000000000000a11001"})
  .sort({createdAt:1})
  .forEach(c=>printjson({
    contractId:c.contractId,
    name:c.contractName,
    farabiRef:c.farabiReferenceId,
    status:c.status,
    currency:c.currency,
    committedValue:c.committedValue.toString(),
    start:c.startLocalDateTime, end:c.endLocalDateTime,
    rateCount:(c.tariffPlan&&c.tariffPlan.rates?c.tariffPlan.rates.length:0),
    createdBy:c.createdBy
  }));
print("=== createdBy decode check: sysadmin Mongo _id = 6a085915164fb80e0b9df8a3 ===");
