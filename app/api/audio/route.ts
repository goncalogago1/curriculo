import OpenAI from "openai";
import { NextResponse } from "next/server";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const tmpPath = `/tmp/${file.name}`;
  fs.writeFileSync(tmpPath, buffer);

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(tmpPath),
    model: "gpt-4o-mini-transcribe",
  });

  return NextResponse.json({ text: transcription.text });
}
