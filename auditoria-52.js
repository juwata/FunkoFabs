const { execSync } = require('child_process');
const fs = require('fs');

// Configuração do Protocolo 5.2
const PAGES = [
  { name: 'Página Principal', url: 'http://127.0.0.1:5500/index.html' },
  { name: 'Página Interna (Checkout)', url: 'http://127.0.0.1:5500/pages/finalize-info.html' }
];

const RUNS = 3;
const TEMP_REPORT = './temp-report.json';
const FINAL_REPORT = './lighthouse-report.md';

function getMedian(values) {
    if (values.length === 0) return 0;
    values.sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half];
    return (values[half - 1] + values[half]) / 2.0;
}

let markdownOutput = `# Relatório Lighthouse - Protocolo 5.2\n\n`;
markdownOutput += `* **Categoria:** Acessibilidade\n`;
markdownOutput += `* **Dispositivo:** Desktop\n`;
markdownOutput += `* **Condições:** Chrome Anônimo, 3 execuções (mediana)\n\n`;

console.log('Iniciando auditoria (Protocolo 5.2)... Isso pode levar alguns minutos.\n');

for (const page of PAGES) {
    console.log(`Auditando: ${page.name} (${page.url})`);
    markdownOutput += `## ${page.name}\n**URL:** ${page.url}\n\n`;
    markdownOutput += `| Execução | Data/Hora | Score de Acessibilidade |\n`;
    markdownOutput += `| :--- | :--- | :---: |\n`;

    let scores = [];

    for (let i = 1; i <= RUNS; i++) {
        console.log(`  -> Execução ${i} de ${RUNS}...`);
        
        // CORREÇÃO: Utilizando lighthouse@11 para manter compatibilidade com Node.js v18.14.0
        const command = `npx lighthouse@11 ${page.url} ` +
            `--only-categories=accessibility ` +
            `--preset=desktop ` +
            `--chrome-flags="--incognito" ` +
            `--output=json ` +
            `--output-path=${TEMP_REPORT} ` +
            `--quiet`;

        try {
            execSync(command, { stdio: 'inherit' });
            
            const reportData = JSON.parse(fs.readFileSync(TEMP_REPORT, 'utf8'));
            const score = reportData.categories.accessibility.score * 100;
            const fetchTime = new Date(reportData.fetchTime).toLocaleString('pt-BR');
            
            scores.push(score);
            
            markdownOutput += `| #${i} | ${fetchTime} | **${score}** |\n`;
        } catch (error) {
            console.error(`\n❌ ERRO FATAL na execução ${i} para ${page.name}:`);
            console.error(error.message);
            console.error(`Verifique os logs acima para entender o motivo.\n`);
        }
    }

    const medianScore = getMedian(scores);
    markdownOutput += `\n**🏆 Score Mediano Considerado: ${medianScore}**\n\n---\n\n`;
    console.log(`✔ Mediana concluída: ${medianScore}\n`);
}

if (fs.existsSync(TEMP_REPORT)) {
    fs.unlinkSync(TEMP_REPORT);
}

fs.writeFileSync(FINAL_REPORT, markdownOutput);
console.log(`🚀 Relatório gerado com sucesso em: ${FINAL_REPORT}`);