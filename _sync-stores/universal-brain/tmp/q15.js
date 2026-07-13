var acc="000000000000000000a11001";
var r1 = db.Nodes.updateOne({_id:ObjectId(acc)},
  {$set:{"applications.$[a].visibility":true, "applications.$[a].status":1}},
  {arrayFilters:[{"a._id":"695a304f901bb7d4a830d0dc"}]});   // Basic Send App
var r2 = db.Nodes.updateOne({_id:ObjectId(acc)},
  {$set:{"commChannels.$[c].visibility":true, "commChannels.$[c].status":1}},
  {arrayFilters:[{"c._id":"695a304f901bb7d4a830d0e2"}]});   // WhatsApp
print("apps  matched="+r1.matchedCount+" modified="+r1.modifiedCount);
print("chan  matched="+r2.matchedCount+" modified="+r2.modifiedCount);
var n=db.Nodes.findOne({_id:ObjectId(acc)});
var app=n.applications.find(a=>a._id=="695a304f901bb7d4a830d0dc");
var ch=n.commChannels.find(c=>c._id=="695a304f901bb7d4a830d0e2");
print("Basic Send App (d0dc): visibility="+app.visibility+" status="+app.status);
print("WhatsApp (d0e2):       visibility="+ch.visibility+" status="+ch.status);
print("visible apps count="+n.applications.filter(a=>a.visibility).length+"  visible channels count="+n.commChannels.filter(c=>c.visibility).length);
