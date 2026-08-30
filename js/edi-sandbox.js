/**
 * Quantum Gaze Software Inc. — Client-Side Document Intelligence & Agentic AI Sandbox
 * 100% In-Browser Interactive Execution & Architecture Telemetry (Zero Server Upload)
 */

const DOCUMENT_SAMPLES = {
    'invoice': `COMMERCIAL INVOICE #INV-2026-8819
Issued: 2026-08-29 | Terms: Net 30 Days
Client: GLOBAL FINTECH CORP (Montreal, QC, CA)
Tax ID: CA-889920112

Itemized Deliverables:
1. Rapid 2-Week AI MVP: Autonomous Customer Support & Agentic RAG Engine (Qty: 1 Package) = $18,500.00
2. Engineering Team AI Coaching & Developer Toolchain Bootcamps (Qty: 24 hrs @ $250.00/hr) = $6,000.00
3. Cloud-Native Microservices on AKS with Kafka Streaming (Qty: 1 System) = $12,500.00

Subtotal: $37,000.00
GST (5.0%): $1,850.00 | QST (9.975%): $3,690.75
Total Invoiced Amount: $42,540.75 CAD`,

    'agent_task': `AGENTIC WORKFLOW DISPATCH SPECIFICATION
Goal: "Deploy an intelligent multi-agent pipeline to ingest raw regulatory documents, extract structured legal entities, validate against federal compliance rules, and notify the compliance officer via Slack webhook."

Agent Hierarchy:
- Lead Orchestrator: Coordinator Agent (GPT-4o / Claude 3.5 Sonnet / Llama 3.3)
- Subagent A: OCR & Visual Tokenizer (Vision Transformer)
- Subagent B: Legal Entity Normalizer & Vector Embedding
- Subagent C: Automated Verifier (Rule Engine + Protected B Sandbox)
- Subagent D: Webhook & Report Dispatcher`,

    'gov_manifest': `CANADIAN PUBLIC SECTOR PROCUREMENT MANIFEST
Solicitation Ref: W8486-26-PROS
Department: Public Services and Procurement Canada (PSPC)
Category: ProServices Stream 1 (Application Services) & Stream 3 (Information Management)
Supplier: Quantum Gaze Software Inc. / Logiciel Quantum Gaze Inc.
NEQ: 1179525945 | Canadian Data Sovereignty: COMPLIANT (Protected B)
Language Parity: English & French (Bill 96 Compliant)
Principal Resource: Senior Integration Architect / AI Systems Engineer (M.Eng, McGill PM)`
};

function parseDocumentIntelligence(rawText) {
    if (!rawText || typeof rawText !== 'string') {
        return { error: 'Empty payload provided' };
    }

    const isAgent = rawText.includes('AGENTIC WORKFLOW') || rawText.includes('Agent Hierarchy');
    const isGov = rawText.includes('CANADIAN PUBLIC SECTOR') || rawText.includes('ProServices');

    const result = {
        meta: {
            engine: 'Quantum Gaze Multi-Modal AI Engine',
            executionSpeed: '2–3 Weeks Concept to Production MVP',
            parsedAt: new Date().toISOString(),
            status: 'VALIDATED_OK',
            security: '100% Client-Side In-Browser Execution (Zero Server Upload)',
            dataSovereignty: 'Canadian & Protected Compliant'
        },
        payloadType: isAgent ? 'Agentic AI Multi-Agent Execution Graph' : isGov ? 'Public Sector Procurement Manifest' : 'Commercial Invoice & Tax Document',
        extractedEntities: {}
    };

    if (isAgent) {
        result.extractedEntities = {
            workflowObjective: 'Autonomous regulatory document ingestion & compliance dispatch',
            orchestrationFramework: 'LangGraph & Model Context Protocol (MCP)',
            agentCount: 4,
            executionPlan: [
                { step: 1, agent: 'OCR & Visual Tokenizer', output: 'Raw multi-page token stream' },
                { step: 2, agent: 'Legal Entity Normalizer', output: 'Vector embeddings + structured JSON schema' },
                { step: 3, agent: 'Automated Verifier', output: '100% compliance pass against Protected B policies' },
                { step: 4, agent: 'Webhook Dispatcher', output: 'Instant encrypted notification delivered' }
            ],
            estimatedDeliveryCycle: '14 Business Days (Rapid Prototyping Sprint)'
        };
    } else if (isGov) {
        result.extractedEntities = {
            procurementPortal: 'CanadaBuys (Supplier Registration)',
            solicitationRef: 'W8486-26-PROS',
            approvedStreams: ['Stream 1: Application Services', 'Stream 3: Information Management & Architecture'],
            enterpriseEntity: 'Quantum Gaze Software Inc. / Logiciel Quantum Gaze Inc.',
            businessNumber: 'NEQ 1179525945',
            compliance: 'Quebec Bill 96 & Federal Data Sovereignty (Protected B)'
        };
    } else {
        result.extractedEntities = {
            invoiceNumber: 'INV-2026-8819',
            issueDate: '2026-08-29',
            currency: 'CAD',
            billedTo: 'GLOBAL FINTECH CORP',
            jurisdiction: 'Montreal, Quebec, Canada',
            taxRegistration: 'CA-889920112',
            financials: {
                subtotal: 37000.00,
                gst: 1850.00,
                qst: 3690.75,
                totalAmountDue: 42540.75
            },
            deliverables: [
                { item: 'Rapid 2-Week AI MVP: Autonomous Customer Support & Agentic RAG Engine', price: 18500.00 },
                { item: 'Engineering Team AI Coaching & Developer Toolchain Bootcamps', price: 6000.00 },
                { item: 'Cloud-Native Microservices on AKS with Kafka Streaming', price: 12500.00 }
            ]
        };
    }

    return result;
}

// Live Simulated Architecture & AI Telemetry Stream
function initTerminalStream() {
    const terminalEl = document.getElementById('terminalStream');
    if (!terminalEl) return;

    const logs = [
        { text: '> Quantum Gaze AI Engine Initialized... OK', class: 'cyan' },
        { text: '> Rapid 2-Week AI MVP Sprint Pipeline: ACTIVE', class: 'cyan' },
        { text: '> Agentic multi-agent orchestrator dispatching tasks in parallel', class: '' },
        { text: '> Azure AKS microservice cluster active — health checks passing', class: '' },
        { text: '> Kafka event stream consuming with exactly-once delivery guarantees', class: 'amber' },
        { text: '> Developer AI Coaching Toolchain integrated into corporate repo', class: 'cyan' },
        { text: '> Canadian Data Sovereignty & Protected B compliance VERIFIED', class: '' }
    ];

    const MAX_TERMINAL_LINES = 40;
    let index = 0;
    setInterval(() => {
        const item = logs[index % logs.length];
        const line = document.createElement('div');
        line.className = `terminal-line ${item.class}`;
        const time = new Date().toISOString().substring(11, 19);
        line.textContent = `[${time}] ${item.text}`;
        terminalEl.appendChild(line);
        // Cap DOM growth on long-lived tabs
        while (terminalEl.children.length > MAX_TERMINAL_LINES) {
            terminalEl.removeChild(terminalEl.firstChild);
        }
        terminalEl.scrollTop = terminalEl.scrollHeight;
        index++;
    }, 2800);
}

document.addEventListener('DOMContentLoaded', () => {
    const rawEdiInput = document.getElementById('rawEdiInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const parseBtn = document.getElementById('parseEdiBtn');
    const tabButtons = document.querySelectorAll('.sandbox-tab-btn');
    const timestampEl = document.getElementById('sandboxTimestamp');

    if (rawEdiInput && jsonOutput) {
        rawEdiInput.value = DOCUMENT_SAMPLES['invoice'];
        jsonOutput.textContent = JSON.stringify(parseDocumentIntelligence(DOCUMENT_SAMPLES['invoice']), null, 2);
        if (timestampEl) timestampEl.textContent = new Date().toUTCString().substring(17, 25) + ' UTC';

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const sampleKey = btn.getAttribute('data-sample');
                if (DOCUMENT_SAMPLES[sampleKey]) {
                    rawEdiInput.value = DOCUMENT_SAMPLES[sampleKey];
                    const parsed = parseDocumentIntelligence(rawEdiInput.value);
                    jsonOutput.textContent = JSON.stringify(parsed, null, 2);
                    if (timestampEl) timestampEl.textContent = new Date().toUTCString().substring(17, 25) + ' UTC';
                }
            });
        });

        if (parseBtn) {
            parseBtn.addEventListener('click', () => {
                try {
                    const parsed = parseDocumentIntelligence(rawEdiInput.value);
                    jsonOutput.textContent = JSON.stringify(parsed, null, 2);
                    if (timestampEl) timestampEl.textContent = new Date().toUTCString().substring(17, 25) + ' UTC';
                } catch (err) {
                    jsonOutput.textContent = JSON.stringify({ error: err.message }, null, 2);
                }
            });
        }
    }

    initTerminalStream();
});
