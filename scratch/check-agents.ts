import { getCases } from "../src/lib/google-sheets";

async function checkAgents() {
  try {
    const cases = await getCases();
    const agents = Array.from(new Set(cases.map(c => c.analistaOperacionesTecnicas))).filter(Boolean);
    console.log("--- AGENTES ENCONTRADOS ---");
    agents.forEach(a => console.log(`- ${a}`));
    console.log("---------------------------");
  } catch (e) {
    console.error(e);
  }
}

checkAgents();
