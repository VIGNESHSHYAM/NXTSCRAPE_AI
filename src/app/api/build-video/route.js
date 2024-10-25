import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegPath);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json('Error: missing ID');
    }

    const dir = `./public/stories/${id}`;
    if (!fs.existsSync(`${dir}/1.png`)) {
      fs.renameSync(`${dir}/b-roll-1.png`, `${dir}/1.png`);
      fs.renameSync(`${dir}/b-roll-2.png`, `${dir}/2.png`);
      fs.renameSync(`${dir}/b-roll-3.png`, `${dir}/3.png`);
      fs.renameSync(`${dir}/voiceover-1.mp3`, `${dir}/1.mp3`);
      fs.renameSync(`${dir}/voiceover-2.mp3`, `${dir}/2.mp3`);
      fs.renameSync(`${dir}/voiceover-3.mp3`, `${dir}/3.mp3`);
      fs.renameSync(`${dir}/voiceover-1.txt`, `${dir}/transcription-1.json`);
      fs.renameSync(`${dir}/voiceover-2.txt`, `${dir}/transcription-2.json`);
      fs.renameSync(`${dir}/voiceover-3.txt`, `${dir}/transcription-3.json`);
    }

    const images = ['1.png', '2.png', '3.png'];
    const audio = ['1.mp3', '2.mp3', '3.mp3'];
    const transcriptions = [
      'transcription-1.json',
      'transcription-2.json',
      'transcription-3.json',
    ];

    for (let i = 0; i < images.length; i++) {
      const inputImage = path.join(dir, images[i]);
      const inputAudio = path.join(dir, audio[i]);
      const inputTranscription = path.join(dir, transcriptions[i]);
      const outputVideo = path.join(dir, `output_${i}.mp4`);

      const transcription = JSON.parse(fs.readFileSync(inputTranscription, 'utf8'));
      const words = transcription.words;
      const duration = parseFloat(transcription.duration).toFixed(2);

      let drawtextFilter = '';
      words.forEach((wordInfo) => {
        const word = wordInfo.word.replace(/'/g, "\\'").replace(/"/g, '\\"');
        const start = parseFloat(wordInfo.start).toFixed(2);
        const end = parseFloat(wordInfo.end).toFixed(2);
        drawtextFilter += `drawtext=text='${word}':fontcolor=white:fontsize=96:borderw=4:bordercolor=black:x=(w-text_w)/2:y=(h*3/4)-text_h:enable='between(t\\,${start}\\,${end})',`;
      });
      drawtextFilter = drawtextFilter.slice(0, -1);

      console.log(`Processing: ${inputImage} and ${inputAudio}`);

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(inputImage)
          .loop(duration)
          .input(inputAudio)
          .audioCodec('copy')
          .videoFilter(drawtextFilter)
          .outputOptions('-t', duration)
          .on('error', (e) => {
            console.error(e);
            reject(e);
          })
          .on('end', resolve)
          .save(outputVideo);
      });

      console.log(`${outputVideo} is complete`);
    }

    console.log('Merging videos');
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(dir, 'output_0.mp4'))
        .input(path.join(dir, 'output_1.mp4'))
        .input(path.join(dir, 'output_2.mp4'))
        .on('end', resolve)
        .on('error', reject)
        .mergeToFile(path.join(dir, 'final.mp4'));
    });

    return res.status(200).json(`${id}/final.mp4`);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
