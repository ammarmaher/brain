var c = db.getSiblingDB("FalconCommerceDB");
var tenantIds = c.Tenants.find({}, {_id:1}).toArray().map(function(t){ return String(t._id); });
var nodeTenantIds = c.Nodes.distinct("tenantId").map(String);
var nodeSet = {}; nodeTenantIds.forEach(function(x){ nodeSet[x]=true; });

print("Tenants count = " + tenantIds.length);
print("distinct Node.tenantId count = " + nodeTenantIds.length);

var noNodeAtAll = tenantIds.filter(function(id){ return !nodeSet[id]; });
print("");
print("=== TENANTS WITH ZERO NODE DOCUMENTS (no root even): " + noNodeAtAll.length + " ===");
noNodeAtAll.forEach(function(id){
  var t = c.Tenants.findOne({_id: id}) || c.Tenants.findOne({_id: ObjectId(id)});
  print("   " + id + "  |  name=" + (t ? (t.name||t.Name||JSON.stringify(Object.keys(t))) : "?"));
});

// also: node tenantIds that have no matching Tenant doc (orphans)
var tenantSet = {}; tenantIds.forEach(function(x){ tenantSet[x]=true; });
var orphanNodes = nodeTenantIds.filter(function(id){ return !tenantSet[id]; });
print("");
print("=== Node.tenantId with NO matching Tenant doc: " + orphanNodes.length + " ===");
orphanNodes.forEach(function(id){ print("   " + id); });
