const { RTMClient } = require("@slack/rtm-api");
const wol = require("wakeonlan");
const sqlite3 = require("sqlite3").verbose();
let db = require("./db")(sqlite3);

const token = process.env.SLACK_BOT_TOKEN;
const channels = process.env.CHANNEL_IDS.split(",") || [];

const rtm = new RTMClient(token);

rtm.on("message", async (event) => {
  if (channels.indexOf(event.channel) > -1) {
    await db.run(
      "INSERT INTO activity(channel,message_recieved) values(?,?)",
      event.channel,
      event.ts
    );
    const count = await db.query(
      "SELECT COUNT(*) FROM activity WHERE channel = '?'",
      event.channel
    );
    if (count > 5) {
      wol(process.env.WOL_DESTINATION).then(() => {
        console.log("wol sent!");
      });
      await db.run("DELETE FROM activity WHERE channel ='?'", event.channel);
    }
    db.close();
  }
});

(async () => {
  const { self, team } = await rtm.start();
})();
