import fs from 'fs';
import uniqid from 'uniqid';
import { GPTScript, RunEventType } from "@gptscript-ai/gptscript";
import { NextResponse } from 'next/server';

const g = new GPTScript();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const dir = uniqid();
  const path = `./public/stories/${dir}`;
  fs.mkdirSync(path, { recursive: true });

  const opts = {
    input: `--url ${url} --dir ${path}`,
    disableCache: true,
  };

  try {
    const run = await g.run('./story.gpt', opts);
    run.on(RunEventType.Event, (ev) => {
      if (ev.type === RunEventType.CallFinish && ev.output) {
        console.log(ev.output);
      }
    });

    const result = await run.text();
    return NextResponse.json({ dir }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
