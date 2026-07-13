var acc="000000000000000000a11001";
var n=db.Nodes.findOne({_id:ObjectId(acc)});
print("node name="+n.name+" type="+n.type+" level="+n.level);
function dump(label, arr){
  print("=== "+label+" ("+(arr?arr.length:0)+") ===");
  (arr||[]).forEach(function(s){
    print("  id="+(s.id||s._id)+" | name="+(s.name?(s.name.en||s.name):"?")+" | visibility="+s.visibility+" | status="+s.status);
  });
}
// try common field names
dump("applications", n.applications);
dump("Applications", n.Applications);
dump("commChannels", n.commChannels);
dump("communicationChannels", n.communicationChannels);
dump("CommChannels", n.CommChannels);
print("=== node top-level keys ===");
printjson(Object.keys(n));
