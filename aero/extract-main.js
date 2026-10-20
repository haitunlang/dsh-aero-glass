const fs = require("fs");
const path = require("path");
const dshRoot = process.env.DSH_ROOT || "D:\\DSH";
const p = process.env.DSH_ASAR || path.join(dshRoot, "resources", "app.asar");
const fd = fs.openSync(p, "r");
const b = Buffer.alloc(16); fs.readSync(fd, b, 0, 16, 0);
const jsonLen = b.readUInt32LE(4);
const jb = Buffer.alloc(jsonLen); fs.readSync(fd, jb, 0, jsonLen, 16);
let hdr = null;
for (let trim = 0; trim < 16 && !hdr; trim++) { try { hdr = JSON.parse(jb.subarray(0, jsonLen - trim).toString("utf8")); } catch {} }
const dataStart = 8 + jsonLen;
function find(node, prefix, target) {
  for (const k of Object.keys(node.files)) {
    const v = node.files[k]; const key = prefix ? prefix + "/" + k : k;
    if (key === target) return v;
    if (v.files) { const r = find(v, key, target); if (r) return r; }
  }
  return null;
}
const it = find(hdr, "", "lib/main.js");
console.log("entry", it);
const buf = Buffer.alloc(it.size);
fs.readSync(fd, buf, 0, it.size, dataStart + Number(it.offset));
const outDir = __dirname;
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "main.orig.js"), buf);
fs.closeSync(fd);
console.log("saved", buf.length);
