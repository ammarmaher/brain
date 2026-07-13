var acc="000000000000000000a11001";
// Make the two contract-referenced services VISIBLE + InActive(1) so the FE rate matrix can price them.
var r1 = db.Nodes.updateOne({_id:ObjectId(acc)},
  {$set:{"applications.$[a].visibility":true, "applications.$[a].status":1}},
  {arrayFilters:[{"a.id":"695a304f901bb7d4a830d0dc"}]});   // Basic Send App
var r2 = db.Nodes.updateOne({_id:ObjectId(acc)},
  {$set:{"commChannels.$[c].visibility":true, "commChannels.$[c].status":1}},
  {arrayFilters:[{"c.id":"695a304f901bb7d4a830d0e2"}]});   // WhatsApp
print("apps update matched="+r1.matchedCount+" modified="+r1.modifiedCount);
print("chan update matched="+r2.matchedCount+" modified="+r2.modifiedCount);
print("=== a11001 services after fix (visible only) ===");
var n=db.Nodes.findOne({_id:ObjectId(acc)});
print("VISIBLE APPS:");
n.applications.filter(a=>a.visibility).forEach(a=>print("  "+a.id+" status="+a.status));
print("VISIBLE CHANNELS:");
n.commChannels.filter(c=>c.visibility).forEach(c=>print("  "+c.id+" status="+c.status));
print("d0dc visible="+n.applications.find(a=>a.id=="695a304f901bb7d4a830d0dc").visibility+" status="+n.applications.find(a=>a.id=="695a304f901bb7d4a830d0dc").status);
print("d0e2 visible="+n.commChannels.find(c=>c.id=="695a304f901bb7d4a830d0e2").visibility+" status="+n.commChannels.find(c=>c.id=="695a304f901bb7d4a830d0e2").status);
