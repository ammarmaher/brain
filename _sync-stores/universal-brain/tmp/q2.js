print("=== Nodes count ==="); print(db.Nodes.countDocuments({}));
print("=== One Node sample ==="); printjson(db.Nodes.findOne({}));
print("=== Tenants count ==="); print(db.Tenants.countDocuments({}));
print("=== One Tenant sample ==="); printjson(db.Tenants.findOne({}));
print("=== Settingss count ==="); print(db.Settingss.countDocuments({}));
print("=== One Settings sample ==="); printjson(db.Settingss.findOne({}));
