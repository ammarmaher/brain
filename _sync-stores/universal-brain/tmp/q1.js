print("=== Tenants matching 001 ===");
db.Tenants.find({Name:/001/i}).forEach(t=>printjson({_id:t._id, Name:t.Name}));
print("=== Nodes En matching Test Tenant 001 ===");
db.Nodes.find({"Name.En":/Tenant 001/i},{Name:1,NodeType:1,TenantId:1,ParentId:1}).limit(20).forEach(n=>printjson(n));
print("=== Distinct NodeType values present ===");
printjson(db.Nodes.distinct("NodeType"));
