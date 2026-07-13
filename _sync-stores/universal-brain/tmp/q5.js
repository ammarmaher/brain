print("=== collections ==="); db.getCollectionNames().forEach(c=>print(' - '+c));
print("=== Users count ==="); print(db.Users.countDocuments({}));
print("=== Falcon-type / admin users (sample) ===");
db.Users.find({},{username:1,Username:1,userType:1,UserType:1,email:1,Email:1,status:1,Status:1,firstName:1,lastName:1}).limit(30).forEach(u=>printjson(u));
