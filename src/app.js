const TICK_INTERVAL = 6000;
const SIM_INTERVAL = 100;
const MAX_LOG_LINES = 300;

const WEAPON_TYPES = {
  SLASH_1H: { verb: "slash" },
  SLASH_2H: { verb: "slash" },
  BLUNT_1H: { verb: "crush" },
  BLUNT_2H: { verb: "crush" },
  PIERCE: { verb: "pierce" },
  H2H: { verb: "punch" },
};

const WEAPONS = {
  rusty_short_sword: {
    id: "rusty_short_sword",
    name: "Rusty Short Sword",
    type: "SLASH_1H",
    damage: 4,
    delay: 24,
    lore: "The edge is more suggestion than reality.",
    history: ["Found half-buried in mud outside Freeport's east gate."],
  },
  bone_mace: {
    id: "bone_mace",
    name: "Bone-Handled Mace",
    type: "BLUNT_1H",
    damage: 5,
    delay: 28,
    lore: "The bone grip is human. You try not to think about it.",
    history: ["Stripped from a fallen guard in the Commonlands."],
  },
  tarnished_rapier: {
    id: "tarnished_rapier",
    name: "Tarnished Rapier",
    type: "PIERCE",
    damage: 5,
    delay: 22,
    lore: "Beneath the tarnish, faint scrollwork. Someone cared about this blade, once.",
    history: [],
  },
  gnollish_cleaver: {
    id: "gnollish_cleaver",
    name: "Gnollish Cleaver",
    type: "SLASH_1H",
    damage: 7,
    delay: 32,
    lore: "Crude but honest. It was made to do one thing.",
    history: ["Pried from the paw of a Splitpaw gnoll."],
  },
  cracked_staff: {
    id: "cracked_staff",
    name: "Cracked Darkwood Staff",
    type: "BLUNT_2H",
    damage: 7,
    delay: 36,
    lore: "Fissures run its length like dry riverbeds.",
    history: [],
  },
  barbed_whip: {
    id: "barbed_whip",
    name: "Barbed Whip",
    type: "SLASH_1H",
    damage: 3,
    delay: 18,
    lore: "The barbs are not metal. They're teeth.",
    proc: { name: "Venom Lash", damage: 4, chance: 0.12 },
    history: ["LORE ITEM - A trainer in Neriak whispered its name: Fangweave."],
  },
};

const SHIELDS = {
  wooden_shield: { name: "Cracked Wooden Shield", ac: 3, lore: "It's held together by hope and twine." },
  bronze_shield: { name: "Battered Bronze Shield", ac: 6, lore: "Dented but solid. It's seen worse than you." },
};

const PRESETS = {
  warrior: {
    name: "Thorgrim",
    race: "Barbarian",
    className: "Warrior",
    level: 10,
    stats: { STR: 113, STA: 95, AGI: 82, DEX: 75, WIS: 60, INT: 60, CHA: 55 },
    baseHP: 320,
    baseMana: 0,
    baseAC: 45,
    weapon: "gnollish_cleaver",
    shield: "bronze_shield",
    skills: { offense: 50, defense: 40, kick: 1, bash: 1, taunt: 1, doubleAttack: 0 },
    abilities: ["kick", "bash", "taunt"],
    spells: [],
  },
  shadowknight: {
    name: "Dyreth",
    race: "Dark Elf",
    className: "Shadow Knight",
    level: 10,
    stats: { STR: 80, STA: 80, AGI: 95, DEX: 85, WIS: 63, INT: 99, CHA: 65 },
    baseHP: 240,
    baseMana: 180,
    baseAC: 32,
    weapon: "tarnished_rapier",
    shield: "wooden_shield",
    skills: { offense: 45, defense: 35, kick: 1, bash: 1, taunt: 1, doubleAttack: 0 },
    abilities: ["kick", "bash", "taunt"],
    spells: [
      { name: "Lifetap", manaCost: 30, castTime: 2.5, damage: 22, heal: 22, recast: 12, type: "dd_heal" },
      { name: "Disease Cloud", manaCost: 40, castTime: 3.0, damagePerTick: 5, duration: 5, recast: 6, type: "dot" },
    ],
  },
  cleric: {
    name: "Aelindra",
    race: "High Elf",
    className: "Cleric",
    level: 10,
    stats: { STR: 65, STA: 75, AGI: 75, DEX: 70, WIS: 115, INT: 85, CHA: 80 },
    baseHP: 210,
    baseMana: 350,
    baseAC: 28,
    weapon: "bone_mace",
    shield: "bronze_shield",
    skills: { offense: 35, defense: 30, bash: 1, doubleAttack: 0 },
    abilities: ["bash"],
    spells: [
      { name: "Minor Healing", manaCost: 15, castTime: 1.5, heal: 25, recast: 1.5, type: "heal" },
      { name: "Cure Light Wounds", manaCost: 30, castTime: 2.0, heal: 50, recast: 2.0, type: "heal" },
      { name: "Holy Might", manaCost: 45, castTime: 2.5, damage: 30, recast: 8, type: "dd" },
      { name: "Courage", manaCost: 20, castTime: 3.0, buff: { ac: 5, duration: 60 }, recast: 0, type: "buff" },
    ],
  },
};

const MOBS = {
  moss_snake: {
    id: "moss_snake",
    name: "a moss snake",
    level: 5,
    maxHP: 80,
    ac: 15,
    minDmg: 2,
    maxDmg: 8,
    delay: 20,
    fleeAt: 0.15,
    attackVerb: "bites",
    desc: "A dull green serpent, thick as a forearm, tongue tasting the air.",
  },
  decaying_skeleton: {
    id: "decaying_skeleton",
    name: "a decaying skeleton",
    level: 10,
    maxHP: 180,
    ac: 28,
    minDmg: 4,
    maxDmg: 18,
    delay: 30,
    fleeAt: 0,
    attackVerb: "claws",
    desc: "Bones held together by dark will alone. Its jaw works silently.",
  },
  orc_centurion: {
    id: "orc_centurion",
    name: "an orc centurion",
    level: 14,
    maxHP: 320,
    ac: 40,
    minDmg: 8,
    maxDmg: 32,
    delay: 28,
    fleeAt: 0.2,
    attackVerb: "hits",
    desc: "Scarred and snarling, wrapped in stained chainmail. It sizes you up with cold intelligence.",
  },
  fire_beetle: {
    id: "fire_beetle",
    name: "a fire beetle",
    level: 3,
    maxHP: 45,
    ac: 10,
    minDmg: 1,
    maxDmg: 5,
    delay: 22,
    fleeAt: 0,
    attackVerb: "bites",
    desc: "Chitin glows faintly orange. It clicks and hisses.",
  },
};

const LOG_COLORS = {
  system: "log-system",
  flavor: "log-flavor",
  engage: "log-engage",
  tick: "log-tick",
  player_hit: "log-player-hit",
  crit: "log-crit",
  miss: "log-miss",
  mob_hit: "log-mob-hit",
  mob_crit: "log-mob-crit",
  mob_action: "log-mob-action",
  defend: "log-defend",
  spell_dmg: "log-spell-dmg",
  heal: "log-heal",
  buff: "log-buff",
  proc: "log-proc",
  interrupt: "log-interrupt",
  channel: "log-channel",
  death: "log-death",
  player_death: "log-player-death",
  death_screen: "log-player-death",
  xp: "log-xp",
};

const root = document.querySelector("#app");

const appState = {
  screen: "setup",
  selectedPreset: "warrior",
  selectedMob: "decaying_skeleton",
  simSpeed: 1,
  combat: null,
};

let intervalId = null;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function capFirst(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function calcDamageBonus(level) {
  if (level < 28) return 0;
  return Math.floor((level - 25) / 3);
}

function calcHitChance(atkSkill, atkBonus, defAC, levelDiff) {
  const base = 65 + atkSkill * 0.2 + atkBonus * 0.1 - defAC * 0.15 + levelDiff * 3;
  return clamp(base, 20, 95) / 100;
}

function rollDamage(weaponDamage, damageBonus, isPrimary) {
  const maxHit = weaponDamage * 2 + (isPrimary ? damageBonus : 0);
  return rand(1, Math.max(1, maxHit));
}

function trimLog(log) {
  if (log.length <= MAX_LOG_LINES) return log;
  return log.slice(log.length - MAX_LOG_LINES);
}

function getConColor(playerLevel, mobLevel) {
  const diff = mobLevel - playerLevel;
  if (diff >= 3) return "con-red";
  if (diff >= 1) return "con-yellow";
  if (diff >= -2) return "con-white";
  if (diff >= -5) return "con-blue";
  return "con-green";
}

function attackAttemptVerb(attackVerb) {
  return attackVerb.replace(/s$/, "");
}

function pushLogs(state, entries) {
  state.log = trimLog([...state.log, ...entries]);
}

function createCombatState(presetId, mobId) {
  const preset = PRESETS[presetId];
  const weapon = WEAPONS[preset.weapon];
  const shield = preset.shield ? SHIELDS[preset.shield] : null;
  const mob = MOBS[mobId];

  return {
    time: 0,
    tickAccum: 0,
    running: true,
    speed: appState.simSpeed,
    outcome: null,
    player: {
      ...preset,
      hp: preset.baseHP,
      maxHP: preset.baseHP,
      mana: preset.baseMana,
      maxMana: preset.baseMana,
      ac: preset.baseAC + (shield ? shield.ac : 0),
      weapon,
      shield,
      nextSwing: weapon.delay * 100,
      abilityCooldowns: {},
      spellCooldowns: {},
      casting: null,
      buffs: [],
    },
    mob: {
      ...mob,
      hp: mob.maxHP,
      nextSwing: mob.delay * 100,
      fleeing: false,
      dots: [],
    },
    log: [
      { time: 0, text: `You ready your ${weapon.name}.`, type: "system" },
      { time: 0, text: `Before you: ${mob.desc}`, type: "flavor" },
      { time: 0, text: `You engage ${mob.name}!`, type: "engage" },
    ],
  };
}

function expireBuffs(state) {
  if (!state.player.buffs.length) return;

  const activeBuffs = [];
  const expiredLogs = [];

  for (const buff of state.player.buffs) {
    if (state.time < buff.expiresAt) {
      activeBuffs.push(buff);
      continue;
    }
    if (buff.ac) state.player.ac -= buff.ac;
    expiredLogs.push({ time: state.time, text: `${buff.name} has worn off.`, type: "system" });
  }

  state.player.buffs = activeBuffs;
  if (expiredLogs.length) pushLogs(state, expiredLogs);
}

function resolveTick(state) {
  state.tickAccum -= TICK_INTERVAL;

  if (state.player.hp < state.player.maxHP) state.player.hp = Math.min(state.player.maxHP, state.player.hp + 1);
  if (state.player.maxMana > 0 && state.player.mana < state.player.maxMana) {
    state.player.mana = Math.min(state.player.maxMana, state.player.mana + 1);
  }

  const logs = [];
  const activeDots = [];
  let dotDamage = 0;

  for (const dot of state.mob.dots) {
    if (dot.ticksRemaining > 0) {
      dotDamage += dot.damagePerTick;
      logs.push({
        time: state.time,
        text: `${dot.name} hits ${state.mob.name} for ${dot.damagePerTick} points of damage.`,
        type: "spell_dmg",
      });
      activeDots.push({ ...dot, ticksRemaining: dot.ticksRemaining - 1 });
    } else {
      logs.push({ time: state.time, text: `${dot.name} has worn off ${state.mob.name}.`, type: "system" });
    }
  }

  state.mob.hp -= dotDamage;
  state.mob.dots = activeDots;

  const manaText = state.player.maxMana > 0
    ? `  Mana: ${Math.max(0, state.player.mana)}/${state.player.maxMana}`
    : "";
  logs.push({
    time: state.time,
    text: `-- tick -- HP: ${Math.max(0, state.player.hp)}/${state.player.maxHP}${manaText} --`,
    type: "tick",
  });

  pushLogs(state, logs);
}

function resolveCasting(state) {
  if (!state.player.casting || state.time < state.player.casting.endTime) return;

  const spell = state.player.casting.spell;
  state.player.casting = null;
  const logs = [];

  if (spell.type === "dd" || spell.type === "dd_heal") {
    const damage = spell.damage + rand(-2, 4);
    state.mob.hp -= damage;
    logs.push({
      time: state.time,
      text: `You cast ${spell.name}. ${capFirst(state.mob.name)} takes ${damage} points of damage.`,
      type: "spell_dmg",
    });
    if (spell.heal) {
      const heal = spell.heal + rand(-2, 3);
      state.player.hp = Math.min(state.player.maxHP, state.player.hp + heal);
      logs.push({ time: state.time, text: `You have been healed for ${heal} points.`, type: "heal" });
    }
  } else if (spell.type === "dot") {
    state.mob.dots.push({ name: spell.name, damagePerTick: spell.damagePerTick, ticksRemaining: spell.duration });
    logs.push({ time: state.time, text: `You cast ${spell.name} on ${state.mob.name}.`, type: "spell_dmg" });
  } else if (spell.type === "heal") {
    const heal = spell.heal + rand(-3, 5);
    state.player.hp = Math.min(state.player.maxHP, state.player.hp + heal);
    logs.push({
      time: state.time,
      text: `You cast ${spell.name}. You have been healed for ${heal} points.`,
      type: "heal",
    });
  } else if (spell.type === "buff") {
    state.player.ac += spell.buff.ac || 0;
    state.player.buffs.push({ name: spell.name, ...spell.buff, expiresAt: state.time + spell.buff.duration * 1000 });
    logs.push({ time: state.time, text: `You cast ${spell.name}.`, type: "buff" });
  }

  state.player.spellCooldowns[spell.name] = state.time + spell.recast * 1000;
  pushLogs(state, logs);
}

function resolvePlayerAutoAttack(state, dt) {
  if (state.player.casting) return;
  if (state.player.nextSwing > 0) {
    state.player.nextSwing -= dt;
    return;
  }
  if (state.mob.hp <= 0) return;

  const weapon = state.player.weapon;
  const hitChance = calcHitChance(
    state.player.skills.offense,
    state.player.stats.STR,
    state.mob.ac,
    state.player.level - state.mob.level
  );
  const logs = [];

  if (Math.random() < hitChance) {
    const damageBonus = calcDamageBonus(state.player.level);
    let damage = rollDamage(weapon.damage, damageBonus, true);
    const isCrit = state.player.className === "Warrior" && state.player.level >= 12 && Math.random() < 0.05;

    if (isCrit) {
      damage = Math.floor(damage * 1.7);
      logs.push({ time: state.time, text: `You score a critical hit! (${damage})`, type: "crit" });
    }

    state.mob.hp -= damage;
    logs.push({
      time: state.time,
      text: `You ${WEAPON_TYPES[weapon.type].verb} ${state.mob.name} for ${damage} points of damage.`,
      type: isCrit ? "crit" : "player_hit",
    });

    if (weapon.proc && Math.random() < weapon.proc.chance) {
      state.mob.hp -= weapon.proc.damage;
      logs.push({ time: state.time, text: `Your ${weapon.name} begins to glow.`, type: "proc" });
      logs.push({
        time: state.time,
        text: `${capFirst(state.mob.name)} was hit by ${weapon.proc.name} for ${weapon.proc.damage} points of damage.`,
        type: "proc",
      });
    }

    if (state.player.skills.doubleAttack && Math.random() < state.player.skills.doubleAttack / 200) {
      const secondDamage = rollDamage(weapon.damage, damageBonus, true);
      state.mob.hp -= secondDamage;
      logs.push({ time: state.time, text: "You score a double attack!", type: "player_hit" });
      logs.push({
        time: state.time,
        text: `You ${WEAPON_TYPES[weapon.type].verb} ${state.mob.name} for ${secondDamage} points of damage.`,
        type: "player_hit",
      });
    }
  } else {
    logs.push({
      time: state.time,
      text: `You try to ${WEAPON_TYPES[weapon.type].verb} ${state.mob.name}, but miss!`,
      type: "miss",
    });
  }

  state.player.nextSwing = weapon.delay * 100;
  pushLogs(state, logs);
}

function resolveMobAutoAttack(state, dt) {
  if (state.mob.nextSwing > 0) {
    state.mob.nextSwing -= dt;
    return;
  }
  if (state.mob.hp <= 0 || state.mob.fleeing) return;

  const hitChance = calcHitChance(state.mob.level * 5, 0, state.player.ac, state.mob.level - state.player.level);
  const logs = [];
  let defended = false;

  if (state.player.skills.defense > 20 && Math.random() < 0.06) {
    logs.push({ time: state.time, text: "You dodge the attack!", type: "defend" });
    defended = true;
  } else if (state.player.shield && Math.random() < 0.08) {
    logs.push({ time: state.time, text: "You block with your shield!", type: "defend" });
    defended = true;
  } else if (Math.random() < 0.04) {
    logs.push({ time: state.time, text: "You parry the attack!", type: "defend" });
    defended = true;
  }

  if (!defended) {
    if (Math.random() < hitChance) {
      const damage = rand(state.mob.minDmg, state.mob.maxDmg);
      state.player.hp -= damage;
      logs.push({
        time: state.time,
        text: `${capFirst(state.mob.name)} ${state.mob.attackVerb} YOU for ${damage} points of damage.`,
        type: damage > state.mob.maxDmg * 0.7 ? "mob_crit" : "mob_hit",
      });

      if (state.player.casting) {
        const channelChance = 0.15;
        if (Math.random() > channelChance) {
          state.player.casting = null;
          logs.push({ time: state.time, text: "Your spell is interrupted.", type: "interrupt" });
        } else {
          logs.push({
            time: state.time,
            text: "You regain your concentration and continue your casting.",
            type: "channel",
          });
        }
      }
    } else {
      logs.push({
        time: state.time,
        text: `${capFirst(state.mob.name)} tries to ${attackAttemptVerb(state.mob.attackVerb)} YOU, but misses!`,
        type: "miss",
      });
    }
  }

  state.mob.nextSwing = state.mob.delay * 100;
  pushLogs(state, logs);
}

function resolveMobFlee(state) {
  if (state.mob.fleeing || state.mob.fleeAt <= 0 || state.mob.hp <= 0) return;
  if (state.mob.hp / state.mob.maxHP <= state.mob.fleeAt) {
    state.mob.fleeing = true;
    pushLogs(state, [{ time: state.time, text: `${capFirst(state.mob.name)} tries to flee.`, type: "mob_action" }]);
  }
}

function resolveOutcome(state) {
  if (state.outcome) return;

  if (state.mob.hp <= 0) {
    state.outcome = "victory";
    state.running = false;
    pushLogs(state, [
      { time: state.time, text: `You have slain ${state.mob.name}!`, type: "death" },
      {
        time: state.time,
        text: state.mob.level >= state.player.level - 3 ? "You gain experience!!" : "You gain experience!",
        type: "xp",
      },
    ]);
  } else if (state.player.hp <= 0) {
    state.outcome = "defeat";
    state.running = false;
    pushLogs(state, [
      { time: state.time, text: `You have been slain by ${state.mob.name}!`, type: "player_death" },
      { time: state.time, text: "LOADING, PLEASE WAIT...", type: "death_screen" },
    ]);
  }
}

function advanceCombat(state, dt) {
  if (!state.running || state.outcome) return state;

  const next = structuredClone(state);
  next.time += dt;
  next.tickAccum += dt;

  expireBuffs(next);
  while (next.tickAccum >= TICK_INTERVAL) resolveTick(next);
  resolveMobFlee(next);
  resolveCasting(next);
  resolvePlayerAutoAttack(next, dt);
  resolveMobAutoAttack(next, dt);
  resolveOutcome(next);

  next.player.hp = Math.max(0, next.player.hp);
  next.player.mana = Math.max(0, next.player.mana);
  next.mob.hp = Math.max(0, next.mob.hp);
  return next;
}

function useAbility(name) {
  const combat = appState.combat;
  if (!combat || !combat.running || combat.outcome) return;

  const cooldownEnd = combat.player.abilityCooldowns[name] || 0;
  if (combat.time < cooldownEnd) return;

  const next = structuredClone(combat);
  const logs = [];
  const cooldown = 6000;

  if (name === "kick" && next.player.skills.kick) {
    const damage = rand(1, Math.max(1, Math.floor(next.player.level * 0.8)));
    next.mob.hp -= damage;
    logs.push({ time: next.time, text: `You kick ${next.mob.name} for ${damage} points of damage!`, type: "player_hit" });
  } else if (name === "bash" && next.player.skills.bash && next.player.shield) {
    const damage = rand(1, Math.max(1, Math.floor(next.player.level * 0.6)));
    const stunned = Math.random() < 0.25;
    next.mob.hp -= damage;
    logs.push({ time: next.time, text: `You bash ${next.mob.name} for ${damage} points of damage!`, type: "player_hit" });
    if (stunned) {
      next.mob.nextSwing += 2000;
      logs.push({ time: next.time, text: `${capFirst(next.mob.name)} is stunned!`, type: "player_hit" });
    }
  } else if (name === "taunt" && next.player.skills.taunt) {
    const success = Math.random() < 0.7;
    logs.push({
      time: next.time,
      text: success ? `You taunt ${next.mob.name}.` : "You have failed to taunt your target.",
      type: success ? "system" : "miss",
    });
  }

  next.player.abilityCooldowns[name] = next.time + cooldown;
  pushLogs(next, logs);
  resolveOutcome(next);
  appState.combat = next;
  syncLoop();
  render();
}

function castSpell(index) {
  const combat = appState.combat;
  if (!combat || !combat.running || combat.outcome || combat.player.casting) return;

  const spell = combat.player.spells[index];
  if (!spell) return;

  const cooldownEnd = combat.player.spellCooldowns[spell.name] || 0;
  if (combat.time < cooldownEnd) return;

  const next = structuredClone(combat);
  if (next.player.mana < spell.manaCost) {
    pushLogs(next, [{ time: next.time, text: `Insufficient mana to cast ${spell.name}!`, type: "system" }]);
    appState.combat = next;
    render();
    return;
  }

  if (Math.random() < 0.08) {
    next.player.mana -= Math.floor(spell.manaCost * 0.5);
    pushLogs(next, [{ time: next.time, text: `Your ${spell.name} spell fizzles!`, type: "interrupt" }]);
    appState.combat = next;
    render();
    return;
  }

  next.player.mana -= spell.manaCost;
  next.player.casting = { spell, startTime: next.time, endTime: next.time + spell.castTime * 1000 };
  pushLogs(next, [{ time: next.time, text: `You begin casting ${spell.name}.`, type: "system" }]);
  appState.combat = next;
  syncLoop();
  render();
}

function formatCooldown(currentTime, readyAt) {
  return Math.max(0, (readyAt - currentTime) / 1000).toFixed(1);
}

function startCombat() {
  appState.combat = createCombatState(appState.selectedPreset, appState.selectedMob);
  appState.screen = "combat";
  syncLoop();
  render();
}

function togglePause() {
  if (!appState.combat) return;
  appState.combat = { ...appState.combat, running: !appState.combat.running };
  syncLoop();
  render();
}

function restartCombat() {
  startCombat();
}

function backToSetup() {
  appState.screen = "setup";
  appState.combat = null;
  syncLoop();
  render();
}

function changeSpeed(speed) {
  appState.simSpeed = speed;
  if (appState.combat) appState.combat = { ...appState.combat, speed };
  syncLoop();
  render();
}

function syncLoop() {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
  if (!appState.combat || !appState.combat.running || appState.combat.outcome) return;

  intervalId = window.setInterval(() => {
    if (!appState.combat || !appState.combat.running || appState.combat.outcome) {
      syncLoop();
      return;
    }
    appState.combat = advanceCombat(appState.combat, SIM_INTERVAL * appState.combat.speed);
    render();
  }, SIM_INTERVAL);
}

function renderSetupScreen() {
  const presetCards = Object.entries(PRESETS).map(([id, preset]) => {
    const weapon = WEAPONS[preset.weapon];
    return `
      <button class="card ${appState.selectedPreset === id ? "active-card" : ""}" data-action="select-preset" data-id="${id}">
        <span class="card-title">${preset.name} - ${preset.race} ${preset.className}</span>
        <span class="card-subtitle">Lv ${preset.level}  HP ${preset.baseHP}${preset.baseMana > 0 ? `  Mana ${preset.baseMana}` : ""}</span>
        <span class="card-meta">${weapon.name}</span>
        <span class="card-meta">Skills: ${preset.abilities.join(", ")}${preset.spells.length ? ` + ${preset.spells.length} spells` : ""}</span>
        <span class="card-flavor">${weapon.lore}</span>
      </button>
    `;
  }).join("");

  const playerLevel = PRESETS[appState.selectedPreset].level;
  const mobCards = Object.entries(MOBS).map(([id, mob]) => `
    <button class="card ${appState.selectedMob === id ? "active-danger" : ""}" data-action="select-mob" data-id="${id}">
      <span class="card-title ${getConColor(playerLevel, mob.level)}">${mob.name} (Lv ${mob.level})</span>
      <span class="card-flavor">${mob.desc}</span>
      <span class="card-meta">HP ${mob.maxHP}  AC ${mob.ac}  Dmg ${mob.minDmg}-${mob.maxDmg}</span>
    </button>
  `).join("");

  const speedButtons = [0.5, 1, 2, 5].map((speed) => `
    <button class="pill ${appState.simSpeed === speed ? "pill-active" : ""}" data-action="speed" data-speed="${speed}">
      ${speed}x
    </button>
  `).join("");

  return `
    <main class="shell">
      <section class="hero">
        <h1>PocketQuest</h1>
        <p>Combat Simulator Vertical Slice</p>
      </section>
      <section class="grid two-up">
        <div class="panel">
          <div class="panel-head"><h2>Choose Your Class</h2></div>
          <div class="stack">${presetCards}</div>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Choose Your Foe</h2></div>
          <div class="stack">${mobCards}</div>
        </div>
      </section>
      <section class="panel controls-panel">
        <div class="speed-row">
          <span class="label">Sim Speed</span>
          <div class="pill-row">${speedButtons}</div>
        </div>
        <button class="primary-button" data-action="start-combat">Engage</button>
      </section>
    </main>
  `;
}

function renderCombatScreen() {
  const combat = appState.combat;
  const player = combat.player;
  const mob = combat.mob;
  const hpPercent = Math.max(0, (player.hp / player.maxHP) * 100);
  const manaPercent = player.maxMana > 0 ? Math.max(0, (player.mana / player.maxMana) * 100) : 0;
  const mobHpPercent = Math.max(0, (mob.hp / mob.maxHP) * 100);
  const castPercent = player.casting
    ? Math.min(100, ((combat.time - player.casting.startTime) / (player.casting.endTime - player.casting.startTime)) * 100)
    : 0;

  const abilityButtons = player.abilities.map((ability) => {
    const cooldownEnd = player.abilityCooldowns[ability] || 0;
    const ready = combat.time >= cooldownEnd && !player.casting && combat.running && !combat.outcome;
    return `
      <button class="action-button ${ready ? "" : "disabled"}" data-action="ability" data-ability="${ability}" ${ready ? "" : "disabled"}>
        <span>${ability.toUpperCase()}</span>
        <span class="button-sub">${ready ? "READY" : `${formatCooldown(combat.time, cooldownEnd)}s`}</span>
      </button>
    `;
  }).join("");

  const spellButtons = player.spells.map((spell, index) => {
    const cooldownEnd = player.spellCooldowns[spell.name] || 0;
    const ready = combat.time >= cooldownEnd && !player.casting && player.mana >= spell.manaCost && combat.running && !combat.outcome;
    return `
      <button class="action-button spell-button ${ready ? "" : "disabled"}" data-action="spell" data-index="${index}" ${ready ? "" : "disabled"}>
        <span>${spell.name}</span>
        <span class="button-sub">${spell.manaCost}m / ${spell.castTime}s${ready ? "" : ` / ${formatCooldown(combat.time, cooldownEnd)}s`}</span>
      </button>
    `;
  }).join("");

  const speedButtons = [0.5, 1, 2, 5].map((speed) => `
    <button class="pill ${combat.speed === speed ? "pill-active" : ""}" data-action="speed" data-speed="${speed}">
      ${speed}x
    </button>
  `).join("");

  const logLines = combat.log.map((entry) => {
    const colorClass = LOG_COLORS[entry.type] || "log-system";
    if (entry.type === "tick") {
      return `<div class="log-line ${colorClass} tick-line">${entry.text}</div>`;
    }
    return `<div class="log-line ${colorClass}"><span class="time-stamp">[${(entry.time / 1000).toFixed(1)}s]</span> ${entry.text}</div>`;
  }).join("");

  return `
    <main class="shell combat-shell">
      <section class="panel combat-header">
        <div>
          <div class="header-name">${player.name}</div>
          <div class="header-sub">${player.race} ${player.className} Lv ${player.level}</div>
        </div>
        <div class="header-center">${(combat.time / 1000).toFixed(1)}s</div>
        <div class="header-right">
          <div class="header-name ${getConColor(player.level, mob.level)}">${mob.name}</div>
          <div class="header-sub">Level ${mob.level}</div>
        </div>
      </section>

      <section class="panel status-panel">
        <div class="status-column">
          <div class="meter">
            <div class="meter-fill hp-fill" style="width:${hpPercent}%"></div>
            <span>${Math.max(0, player.hp)} / ${player.maxHP}</span>
          </div>
          ${player.maxMana > 0 ? `
            <div class="meter compact">
              <div class="meter-fill mana-fill" style="width:${manaPercent}%"></div>
              <span>${Math.max(0, player.mana)} / ${player.maxMana}</span>
            </div>
          ` : ""}
          ${player.casting ? `
            <div class="meter compact">
              <div class="meter-fill cast-fill" style="width:${castPercent}%"></div>
              <span>Casting: ${player.casting.spell.name}</span>
            </div>
          ` : ""}
        </div>
        <div class="status-column">
          <div class="meter">
            <div class="meter-fill enemy-fill" style="width:${mobHpPercent}%"></div>
            <span>${Math.max(0, mob.hp)} / ${mob.maxHP}</span>
          </div>
          <div class="mob-detail">${mob.desc}</div>
        </div>
      </section>

      <section class="panel log-panel" id="log-panel">${logLines}</section>

      <section class="panel action-panel">
        <div class="action-group">
          <div class="group-label">Abilities</div>
          <div class="button-grid">${abilityButtons || `<span class="empty-state">None</span>`}</div>
        </div>
        ${player.spells.length ? `
          <div class="action-group">
            <div class="group-label">Spells</div>
            <div class="button-grid">${spellButtons}</div>
          </div>
        ` : ""}
      </section>

      <section class="panel bottom-controls">
        <button class="secondary-button" data-action="pause">${combat.running ? "Pause" : "Resume"}</button>
        <div class="pill-row">${speedButtons}</div>
        <button class="secondary-button" data-action="back">Back</button>
        ${combat.outcome ? `<button class="primary-button inline-button" data-action="restart">Again</button>` : ""}
      </section>
    </main>
  `;
}

function render() {
  root.innerHTML = appState.screen === "setup" ? renderSetupScreen() : renderCombatScreen();
  bindActionButtons();
  const logPanel = document.querySelector("#log-panel");
  if (logPanel) logPanel.scrollTop = logPanel.scrollHeight;
}

function handleAction(button) {
  const action = button.dataset.action;
  if (action === "select-preset") {
    appState.selectedPreset = button.dataset.id;
    render();
  } else if (action === "select-mob") {
    appState.selectedMob = button.dataset.id;
    render();
  } else if (action === "speed") {
    changeSpeed(Number(button.dataset.speed));
  } else if (action === "start-combat") {
    startCombat();
  } else if (action === "ability") {
    useAbility(button.dataset.ability);
  } else if (action === "spell") {
    castSpell(Number(button.dataset.index));
  } else if (action === "pause") {
    togglePause();
  } else if (action === "back") {
    backToSetup();
  } else if (action === "restart") {
    restartCombat();
  }
}

function bindActionButtons() {
  const actionButtons = root.querySelectorAll("[data-action]");
  for (const button of actionButtons) {
    button.onpointerdown = (event) => {
      event.preventDefault();
      handleAction(button);
    };
    button.onclick = (event) => {
      event.preventDefault();
    };
  }
}

render();
