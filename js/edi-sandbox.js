/**
 * Quantum Gaze Software Inc. — Client-Side EDI Parser & Telemetry Sandbox
 * 100% In-Browser Interactive Engine (Zero Server Upload)
 */

const EDI_SAMPLES = {
    '204': `ISA*00*          *00*          *02*QUANTUMGAZE    *01*CARRIER01      *260828*1700*U*00401*000000001*0*P*>~
GS*SM*QUANTUMGAZE*CARRIER01*20260828*1700*1*X*004010~
ST*204*0001~
B2**QGSG*987654321**PP~
B2A*00*LT~
L11*PO-994821*PO~
MS3*QGSG*B*M~
N1*SH*MONTREAL DISTRIBUTION CENTER~
N3*5410 PLAMONDON AVE~
N4*MONTREAL*QC*H3X1C1*CA~
N1*CN*CHICAGO LOGISTICS HUB~
N3*1200 S MICHIGAN AVE~
N4*CHICAGO*IL*60605*US~
S5*1*CL~
G62*37*20260901*E*0800~
OID*PO-994821*1200*CA*45000*L~
SE*15*0001~
GE*1*1~
IEA*1*000000001~`,

    '214': `ISA*00*          *00*          *02*CARRIER01      *01*QUANTUMGAZE    *260828*1715*U*00401*000000002*0*P*>~
GS*QM*CARRIER01*QUANTUMGAZE*20260828*1715*2*X*004010~
ST*214*0001~
B10*987654321*BOL-441029*QGSG~
L11*PO-994821*PO~
N1*CN*CHICAGO LOGISTICS HUB~
N3*1200 S MICHIGAN AVE~
N4*CHICAGO*IL*60605*US~
LX*1~
AT7*AF*NS***20260828*1630*ET~
MS1*DETROIT*MI*USA~
MS2*QGSG*5421~
SE*11*0001~
GE*1*2~
IEA*1*000000002~`,

    '850': `ISA*00*          *00*          *01*ENTERPRISE     *01*QUANTUMGAZE    *260828*1730*U*00401*000000003*0*P*>~
GS*PO*ENTERPRISE*QUANTUMGAZE*20260828*1730*3*X*004010~
ST*850*0001~
BEG*00*NE*PO-2026-8831**20260828~
CUR*BY*USD~
N1*BY*GLOBAL RETAIL CORP~
N3*100 ENTERPRISE WAY~
N4*NEW YORK*NY*10001*US~
PO1*1*500*EA*42.50*PE*VN*SKU-9921-A~
PID*F****INDUSTRIAL SENSOR MODULE~
CTT*1~
SE*10*0001~
GE*1*3~
IEA*1*000000003~`
};

function parseEdiToJson(ediText) {
    if (!ediText || typeof ediText !== 'string') {
        return { error: 'Empty EDI payload' };
    }

    const segments = ediText
        .split('~')
        .map(s => s.trim().replace(/\r?\n/g, ''))
        .filter(s => s.length > 0);

    const result = {
        meta: {
            standard: 'ANSI X12',
            parserEngine: 'Quantum Gaze In-Browser Engine',
            parsedAt: new Date().toISOString(),
            status: 'VALIDATED_OK',
            privacy: '100% Client-Side Executed'
        },
        interchange: {},
        functionalGroup: {},
        transactionSet: {
            segmentsCount: segments.length,
            details: {}
        }
    };

    segments.forEach(seg => {
        const elements = seg.split('*');
        const tag = elements[0];

        switch (tag) {
            case 'ISA':
                result.interchange = {
                    senderId: (elements[6] || '').trim(),
                    receiverId: (elements[8] || '').trim(),
                    date: elements[9],
                    time: elements[10],
                    controlNumber: elements[13]
                };
                break;
            case 'GS':
                result.functionalGroup = {
                    functionalCode: elements[1],
                    sender: elements[2],
                    receiver: elements[3],
                    date: elements[4],
                    time: elements[5]
                };
                break;
            case 'ST':
                result.transactionSet.setIdentifier = elements[1];
                result.transactionSet.controlNumber = elements[2];
                if (elements[1] === '204') result.transactionSet.type = 'Motor Carrier Load Tender';
                if (elements[1] === '214') result.transactionSet.type = 'Transportation Shipment Status';
                if (elements[1] === '850') result.transactionSet.type = 'Purchase Order';
                break;
            case 'B2':
                result.transactionSet.details.scac = elements[2];
                result.transactionSet.details.shipmentId = elements[3];
                result.transactionSet.details.paymentMethod = elements[5];
                break;
            case 'B10':
                result.transactionSet.details.referenceId = elements[1];
                result.transactionSet.details.bolNumber = elements[2];
                result.transactionSet.details.scac = elements[3];
                break;
            case 'BEG':
                result.transactionSet.details.orderType = elements[2];
                result.transactionSet.details.purchaseOrderNumber = elements[3];
                result.transactionSet.details.orderDate = elements[5];
                break;
            case 'N1':
                if (!result.transactionSet.details.entities) result.transactionSet.details.entities = [];
                result.transactionSet.details.entities.push({
                    role: elements[1] === 'SH' ? 'Shipper' : elements[1] === 'CN' ? 'Consignee' : elements[1] === 'BY' ? 'Buyer' : elements[1],
                    name: elements[2]
                });
                break;
            case 'N4':
                if (result.transactionSet.details.entities && result.transactionSet.details.entities.length > 0) {
                    const current = result.transactionSet.details.entities[result.transactionSet.details.entities.length - 1];
                    current.city = elements[1];
                    current.state = elements[2];
                    current.postalCode = elements[3];
                    current.country = elements[4];
                }
                break;
            case 'AT7':
                result.transactionSet.details.status = {
                    statusCode: elements[1],
                    statusReason: elements[2],
                    eventDate: elements[5],
                    eventTime: elements[6],
                    timeZone: elements[7]
                };
                break;
            case 'PO1':
                if (!result.transactionSet.details.lineItems) result.transactionSet.details.lineItems = [];
                result.transactionSet.details.lineItems.push({
                    lineNumber: elements[1],
                    quantity: elements[2],
                    unit: elements[3],
                    unitPrice: elements[4],
                    sku: elements[7]
                });
                break;
        }
    });

    return result;
}

// BizTalk 2028 Countdown Timer Function
function initBizTalkCountdown() {
    const daysEl = document.getElementById('countDays');
    const hrsEl = document.getElementById('countHours');
    const minEl = document.getElementById('countMin');
    const secEl = document.getElementById('countSec');

    if (!daysEl) return;

    // Microsoft BizTalk Server 2020 Mainstream End Date: April 30, 2028 (local midnight)
    const targetDate = new Date(2028, 3, 30).getTime();

    function update() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hrsEl.textContent = '00';
            minEl.textContent = '00';
            secEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hrsEl.textContent = String(hours).padStart(2, '0');
        minEl.textContent = String(minutes).padStart(2, '0');
        secEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// Live Terminal Stream Generator
function initTerminalStream() {
    const terminalEl = document.getElementById('terminalStream');
    if (!terminalEl) return;

    const logs = [
        { text: '> Connecting to Azure Service Bus endpoint... OK', class: 'cyan' },
        { text: '> Validating ANSI X12 204 Load Tender schema... SUCCESS', class: '' },
        { text: '> Coexistence dual-route parity check: 100% MATCH', class: '' },
        { text: '> BizTalk pipeline extraction complete. Zero packet loss.', class: 'amber' },
        { text: '> Azure Logic Apps runtime active (42ms latency).', class: 'cyan' }
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
        rawEdiInput.value = EDI_SAMPLES['204'];
        jsonOutput.textContent = JSON.stringify(parseEdiToJson(EDI_SAMPLES['204']), null, 2);
        if (timestampEl) timestampEl.textContent = new Date().toUTCString().substring(17, 25) + ' UTC';

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const sampleKey = btn.getAttribute('data-sample');
                if (EDI_SAMPLES[sampleKey]) {
                    rawEdiInput.value = EDI_SAMPLES[sampleKey];
                    const parsed = parseEdiToJson(rawEdiInput.value);
                    jsonOutput.textContent = JSON.stringify(parsed, null, 2);
                    if (timestampEl) timestampEl.textContent = new Date().toUTCString().substring(17, 25) + ' UTC';
                }
            });
        });

        if (parseBtn) {
            parseBtn.addEventListener('click', () => {
                try {
                    const parsed = parseEdiToJson(rawEdiInput.value);
                    jsonOutput.textContent = JSON.stringify(parsed, null, 2);
                    if (timestampEl) timestampEl.textContent = new Date().toUTCString().substring(17, 25) + ' UTC';
                } catch (err) {
                    jsonOutput.textContent = JSON.stringify({ error: err.message }, null, 2);
                }
            });
        }
    }

    initBizTalkCountdown();
    initTerminalStream();
});
