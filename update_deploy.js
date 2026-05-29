const fs = require('fs');
const path = require('path');

const projectsDir = '/home/giuseppe/Documenti/projects';

function findPackageJsons(dir, depth) {
  if (depth < 0) return [];
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file === 'node_modules' || file.startsWith('.')) continue;
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(findPackageJsons(filePath, depth - 1));
      } else if (file === 'package.json') {
        results.push(filePath);
      }
    }
  } catch (e) {
    // ignore
  }
  return results;
}

const packageJsons = findPackageJsons(projectsDir, 2); // Depth 2 should find projects/app/package.json
let updatedCount = 0;

for (const pkgPath of packageJsons) {
  try {
    const content = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(content);
    
    const hasAngular = (pkg.dependencies && pkg.dependencies['@angular/core']) || (pkg.devDependencies && pkg.devDependencies['@angular/core']);
    const hasIonic = (pkg.dependencies && pkg.dependencies['@ionic/angular']) || (pkg.devDependencies && pkg.devDependencies['@ionic/angular']);
    
    if (hasAngular || hasIonic) {
      pkg.scripts = pkg.scripts || {};
      if (pkg.scripts.deploy !== "ng test --watch=false && ionic build --prod && firebase deploy") {
        pkg.scripts.deploy = "ng test --watch=false && ionic build --prod && firebase deploy";
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
        console.log('Updated: ' + pkgPath);
        updatedCount++;
      }
    }
  } catch(e) {
    console.error('Error with ' + pkgPath, e.message);
  }
}

console.log('Total updated: ' + updatedCount);
