const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const dshRoot = process.env.DSH_ROOT || 'D:\\DSH';
const ORIGINAL = process.env.DSH_ASAR || path.join(dshRoot, 'resources', 'app.asar');
const PATCHED_MAIN = path.join(__dirname, 'main.patched.js');
const OUTPUT = path.join(__dirname, 'app.asar.patched');

function readHeader(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const head = Buffer.alloc(16);
  fs.readSync(fd, head, 0, 16, 0);
  const jsonLen = head.readUInt32LE(4);
  const raw = Buffer.alloc(jsonLen);
  fs.readSync(fd, raw, 0, jsonLen, 16);
  fs.closeSync(fd);
  let header = null;
  for (let trim = 0; trim < 16 && !header; trim += 1) {
    try {
      header = JSON.parse(raw.subarray(0, jsonLen - trim).toString('utf8'));
    } catch {
      header = null;
    }
  }
  if (!header) throw new Error('cannot parse asar header');
  return { header, dataStart: 8 + jsonLen };
}

function walk(node, prefix, visit) {
  for (const key of Object.keys(node.files)) {
    const entry = node.files[key];
    const full = prefix ? prefix + '/' + key : key;
    if (entry.files) {
      walk(entry, full, visit);
    } else {
      visit(entry, full);
    }
  }
}

const { header, dataStart } = readHeader(ORIGINAL);
const source = fs.readFileSync(ORIGINAL);
const patchedMain = fs.readFileSync(PATCHED_MAIN);

const originalInfo = new Map();
walk(header, '', (entry, full) => {
  originalInfo.set(full, {
    offset: entry.offset === undefined ? null : Number(entry.offset),
    size: entry.size,
    unpacked: entry.unpacked === true,
    link: entry.link !== undefined,
  });
});

const next = JSON.parse(JSON.stringify(header));

let cursor = 0;
let copied = 0;
let patchedAt = null;
walk(next, '', (entry, full) => {
  if (entry.link !== undefined) return;
  if (entry.unpacked === true) return;
  const original = originalInfo.get(full);
  if (!original) throw new Error('missing original entry ' + full);
  entry.offset = String(cursor);
  if (full === 'lib/main.js') {
    patchedAt = cursor;
    entry.size = patchedMain.length;
    delete entry.integrity;
  } else {
    entry.size = original.size;
  }
  cursor += entry.size;
  copied += 1;
});
if (patchedAt === null) throw new Error('lib/main.js not found in tree');

const json = Buffer.from(JSON.stringify(next), 'utf8');
const padded = (json.length + 3) & ~3;
const headerSize = padded;
const dataStartOut = 16 + headerSize;

const out = fs.openSync(OUTPUT, 'w');
const prefix = Buffer.alloc(16);
prefix.writeUInt32LE(4, 0);
prefix.writeUInt32LE(headerSize + 8, 4);
prefix.writeUInt32LE(headerSize + 4, 8);
prefix.writeUInt32LE(headerSize, 12);
fs.writeSync(out, prefix, 0, 16);
fs.writeSync(out, json, 0, json.length);
if (padded > json.length) {
  fs.writeSync(out, Buffer.alloc(padded - json.length, 0x20), 0, padded - json.length);
}

walk(next, '', (entry, full) => {
  if (entry.link !== undefined) return;
  if (entry.unpacked === true) return;
  const original = originalInfo.get(full);
  const targetOffset = Number(entry.offset);
  if (full === 'lib/main.js') {
    fs.writeSync(out, patchedMain, 0, patchedMain.length, dataStartOut + targetOffset);
    return;
  }
  const start = dataStart + original.offset;
  const length = original.size;
  let written = 0;
  const chunkSize = 4 * 1024 * 1024;
  while (written < length) {
    const take = Math.min(chunkSize, length - written);
    fs.writeSync(out, source, start + written, take, dataStartOut + targetOffset + written);
    written += take;
  }
});
fs.closeSync(out);

console.log('header bytes', json.length, 'padded', padded);
console.log('data start', dataStartOut, 'files', copied);
console.log('output size', fs.statSync(OUTPUT).size);
console.log('patched main offset', patchedAt);

// --- verification -------------------------------------------------------
const check = readHeader(OUTPUT);
const checkSource = fs.readFileSync(OUTPUT);
const checkInfo = new Map();
walk(check.header, '', (entry, full) => {
  checkInfo.set(full, {
    offset: entry.offset === undefined ? null : Number(entry.offset),
    size: entry.size,
    unpacked: entry.unpacked === true,
    link: entry.link !== undefined,
  });
});

if (checkInfo.size !== originalInfo.size) throw new Error('entry count changed');
for (const [full, original] of originalInfo) {
  const got = checkInfo.get(full);
  if (!got) throw new Error('missing entry in output ' + full);
  if (original.unpacked !== got.unpacked || original.link !== got.link) {
    throw new Error('entry flags changed ' + full);
  }
  if (!original.unpacked && !original.link) {
    const expected = full === 'lib/main.js' ? patchedMain.length : original.size;
    if (got.size !== expected) throw new Error('bad size ' + full + ' ' + got.size + ' != ' + expected);
  }
}

// extract patched main back out
const mainEntry = checkInfo.get('lib/main.js');
const mainBack = Buffer.alloc(mainEntry.size);
fs.readSync(fs.openSync(OUTPUT, 'r'), mainBack, 0, mainEntry.size, check.dataStart + mainEntry.offset);
if (!mainBack.equals(patchedMain)) throw new Error('patched main round-trip mismatch');
console.log('main.js round-trip OK', mainBack.length);

// hash a sample of unchanged files
const samples = [];
for (const [full, info] of originalInfo) {
  if (info.unpacked || info.link || full === 'lib/main.js' || info.size === 0) continue;
  samples.push(full);
  if (samples.length >= 12) break;
}
for (const full of samples) {
  const original = originalInfo.get(full);
  const got = checkInfo.get(full);
  const a = Buffer.alloc(original.size);
  const b = Buffer.alloc(got.size);
  const fdA = fs.openSync(ORIGINAL, 'r');
  fs.readSync(fdA, a, 0, a.length, dataStart + original.offset);
  fs.closeSync(fdA);
  const fdB = fs.openSync(OUTPUT, 'r');
  fs.readSync(fdB, b, 0, b.length, check.dataStart + got.offset);
  fs.closeSync(fdB);
  const hashA = crypto.createHash('sha256').update(a).digest('hex');
  const hashB = crypto.createHash('sha256').update(b).digest('hex');
  if (hashA !== hashB) throw new Error('sample mismatch ' + full);
}
console.log('sample hashes OK', samples.length);
console.log('output sha256', crypto.createHash('sha256').update(checkSource).digest('hex'));
