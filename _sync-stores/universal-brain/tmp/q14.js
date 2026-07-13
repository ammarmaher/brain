var acc="000000000000000000a11001";
var n=db.Nodes.findOne({_id:ObjectId(acc)});
print("=== raw applications[0] ==="); printjson(n.applications[0]);
print("=== raw commChannels[0] ==="); printjson(n.commChannels[0]);
print("=== app _id types ===");
n.applications.forEach(a=>print("  _id="+a._id+"  type="+(a._id instanceof ObjectId ? "ObjectId":typeof a._id)+"  visibility="+a.visibility));
