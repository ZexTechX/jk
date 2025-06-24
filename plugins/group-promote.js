const { cmd } = require('../command');
const { getGroupAdmins } = require('../lib/functions');

// PROMOTE COMMAND
cmd({
    pattern: "promote",
    react: "🥏",
    alias: ["addadmin", "p"],
    desc: "To add a participant as an admin",
    category: "group",
    use: '.promote',
    filename: __filename
},
async(conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, participants, reply }) => {
    if (!isGroup) return reply("❌ This command only works in group chats.");
    if (!isAdmins) return reply("❌ You must be a group admin to use this.");
    if (!isBotAdmins) return reply("❌ I need admin rights to do that.");

    const botOwner = (conn.user.id || "").split(":")[0] + "@s.whatsapp.net";

    let users = mek.mentionedJid ? mek.mentionedJid[0] : mek.msg?.contextInfo?.participant;
    if (!users) return reply("❌ Couldn't find any user to promote.");
    if (users === botOwner) return reply("⚠️ Cannot promote the bot owner!");

    const groupAdmins = await getGroupAdmins(participants);
    if (groupAdmins.includes(users)) return reply("ℹ️ This user is already an admin.");

    await conn.groupParticipantsUpdate(from, [users], "promote");
    await conn.sendMessage(from, { text: `✅ User promoted as an admin.` }, { quoted: mek });
});

