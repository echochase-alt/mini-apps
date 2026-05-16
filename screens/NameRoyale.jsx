import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import "../styles/name-royale.css";

const MAX_NAMES = 100;
const MAX_NAME_LENGTH = 30;
const STARTING_HP = 100;
const ELIMINATION_HEAL = 33;
const PAIR_DAMAGE_COOLDOWN_MS = 320;
const SPEED_GROWTH_PER_SECOND = 1.05;
const MAX_SPEED_MULTIPLIER = 5;
const RED_ZONE_SECONDS = 60;
const FINAL_DUEL_ACCELERATION = 118;
const NEAREST_TARGET_ACCELERATION = 72;

const PASTEL_POOL = [
  "#f8b4c4",
  "#ffd6a5",
  "#fdffb6",
  "#caffbf",
  "#9bf6ff",
  "#a0c4ff",
  "#bdb2ff",
  "#ffc6ff",
  "#d8f3dc",
  "#bee1e6",
  "#f1c0e8",
  "#cfbaf0",
  "#a3c4f3",
  "#90dbf4",
  "#98f5e1",
  "#b9fbc0",
  "#fbf8cc",
  "#fde4cf",
  "#ffcfdb",
  "#cddafd",
];

const SAMPLE_NAMES = [
  "Ada",
  "Ronaldo",
  "John",
  "Petacekfetacek",
  "Hungry Cat",
  "Smelly Cat",
  "Kai",
  "Tiny Tim",
  "Kid Named Finger",
  "Zed",
  "Mochi",
  "The Longest Noodle",
  "Pip",
  "Velvet",
  "Basilisk",
  "June",
  "Orbit",
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const random = (min, max) => Math.random() * (max - min) + min;
const roundDamage = (value) => Math.round(value * 10) / 10;

const normalizeAngle = (angle) => {
  let next = angle;

  while (next <= -Math.PI) next += Math.PI * 2;
  while (next > Math.PI) next -= Math.PI * 2;

  return next;
};

const shortestAxisAngleDelta = (current, target) => {
  let delta = normalizeAngle(target - current);

  if (delta > Math.PI / 2) delta -= Math.PI;
  if (delta < -Math.PI / 2) delta += Math.PI;

  return delta;
};

const roundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const sanitizeName = (rawName) => {
  return String(rawName ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f<>`{}[\]\\/|^~]/g, "")
    .replace(/[^\p{L}\p{N} ._'’\-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
};

const parseNames = (input) => {
  const seen = new Set();

  return String(input)
    .split(/\r?\n/)
    .map(sanitizeName)
    .filter(Boolean)
    .filter((name) => {
      const key = name.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_NAMES);
};

const getCollisionKey = (a, b) => (a.id < b.id ? `${a.id}:${b.id}` : `${b.id}:${a.id}`);

const createTextBurst = (game, x, y, text, type = "damage") => {
  game.floaters.push({
    x,
    y,
    text,
    type,
    age: 0,
    life: type === "heal" ? 0.9 : 0.75,
    vy: type === "heal" ? -34 : -42,
    drift: random(-10, 10),
  });
};

const createParticles = (game, x, y, color, count, type = "spark") => {
  for (let i = 0; i < count; i += 1) {
    const angle = random(0, Math.PI * 2);
    const speed = random(type === "confetti" ? 35 : 22, type === "confetti" ? 135 : 90);

    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: random(type === "confetti" ? 3 : 1.4, type === "confetti" ? 7 : 4),
      rotation: random(0, Math.PI * 2),
      spin: random(-5, 5),
      color,
      age: 0,
      life: random(type === "confetti" ? 1.1 : 0.35, type === "confetti" ? 2.1 : 0.85),
      type,
    });
  }
};

const drawBackground = (ctx, width, height, now, elapsed = 0) => {
  const time = now * 0.00014;
  const redZoneIntensity = clamp((elapsed - RED_ZONE_SECONDS) / 8, 0, 1);

  const base = ctx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#0b1020");
  base.addColorStop(0.5, "#142235");
  base.addColorStop(1, "#060814");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(
    width * 0.45,
    height * 0.34,
    Math.min(width, height) * 0.08,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.82
  );
  glow.addColorStop(0, "rgba(176, 214, 255, 0.16)");
  glow.addColorStop(0.42, "rgba(124, 139, 180, 0.05)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0.48)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(Math.sin(time * 0.8) * 0.05);

  const maxRadius = Math.max(width, height) * 0.62;
  for (let i = 0; i < 8; i += 1) {
    const radius = maxRadius * (0.2 + i * 0.11);
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.58, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(210, 220, 236, ${0.08 - i * 0.006})`;
    ctx.lineWidth = i === 0 ? 2 : 1;
    ctx.stroke();
  }
  ctx.restore();

  const spacing = 78;
  const offset = (time * 160) % spacing;
  ctx.save();
  ctx.globalAlpha = 0.32;
  for (let x = -spacing + offset; x < width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + width * 0.07, height);
    ctx.strokeStyle = "rgba(196, 210, 230, 0.07)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  for (let y = -spacing + offset; y < height + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + height * 0.04);
    ctx.strokeStyle = "rgba(196, 210, 230, 0.055)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  for (let i = 0; i < 55; i += 1) {
    const seed = i * 91.73;
    const x = ((Math.sin(seed) * 0.5 + 0.5) * width + Math.sin(time * 2.2 + seed) * 24) % width;
    const y = ((Math.cos(seed * 1.45) * 0.5 + 0.5) * height + Math.cos(time * 1.6 + seed) * 18) % height;
    ctx.beginPath();
    ctx.arc(x, y, 0.7 + (i % 3) * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(235, 242, 255, ${0.035 + (i % 5) * 0.012})`;
    ctx.fill();
  }

  if (redZoneIntensity > 0) {
    const pulse = (Math.sin(now / 170) * 0.5 + 0.5) * 0.08 * redZoneIntensity;
    const redWash = ctx.createRadialGradient(
      width * 0.5,
      height * 0.48,
      Math.min(width, height) * 0.12,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.8
    );

    redWash.addColorStop(0, `rgba(255, 74, 74, ${0.13 * redZoneIntensity + pulse})`);
    redWash.addColorStop(0.48, `rgba(160, 32, 42, ${0.2 * redZoneIntensity + pulse})`);
    redWash.addColorStop(1, `rgba(70, 8, 16, ${0.46 * redZoneIntensity})`);
    ctx.fillStyle = redWash;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.shadowColor = "rgba(255, 70, 70, 0.75)";
    ctx.shadowBlur = 24;
    ctx.strokeStyle = `rgba(255, 92, 92, ${0.5 * redZoneIntensity})`;
    ctx.lineWidth = 4;
    ctx.strokeRect(5, 5, width - 10, height - 10);
    ctx.restore();
  }
};

const createSprite = (name, index, ctx, arenaWidth, arenaHeight) => {
  const charCount = clamp([...name].length, 1, MAX_NAME_LENGTH);
  const color = PASTEL_POOL[index % PASTEL_POOL.length];
  const fontSize = clamp(13 + Math.min(charCount, 18) * 0.18, 13, 16);

  ctx.font = `800 ${fontSize}px Inter, Quicksand, Arial, Helvetica, sans-serif`;
  const measuredWidth = ctx.measureText(name).width;
  const width = clamp(measuredWidth + 34 + charCount * 1.4, 58, Math.min(230, arenaWidth * 0.64));
  const height = clamp(29 + charCount * 0.14, 29, 36);
  const speed = random(58, 88) + (MAX_NAME_LENGTH - charCount) * 1.55;
  const angle = random(0, Math.PI * 2);

  return {
    id: index,
    name,
    color,
    x: random(width / 2 + 4, Math.max(width / 2 + 5, arenaWidth - width / 2 - 4)),
    y: random(height / 2 + 4, Math.max(height / 2 + 5, arenaHeight - height / 2 - 4)),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    width,
    height,
    fontSize,
    mass: width * height,
    hp: STARTING_HP,
    maxHp: STARTING_HP,
    damage: roundDamage(5 + charCount / 1.5),
    angle: random(-0.18, 0.18),
    angularVelocity: random(-0.85, 0.85),
    alive: true,
    isWinner: false,
    hurtUntil: 0,
    healUntil: 0,
    lastCollisionAt: 0,
  };
};

const placeSprites = (sprites, width, height) => {
  const placed = [];

  for (const sprite of sprites) {
    let placedSafely = false;

    for (let attempt = 0; attempt < 260; attempt += 1) {
      sprite.x = random(sprite.width / 2 + 6, Math.max(sprite.width / 2 + 7, width - sprite.width / 2 - 6));
      sprite.y = random(sprite.height / 2 + 6, Math.max(sprite.height / 2 + 7, height - sprite.height / 2 - 6));

      const overlaps = placed.some(
        (other) =>
          Math.abs(sprite.x - other.x) < (sprite.width + other.width) / 2 + 8 &&
          Math.abs(sprite.y - other.y) < (sprite.height + other.height) / 2 + 8
      );

      if (!overlaps) {
        placedSafely = true;
        break;
      }
    }

    placed.push(sprite);

    if (!placedSafely) {
      sprite.x = random(sprite.width / 2 + 4, Math.max(sprite.width / 2 + 5, width - sprite.width / 2 - 4));
      sprite.y = random(sprite.height / 2 + 4, Math.max(sprite.height / 2 + 5, height - sprite.height / 2 - 4));
    }
  }
};

const applyDamageExchange = (game, a, b, now) => {
  const damageToB = a.damage;
  const damageToA = b.damage;
  const aWasAlive = a.alive;
  const bWasAlive = b.alive;

  a.hp = clamp(a.hp - damageToA, 0, a.maxHp);
  b.hp = clamp(b.hp - damageToB, 0, b.maxHp);

  a.hurtUntil = now + 260;
  b.hurtUntil = now + 260;
  a.lastCollisionAt = now;
  b.lastCollisionAt = now;

  createTextBurst(game, a.x, a.y - a.height * 0.7, `-${damageToA}`, "damage");
  createTextBurst(game, b.x, b.y - b.height * 0.7, `-${damageToB}`, "damage");
  createParticles(game, a.x, a.y, "#ff6b6b", 7);
  createParticles(game, b.x, b.y, "#ff6b6b", 7);

  if (a.hp <= 0 && aWasAlive) {
    a.alive = false;
    createParticles(game, a.x, a.y, a.color, 20);
  }

  if (b.hp <= 0 && bWasAlive) {
    b.alive = false;
    createParticles(game, b.x, b.y, b.color, 20);
  }

  if (!b.alive && bWasAlive && a.alive) {
    a.hp = clamp(a.hp + ELIMINATION_HEAL, 0, a.maxHp);
    a.healUntil = now + 900;
    createTextBurst(game, a.x, a.y - a.height * 1.35, `+${ELIMINATION_HEAL}`, "heal");
    createParticles(game, a.x, a.y, "#52e69a", 24, "confetti");
  }

  if (!a.alive && aWasAlive && b.alive) {
    b.hp = clamp(b.hp + ELIMINATION_HEAL, 0, b.maxHp);
    b.healUntil = now + 900;
    createTextBurst(game, b.x, b.y - b.height * 1.35, `+${ELIMINATION_HEAL}`, "heal");
    createParticles(game, b.x, b.y, "#52e69a", 24, "confetti");
  }
};

const resolveCollision = (game, a, b, now) => {
  if (!a.alive || !b.alive || a.isWinner || b.isWinner) return;

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const overlapX = (a.width + b.width) / 2 - Math.abs(dx);
  const overlapY = (a.height + b.height) / 2 - Math.abs(dy);

  if (overlapX <= 0 || overlapY <= 0) return;

  if (overlapX < overlapY) {
    const direction = dx === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(dx);
    a.x -= (overlapX / 2 + 0.8) * direction;
    b.x += (overlapX / 2 + 0.8) * direction;

    const aVx = a.vx;
    a.vx = b.vx * 0.92;
    b.vx = aVx * 0.92;
    a.vy += random(-14, 14);
    b.vy += random(-14, 14);
  } else {
    const direction = dy === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(dy);
    a.y -= (overlapY / 2 + 0.8) * direction;
    b.y += (overlapY / 2 + 0.8) * direction;

    const aVy = a.vy;
    a.vy = b.vy * 0.92;
    b.vy = aVy * 0.92;
    a.vx += random(-14, 14);
    b.vx += random(-14, 14);
  }

  const collisionAngle = Math.atan2(dy, dx);
  const relativeVelocity = Math.hypot(a.vx - b.vx, a.vy - b.vy);
  const spinImpulse = clamp(relativeVelocity / 140, 0.16, 2.25);
  const spinDirection = dx * (a.vy - b.vy) - dy * (a.vx - b.vx) >= 0 ? 1 : -1;
  const aTurn = shortestAxisAngleDelta(a.angle, collisionAngle);
  const bTurn = shortestAxisAngleDelta(b.angle, collisionAngle);

  a.angularVelocity = clamp(a.angularVelocity + aTurn * 7 - spinDirection * spinImpulse, -8, 8);
  b.angularVelocity = clamp(b.angularVelocity + bTurn * 7 + spinDirection * spinImpulse, -8, 8);

  a.x = clamp(a.x, a.width / 2, game.width - a.width / 2);
  b.x = clamp(b.x, b.width / 2, game.width - b.width / 2);
  a.y = clamp(a.y, a.height / 2, game.height - a.height / 2);
  b.y = clamp(b.y, b.height / 2, game.height - b.height / 2);

  const pairKey = getCollisionKey(a, b);
  const lastHit = game.pairCooldowns.get(pairKey) || 0;

  if (now - lastHit >= PAIR_DAMAGE_COOLDOWN_MS) {
    game.pairCooldowns.set(pairKey, now);
    applyDamageExchange(game, a, b, now);
  }
};

const applyNearestTargetPull = (sprites, dt) => {
  for (const sprite of sprites) {
    let nearest = null;
    let nearestDistance = Infinity;

    for (const other of sprites) {
      if (other === sprite) continue;

      const distance = Math.hypot(other.x - sprite.x, other.y - sprite.y);

      if (distance < nearestDistance) {
        nearest = other;
        nearestDistance = distance;
      }
    }

    if (!nearest || nearestDistance < 1) continue;

    const nx = (nearest.x - sprite.x) / nearestDistance;
    const ny = (nearest.y - sprite.y) / nearestDistance;
    const urgency = clamp(nearestDistance / 420, 0.38, 1.15);

    sprite.vx += nx * NEAREST_TARGET_ACCELERATION * urgency * dt;
    sprite.vy += ny * NEAREST_TARGET_ACCELERATION * urgency * dt;
    sprite.angularVelocity = clamp(
      sprite.angularVelocity + shortestAxisAngleDelta(sprite.angle, Math.atan2(ny, nx)) * 1.6 * dt,
      -8,
      8
    );
  }
};

const applyFinalDuelPull = (a, b, dt) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy);

  if (distance < 1) return;

  const nx = dx / distance;
  const ny = dy / distance;
  const closenessBoost = clamp(distance / 360, 0.38, 1.2);
  const acceleration = FINAL_DUEL_ACCELERATION * closenessBoost;

  a.vx += nx * acceleration * dt;
  a.vy += ny * acceleration * dt;
  b.vx -= nx * acceleration * dt;
  b.vy -= ny * acceleration * dt;

  a.angularVelocity = clamp(a.angularVelocity + 0.7 * dt, -8, 8);
  b.angularVelocity = clamp(b.angularVelocity - 0.7 * dt, -8, 8);
};

const updateSprite = (sprite, dt, game, elapsed) => {
  if (!sprite.alive || sprite.isWinner) return;

  const speedPressure = clamp(Math.pow(SPEED_GROWTH_PER_SECOND, elapsed), 1, MAX_SPEED_MULTIPLIER);
  sprite.x += sprite.vx * dt * speedPressure;
  sprite.y += sprite.vy * dt * speedPressure;
  sprite.angle += sprite.angularVelocity * dt;
  sprite.angularVelocity *= Math.pow(0.91, dt * 60);

  if (Math.abs(sprite.angularVelocity) < 0.018) {
    sprite.angularVelocity = 0;
  }

  if (sprite.x - sprite.width / 2 < 0) {
    sprite.x = sprite.width / 2;
    sprite.vx = Math.abs(sprite.vx);
    sprite.angularVelocity = clamp(sprite.angularVelocity + Math.sign(sprite.vy || 1) * random(0.28, 0.72), -8, 8);
  }

  if (sprite.x + sprite.width / 2 > game.width) {
    sprite.x = game.width - sprite.width / 2;
    sprite.vx = -Math.abs(sprite.vx);
    sprite.angularVelocity = clamp(sprite.angularVelocity - Math.sign(sprite.vy || 1) * random(0.28, 0.72), -8, 8);
  }

  if (sprite.y - sprite.height / 2 < 0) {
    sprite.y = sprite.height / 2;
    sprite.vy = Math.abs(sprite.vy);
    sprite.angularVelocity = clamp(sprite.angularVelocity - Math.sign(sprite.vx || 1) * random(0.28, 0.72), -8, 8);
  }

  if (sprite.y + sprite.height / 2 > game.height) {
    sprite.y = game.height - sprite.height / 2;
    sprite.vy = -Math.abs(sprite.vy);
    sprite.angularVelocity = clamp(sprite.angularVelocity + Math.sign(sprite.vx || 1) * random(0.28, 0.72), -8, 8);
  }

  const currentSpeed = Math.hypot(sprite.vx, sprite.vy);
  const maxSpeed = 185;
  const minSpeed = 42;

  if (currentSpeed > maxSpeed) {
    sprite.vx = (sprite.vx / currentSpeed) * maxSpeed;
    sprite.vy = (sprite.vy / currentSpeed) * maxSpeed;
  } else if (currentSpeed < minSpeed) {
    const angle = Math.atan2(sprite.vy, sprite.vx) || random(0, Math.PI * 2);
    sprite.vx = Math.cos(angle) * minSpeed;
    sprite.vy = Math.sin(angle) * minSpeed;
  }
};

const handleCollisions = (game, now) => {
  const sprites = game.sprites.filter((sprite) => sprite.alive);
  const cellSize = 150;
  const grid = new Map();

  for (const sprite of sprites) {
    const minX = Math.floor((sprite.x - sprite.width / 2) / cellSize);
    const maxX = Math.floor((sprite.x + sprite.width / 2) / cellSize);
    const minY = Math.floor((sprite.y - sprite.height / 2) / cellSize);
    const maxY = Math.floor((sprite.y + sprite.height / 2) / cellSize);

    for (let gx = minX; gx <= maxX; gx += 1) {
      for (let gy = minY; gy <= maxY; gy += 1) {
        const key = `${gx},${gy}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(sprite);
      }
    }
  }

  const checked = new Set();

  for (const bucket of grid.values()) {
    for (let i = 0; i < bucket.length; i += 1) {
      for (let j = i + 1; j < bucket.length; j += 1) {
        const a = bucket[i];
        const b = bucket[j];
        const key = getCollisionKey(a, b);
        if (checked.has(key)) continue;
        checked.add(key);
        resolveCollision(game, a, b, now);
      }
    }
  }
};

const drawSprite = (ctx, sprite, now) => {
  if (!sprite.alive) return;

  const hurtProgress = clamp((sprite.hurtUntil - now) / 260, 0, 1);
  const healProgress = clamp((sprite.healUntil - now) / 900, 0, 1);
  const winnerPulse = sprite.isWinner ? 1 + Math.sin(now / 140) * 0.06 : 1;
  const shakeX = hurtProgress ? Math.sin(now * 0.07 + sprite.id) * 3.4 * hurtProgress : 0;
  const shakeY = hurtProgress ? Math.cos(now * 0.08 + sprite.id) * 2.4 * hurtProgress : 0;

  ctx.save();
  ctx.translate(sprite.x + shakeX, sprite.y + shakeY);
  ctx.rotate(sprite.angle);
  ctx.scale(winnerPulse + hurtProgress * 0.05, winnerPulse + hurtProgress * 0.05);

  if (sprite.isWinner) {
    const pulse = Math.sin(now / 190) * 7;
    ctx.save();
    ctx.shadowColor = "rgba(255, 220, 82, 0.98)";
    ctx.shadowBlur = 34;
    roundedRect(ctx, -sprite.width / 2 - 16 - pulse, -sprite.height / 2 - 14 - pulse, sprite.width + 32 + pulse * 2, sprite.height + 28 + pulse * 2, 28);
    ctx.strokeStyle = "rgba(255, 220, 82, 0.82)";
    ctx.lineWidth = 5;
    ctx.stroke();
    roundedRect(ctx, -sprite.width / 2 - 28 - pulse, -sprite.height / 2 - 25 - pulse, sprite.width + 56 + pulse * 2, sprite.height + 50 + pulse * 2, 34);
    ctx.strokeStyle = "rgba(255, 246, 184, 0.36)";
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.restore();
  }

  if (healProgress > 0) {
    ctx.save();
    ctx.shadowColor = "rgba(82, 230, 154, 0.9)";
    ctx.shadowBlur = 30 * healProgress;
    roundedRect(
      ctx,
      -sprite.width / 2 - 10 * healProgress,
      -sprite.height / 2 - 8 * healProgress,
      sprite.width + 20 * healProgress,
      sprite.height + 16 * healProgress,
      26
    );
    ctx.strokeStyle = `rgba(82, 230, 154, ${0.65 * healProgress})`;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();
  }

  if (hurtProgress > 0) {
    ctx.save();
    ctx.shadowColor = "rgba(255, 90, 90, 0.95)";
    ctx.shadowBlur = 30 * hurtProgress;
    roundedRect(ctx, -sprite.width / 2 - 5, -sprite.height / 2 - 5, sprite.width + 10, sprite.height + 10, 24);
    ctx.strokeStyle = `rgba(255, 93, 93, ${0.76 * hurtProgress})`;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();
  }

  const body = ctx.createLinearGradient(-sprite.width / 2, -sprite.height / 2, sprite.width / 2, sprite.height / 2);
  body.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  body.addColorStop(0.48, "rgba(255, 255, 255, 0.08)");
  body.addColorStop(1, "rgba(0, 0, 0, 0.1)");

  ctx.save();
  ctx.shadowColor = sprite.isWinner ? "rgba(255, 220, 82, 0.9)" : `${sprite.color}aa`;
  ctx.shadowBlur = sprite.isWinner ? 26 : 16;
  roundedRect(ctx, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height, sprite.height / 2);
  ctx.fillStyle = body;
  ctx.fill();
  ctx.strokeStyle = sprite.isWinner ? "#ffdc52" : sprite.color;
  ctx.lineWidth = sprite.isWinner ? 4 : 3;
  ctx.stroke();
  ctx.restore();

  roundedRect(ctx, -sprite.width / 2 + 4, -sprite.height / 2 + 4, sprite.width - 8, sprite.height - 8, sprite.height / 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = `900 ${sprite.fontSize}px Inter, Quicksand, Arial, Helvetica, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(3, 6, 15, 0.72)";
  ctx.strokeText(sprite.name, 0, 0, sprite.width - 22);
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.fillText(sprite.name, 0, 0, sprite.width - 22);

  if (!sprite.isWinner) {
    const barWidth = sprite.width * 0.78;
    const barHeight = 4;
    const barTop = -sprite.height / 2 - 9;
    const hpRatio = sprite.hp / sprite.maxHp;

    roundedRect(ctx, -barWidth / 2, barTop, barWidth, barHeight, 6);
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fill();
    roundedRect(ctx, -barWidth / 2, barTop, barWidth * hpRatio, barHeight, 6);
    ctx.fillStyle = hpRatio > 0.5 ? "#52e69a" : hpRatio > 0.24 ? "#ffd166" : "#ff6b6b";
    ctx.fill();
  } else {
    ctx.font = "900 24px Inter, Quicksand, Arial, Helvetica, sans-serif";
    ctx.textBaseline = "bottom";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "rgba(3, 6, 15, 0.85)";
    ctx.strokeText("WINNER", 0, -sprite.height / 2 - 16);
    ctx.fillStyle = "#ffdc52";
    ctx.fillText("WINNER", 0, -sprite.height / 2 - 16);
  }

  ctx.restore();
};

const updateAndDrawEffects = (ctx, game, dt) => {
  game.particles = game.particles.filter((particle) => {
    particle.age += dt;
    if (particle.age >= particle.life) return false;

    const progress = particle.age / particle.life;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += particle.type === "confetti" ? 46 * dt : 28 * dt;
    particle.rotation += particle.spin * dt;

    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;

    if (particle.type === "confetti") {
      ctx.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * 0.62);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    return true;
  });

  game.floaters = game.floaters.filter((floater) => {
    floater.age += dt;
    if (floater.age >= floater.life) return false;

    const progress = floater.age / floater.life;
    floater.x += floater.drift * dt;
    floater.y += floater.vy * dt;

    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.font = floater.type === "heal" ? "900 17px Inter, Arial, sans-serif" : "900 15px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.72)";
    ctx.strokeText(floater.text, floater.x, floater.y);
    ctx.fillStyle = floater.type === "heal" ? "#52e69a" : "#ff6b6b";
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();

    return true;
  });
};

export const NameRoyale = () => {
  const navigate = useNavigate();
  const shellRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const gameRef = useRef(null);

  const [rawNames, setRawNames] = useState(SAMPLE_NAMES.join("\n"));
  const [activeNames, setActiveNames] = useState([]);
  const [screen, setScreen] = useState("setup");
  const [error, setError] = useState("");
  const [battleKey, setBattleKey] = useState(0);
  const [winner, setWinner] = useState(null);
  const [stats, setStats] = useState({ alive: 0, elapsed: 0, speed: 1 });

  const parsedNames = useMemo(() => parseNames(rawNames), [rawNames]);

  const canStart = parsedNames.length >= 2;

  const startBattle = useCallback(() => {
    const names = parseNames(rawNames);

    if (names.length < 2) {
      setError("Enter at least 2 valid names to start the battle.");
      return;
    }

    setError("");
    setWinner(null);
    setStats({ alive: names.length, elapsed: 0, speed: 1 });
    setActiveNames(names);
    setBattleKey((key) => key + 1);
    setScreen("battle");
  }, [rawNames]);

  const resetToSetup = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    gameRef.current = null;
    setWinner(null);
    setScreen("setup");
  }, []);

  useEffect(() => {
    if (screen !== "battle" || activeNames.length === 0) return undefined;

    const canvas = canvasRef.current;
    const shell = shellRef.current;
    if (!canvas || !shell) return undefined;

    const ctx = canvas.getContext("2d", { alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const game = {
      width: 0,
      height: 0,
      sprites: [],
      particles: [],
      floaters: [],
      pairCooldowns: new Map(),
      lastTime: performance.now(),
      startedAt: performance.now(),
      lastStatsAt: 0,
      winnerAnnounced: false,
      endedElapsed: null,
      endedSpeed: 1,
      confettiAt: 0,
    };

    gameRef.current = game;

    const resizeCanvas = () => {
      const rect = shell.getBoundingClientRect();
      const width = Math.max(320, rect.width);
      const height = Math.max(420, rect.height);

      game.width = width;
      game.height = height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (const sprite of game.sprites) {
        sprite.x = clamp(sprite.x, sprite.width / 2, width - sprite.width / 2);
        sprite.y = clamp(sprite.y, sprite.height / 2, height - sprite.height / 2);
      }
    };

    resizeCanvas();

    game.sprites = activeNames.map((name, index) => createSprite(name, index, ctx, game.width, game.height));
    placeSprites(game.sprites, game.width, game.height);

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(shell);

    const loop = (now) => {
      const currentGame = gameRef.current;
      if (!currentGame) return;

      const dt = Math.min((now - currentGame.lastTime) / 1000, 0.033);
      const elapsed = (now - currentGame.startedAt) / 1000;
      currentGame.lastTime = now;

      drawBackground(ctx, currentGame.width, currentGame.height, now, elapsed);

      if (!currentGame.winnerAnnounced) {
        const aliveSprites = currentGame.sprites.filter((sprite) => sprite.alive);

        if (aliveSprites.length === 2) {
          applyFinalDuelPull(aliveSprites[0], aliveSprites[1], dt);
        } else if (aliveSprites.length > 2 && aliveSprites.length <= 5) {
          applyNearestTargetPull(aliveSprites, dt);
        }

        for (const sprite of currentGame.sprites) {
          updateSprite(sprite, dt, currentGame, elapsed);
        }
        handleCollisions(currentGame, now);
      }

      currentGame.sprites = currentGame.sprites.filter((sprite) => sprite.alive);

      const aliveCount = currentGame.sprites.length;
      if (aliveCount <= 1 && !currentGame.winnerAnnounced) {
        const finalWinner = currentGame.sprites[0];
        currentGame.winnerAnnounced = true;
        currentGame.endedElapsed = Math.floor(elapsed);
        currentGame.endedSpeed = clamp(Math.pow(SPEED_GROWTH_PER_SECOND, elapsed), 1, MAX_SPEED_MULTIPLIER);

        if (finalWinner) {
          finalWinner.isWinner = true;
          finalWinner.vx = 0;
          finalWinner.vy = 0;
          finalWinner.hp = Math.max(finalWinner.hp, 1);
          setWinner({ name: finalWinner.name, hp: Math.ceil(finalWinner.hp), damage: finalWinner.damage });
          createParticles(currentGame, finalWinner.x, finalWinner.y, "#ffdc52", 90, "confetti");
        }

        setStats({ alive: aliveCount, elapsed: currentGame.endedElapsed, speed: currentGame.endedSpeed });
      }

      for (const sprite of currentGame.sprites) {
        drawSprite(ctx, sprite, now);
      }

      if (currentGame.winnerAnnounced && currentGame.sprites[0]) {
        const finalWinner = currentGame.sprites[0];
        if (now - currentGame.confettiAt > 650) {
          currentGame.confettiAt = now;
          createParticles(currentGame, finalWinner.x, finalWinner.y, "#ffdc52", 22, "confetti");
          createParticles(currentGame, finalWinner.x, finalWinner.y, finalWinner.color, 12, "confetti");
        }
      }

      updateAndDrawEffects(ctx, currentGame, dt);

      if (now - currentGame.lastStatsAt > 130 && !currentGame.winnerAnnounced) {
        currentGame.lastStatsAt = now;
        setStats({ alive: aliveCount, elapsed: Math.floor(elapsed), speed: clamp(Math.pow(SPEED_GROWTH_PER_SECOND, elapsed), 1, MAX_SPEED_MULTIPLIER) });
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      gameRef.current = null;
    };
  }, [activeNames, battleKey, screen]);

  return (
    <main className={`name-royale ${screen === "battle" ? "name-royale--battle" : ""}`}>
      {screen === "setup" ? (
        <>
          <Navbar />
          <section className="name-royale-setup">
          <div className="name-royale-hero">
            <h1>Name Battle</h1>
            <p>
              Enter up to 100 names. Every name joins the battle as a sprite.
              Longer names hit harder, shorter names are harder to catch.
            </p>
          </div>

          <div className="name-royale-card">
            <div className="name-royale-card-header">
              <div>
                <h2>Enter players</h2>
                <p>Add one name per line.</p>
              </div>
            </div>

            <textarea
              value={rawNames}
              onChange={(event) => {
                setRawNames(event.target.value.slice(0, 8_000));
                if (error) setError("");
              }}
              spellCheck="false"
              placeholder="Ada&#10;Maximus&#10;Nova"
              aria-label="Names for Name Battle"
            />

            <div className="name-royale-meta-row">
              <span>{parsedNames.length}/{MAX_NAMES} valid names</span>
              <span>Max {MAX_NAME_LENGTH} characters each</span>
            </div>

            <button
              className="name-royale-clear"
              type="button"
              disabled={!rawNames.trim()}
              onClick={() => {
                setRawNames("");
                if (error) setError("");
              }}
            >
              Clear all
            </button>

            {error ? <div className="name-royale-error">{error}</div> : null}

            <div className="name-royale-preview" aria-label="Sanitized name preview">
              {parsedNames.slice(0, 18).map((name, index) => (
                <span key={`${name}-${index}`} style={{ "--chip-colour": PASTEL_POOL[index % PASTEL_POOL.length] }}>
                  {name}
                </span>
              ))}
              {parsedNames.length > 18 ? <em>+{parsedNames.length - 18} more</em> : null}
            </div>

            <div className="name-royale-rules">
              <div>
                <strong>100 HP</strong>
                <span>Every sprite starts equal.</span>
              </div>
              <div>
                <strong>5 + letters / 1.5</strong>
                <span>Long names deal more damage.</span>
              </div>
              <div>
                <strong>+33 HP</strong>
                <span>Eliminations heal survivors.</span>
              </div>
            </div>

            <button className="name-royale-start" type="button" disabled={!canStart} onClick={startBattle}>
              Start Battle
            </button>
          </div>
          </section>
        </>
      ) : (
        <section className="name-royale-stage">
          <div ref={shellRef} className="name-royale-arena-shell">
            <canvas ref={canvasRef} className="name-royale-canvas" />
          </div>

          <div className="name-royale-hud name-royale-hud--top">
            <div>
              <span>Name Battle</span>
              <strong>{winner ? "Victory" : stats.elapsed >= RED_ZONE_SECONDS ? "Red Zone" : "Battle Live"}</strong>
            </div>
            <div className="name-royale-stat-card">
              <span>Alive</span>
              <strong>{stats.alive}</strong>
            </div>
            <div className="name-royale-stat-card">
              <span>Time</span>
              <strong>{stats.elapsed}s</strong>
            </div>
            <div className="name-royale-stat-card">
              <span>Speed</span>
              <strong>{stats.speed.toFixed(1)}x</strong>
            </div>
          </div>

          {winner ? (
            <div className="name-royale-winner-panel">
              <span>Winner</span>
              <strong>{winner.name}</strong>
              <p>{winner.hp} HP left · {winner.damage} damage per hit · {stats.elapsed}s battle</p>
              <div className="name-royale-winner-actions">
                <button type="button" onClick={resetToSetup}>Edit names</button>
                <button type="button" onClick={startBattle}>Restart</button>
                <button type="button" onClick={() => navigate("/mini-apps")}>To mini apps</button>
              </div>
            </div>
          ) : null}
        </section>
      )}
    </main>
  );
};
