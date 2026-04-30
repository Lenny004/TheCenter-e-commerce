const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const outputPath = path.resolve(__dirname, '..', 'src', 'environments', 'environment.ts');

function parseEnv(content) {
  const result = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      continue;
    }
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

let apiUrl = '/api';
let apiDirectBase = '';
if (fs.existsSync(envPath)) {
  const parsed = parseEnv(fs.readFileSync(envPath, 'utf8'));
  if (parsed.API_URL) {
    apiUrl = parsed.API_URL;
  }
  if (parsed.API_DIRECT_BASE) {
    apiDirectBase = parsed.API_DIRECT_BASE;
  }
}

const safeApiUrl = apiUrl.replace(/'/g, "\\'");
const safeApiDirectBase = apiDirectBase.replace(/'/g, "\\'");
const output = `export const environment = {\n  apiUrl: '${safeApiUrl}',\n  apiDirectBase: '${safeApiDirectBase}'\n};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, 'utf8');
