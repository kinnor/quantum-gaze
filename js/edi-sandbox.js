/**
 * Quantum Gaze Software Inc. — ClearanceGuard AI Sandbox
 * Customs Document Preflight Demo — client-side only, nothing uploaded.
 * The system recommends; an authorized employee decides.
 */

const DOCUMENT_SAMPLES = {
    'invoice': `=== COMMERCIAL INVOICE (excerpt, synthetic) ===
Shipment Ref: SHIP-2026-04471
Consignee: Northbridge Import Partners Inc.
Country of Origin: Vietnam
Currency: USD
Incoterm: FOB
Line 1 — Item: Woven Cotton Textile Rolls | Qty: 500 units | Unit Price: $4.20 | Line Total: $2,100.00
Line 2 — Item: Injection-Molded Housing Units | Qty: 300 units | Unit Price: $6.50 | Line Total: $1,950.00
Line 3 — Item: Aluminum Bracket Assemblies | Qty: 200 units | Unit Price: $9.00 | Line Total: $1,800.00
Subtotal: $5,850.00
Freight: $350.00
Total Invoice Value: $6,200.00

=== PACKING LIST (excerpt, synthetic) ===
Consignee: Northbridge Import Partners Inc.
Country of Origin: Vietnam
Gross Weight: 1,240 kg
Line 1 — Qty: 500 units
Line 2 — Qty: 300 units
Line 3 — Qty: 200 units`,

    'agent_task': `=== BILL OF LADING (excerpt, synthetic) ===
Shipment Ref: SHIP-2026-04471
Consignee: Northbridge Import Partners Inc.
Country of Origin: Vietnam
Currency: USD
Incoterm: FOB
Gross Weight: 1,240 kg
Line 1 — Qty: 500 units
Line 2 — Qty: 300 units
Line 3 — Qty: 200 units

=== ENTRY SUMMARY (excerpt, synthetic) ===
Shipment Ref: SHIP-2026-04471
Importer of Record: North Bridge Import Partners Inc.
Country of Origin: China
Currency: USD
Line 1 — Item: Woven Cotton Textile Rolls | Qty: 500 units | Unit Price: $4.20 | Line Total: $2,100.00
Line 2 — Item: Injection-Molded Housing Units | Qty: 280 units | Unit Price: $6.50 | Line Total: $1,820.00
Line 3 — Item: Aluminum Bracket Assemblies | Qty: 200 units | Unit Price: $9.00 | Line Total: $1,800.00
Subtotal: $5,720.00
Freight: $350.00
Total Declared Value: $6,070.00`,

    'gov_manifest': `=== GOVERNMENT IMPORTER MANIFEST — HEADER (excerpt, synthetic) ===
Shipment Ref: SHIP-GOV-2026-0093
Importer of Record: Meridian Public Works Supply Ltd.
Country of Origin: Vietnam
Currency: CAD
Incoterm: DAP
Line 1 — Item: Modular Office Partition Panels | Qty: 400 units | Unit Price: $20.00 | Line Total: $8,000.00
Line 2 — Item: Steel Cable Trays | Qty: 150 units | Unit Price: $28.00 | Line Total: $4,200.00
Subtotal: $12,200.00
Total Declared Value: $14,000.00

=== GOVERNMENT IMPORTER MANIFEST — LINE DETAIL CONFIRMATION (excerpt, synthetic) ===
Consignee: Meridian Public Works Supply Ltd.
Country of Origin: Vietnam
Gross Weight: 860 kg
Line 1 — Qty: 400 units
Line 2 — Qty: 150 units`
};

// --- helpers -------------------------------------------------------------

function toNumber(str) {
    if (str === null || str === undefined) return null;
    const n = parseFloat(String(str).replace(/[^0-9.\-]/g, ''));
    return Number.isNaN(n) ? null : n;
}

function findAll(re, text) {
    const out = [];
    let m;
    while ((m = re.exec(text)) !== null) {
        out.push(m);
    }
    return out;
}

// --- extraction ------------------------------------------------------------

function extractShipment(rawText, documentSetLabel) {
    const consigneeMentions = findAll(/(?:Consignee|Importer of Record)\s*:\s*([^\n\r]+)/gi, rawText).map(m => m[1].trim());
    const originMentions = findAll(/Country of Origin\s*:\s*([^\n\r]+)/gi, rawText).map(m => m[1].trim());
    const currencyMentions = findAll(/Currency\s*:\s*([A-Z]{3})/gi, rawText).map(m => m[1].toUpperCase());
    const referenceMatch = rawText.match(/Shipment Ref\s*:\s*([^\n\r]+)/i);
    const incotermMatch = rawText.match(/Incoterm\s*:\s*([A-Z]{3})/i);
    const weightMatch = rawText.match(/Gross Weight\s*:\s*([\d,]+\s*kg)/i);
    const freightMatch = rawText.match(/Freight\s*:\s*\$([\d,]+\.\d{2})/i);
    const subtotalMatch = rawText.match(/Subtotal\s*:\s*\$([\d,]+\.\d{2})/i);
    const totalMatch = rawText.match(/Total\s+(?:Invoice\s+|Declared\s+)?Value\s*:\s*\$([\d,]+\.\d{2})/i);

    const lineItems = findAll(/Line\s+\d+\s*[—-]\s*Item:\s*([^|]+)\|\s*Qty:\s*([\d,]+)\s*units\s*\|\s*Unit Price:\s*\$([\d,]+\.\d{2})\s*\|\s*Line Total:\s*\$([\d,]+\.\d{2})/gi, rawText)
        .map(m => ({
            description: m[1].trim(),
            qty: toNumber(m[2]),
            unitPrice: toNumber(m[3]),
            lineTotal: toNumber(m[4])
        }));

    const quantityConfirmation = findAll(/Line\s+\d+\s*[—-]\s*Qty:\s*([\d,]+)\s*units/gi, rawText)
        .map(m => toNumber(m[1]));

    const freightValue = freightMatch ? toNumber(freightMatch[1]) : 0;
    const computedLineSum = lineItems.reduce((sum, row) => sum + (row.lineTotal || 0), 0);

    return {
        documentSet: documentSetLabel,
        reference: referenceMatch ? referenceMatch[1].trim() : null,
        consigneeMentions,
        originMentions,
        currencyMentions,
        incoterm: incotermMatch ? incotermMatch[1].toUpperCase() : null,
        weight: weightMatch ? weightMatch[1].trim() : null,
        lineItems,
        quantityConfirmation,
        subtotal: subtotalMatch ? toNumber(subtotalMatch[1]) : null,
        freight: freightMatch ? toNumber(freightMatch[1]) : null,
        declaredTotal: totalMatch ? toNumber(totalMatch[1]) : null,
        computedTotal: lineItems.length ? +(computedLineSum + freightValue).toFixed(2) : null
    };
}

// --- deterministic cross-checks ---------------------------------------------

function buildChecks(shipment) {
    const checks = [];

    // 1. Currency consistency
    const uniqueCurrencies = Array.from(new Set(shipment.currencyMentions));
    checks.push({
        id: 'currency-consistency',
        rule: 'All currency references use the same ISO code',
        status: uniqueCurrencies.length === 1 ? 'PASS' : 'REVIEW',
        evidence: shipment.currencyMentions.length
            ? `Currency mentions found: ${shipment.currencyMentions.join(', ')}`
            : 'No currency code found in document text'
    });

    // 2. Declared total vs. recomputed sum
    let totalStatus = 'REVIEW';
    let totalEvidence = 'Insufficient line-item data to recompute a total';
    if (shipment.declaredTotal != null && shipment.computedTotal != null) {
        const diff = Math.abs(shipment.declaredTotal - shipment.computedTotal);
        totalStatus = diff < 0.01 ? 'PASS' : 'REVIEW';
        totalEvidence = `Declared total $${shipment.declaredTotal.toFixed(2)} vs. line items + freight = $${shipment.computedTotal.toFixed(2)}`;
    }
    checks.push({ id: 'total-vs-line-items', rule: 'Declared total equals the sum of line items plus freight', status: totalStatus, evidence: totalEvidence });

    // 3. Quantity cross-check between the two source documents
    let qtyStatus = 'REVIEW';
    let qtyEvidence = 'No second quantity listing found to cross-check';
    if (shipment.lineItems.length && shipment.quantityConfirmation.length) {
        const primaryQty = shipment.lineItems.map(li => li.qty);
        const mismatch = primaryQty.length !== shipment.quantityConfirmation.length ||
            primaryQty.some((q, i) => q !== shipment.quantityConfirmation[i]);
        qtyStatus = mismatch ? 'REVIEW' : 'PASS';
        qtyEvidence = `Primary listing: [${primaryQty.join(', ')}] vs. secondary listing: [${shipment.quantityConfirmation.join(', ')}]`;
    }
    checks.push({ id: 'quantity-cross-check', rule: 'Quantities match across the two source documents', status: qtyStatus, evidence: qtyEvidence });

    // 4. Consignee / importer of record match
    let consigneeStatus = 'REVIEW';
    let consigneeEvidence = 'Fewer than two consignee/importer mentions found to compare';
    if (shipment.consigneeMentions.length >= 2) {
        const [a, b] = shipment.consigneeMentions;
        consigneeStatus = a.trim().toLowerCase() === b.trim().toLowerCase() ? 'PASS' : 'REVIEW';
        consigneeEvidence = `"${a}" vs. "${b}"`;
    }
    checks.push({ id: 'consignee-match', rule: 'Consignee / importer of record name is consistent across documents', status: consigneeStatus, evidence: consigneeEvidence });

    // 5. Country of origin match
    let originStatus = 'REVIEW';
    let originEvidence = 'Fewer than two country-of-origin mentions found to compare';
    if (shipment.originMentions.length >= 2) {
        const [a, b] = shipment.originMentions;
        originStatus = a.trim().toLowerCase() === b.trim().toLowerCase() ? 'PASS' : 'REVIEW';
        originEvidence = `"${a}" vs. "${b}"`;
    }
    checks.push({ id: 'origin-match', rule: 'Declared country of origin is consistent across documents', status: originStatus, evidence: originEvidence });

    // 6. Gross weight present
    checks.push({
        id: 'weight-present',
        rule: 'Gross weight is declared',
        status: shipment.weight ? 'PASS' : 'REVIEW',
        evidence: shipment.weight ? `Gross weight: ${shipment.weight}` : 'No gross weight field found'
    });

    // 7. Incoterm present
    checks.push({
        id: 'incoterm-present',
        rule: 'Incoterm is declared',
        status: shipment.incoterm ? 'PASS' : 'REVIEW',
        evidence: shipment.incoterm ? `Incoterm: ${shipment.incoterm}` : 'No Incoterm field found'
    });

    // 8. Shipment reference present
    checks.push({
        id: 'reference-present',
        rule: 'Shipment reference number is present',
        status: shipment.reference ? 'PASS' : 'REVIEW',
        evidence: shipment.reference ? `Shipment Ref: ${shipment.reference}` : 'No shipment reference found'
    });

    return checks;
}

const SEVERITY_BY_CHECK = {
    'currency-consistency': 'medium',
    'total-vs-line-items': 'medium',
    'quantity-cross-check': 'high',
    'consignee-match': 'high',
    'origin-match': 'high',
    'weight-present': 'low',
    'incoterm-present': 'low',
    'reference-present': 'low'
};

const SUGGESTED_ACTION_BY_CHECK = {
    'currency-consistency': 'Confirm the settlement currency with the exporter before filing.',
    'total-vs-line-items': 'Recalculate the declared total against the line-item detail before filing.',
    'quantity-cross-check': 'Reconcile the quantity discrepancy with the shipper before release.',
    'consignee-match': 'Confirm the correct legal entity name with the importer before filing.',
    'origin-match': 'Verify the country of origin against the certificate of origin before filing.',
    'weight-present': 'Request the missing gross weight from the submitting party.',
    'incoterm-present': 'Request the missing Incoterm from the submitting party.',
    'reference-present': 'Request a shipment reference number from the submitting party.'
};

function buildReviewerQueue(checks) {
    return checks
        .filter(c => c.status === 'REVIEW')
        .map(c => ({
            checkId: c.id,
            severity: SEVERITY_BY_CHECK[c.id] || 'medium',
            reason: `${c.rule} — ${c.evidence}`,
            suggestedReviewerAction: SUGGESTED_ACTION_BY_CHECK[c.id] || 'Review manually before filing.'
        }));
}

// --- entry point -------------------------------------------------------------

function parseDocumentIntelligence(rawText) {
    const meta = {
        engine: 'ClearanceGuard AI — Customs Document Preflight (demo)',
        mode: 'client-side, nothing uploaded',
        decision: 'RECOMMENDATION — authorized employee decides',
        evaluatedAt: new Date().toISOString()
    };

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
        return {
            meta,
            status: 'INSUFFICIENT_DATA',
            explanation: 'No document text was provided. Paste a shipment excerpt with labeled fields (Consignee, Country of Origin, Currency, Qty, Line Total) to run a preflight.',
            shipment: null,
            checks: [],
            reviewerQueue: []
        };
    }

    const isInvoicePacking = /COMMERCIAL INVOICE/i.test(rawText) && /PACKING LIST/i.test(rawText);
    const isBolEntry = /BILL OF LADING/i.test(rawText) && /ENTRY SUMMARY/i.test(rawText);
    const isGovManifest = /GOVERNMENT IMPORTER MANIFEST/i.test(rawText);

    if (!isInvoicePacking && !isBolEntry && !isGovManifest) {
        return {
            meta,
            status: 'INSUFFICIENT_DATA',
            explanation: 'No recognized customs document structure was found (expected a commercial invoice + packing list, a bill of lading + entry summary, or a government importer manifest excerpt). Use one of the sample tabs, or paste a shipment excerpt with labeled fields, to run a preflight.',
            shipment: null,
            checks: [],
            reviewerQueue: []
        };
    }

    const documentSetLabel = isInvoicePacking
        ? 'Commercial Invoice + Packing List'
        : isBolEntry
            ? 'Bill of Lading + Entry Summary'
            : 'Government Importer Manifest';

    const shipment = extractShipment(rawText, documentSetLabel);
    const checks = buildChecks(shipment);
    const reviewerQueue = buildReviewerQueue(checks);

    return { meta, shipment, checks, reviewerQueue };
}

// Live simulated preflight telemetry stream (demo only — no server calls, no metrics)
function initTerminalStream() {
    const terminalEl = document.getElementById('terminalStream');
    if (!terminalEl) return;

    const logs = [
        { text: 'ClearanceGuard AI preflight sandbox initialized — nothing uploaded, all parsing runs in this browser tab', class: 'cyan' },
        { text: '[PREFLIGHT] Commercial invoice + packing list parsed', class: 'cyan' },
        { text: '[CHECK] Currency consistency: PASS', class: '' },
        { text: '[CHECK] Quantity vs. packing list: PASS', class: '' },
        { text: '[CHECK] Consignee name match: REVIEW', class: 'amber' },
        { text: '[CHECK] Country of origin match: REVIEW', class: 'amber' },
        { text: '[QUEUE] Findings routed to a human reviewer — awaiting authorized decision', class: 'amber' },
        { text: '[PILOT] Decision-grade pilot in 14–21 days', class: 'cyan' }
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
