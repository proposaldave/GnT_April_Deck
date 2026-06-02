import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "assets", "generated", "silliness-signal");
const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
const fallbackModel = process.env.OPENAI_IMAGE_FALLBACK_MODEL || "gpt-image-1";
const size = process.env.OPENAI_IMAGE_SIZE || "2048x1152";
const quality = process.env.OPENAI_IMAGE_QUALITY || "high";

const files = {
  A: "candidate-a.png",
  B: "candidate-b.png",
  C: "candidate-c.png",
};

const basePrompt = `Create a single 16:9 premium editorial illustration for an investor pitch deck about pickleball as a social signal engine.

Scene: a warm, modern indoor pickleball club with one main court and a visible social lounge edge. The image is one coherent cinematic moment, not a collage, but it contains multiple readable micro-scenes across the court.

Core idea: pickleball looks ridiculous, and that is why it works. The silliness lowers status. When status drops, human behavior becomes visible.

Show five silly-but-human moments in the same scene:
1. A yellow perforated plastic pickleball bouncing or rolling in a toy-like, almost absurd way.
2. Two adult players laughing together over a confusing score moment, friendly and disarmed, not competitive or angry.
3. Two players near the kitchen line softly dinking from very close range, intensely focused on a tiny gentle shot that looks funny because adults are taking it seriously.
4. A lucky net-cord ball dribbling over while one player gives an exaggerated apology and the others laugh.
5. A player with an awkward, weird-looking technique somehow making a good shot, with others reacting warmly.
6. In the background or lounge edge, players rotate partners, paddle tap, welcome a new person, and gesture like they want to play again.

Make the human signal visible: subtle glowing threads, dots, and arcs in a refined GnR palette - coral red, soft blue, warm gold, small pink accents - gently connect people across these moments. The signal should feel like an Invitation Graph emerging naturally from play: who welcomes, who waits, who laughs, who adapts, who gets invited back. It should be magical but restrained, woven into court lines, body language, paddle taps, and laughter. Not a sci-fi dashboard.

Mood: status guard down, friendly absurdity, adults reconnecting through play, community forming in real time.

Composition: leave clean negative space on the left third or lower-left for a large deck headline overlay. Put the richest visual storytelling on the center and right. Use depth, warm light, and premium pitch-deck polish.

Style: cinematic semi-realistic painterly illustration, high-end editorial, warm indoor lighting, subtle watercolor texture, refined but alive. Diverse adults, mixed ages from 30s to 70s, multi-ethnic, natural bodies, real pickleball paddles, believable indoor court.

Avoid: readable text, labels, score numbers, UI overlays, screenshot controls, logos, watermarks, fake brand marks, warped hands, fused paddles, extra fingers, grotesque faces, generic stock-photo look, childish cartoon style, overdone neon cyberpunk HUD, cluttered collage, sterile diagram.`;

const variations = [
  {
    key: "A",
    name: "Social Diorama",
    camera: "Wide-angle court-level view. Main court and lounge both visible. Strong left negative space. Best default candidate.",
  },
  {
    key: "B",
    name: "Court as Social Map",
    camera: "Slightly elevated angle looking down at the court, but still warm and human. Signal threads follow court lines. Avoid sterile top-down diagram.",
  },
  {
    key: "C",
    name: "Hero Moment",
    camera: "One strong foreground silly moment - net-cord apology or awkward dink - with other social rituals visible in background. More emotional, less explanatory.",
  },
];

function usageBlock() {
  return [
    "COMMANDS:",
    "Generate or regenerate images:",
    "  $env:OPENAI_API_KEY='<your key>'; node scripts/generate-silliness-signal-image.mjs",
    "Choose a different final candidate after generation:",
    "  node scripts/generate-silliness-signal-image.mjs --final=B --skip-generate",
    "Run the deck:",
    "  python -m http.server 4173",
    "Preview the active slide:",
    "  http://localhost:4173/GnR_deck.html",
    "  then navigate to slide 21, or run caseyGo(21) in the browser console",
    "Preview candidates:",
    "  assets/generated/silliness-signal/contact-sheet.html",
    "FILES:",
    "  GnR_deck.html",
    "  scripts/generate-silliness-signal-image.mjs",
    "  assets/generated/silliness-signal/candidate-a.png",
    "  assets/generated/silliness-signal/candidate-b.png",
    "  assets/generated/silliness-signal/candidate-c.png",
    "  assets/generated/silliness-signal/final.png",
    "  assets/generated/silliness-signal/contact-sheet.html",
  ].join("\n");
}

function requestedFinal() {
  const arg = process.argv.find((item) => item.startsWith("--final="));
  return (arg ? arg.split("=")[1] : "A").trim().toUpperCase();
}

async function writeContactSheet(finalKey = "A") {
  const cards = variations.map(({ key, name, camera }) => {
    const filename = files[key];
    const selected = key === finalKey ? " selected" : "";
    return `<article class="card${selected}">
      <img src="${filename}" alt="Candidate ${key} - ${name}">
      <div class="meta">
        <strong>Candidate ${key} - ${name}</strong>
        <span>${camera}</span>
      </div>
    </article>`;
  }).join("\n");

  await writeFile(path.join(outDir, "contact-sheet.html"), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Silliness Signal Candidates</title>
  <style>
    body { margin:0; background:#fbf7ef; color:#1a1612; font-family:Manrope, Arial, sans-serif; }
    main { max-width:1440px; margin:0 auto; padding:32px; }
    h1 { margin:0 0 8px; font-family:Georgia, serif; font-size:42px; line-height:1; letter-spacing:0; }
    p { margin:0 0 24px; max-width:820px; color:rgba(26,22,18,.72); font-size:16px; line-height:1.45; }
    .grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:18px; }
    .card { background:white; border:1px solid rgba(184,149,74,.35); box-shadow:0 18px 48px rgba(26,22,18,.08); }
    .card.selected { outline:4px solid #c8462c; }
    img { display:block; width:100%; aspect-ratio:16/9; object-fit:cover; }
    .meta { padding:14px 16px 16px; display:grid; gap:6px; }
    strong { font-size:13px; letter-spacing:.12em; text-transform:uppercase; color:#c8462c; }
    span { font-size:13px; line-height:1.4; color:rgba(26,22,18,.72); }
  </style>
</head>
<body>
  <main>
    <h1>Silliness Signal Candidates</h1>
    <p>Candidate ${finalKey} is wired into the deck as final.png. Run the generator again with OPENAI_API_KEY set to replace these seed assets with fresh image-model candidates.</p>
    <section class="grid">${cards}</section>
  </main>
</body>
</html>
`);
}

async function decodeImagePayload(payload, targetPath) {
  const item = payload.data?.[0];
  if (!item) throw new Error("Image API returned no data.");

  if (item.b64_json) {
    await writeFile(targetPath, Buffer.from(item.b64_json, "base64"));
    return;
  }

  if (item.url) {
    const response = await fetch(item.url);
    if (!response.ok) throw new Error(`Failed to download image URL: ${response.status}`);
    await writeFile(targetPath, Buffer.from(await response.arrayBuffer()));
    return;
  }

  throw new Error("Image API returned neither b64_json nor url.");
}

async function generateImage(prompt, targetPath, activeModel) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: activeModel,
      prompt,
      size,
      quality,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error?.message || JSON.stringify(payload);
    throw new Error(`${response.status} ${message}`);
  }

  await decodeImagePayload(payload, targetPath);
}

async function generateAll() {
  for (const variation of variations) {
    const prompt = `${basePrompt}\n\nCamera/composition variation: ${variation.camera}`;
    const targetPath = path.join(outDir, files[variation.key]);
    try {
      console.log(`Generating Candidate ${variation.key} with ${model}...`);
      await generateImage(prompt, targetPath, model);
    } catch (error) {
      if (model !== fallbackModel && /model|not found|does not exist|unsupported/i.test(error.message)) {
        console.log(`Falling back to ${fallbackModel} for Candidate ${variation.key}...`);
        await generateImage(prompt, targetPath, fallbackModel);
      } else {
        throw error;
      }
    }
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const finalKey = requestedFinal();
  if (!files[finalKey]) throw new Error(`Unknown final candidate "${finalKey}". Use A, B, or C.`);

  const skipGenerate = process.argv.includes("--skip-generate");
  if (!process.env.OPENAI_API_KEY && !skipGenerate) {
    await writeContactSheet(finalKey);
    console.log("OPENAI_API_KEY is missing. Existing seed images were preserved; no new API images were generated.");
    console.log(usageBlock());
    process.exitCode = 1;
    return;
  }

  if (!skipGenerate) await generateAll();

  const finalSource = path.join(outDir, files[finalKey]);
  await readFile(finalSource);
  await copyFile(finalSource, path.join(outDir, "final.png"));
  await writeContactSheet(finalKey);
  console.log(`Candidate ${finalKey} is wired into the deck as assets/generated/silliness-signal/final.png.`);
  console.log(usageBlock());
}

main().catch((error) => {
  console.error(error.message);
  console.log(usageBlock());
  process.exitCode = 1;
});
