var c = db.getSiblingDB("FalconCommerceDB");
var id = db.getSiblingDB("FalconIdentityDb");

// recompute empty tenants (children == 0)
var agg = c.Nodes.aggregate([
  { $group: { _id: "$tenantId",
      children: { $sum: { $cond: [ { $eq: ["$type", 2] }, 1, 0 ] } },
      rootName: { $max: { $cond: [ { $eq: ["$type", 1] }, "$name", null ] } } } },
  { $match: { children: 0 } }
]).toArray();

var roleMap = {1:"falcon-admin",2:"falcon-user",3:"reseller?",4:"acc-owner",5:"acc-admin",6:"user"};
var statusMap = {1:"Inactive/Pending",2:"Active",3:"Disabled",4:"Locked"};

agg.sort(function(a,b){ return (a.rootName||"").localeCompare(b.rootName||""); });

agg.forEach(function(t){
  var users = id.Users.find({ $or:[{tenantId:t._id},{path:t._id},{nodeId:t._id}] },
      {username:1, email:1, role:1, userType:1, status:1, identityUserId:1, isDeleted:1}).toArray();
  print("############################################################");
  print("CLIENT: " + (t.rootName||"<no-root-name>") + "   tenantId=" + t._id + "   users=" + users.length);
  users.forEach(function(u){
    print("   - " + u.username
      + "  | role=" + (roleMap[u.role]||u.role)
      + "  | status=" + (statusMap[u.status]||u.status)
      + "  | deleted=" + (u.isDeleted===true)
      + "  | zuid=" + u.identityUserId
      + "  | email=" + (u.email||""));
  });
});
