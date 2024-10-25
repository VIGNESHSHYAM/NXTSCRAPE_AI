import fs from 'fs';

export default function handler(req, res) {
  const stories = fs
    .readdirSync('./public/stories')
    .filter((dir) => {
      return dir.match(/^[a-z0-9]{6,}$/) && fs.existsSync(`./public/stories/${dir}/final.mp4`);
    });

  res.status(200).json(stories);
}
