const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function runCommand(command) {
  try {
    console.log(`\n> Esecuzione: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`\n[ERRORE] Il comando ha fallito: ${command}`);
    return false;
  }
}

async function main() {
  console.log("=== INIZIO WORKFLOW DI DEPLOY E AUTO-COMMIT UTENTE ===");

  // 1. Esecuzione test, build e deploy firebase
  console.log("\nAvvio dei test, compilazione e deploy su Firebase...");
  const deploySuccess = runCommand("ng test --watch=false && ionic build --prod && firebase deploy");
  if (!deploySuccess) {
    console.log("\n[ABORTITO] Il deploy è fallito. Interruzione del workflow.");
    rl.close();
    process.exit(1);
  }

  console.log("\n[OK] Deploy completato con successo!");

  // 2. Controllo modifiche git
  console.log("\nAnalisi dello stato di Git...");
  let status = "";
  try {
    status = execSync("git status --porcelain").toString().trim();
  } catch (err) {
    console.error("Impossibile leggere lo stato di Git:", err);
    rl.close();
    process.exit(1);
  }

  if (!status) {
    console.log("Nessuna modifica pendente rilevata in Git. Workflow completato.");
    rl.close();
    process.exit(0);
  }

  const lines = status.split("\n").map(line => line.trim());
  const modifiedFiles = lines.map(line => {
    const parts = line.split(/\s+/);
    return {
      status: parts[0],
      file: parts.slice(1).join(" ")
    };
  });

  console.log(`Trovati ${modifiedFiles.length} file modificati/non tracciati.`);

  // 3. Commit del Changelog (se modificato)
  const changelogFile = modifiedFiles.find(f => f.file.includes("changelog.page.html"));
  if (changelogFile) {
    console.log("\nRilevate modifiche al Changelog. Eseguo commit separato...");
    runCommand("git add src/app/pages/changelog/changelog.page.html");
    runCommand('git commit -m "docs(changelog): update changelog for the latest release"');
  }

  // 4. Commit del Codice
  // Ricalcola lo status dopo il commit del changelog
  const remainingStatus = execSync("git status --porcelain").toString().trim();
  if (remainingStatus) {
    rl.question("\nInserisci il messaggio di commit per il codice modificato (invio per usare il default): ", (commitMsg) => {
      if (!commitMsg.trim()) {
        commitMsg = "feat(code): update application components and styles";
      }
      console.log(`Uso il messaggio di commit: "${commitMsg}"`);

      runCommand("git add .");
      runCommand(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);

      console.log("\nEseguo il push delle modifiche sul repository remoto...");
      runCommand("git push");

      console.log("\n=== WORKFLOW COMPLETATO CON SUCCESSO! ===");
      rl.close();
      process.exit(0);
    });
  } else {
    console.log("\nNessuna altra modifica al codice da committare.");
    console.log("=== WORKFLOW COMPLETATO CON SUCCESSO! ===");
    rl.close();
    process.exit(0);
  }
}

main().catch(err => {
  console.error("Errore imprevisto nel workflow:", err);
  rl.close();
  process.exit(1);
});
