export const updateGistWithAchievement = async ({ title, source }) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const gistId = import.meta.env.VITE_GIST_ID;

  if (!token || !gistId) {
    console.error("Missing GITHUB_TOKEN or GIST_ID in environment variables.");
    return;
  }

  const getSydneyOffset = (date = new Date()) => {
    const year = date.getFullYear();
    const dstStart = new Date(Date.UTC(year, 9, 1)); // First Sunday in October
    while (dstStart.getUTCDay() !== 0) dstStart.setUTCDate(dstStart.getUTCDate() + 1);

    const dstEnd = new Date(Date.UTC(year, 3, 1)); // First Sunday in April
    while (dstEnd.getUTCDay() !== 0) dstEnd.setUTCDate(dstEnd.getUTCDate() + 1);

    return date >= dstStart || date < dstEnd ? 11 : 10; // AEDT if in DST, otherwise AEST
  };

  const getSydneyTime = () => {
    const now = new Date();
    const offset = getSydneyOffset(now);
    const local = new Date(now.getTime() + offset * 60 * 60 * 1000);
    return local.toISOString().replace("T", " ").split(".")[0] + ` (UTC+${offset})`;
  };

  const ip = await fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => data.ip)
    .catch(() => "unknown");

  const timestamp = getSydneyTime();
  const newLine = `${timestamp}: ${ip} achieved ${title} from ${source}!`;

  const gistRes = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const gistData = await gistRes.json();
  const currentContent = gistData.files["achievement.txt"]?.content || "";

  const updatedContent = currentContent + (currentContent.endsWith("\n") ? "" : "\n") + newLine + "\n";

  await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      files: {
        "achievement.txt": {
          content: updatedContent,
        },
      },
    }),
  });
};
