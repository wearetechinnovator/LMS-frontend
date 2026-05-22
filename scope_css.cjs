const fs = require('fs');
let css = fs.readFileSync('src/assets/custom.css', 'utf8');

const sections = [
  { marker: '/* ============== AUTH FORM =========== */', scope: '.auth-form-scope' },
  { marker: '/* ============== AUTH PAGE =========== */', scope: '.auth-page-scope' },
  { marker: '/* ========== ONBOARDING PAGE ========= */', scope: '.onboarding-page-scope' },
  { marker: '/* ======= COMPANY PROFILE PAGE ======= */', scope: '.company-profile-scope' },
  { marker: '/* ==== Initial Configuration PAGE ==== */', scope: '.initial-config-scope' },
  { marker: '/* ========== DASHBOARD PAGE ========== */', scope: '.dashboard-page-scope' }
];

let result = '';
let parts = css.split(/(?=\/\* ==================================== \*\/\n\/\* ======)/);

for (let part of parts) {
  let matchedScope = null;
  for (let s of sections) {
    if (part.includes(s.marker)) {
      matchedScope = s.scope;
      break;
    }
  }

  if (matchedScope) {
    // Extract root and reference
    let rootBlocks = [];
    part = part.replace(/:root\s*\{[\s\S]*?\}/g, (match) => {
      rootBlocks.push(match);
      return '';
    });

    let refBlocks = [];
    part = part.replace(/@reference\s+[^;]+;/g, (match) => {
      refBlocks.push(match);
      return '';
    });
    
    // Extract the header comments to put them outside the scope
    let headerComments = [];
    part = part.replace(/\/\* ==================================== \*\/\n\/\* .*? \*\/\n\/\* ==================================== \*\//g, (match) => {
      headerComments.push(match);
      return '';
    });

    // Output header
    if (headerComments.length > 0) result += headerComments.join('\n') + '\n';
    
    // Output refs
    if (refBlocks.length > 0) result += refBlocks.join('\n') + '\n\n';
    
    // Output root
    if (rootBlocks.length > 0) result += rootBlocks.join('\n\n') + '\n\n';

    // Wrap remaining content
    result += `${matchedScope} {\n`;
    let contentLines = part.split('\n');
    for (let line of contentLines) {
      if (line.trim() !== '') {
        result += `  ${line}\n`;
      } else {
        result += '\n';
      }
    }
    result += `}\n\n`;
  } else {
    result += part;
  }
}

fs.writeFileSync('src/assets/custom.css', result);
console.log('CSS scoping applied successfully.');
