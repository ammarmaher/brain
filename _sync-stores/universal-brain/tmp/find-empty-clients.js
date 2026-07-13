var d = db.getSiblingDB("FalconCommerceDB");
var agg = d.Nodes.aggregate([
  { $group: {
      _id: "$tenantId",
      total: { $sum: 1 },
      children: { $sum: { $cond: [ { $eq: ["$type", 2] }, 1, 0 ] } },
      rootName: { $max: { $cond: [ { $eq: ["$type", 1] }, "$name", "NO_ROOT" ] } }
  }},
  { $sort: { rootName: 1 } }
]).toArray();

var empty = agg.filter(function(t){ return t.children === 0; });
print("=== TOTAL TENANT-GROUPS IN Nodes: " + agg.length + " ===");
print("=== CLIENTS WITH NO SUB-NODES (root only): " + empty.length + " ===");
empty.forEach(function(t){
  print(t._id + "  |  name=" + t.rootName + "  |  totalNodes=" + t.total);
});

print("");
print("=== ALL TENANT GROUPS (name | tenantId | total | children) ===");
agg.forEach(function(t){
  print((t.children === 0 ? "[EMPTY] " : "        ") + t.rootName + "  |  " + t._id + "  |  total=" + t.total + "  |  children=" + t.children);
});
