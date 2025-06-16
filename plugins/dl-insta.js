const axios = require("axios");
const { cmd } = require('../command');

cmd({
  pattern: "igdl",
  alias: ["instagram", "insta", "ig", "igvideo"],
  react: '📶',
  desc: "Download videos from Instagram (Alternative API)",
  category: "download",
  use: ".igdl2 <Instagram URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('Please provide a valid Instagram URL. Example: `.igdl2 https://instagram.com/...`');
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://bk9.fun/download/instagram?url=${encodeURIComponent(igUrl)}`;
    const response = await axios.get(apiUrl);

    if (!response.data?.status || !response.data?.BK9?.[0]?.url) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply('❌ Unable to fetch the video. Try .igdl2 for primary download.');
    }

    const videoUrl = response.data.BK9[0].url;
    await conn.sendMessage(from, { react: { text: '📥', key: m.key } });

    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply('❌ Failed to download the video. Please try again later.');
    }

    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: `📥 *Instagram Downloader*\n\n` +
        `📏 *Quality*: HD\n\n` +
        `> © Powered by JawadTechXD 🔪`,
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading video:', error);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply('❌ API 2 failed. Try .igdl for primary download.');
  }
});

cmd({
  pattern: "ig2",
  alias: ["insta2"],
  desc: "Download Instagram videos/reels",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram URL\nExample: .ig https://www.instagram.com/reel/...");
    }

    // Show processing indicator
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    // API endpoint
    const apiUrl = `https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(q)}`;
    
    // Fetch data from API
    const { data } = await axios.get(apiUrl);

    // Validate response
    if (!data?.success || data?.status !== 200 || !data?.downloadUrl) {
      return reply("⚠️ Failed to fetch media. Please check the link or try again later.");
    }

    // Determine media type
    const isVideo = data.type === "mp4";
    const mediaType = isVideo ? "video" : "image";

    // Send the media
    await conn.sendMessage(
      from,
      {
        [mediaType]: { url: data.downloadUrl },
        mimetype: isVideo ? "video/mp4" : "image/jpeg",
        caption: `> *Powerd By JawadTechX ♥️*`
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("Instagram Download Error:", error);
    reply(`❌ Error: ${error.message || "Failed to download media"}`);
  }
});
