// Find tenants / nodes referencing "001" or "Test Tenant" by lowercase 'name'
print("=== Tenants (name,_id) ===");
db.Tenants.find({},{name:1,Name:1}).limit(40).forEach(t=>printjson(t));
print("=== Nodes name~001 ===");
db.Nodes.find({name:/001/i},{name:1,type:1,level:1,tenantId:1,parentId:1}).limit(20).forEach(n=>printjson(n));
print("=== Nodes name~test tenant ===");
db.Nodes.find({name:/test/i},{name:1,type:1,level:1,tenantId:1}).limit(20).forEach(n=>printjson(n));
print("=== distinct type ===");
printjson(db.Nodes.distinct("type"));
