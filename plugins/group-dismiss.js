const config = require("../config");
const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a member",
    category: "group",
    filename: __filename,
  },
  async (conn, mek, m, { from, quoted, args, reply, isGroup, isBotAdmins }) => {
    try {
      if (!isGroup) return reply("_This command is for groups_");
      if (!isBotAdmins) return reply("_I'm not admin_");
      if (!args[0] && !quoted) return reply("_Mention user to demote_");

      let jid = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");
            
      await conn.groupParticipantsUpdate(from, [jid], "demote");
      return reply(`@${jid.split("@")[0]} demoted from admin`, { mentions: [jid] });
    } catch (e) {
      console.log(e);
      m.reply(`${e}`);
    }
  }
);


