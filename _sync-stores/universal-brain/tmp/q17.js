var acc="000000000000000000a11001";
var keepApp = ["695a304f901bb7d4a830d0dc"];                 // Basic Send App
var keepChan= ["695a304f901bb7d4a830d0e2",                   // WhatsApp
               "695a304f901bb7d4a830d0e3",                   // AI
               "695a304f901bb7d4a830d0de"];                  // Voice

// APPLICATIONS: only Basic Send App visible
db.Nodes.updateOne({_id:ObjectId(acc)},{$set:{"applications.$[a].visibility":false}},{arrayFilters:[{"a._id":{$nin:keepApp}}]});
db.Nodes.updateOne({_id:ObjectId(acc)},{$set:{"applications.$[a].visibility":true}},{arrayFilters:[{"a._id":{$in:keepApp}}]});
// COMM CHANNELS: only WhatsApp, AI, Voice visible
db.Nodes.updateOne({_id:ObjectId(acc)},{$set:{"commChannels.$[c].visibility":false}},{arrayFilters:[{"c._id":{$nin:keepChan}}]});
db.Nodes.updateOne({_id:ObjectId(acc)},{$set:{"commChannels.$[c].visibility":true}},{arrayFilters:[{"c._id":{$in:keepChan}}]});

var names = {
 "695a304f901bb7d4a830d0dc":"Basic Send App","695a304f901bb7d4a830d0dd":"Survey Pro","695a304f901bb7d4a830d0e1":"Campaign Engine",
 "695a304f901bb7d4a830d100":"Workflow Builder","695a304f901bb7d4a830d101":"Analytics Suite","695a304f901bb7d4a830d102":"Form Builder",
 "695a304f901bb7d4a830d103":"Reporting Hub","695a304f901bb7d4a830d104":"AI Assistant",
 "695a304f901bb7d4a830d0e2":"WhatsApp","695a304f901bb7d4a830d0de":"Voice","695a304f901bb7d4a830d0e3":"AI",
 "695a304f901bb7d4a830d110":"SMS","695a304f901bb7d4a830d111":"Email Relay","695a304f901bb7d4a830d112":"Push Notifications",
 "695a304f901bb7d4a830d113":"RCS Messaging","695a304f901bb7d4a830d114":"Telegram Bot"};
var n=db.Nodes.findOne({_id:ObjectId(acc)});
print("=== VISIBLE APPLICATIONS ==="); n.applications.filter(a=>a.visibility).forEach(a=>print("  "+(names[a._id]||a._id)));
print("=== VISIBLE COMM CHANNELS ==="); n.commChannels.filter(c=>c.visibility).forEach(c=>print("  "+(names[c._id]||c._id)));
print("=== HIDDEN now ===");
print("  apps: "+n.applications.filter(a=>!a.visibility).map(a=>names[a._id]||a._id).join(", "));
print("  chans: "+n.commChannels.filter(c=>!c.visibility).map(c=>names[c._id]||c._id).join(", "));
