/**
 * merge-animations.js
 * ───────────────────────────────────────────────────────────────────────────
 * Merges Mixamo FBX animation clips into the avatar GLB so all per-scene
 * animations (sitting, typing, pointing, presenting, waving) are available.
 *
 * HOW TO USE:
 * 1. Go to https://www.mixamo.com  (free Adobe account)
 * 2. Upload the Soldier model or use the built-in character
 * 3. Download each animation listed below as:
 *      Format: FBX Binary (.fbx)
 *      Skin:   Without Skin   ← animation only, smaller file
 *      FPS:    30
 * 4. Put each FBX file in ./assets/animations/  (create this folder)
 * 5. Convert each FBX → GLB  (use https://products.aspose.app/3d/conversion/fbx-to-glb
 *    or "npm i -g @fbs2gltf/cli" if available)
 * 6. Run:  node merge-animations.js
 *
 * After running, the script outputs assets/avatar.glb with all clips baked in.
 * The SCENE_CONFIG in main.js will then use the new animation names automatically.
 * ───────────────────────────────────────────────────────────────────────────
 */

// ── REQUIRED ANIMATIONS (Mixamo search terms) ────────────────────────────
// Scene 0 Hero:       "Breathing Idle"     → save as: idle.glb
// Scene 1 Education:  "Sitting Idle"       → save as: seated-idle.glb
// Scene 2 Coding:     "Typing"             → save as: typing.glb
// Scene 3 Finance:    "Pointing Forward"   → save as: pointing.glb
// Scene 4 Marketing:  "Presenting Speech"  → save as: presenting.glb
// Scene 5 AI:         "Standing Idle"      → save as: standing-idle.glb
// Scene 7 Experience: "Standing Idle"      → reuse standing-idle.glb
// Scene 8 Contact:    "Waving Gesture"     → save as: waving.glb

const { NodeIO } = require('@gltf-transform/core');
const { dedup, prune } = require('@gltf-transform/functions');
const path = require('path');
const fs   = require('fs');

const ANIM_DIR = path.join(__dirname, 'assets', 'animations');
const BASE_GLB = path.join(__dirname, 'assets', 'avatar-base.glb');
const OUT_GLB  = path.join(__dirname, 'assets', 'avatar.glb');

// Maps filename (without .glb) → the animation-name used in main.js SCENE_CONFIG
const ANIMATION_MAP = {
  'idle':          'Idle',
  'seated-idle':   'seated-idle',
  'typing':        'typing',
  'pointing':      'pointing',
  'presenting':    'presenting',
  'standing-idle': 'standing-idle',
  'waving':        'waving',
};

async function mergeAnimations() {
  const io = new NodeIO();

  console.log('📂  Loading base model:', BASE_GLB);
  if (!fs.existsSync(BASE_GLB)) {
    console.error('❌  Base GLB not found. Copy your soldier/avatar model to assets/avatar-base.glb');
    process.exit(1);
  }

  const doc = await io.read(BASE_GLB);

  // Remove existing animations from base (keep mesh + skeleton)
  const existingAnims = doc.getRoot().listAnimations();
  existingAnims.forEach(anim => anim.dispose());
  console.log(`✅  Cleared ${existingAnims.length} base animations from model`);

  // Merge each animation GLB
  for (const [filename, animName] of Object.entries(ANIMATION_MAP)) {
    const animPath = path.join(ANIM_DIR, `${filename}.glb`);
    if (!fs.existsSync(animPath)) {
      console.warn(`⚠️   Missing: ${animPath}  — skipping "${animName}"`);
      continue;
    }

    const animDoc   = await io.read(animPath);
    const animations = animDoc.getRoot().listAnimations();

    for (const anim of animations) {
      // Rename to our target name
      anim.setName(animName);
      // Move animation into main doc
      const cloned = anim.clone();
      doc.getRoot().addAnimation(cloned);
      console.log(`✅  Merged: ${animName} (from ${filename}.glb)`);
    }
  }

  // Optimise
  await doc.transform(dedup(), prune());

  // Write output
  await io.write(OUT_GLB, doc);
  console.log('\n🎉  Done! Merged avatar written to:', OUT_GLB);
  console.log('    Reload the browser to see all animations.\n');

  // Print a summary of what's now in the GLB
  const out   = await io.read(OUT_GLB);
  const names = out.getRoot().listAnimations().map(a => a.getName());
  console.log('📋  Animations now in avatar.glb:', names);
}

mergeAnimations().catch(err => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
