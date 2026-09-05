/**
 * Quantum Gaze Software Inc. — Client-Side Document Intelligence & Agentic AI Sandbox
 * 100% In-Browser Interactive Execution & Architecture Telemetry (Zero Server Upload)
 *
 * Presets:
 *   customs_preflight — ClearanceGuard AI: Commercial Invoice × Bill of Lading × Packing List
 *                       deterministic cross-document reconciliation with visual discrepancy boxes
 *   invoice           — generic commercial invoice extraction
 *   agent_task        — agentic workflow dispatch specification
 *   gov_manifest      — public-sector procurement manifest
 *
 * Everything below runs on synthetic sample data in the visitor's browser. Nothing is uploaded.
 */

const DOCUMENT_SAMPLES = {
    'customs_preflight': `=== COMMERCIAL INVOICE ===
Invoice: INV-2026-8819A | Date: 2026-09-02 | Currency: USD | Incoterm: FOB Yantian
Supplier: Shenzhen Electronics Tech Co (CN)
Buyer: Montreal Advanced Robotics Inc (CA) | BN: 123456789RM0001
Line | Part | Description | HS Code | Qty | Unit Price | Line Total
1 | MC-8821 | Integrated processing microcontrollers | 8542.31.00.00 | 10000 PCE | 10.50 | 105,000.00
2 | PW-4410 | High voltage power transistors | 8541.29.00.00 | 4000 PCE | 5.00 | 20,000.00
3 | CB-1200 | Shielded copper cable assemblies | 8544.42.90.00 | 1200 PCE | 8.25 | 9,900.00
Invoice Total: 135,400.00 USD | Packages: 46 CTN | Gross Weight: 1,240.0 KG

=== BILL OF LADING ===
MBL: MBLX000123456 | Vessel: MV SYNTHETIC EXPRESS V.001E | POL: Yantian, CN | POD: Montréal, CA
Shipper: Shenzhen Electronics Tech Co | Consignee: Montreal Advanced Robotics Inc
Container: CSQU3054383 (40HC) | Packages: 46 CTN | Gross Weight: 1,240.0 KG
Declared Value: 135,400.00 CAD | Freight: PREPAID

=== PACKING LIST ===
Ref: PL-8819A | Cartons: 46
1 | MC-8821 | 10000 PCE | Net 620.0 KG
2 | PW-4410 | 3950 PCE | Net 210.5 KG
3 | CB-1200 | 1200 PCE | Net 380.0 KG
Total Net Weight: 1,210.5 KG`,

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
- Lead Orchestrator: Coordinator Agent (frontier LLM of choice)
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

/* ------------------------------------------------------------------------ */
/* Customs preflight — deterministic cross-document reconciliation            */
/* ------------------------------------------------------------------------ */

const PREFLIGHT_UI_TEXT = {
    en: { clear: 'No discrepancies detected — ready for specialist review', flagged: '{n} discrepanc{y} routed to human review', ok: 'match', ci: 'Commercial Invoice', bl: 'Bill of Lading', pl: 'Packing List' },
    fr: { clear: 'Aucune anomalie détectée — prêt pour la révision du spécialiste', flagged: '{n} anomalie{s} acheminée{s} vers la révision humaine', ok: 'concordance', ci: 'Facture commerciale', bl: 'Connaissement', pl: 'Liste de colisage' },
    de: { clear: 'Keine Abweichungen erkannt — bereit zur Fachprüfung', flagged: '{n} Abweichung{en} zur manuellen Prüfung weitergeleitet', ok: 'Übereinstimmung', ci: 'Handelsrechnung', bl: 'Konnossement', pl: 'Packliste' }
};

function preflightLang() {
    // The site's i18n runtime (js/translations.js) exposes getCurrentLanguage(); fall back to the
    // selector value, then <html lang>.
    let lang = '';
    try { if (typeof getCurrentLanguage === 'function') lang = getCurrentLanguage() || ''; } catch (e) { /* ignore */ }
    if (!lang) { const sel = document.getElementById('languageSelector'); if (sel && sel.value) lang = sel.value; }
    if (!lang) lang = document.documentElement.lang || 'en';
    lang = String(lang).slice(0, 2).toLowerCase();
    return PREFLIGHT_UI_TEXT[lang] ? lang : 'en';
}

function toNumber(str) {
    if (str === undefined || str === null) return NaN;
    return parseFloat(String(str).replace(/,/g, ''));
}

function money(n) {
    return (Math.round(n * 100) / 100).toFixed(2);
}

function splitPreflightDocuments(rawText) {
    const docs = { ci: '', bl: '', pl: '' };
    const parts = rawText.split(/^===\s*(.+?)\s*===\s*$/m);
    for (let i = 1; i < parts.length; i += 2) {
        const title = parts[i].toUpperCase();
        const body = (parts[i + 1] || '').trim();
        if (title.includes('INVOICE')) docs.ci = body;
        else if (title.includes('LADING') || title.includes('B/L') || title.includes('WAYBILL')) docs.bl = body;
        else if (title.includes('PACKING')) docs.pl = body;
    }
    return docs;
}

function parseInvoice(text) {
    const inv = { currency: null, lines: [], statedTotal: NaN, packages: NaN, grossKg: NaN, supplier: '', buyer: '', number: '' };
    const cur = text.match(/Currency:\s*([A-Z]{3})/i); if (cur) inv.currency = cur[1].toUpperCase();
    const num = text.match(/Invoice:\s*([A-Z0-9-]+)/i); if (num) inv.number = num[1];
    const sup = text.match(/Supplier:\s*([^(|\n]+)/i); if (sup) inv.supplier = sup[1].trim();
    const buy = text.match(/Buyer:\s*([^(|\n]+)/i); if (buy) inv.buyer = buy[1].trim();
    const tot = text.match(/Invoice Total:\s*([\d,]+\.?\d*)\s*([A-Z]{3})?/i);
    if (tot) { inv.statedTotal = toNumber(tot[1]); inv.totalCurrency = tot[2] ? tot[2].toUpperCase() : null; inv.totalText = tot[1]; }
    const pk = text.match(/Packages:\s*(\d+)/i); if (pk) inv.packages = parseInt(pk[1], 10);
    const gw = text.match(/Gross Weight:\s*([\d,]+\.?\d*)\s*KG/i); if (gw) inv.grossKg = toNumber(gw[1]);
    const lineRe = /^(\d+)\s*\|\s*([A-Z0-9-]+)\s*\|\s*(.+?)\s*\|\s*([\d.]+)\s*\|\s*([\d,]+)\s*([A-Z]{2,3})\s*\|\s*([\d,]+\.?\d*)\s*\|\s*([\d,]+\.?\d*)\s*$/gm;
    let m;
    while ((m = lineRe.exec(text)) !== null) {
        inv.lines.push({ line: parseInt(m[1], 10), part: m[2], description: m[3], hs: m[4], qty: toNumber(m[5]), qtyText: `${m[5]} ${m[6]}`, uom: m[6], unitPrice: toNumber(m[7]), lineTotal: toNumber(m[8]), lineTotalText: m[8] });
    }
    return inv;
}

function parseBillOfLading(text) {
    const bl = { packages: NaN, grossKg: NaN, declaredValue: NaN, declaredCurrency: null, shipper: '', consignee: '' };
    const pk = text.match(/Packages:\s*(\d+)/i); if (pk) bl.packages = parseInt(pk[1], 10);
    const gw = text.match(/Gross Weight:\s*([\d,]+\.?\d*)\s*KG/i); if (gw) bl.grossKg = toNumber(gw[1]);
    const dv = text.match(/Declared Value:\s*([\d,]+\.?\d*)\s*([A-Z]{3})/i);
    if (dv) { bl.declaredValue = toNumber(dv[1]); bl.declaredCurrency = dv[2].toUpperCase(); bl.declaredText = `${dv[1]} ${dv[2]}`; }
    const sh = text.match(/Shipper:\s*([^|\n]+)/i); if (sh) bl.shipper = sh[1].trim();
    const cn = text.match(/Consignee:\s*([^|\n]+)/i); if (cn) bl.consignee = cn[1].trim();
    return bl;
}

function parsePackingList(text) {
    const pl = { cartons: NaN, lines: [], statedNetKg: NaN };
    const ct = text.match(/Cartons:\s*(\d+)/i); if (ct) pl.cartons = parseInt(ct[1], 10);
    const nt = text.match(/Total Net Weight:\s*([\d,]+\.?\d*)\s*KG/i); if (nt) pl.statedNetKg = toNumber(nt[1]);
    const lineRe = /^(\d+)\s*\|\s*([A-Z0-9-]+)\s*\|\s*([\d,]+)\s*([A-Z]{2,3})\s*\|\s*Net\s*([\d,]+\.?\d*)\s*KG/gim;
    let m;
    while ((m = lineRe.exec(text)) !== null) {
        pl.lines.push({ line: parseInt(m[1], 10), part: m[2], qty: toNumber(m[3]), qtyText: `${m[3]} ${m[4]}`, netKg: toNumber(m[5]) });
    }
    return pl;
}

/**
 * Runs the ClearanceGuard preflight rule set. Every finding carries the exact
 * evidence substring so the visual layer can draw a box around it.
 */
function runCustomsPreflight(rawText) {
    const docs = splitPreflightDocuments(rawText);
    const ci = parseInvoice(docs.ci);
    const bl = parseBillOfLading(docs.bl);
    const pl = parsePackingList(docs.pl);
    const findings = [];
    const add = (severity, rule, doc, message, evidence, extra) => findings.push(Object.assign({ severity, rule, document: doc, message, evidence }, extra || {}));

    // R1 — line arithmetic: qty × unit price == line total (invoice)
    let computedTotal = 0;
    ci.lines.forEach(l => {
        const expected = l.qty * l.unitPrice;
        computedTotal += expected;
        if (Math.abs(expected - l.lineTotal) > 0.005) {
            add('ERROR', 'LINE_MATH', 'ci', `Line ${l.line}: ${l.qty} × ${money(l.unitPrice)} = ${money(expected)}, invoice states ${money(l.lineTotal)}`, l.lineTotalText, { line: l.line, expected: money(expected), found: money(l.lineTotal) });
        }
        if (!/^\d{4}\.\d{2}(\.\d{2}(\.\d{2})?)?$/.test(l.hs)) {
            add('WARN', 'HS_FORMAT', 'ci', `Line ${l.line}: HS code "${l.hs}" is not in 6/8/10-digit tariff format`, l.hs, { line: l.line });
        }
    });

    // R2 — invoice total == Σ line totals
    if (ci.lines.length && !isNaN(ci.statedTotal) && Math.abs(computedTotal - ci.statedTotal) > 0.005) {
        add('ERROR', 'INVOICE_TOTAL', 'ci', `Σ line totals = ${money(computedTotal)} but Invoice Total states ${money(ci.statedTotal)} (Δ ${money(ci.statedTotal - computedTotal)})`, ci.totalText, { expected: money(computedTotal), found: money(ci.statedTotal) });
    }

    // R3 — quantity parity: invoice line vs packing list line (by part number)
    ci.lines.forEach(l => {
        const p = pl.lines.find(x => x.part === l.part);
        if (!p) { add('WARN', 'MISSING_ON_PACKING_LIST', 'pl', `Part ${l.part} (invoice line ${l.line}) has no packing-list line`, null, { line: l.line }); return; }
        if (p.qty !== l.qty) {
            add('ERROR', 'QTY_MISMATCH', 'pl', `Part ${l.part}: invoice ${l.qty} ${l.uom} vs packing list ${p.qty} ${l.uom} (Δ ${p.qty - l.qty})`, p.qtyText, { line: l.line, expected: l.qty, found: p.qty, alsoMark: { doc: 'ci', evidence: l.qtyText } });
        }
    });
    pl.lines.forEach(p => { if (!ci.lines.find(l => l.part === p.part)) add('WARN', 'NOT_ON_INVOICE', 'ci', `Packing-list part ${p.part} is not invoiced`, null, { line: p.line }); });

    // R4 — currency: invoice currency vs B/L declared-value currency
    if (ci.currency && bl.declaredCurrency && ci.currency !== bl.declaredCurrency) {
        add('ERROR', 'CURRENCY_MISMATCH', 'bl', `Invoice is in ${ci.currency}; Bill of Lading declares value in ${bl.declaredCurrency} — valuation for duty (VFD) will be wrong unless converted`, bl.declaredText, { expected: ci.currency, found: bl.declaredCurrency, alsoMark: { doc: 'ci', evidence: `Currency: ${ci.currency}` } });
    }
    if (ci.totalCurrency && ci.currency && ci.totalCurrency !== ci.currency) {
        add('ERROR', 'CURRENCY_INTERNAL', 'ci', `Invoice header says ${ci.currency} but total line says ${ci.totalCurrency}`, ci.totalText);
    }

    // R5 — package count parity across all three documents
    const pkgs = [['ci', ci.packages], ['bl', bl.packages], ['pl', pl.cartons]].filter(x => !isNaN(x[1]));
    if (pkgs.length > 1 && new Set(pkgs.map(x => x[1])).size > 1) {
        add('ERROR', 'PACKAGE_COUNT', 'bl', `Package counts differ: ${pkgs.map(x => `${x[0].toUpperCase()}=${x[1]}`).join(', ')}`, `Packages: ${bl.packages}`);
    }

    // R6 — weights: gross parity CI vs B/L, Σ net == stated net, net must not exceed gross
    if (!isNaN(ci.grossKg) && !isNaN(bl.grossKg) && Math.abs(ci.grossKg - bl.grossKg) > 0.05) {
        add('WARN', 'GROSS_WEIGHT', 'bl', `Gross weight CI ${ci.grossKg} KG vs B/L ${bl.grossKg} KG`, `Gross Weight: ${docs.bl.match(/Gross Weight:\s*([\d,]+\.?\d*)/i)?.[1] || bl.grossKg}`);
    }
    const sumNet = pl.lines.reduce((a, p) => a + p.netKg, 0);
    if (pl.lines.length && !isNaN(pl.statedNetKg) && Math.abs(sumNet - pl.statedNetKg) > 0.05) {
        add('ERROR', 'NET_WEIGHT_SUM', 'pl', `Σ line net = ${sumNet.toFixed(1)} KG but Total Net Weight states ${pl.statedNetKg} KG`, `Total Net Weight: ${docs.pl.match(/Total Net Weight:\s*([\d,]+\.?\d*)/i)?.[1] || pl.statedNetKg}`);
    }
    const gross = !isNaN(bl.grossKg) ? bl.grossKg : ci.grossKg;
    if (!isNaN(gross) && !isNaN(pl.statedNetKg) && pl.statedNetKg > gross) {
        add('ERROR', 'NET_EXCEEDS_GROSS', 'pl', `Net weight ${pl.statedNetKg} KG exceeds gross weight ${gross} KG — physically impossible`, `Total Net Weight: ${pl.statedNetKg}`);
    }

    // R7 — party parity: supplier/shipper and buyer/consignee
    const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (ci.supplier && bl.shipper && !norm(bl.shipper).includes(norm(ci.supplier).slice(0, 12))) add('WARN', 'SHIPPER_MISMATCH', 'bl', `Supplier "${ci.supplier}" ≠ Shipper "${bl.shipper}"`, bl.shipper);
    if (ci.buyer && bl.consignee && !norm(bl.consignee).includes(norm(ci.buyer).slice(0, 12))) add('WARN', 'CONSIGNEE_MISMATCH', 'bl', `Buyer "${ci.buyer}" ≠ Consignee "${bl.consignee}"`, bl.consignee);

    if (!ci.lines.length) add('WARN', 'NO_INVOICE_LINES', 'ci', 'No invoice lines recognised — keep the "Line | Part | Description | HS Code | Qty | Unit Price | Line Total" layout', null);

    const errors = findings.filter(f => f.severity === 'ERROR').length;
    const checks = ['LINE_MATH', 'HS_FORMAT', 'INVOICE_TOTAL', 'QTY_MISMATCH', 'MISSING_ON_PACKING_LIST', 'NOT_ON_INVOICE',
        'CURRENCY_MISMATCH', 'CURRENCY_INTERNAL', 'PACKAGE_COUNT', 'GROSS_WEIGHT', 'NET_WEIGHT_SUM', 'NET_EXCEEDS_GROSS',
        'SHIPPER_MISMATCH', 'CONSIGNEE_MISMATCH', 'NO_INVOICE_LINES'];
    return {
        documents: {
            commercialInvoice: { number: ci.number || null, currency: ci.currency, lines: ci.lines.length, statedTotal: isNaN(ci.statedTotal) ? null : money(ci.statedTotal), computedTotal: money(computedTotal), packages: ci.packages, grossKg: ci.grossKg },
            billOfLading: { packages: bl.packages, grossKg: bl.grossKg, declaredValue: isNaN(bl.declaredValue) ? null : money(bl.declaredValue), declaredCurrency: bl.declaredCurrency },
            packingList: { cartons: pl.cartons, lines: pl.lines.length, sumNetKg: Number(sumNet.toFixed(1)), statedNetKg: pl.statedNetKg }
        },
        checksRun: checks,
        findings,
        summary: { errors, warnings: findings.length - errors },
        decision: errors ? 'ROUTE_TO_HUMAN_REVIEWER' : 'CLEAR_FOR_SPECIALIST_REVIEW',
        governance: 'The system recommends; an authorized customs specialist decides. No automated filing, no tariff classification, no legal advice.',
        _docs: docs
    };
}

/* ------------------------------------------------------------------------ */
/* Generic parser (unchanged presets)                                         */
/* ------------------------------------------------------------------------ */

function parseDocumentIntelligence(rawText) {
    if (!rawText || typeof rawText !== 'string') {
        return { error: 'Empty payload provided' };
    }

    const isPreflight = /===\s*(COMMERCIAL INVOICE|BILL OF LADING|PACKING LIST)\s*===/i.test(rawText);
    const isAgent = rawText.includes('AGENTIC WORKFLOW') || rawText.includes('Agent Hierarchy');
    const isGov = rawText.includes('CANADIAN PUBLIC SECTOR') || rawText.includes('ProServices');

    const result = {
        meta: {
            engine: isPreflight ? 'ClearanceGuard AI — Customs Document Preflight' : 'Quantum Gaze Multi-Modal AI Engine',
            executionSpeed: isPreflight ? 'Deterministic cross-document reconciliation (runs locally in this browser)' : '2–3 Weeks Concept to Production MVP',
            parsedAt: new Date().toISOString(),
            status: 'VALIDATED_OK',
            security: '100% Client-Side In-Browser Execution (Zero Server Upload)',
            dataSovereignty: 'Canadian & Protected Compliant'
        },
        payloadType: isPreflight ? 'Customs Document Preflight (Commercial Invoice × Bill of Lading × Packing List)'
            : isAgent ? 'Agentic AI Multi-Agent Execution Graph'
                : isGov ? 'Public Sector Procurement Manifest' : 'Commercial Invoice & Tax Document',
        extractedEntities: {}
    };

    if (isPreflight) {
        const pf = runCustomsPreflight(rawText);
        result.meta.status = pf.summary.errors ? 'DISCREPANCIES_FOUND' : 'VALIDATED_OK';
        result.preflight = pf;
        return result;
    }

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

/* ------------------------------------------------------------------------ */
/* Visual discrepancy layer ("bounding boxes" on the source documents)        */
/* ------------------------------------------------------------------------ */

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderPreflightVisual(preflight) {
    const panel = document.getElementById('preflightVisual');
    const docsEl = document.getElementById('preflightDocs');
    const summaryEl = document.getElementById('preflightSummary');
    if (!panel || !docsEl) return;

    if (!preflight) { panel.hidden = true; return; }
    panel.hidden = false;

    const ui = PREFLIGHT_UI_TEXT[preflightLang()];
    const n = preflight.findings.length;
    if (summaryEl) {
        const errors = preflight.summary.errors;
        summaryEl.textContent = n === 0 ? ui.clear
            : ui.flagged.replace('{n}', n).replace('{y}', n === 1 ? 'y' : 'ies').replace(/\{s\}/g, n === 1 ? '' : 's').replace('{en}', n === 1 ? '' : 'en');
        summaryEl.className = 'preflight-summary ' + (errors ? 'is-error' : n ? 'is-warn' : 'is-ok');
    }

    // Collect marks per document: {evidence, severity, rule}
    const marks = { ci: [], bl: [], pl: [] };
    preflight.findings.forEach(f => {
        if (f.evidence && marks[f.document]) marks[f.document].push({ evidence: f.evidence, severity: f.severity, rule: f.rule });
        if (f.alsoMark && marks[f.alsoMark.doc]) marks[f.alsoMark.doc].push({ evidence: f.alsoMark.evidence, severity: f.severity, rule: f.rule });
    });

    const titles = { ci: ui.ci, bl: ui.bl, pl: ui.pl };
    docsEl.innerHTML = ['ci', 'bl', 'pl'].map(key => {
        const text = preflight._docs[key] || '';
        let html = escapeHtml(text);
        // Longest evidence first so nested substrings do not break earlier boxes
        marks[key].sort((a, b) => b.evidence.length - a.evidence.length).forEach(m => {
            const needle = escapeHtml(m.evidence);
            if (!needle || html.indexOf(needle) === -1 || html.indexOf(`>${needle}<`) !== -1) return;
            // Replacement *function*: a plain string would expand `$&`, `$'` etc. if the evidence contains '$'
            const wrapped = `<span class="pf-box pf-${m.severity.toLowerCase()}" data-rule="${escapeHtml(m.rule)}">${needle}</span>`;
            html = html.replace(needle, () => wrapped);
        });
        const count = marks[key].length;
        return `<div class="pf-doc">
            <div class="pf-doc-title"><span>${escapeHtml(titles[key])}</span><span class="pf-doc-count ${count ? 'is-flagged' : 'is-ok'}">${count ? count : '✓ ' + escapeHtml(ui.ok)}</span></div>
            <pre class="pf-doc-body">${html || '—'}</pre>
        </div>`;
    }).join('');
}

/* ------------------------------------------------------------------------ */
/* Live Simulated Architecture & AI Telemetry Stream                           */
/* ------------------------------------------------------------------------ */

function initTerminalStream() {
    const terminalEl = document.getElementById('terminalStream');
    if (!terminalEl) return;

    const logs = [
        { text: '> Quantum Gaze AI Engine Initialized... OK', class: 'cyan' },
        { text: '> ClearanceGuard preflight: CI × B/L × PL reconciliation rules loaded', class: 'cyan' },
        { text: '> Rapid 2-Week AI MVP Sprint Pipeline: ACTIVE', class: '' },
        { text: '> Agentic multi-agent orchestrator dispatching tasks in parallel', class: '' },
        { text: '> Azure AKS microservice cluster active — health checks passing', class: '' },
        { text: '> Kafka event stream consuming with exactly-once delivery guarantees', class: 'amber' },
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

/* ------------------------------------------------------------------------ */
/* Wiring                                                                     */
/* ------------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
    const rawEdiInput = document.getElementById('rawEdiInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const parseBtn = document.getElementById('parseEdiBtn');
    const tabButtons = document.querySelectorAll('.sandbox-tab-btn');
    const timestampEl = document.getElementById('sandboxTimestamp');

    const jsonForDisplay = parsed => {
        if (parsed && parsed.preflight) {
            const clone = Object.assign({}, parsed, { preflight: Object.assign({}, parsed.preflight) });
            delete clone.preflight._docs;
            return JSON.stringify(clone, null, 2);
        }
        return JSON.stringify(parsed, null, 2);
    };

    const execute = () => {
        let parsed;
        try {
            parsed = parseDocumentIntelligence(rawEdiInput.value);
        } catch (err) {
            parsed = { error: err.message };
        }
        jsonOutput.textContent = jsonForDisplay(parsed);
        renderPreflightVisual(parsed && parsed.preflight ? parsed.preflight : null);
        if (timestampEl) timestampEl.textContent = new Date().toUTCString().substring(17, 25) + ' UTC';
    };

    if (rawEdiInput && jsonOutput) {
        const activeBtn = document.querySelector('.sandbox-tab-btn.active');
        const initialKey = activeBtn && DOCUMENT_SAMPLES[activeBtn.getAttribute('data-sample')] ? activeBtn.getAttribute('data-sample') : 'customs_preflight';
        rawEdiInput.value = DOCUMENT_SAMPLES[initialKey];
        execute();

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const sampleKey = btn.getAttribute('data-sample');
                if (DOCUMENT_SAMPLES[sampleKey]) {
                    rawEdiInput.value = DOCUMENT_SAMPLES[sampleKey];
                    execute();
                }
            });
        });

        if (parseBtn) parseBtn.addEventListener('click', execute);

        // Re-render the visual layer's JS-generated labels when the visitor switches language.
        // The i18n runtime handles data-i18n nodes; we run after it (setTimeout 0) on the same change event.
        const rerenderLabels = () => setTimeout(() => {
            const parsed = parseDocumentIntelligence(rawEdiInput.value);
            renderPreflightVisual(parsed && parsed.preflight ? parsed.preflight : null);
        }, 0);
        const langSelector = document.getElementById('languageSelector');
        if (langSelector) langSelector.addEventListener('change', rerenderLabels);
        document.addEventListener('languageChanged', rerenderLabels);
    }

    // Deep link https://quantum-gaze.ca/#demo — the browser's own fragment scroll is animated by
    // `html { scroll-behavior: smooth }` and hero images/fonts keep shifting layout while it runs.
    // Issuing a second *smooth* scroll cancels the first (observed: page settles near the top), so
    // after load we correct the position instantly, and only if the section is not already in place.
    if (location.hash === '#demo') {
        const settle = () => {
            const demo = document.getElementById('demo');
            if (!demo) return;
            const top = demo.getBoundingClientRect().top;
            const margin = parseFloat(getComputedStyle(demo).scrollMarginTop) || 0;
            if (Math.abs(top - margin) > 12) demo.scrollIntoView({ behavior: 'instant', block: 'start' });
        };
        const schedule = () => { setTimeout(settle, 400); setTimeout(settle, 1500); };
        if (document.readyState === 'complete') schedule();
        else window.addEventListener('load', schedule, { once: true });
    }

    initTerminalStream();
});
