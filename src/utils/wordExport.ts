import { PCBRepairForm } from "../types";
import { calculateJobNumber } from "./jobRef";

/**
 * Format Date to DD/MM/YY
 */
const formatDateString = (dateStr: string) => {
  if (!dateStr) return "N.A";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0].slice(-2)}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

/**
 * Helper to render value or fallback
 */
const getFieldValue = (value: string, placeholder?: string): string => {
  if (value && value.trim() !== "") {
    return value;
  }
  return placeholder || "N.A";
};

/**
 * Converts the form structure into a high-fidelity Word-compatible (.doc) download package
 */
export function exportToWord(form: PCBRepairForm, showSamplePhoto: boolean, savedForms?: PCBRepairForm[]) {
  const filename = (form.title || "pcb_repair_form")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") + ".doc";

  // Dynamic realistic job number
  const jobId = calculateJobNumber(form, savedForms);

  // Compile individual pictures in absolute grid or centered space-saving layout
  let photosHtml = "";
  const items: { src: string; isSample?: boolean; label: string }[] = [];
  form.photos.forEach((photo, idx) => {
    items.push({ src: photo, label: `PHOTO ${idx + 1}` });
  });
  if (showSamplePhoto) {
    items.push({ src: "", isSample: true, label: "SAMPLE REPRESENTATIVE PHOTO" });
  }

  if (items.length === 1) {
    const item = items[0];
    if (item.isSample) {
      photosHtml += `
        <div style="text-align: center; margin: 5px auto; width: 320px;">
          <div style="border: 2px dashed #0284c7; padding: 20px; border-radius: 6px; background-color: #fffbeb;">
            <div style="display: inline-block; border: 2px solid #b45309; background-color: #fef3c7; padding: 12px 24px; font-family: Courier, monospace; font-size: 10.5pt; font-weight: bold; border-radius: 4px; color: #1e293b; margin-bottom: 8px;">
              <div style="line-height: 1.1;">MORNING</div>
              <div style="line-height: 1.1; letter-spacing: 1px;">CARINA</div>
              <div style="line-height: 1.1;">ER CRANE</div>
              <div style="line-height: 1.1; letter-spacing: 1px;">PCB</div>
            </div>
            <div style="color: #0284c7; font-family: Arial, sans-serif; font-size: 8.5pt; font-weight: bold; text-transform: uppercase;">
              ${item.label}
            </div>
          </div>
        </div>
      `;
    } else {
      photosHtml += `
        <div style="text-align: center; margin: 5px auto; width: 340px;">
          <div style="border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px; background-color: #f8fafc;">
            <img src="${item.src}" width="320" height="130" style="width: 320px; height: 130px; object-fit: contain; border-radius: 4px;" />
          </div>
        </div>
      `;
    }
  } else if (items.length > 1) {
    photosHtml += `<table border="0" cellspacing="0" cellpadding="6" style="width: 100%; border-collapse: collapse;">`;
    for (let i = 0; i < items.length; i += 3) {
      photosHtml += `<tr>`;
      
      // Column 1
      const item1 = items[i];
      photosHtml += `<td style="width: 33.33%; vertical-align: top; padding: 6px;">`;
      if (item1.isSample) {
        photosHtml += `
          <div style="border: 1.5px dashed #0284c7; padding: 10px; border-radius: 6px; text-align: center; background-color: #fffbeb;">
            <div style="display: inline-block; border: 1.5px solid #b45309; background-color: #fef3c7; padding: 4px 8px; font-family: Courier, monospace; font-size: 7.5pt; font-weight: bold; border-radius: 4px; color: #1e293b; margin-bottom: 6px;">
              <div style="line-height: 1.1;">MORNING</div>
              <div style="line-height: 1.1; letter-spacing: 1px;">CARINA</div>
              <div style="line-height: 1.1;">ER CRANE</div>
              <div style="line-height: 1.1; letter-spacing: 1px;">PCB</div>
            </div>
            <div style="color: #0284c7; font-family: Arial, sans-serif; font-size: 7pt; font-weight: bold; text-transform: uppercase;">
              ${item1.label}
            </div>
          </div>
        `;
      } else {
        photosHtml += `
          <div style="border: 1px solid #cbd5e1; padding: 6.0px; border-radius: 6px; text-align: center; background-color: #f8fafc;">
            <img src="${item1.src}" width="180" height="90" style="width: 180px; height: 90px; object-fit: contain; border-radius: 4px;" />
          </div>
        `;
      }
      photosHtml += `</td>`;
 
      // Column 2
      if (i + 1 < items.length) {
        const item2 = items[i + 1];
        photosHtml += `<td style="width: 33.33%; vertical-align: top; padding: 6px;">`;
        if (item2.isSample) {
          photosHtml += `
            <div style="border: 1.5px dashed #0284c7; padding: 10px; border-radius: 6px; text-align: center; background-color: #fffbeb;">
              <div style="display: inline-block; border: 1.5px solid #b45309; background-color: #fef3c7; padding: 4px 8px; font-family: Courier, monospace; font-size: 7.5pt; font-weight: bold; border-radius: 4px; color: #1e293b; margin-bottom: 6px;">
                <div style="line-height: 1.1;">MORNING</div>
                <div style="line-height: 1.1; letter-spacing: 1px;">CARINA</div>
                <div style="line-height: 1.1;">ER CRANE</div>
                <div style="line-height: 1.1; letter-spacing: 1px;">PCB</div>
              </div>
              <div style="color: #0284c7; font-family: Arial, sans-serif; font-size: 7pt; font-weight: bold; text-transform: uppercase;">
                ${item2.label}
              </div>
            </div>
          `;
        } else {
          photosHtml += `
            <div style="border: 1px solid #cbd5e1; padding: 6.0px; border-radius: 6px; text-align: center; background-color: #f8fafc;">
              <img src="${item2.src}" width="180" height="90" style="width: 180px; height: 90px; object-fit: contain; border-radius: 4px;" />
            </div>
          `;
        }
        photosHtml += `</td>`;
      } else {
        photosHtml += `<td style="width: 33.33%; padding: 6px;">&nbsp;</td>`;
      }
 
      // Column 3
      if (i + 2 < items.length) {
        const item3 = items[i + 2];
        photosHtml += `<td style="width: 33.33%; vertical-align: top; padding: 6px;">`;
        if (item3.isSample) {
          photosHtml += `
            <div style="border: 1.5px dashed #0284c7; padding: 10px; border-radius: 6px; text-align: center; background-color: #fffbeb;">
              <div style="display: inline-block; border: 1.5px solid #b45309; background-color: #fef3c7; padding: 4px 8px; font-family: Courier, monospace; font-size: 7.5pt; font-weight: bold; border-radius: 4px; color: #1e293b; margin-bottom: 6px;">
                <div style="line-height: 1.1;">MORNING</div>
                <div style="line-height: 1.1; letter-spacing: 1px;">CARINA</div>
                <div style="line-height: 1.1;">ER CRANE</div>
                <div style="line-height: 1.1; letter-spacing: 1px;">PCB</div>
              </div>
              <div style="color: #0284c7; font-family: Arial, sans-serif; font-size: 7pt; font-weight: bold; text-transform: uppercase;">
                ${item3.label}
              </div>
            </div>
          `;
        } else {
          photosHtml += `
            <div style="border: 1px solid #cbd5e1; padding: 6.0px; border-radius: 6px; text-align: center; background-color: #f8fafc;">
              <img src="${item3.src}" width="180" height="90" style="width: 180px; height: 90px; object-fit: contain; border-radius: 4px;" />
            </div>
          `;
        }
        photosHtml += `</td>`;
      } else {
        photosHtml += `<td style="width: 33.33%; padding: 6px;">&nbsp;</td>`;
      }
      
      photosHtml += `</tr>`;
    }
    photosHtml += `</table>`;
  } else {
    photosHtml += `
      <div style="border: 2px dashed #cbd5e1; padding: 25px; border-radius: 6px; text-align: center; color: #94a3b8; font-family: Arial, sans-serif; font-size: 9pt;">
        No photos attached to this repair case sheet.
      </div>
    `;
  }

  // Construct complete brand-aware premium custom word format template
  const documentHtml = `
    <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Form for PCB Repair - CEL-RON Enterprises</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 21.0cm 29.7cm; /* A4 */
          margin: 0.4in;
        }
        body {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9.5pt;
          line-height: 1.3;
          color: #1e293b;
          background-color: #ffffff;
        }
        .header-table {
          width: 100%;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 15px;
          margin-bottom: 10px;
        }
        .logo-title {
          font-size: 18pt;
          font-weight: 900;
          color: #dc2626;
          line-height: 1.0;
        }
        .logo-subtitle {
          font-size: 7.5pt;
          font-weight: bold;
          color: #0e7490;
          letter-spacing: 3px;
          margin-top: 3px;
        }
        .company-name {
          font-size: 17pt;
          font-weight: 900;
          color: #dc2626;
          line-height: 1.0;
        }
        .company-addon {
          font-size: 15pt;
          font-weight: bold;
          color: #1e293b;
        }
        .reg-no {
          font-size: 9.5pt;
          font-weight: bold;
          color: #000000;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .address-line {
          font-size: 9.5pt;
          font-weight: bold;
          color: #475569;
          margin-top: 2px;
        }
        .comm-line {
          font-size: 9pt;
          color: #334155;
          margin-top: 2px;
        }
        .web-url {
          font-size: 9.5pt;
          font-weight: bold;
          color: #1d4ed8;
          margin-top: 2px;
        }
        .title-table {
          width: 100%;
          background-color: #1e3a8a;
          margin-top: 8px;
          border-radius: 6px;
        }
        .block-table {
          width: 100%;
          margin-top: 8px;
        }
        .to-box {
          border: 1.5px solid #cbd5e1;
          background-color: #f8fafc;
          padding: 10px;
          border-radius: 6px;
        }
        .specs-box {
          border: 1.5px solid #cbd5e1;
          border-collapse: collapse;
        }
        .specs-label {
          background-color: #f1f5f9;
          font-weight: bold;
          color: #1e3a8a;
          font-size: 9pt;
          text-transform: uppercase;
          border: 1.5px solid #cbd5e1;
          padding: 6px 10px;
          width: 35%;
        }
        .specs-value {
          border: 1.5px solid #cbd5e1;
          padding: 6px 10px;
          font-weight: bold;
          color: #334155;
          width: 65%;
        }
        .subject-line {
          font-size: 11pt;
          font-weight: bold;
          color: #020617;
          margin-top: 15px;
          margin-bottom: 12px;
        }
        .data-table {
          width: 100%;
          border: 1.5px solid #cbd5e1;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .table-th {
          background-color: #0f172a;
          color: #ffffff;
          font-size: 9pt;
          font-weight: bold;
          text-transform: uppercase;
          border: 1.5px solid #cbd5e1;
          padding: 6px 8px;
        }
        .cell-sn {
          text-align: center;
          font-weight: bold;
          color: #64748b;
          border: 1.5px solid #cbd5e1;
          padding: 6px;
          width: 8%;
        }
        .cell-param {
          background-color: #f8fafc;
          font-weight: bold;
          color: #1e3a8a;
          border: 1.5px solid #cbd5e1;
          padding: 6px 10px;
          width: 32%;
        }
        .cell-value {
          border: 1.5px solid #cbd5e1;
          padding: 6px 10px;
          color: #0f172a;
          font-weight: bold;
        }
        .cell-problem {
          border: 1.5px solid #cbd5e1;
          padding: 6px 10px;
          color: #dc2626;
          font-weight: bold;
        }
        .photos-heading {
          font-size: 9.5pt;
          font-weight: bold;
          color: #1e3a8a;
          background-color: #f1f5f9;
          border: 1.5px solid #cbd5e1;
          border-bottom: none;
          padding: 6px 10px;
          margin-top: 18px;
          text-transform: uppercase;
        }
        .photos-body {
          border: 1.5px solid #cbd5e1;
          padding: 15px;
          background-color: #ffffff;
        }
        .sig-box {
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 10px;
          background-color: #f8fafc;
          text-align: center;
        }
        .sig-line {
          border-top: 1px solid #94a3b8;
          padding-top: 4px;
          font-size: 8.5pt;
          font-weight: bold;
          color: #475569;
          margin-top: 15px;
          text-transform: uppercase;
        }
        .footer-line {
          margin-top: 25px;
          border-top: 2px solid #1e3a8a;
          padding-top: 5px;
          text-align: center;
          font-size: 11pt;
          font-weight: bold;
          letter-spacing: 3px;
          color: #1e3a8a;
        }
      </style>
    </head>
    <body>

      <!-- 1. BRANDING HEADER -->
      <table class="header-table" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <!-- Logo Block Left -->
          <td style="width: 40%; text-align: left; vertical-align: middle;">
            ${form.celronLogo ? `
              <img src="${form.celronLogo}" width="260" height="80" style="width: 260px; height: 80px; object-fit: contain;" />
            ` : `
              <div class="logo-title">CEL-RON</div>
              <div class="logo-subtitle">ENTERPRISES PTE LTD</div>
            `}
          </td>
          <!-- Official Address coordinates Right -->
          <td style="width: 60%; text-align: right; vertical-align: middle;">
            <div>
              <span class="company-name">CEL-RON</span>
              <span class="company-addon"> ENTERPRISES PTE LTD</span>
            </div>
            <div class="reg-no">UEN NO. 201436227C</div>
            <div class="address-line">10, Jln. Besar, "Sim Lim Tower" #03-05, Singapore 208787</div>
            <div class="comm-line">Phone: <b>+65 81962270</b> | Email: <b>sales@celron.net</b></div>
            <div class="web-url">www.celron.net</div>
          </td>
        </tr>
      </table>

      <!-- 2. DOCUMENT SUBTITLE PCB REPAIR FORM -->
      <table class="title-table" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e3a8a; color: #ffffff; width: 100%; border-radius: 6px; margin-top: 15px; border-collapse: separate;">
        <tr>
          <td style="width: 30%; font-weight: bold; text-align: left; font-size: 9.5pt; padding: 10px 15px; color: #bae6fd;">
            JOB. REF: <span style="color: #ffffff; font-family: monospace; font-weight: bold;">${jobId}</span>
          </td>
          <td style="width: 40%; text-align: center; font-size: 13pt; font-weight: 900; color: #ffffff; letter-spacing: 2px; padding: 10px 0; text-transform: uppercase;">
            PCB REPAIR FORM
          </td>
          <td style="width: 30%; font-weight: bold; text-align: right; font-size: 9.5pt; padding: 10px 15px; color: #bae6fd;">
            DATE: <span style="color: #ffffff; font-weight: bold;">${formatDateString(form.collectedDate)}</span>
          </td>
        </tr>
      </table>

      <!-- 3. DETAILED COLUMN BOXES AND SPECS -->
      <table class="block-table" border="0" cellspacing="0" cellpadding="8">
        <tr>
          <!-- LEFT "TO BOX" -->
          <td style="width: 50%; vertical-align: top; padding: 0 8px 0 0;">
            <div class="to-box">
              <div style="font-size: 8.5pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin-bottom: 4px;">TO:</div>
              <div style="font-size: 12pt; font-weight: bold; color: #000000;">${getFieldValue(form.customer, "Sunsai Engineering Pte Ltd")}</div>
              <div style="font-size: 9.5pt; color: #334155; margin-top: 6px;">
                ${getFieldValue(form.collectedFrom, "Blk 290D, #15-366, Singapore 651290")}
              </div>
              <div style="border-top: 1px solid #cbd5e1; margin-top: 10px; padding-top: 6px;">
                <span style="font-size: 8pt; font-weight: bold; color: #64748b; display: block;">ATTN / CONTACT PERSON:</span>
                <span style="font-size: 10pt; font-weight: bold; color: #1e293b;">${getFieldValue(form.orderedBy, "AL. Pandiselvam BE")}</span>
              </div>
            </div>
          </td>

          <!-- RIGHT CASE SPECIFICATIONS -->
          <td style="width: 50%; vertical-align: top; padding: 0 0 0 8px;">
            <table class="specs-box" cellspacing="0" cellpadding="0" style="width: 100%;">

              <tr>
                <td class="specs-label">VESSEL / PROJ</td>
                <td class="specs-value" style="text-transform: uppercase;">${getFieldValue(form.vesselName, "MORNING CARINA")}</td>
              </tr>
              <tr>
                <td class="specs-label">STATUS</td>
                <td class="specs-value" style="color: #d97706;">${form.repairStatus || "WALK IN / DIAGNOSTIC"}</td>
              </tr>
              <tr>
                <td class="specs-label">JOB. REF</td>
                <td class="specs-value" style="font-family: monospace; color: #059669;">${jobId}</td>
              </tr>
              <tr>
                <td class="specs-label">TECHNICIAN</td>
                <td class="specs-value">Mark S. / N.R.KUMAR</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- 5. MAIN REPORT DATA TABLES (PART 1 & PART 2) -->
      <!-- PART 1: EQUIPMENT DESCRIPTION & SPECIFICATIONS -->
      <div style="background-color: #1e3a8a; color: #ffffff; font-size: 9.5pt; font-weight: bold; padding: 6px 10px; margin-top: 15px; border-radius: 4px 4px 0 0; text-transform: uppercase;">
        PART 1: EQUIPMENT DESCRIPTION & SPECIFICATIONS
      </div>
      <table border="0" cellspacing="0" cellpadding="0" style="width: 100%; border: 1px solid #cbd5e1; border-top: none; margin-top: 0; table-layout: fixed; border-collapse: collapse;">
        <tr>
          <!-- COLUMN 1: SYSTEM DETAIL -->
          <td style="width: 33.33%; border-right: 1px solid #cbd5e1; vertical-align: top;">
            <div style="background-color: #f1f5f9; border-bottom: 1px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt; color: #1e3a8a; padding: 5px; text-transform: uppercase;">
              System Detail
            </div>
            <div style="padding: 6px 10px; text-align: center; font-size: 9pt; line-height: 1.3; color: #1e293b;">
              ${form.systemDetail ? `<b>${form.systemDetail}</b>` : '<span style="color: #94a3b8; font-style: italic;">N.A</span>'}
            </div>
          </td>
          <!-- COLUMN 2: MAKER & MODEL -->
          <td style="width: 33.33%; border-right: 1px solid #cbd5e1; vertical-align: top;">
            <div style="background-color: #f1f5f9; border-bottom: 1px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt; color: #1e3a8a; padding: 5px; text-transform: uppercase;">
              Maker & Model
            </div>
            <div style="padding: 6px 10px; text-align: center; font-size: 9pt; line-height: 1.3; color: #1e293b;">
              ${form.maker || form.model || form.serialNo ? `
                ${form.maker ? `<div style="font-weight: bold; color: #020617; text-transform: uppercase;">${form.maker}</div>` : ""}
                ${form.model ? `<div style="margin-top: 2px; color: #334155;">Model: ${form.model}</div>` : ""}
                ${form.serialNo ? `<div style="margin-top: 2px; color: #64748b; font-family: monospace; font-size: 8.5pt;">S/N: ${form.serialNo}</div>` : ""}
              ` : '<span style="color: #94a3b8; font-style: italic;">N.A</span>'}
            </div>
          </td>
          <!-- COLUMN 3: PCB MARKINGS -->
          <td style="width: 33.33%; vertical-align: top;">
            <div style="background-color: #f1f5f9; border-bottom: 1px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 8.5pt; color: #1e3a8a; padding: 5px; text-transform: uppercase;">
              PCB Markings
            </div>
            <div style="padding: 6px 10px; text-align: center; font-size: 9pt; line-height: 1.3; color: #1e293b; font-family: monospace;">
              ${form.pcbNoMarkings ? `<b style="color: #334155;">${form.pcbNoMarkings}</b>` : '<span style="color: #94a3b8; font-style: italic;">N.A</span>'}
            </div>
          </td>
        </tr>
      </table>

      <!-- PART 2: REPORTED PROBLEMS & WITNESSED SYMPTOMS -->
      <div style="background-color: #1e3a8a; color: #ffffff; font-size: 9.5pt; font-weight: bold; padding: 6px 10px; margin-top: 20px; border-radius: 4px 4px 0 0; text-transform: uppercase;">
        PART 2: REPORTED PROBLEMS & WITNESSED SYMPTOMS
      </div>
      <table class="block-table" cellspacing="0" cellpadding="0" style="margin-top: 0; border: 1px solid #cbd5e1; border-top: none; width: 100%; border-collapse: collapse;">
        <tr>
          <!-- 100% width row for PROBLEMS & SYMPTOMS -->
          <td style="width: 100%; vertical-align: top; padding: 10px;">
            <div style="font-size: 8.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">
              Reported Problems & Witnessed Symptoms
            </div>
            <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8px; border-radius: 4px; font-size: 9pt; color: ${form.problems ? '#1e293b' : '#cbd5e1'}; min-height: 100px; line-height: 1.3; white-space: pre-wrap;">
              ${getFieldValue(form.problems, "please fill in")}
            </div>
          </td>
        </tr>
        <tr>
          <!-- 100% width row for ATTACHMENTS (TEXT, TABLES & PHOTOS) -->
          <td style="width: 100%; vertical-align: top; padding: 10px; background-color: #f8fafc; border-top: 1px solid #cbd5e1;">
            <!-- REMARKS PANE (MOVED HERE AS ANOTHER PANE ABOVE PHOTOS OR ATTACHMENT DETAILS) -->
            <div style="font-size: 8.5pt; font-weight: bold; color: #4338ca; text-transform: uppercase; margin-bottom: 4px;">
              Remark
            </div>
            <div style="background-color: #ffffff; border: 1px solid #cbd5e1; padding: 8px; border-radius: 4px; font-size: 9pt; color: #1e293b; min-height: 40px; line-height: 1.3; margin-bottom: 12px; white-space: pre-wrap;">
              ${getFieldValue(form.remark, "N.A")}
            </div>

            ${form.attachmentsText && form.attachmentsText.trim() !== "" ? `
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 8px; border-radius: 4px; font-size: 9pt; color: #334155; margin-bottom: 10px; line-height: 1.3; font-family: sans-serif; white-space: pre-wrap;">
                ${form.attachmentsText}
              </div>
            ` : `
              <div style="border: 1px dashed #cbd5e1; padding: 8px; text-align: center; font-size: 8.5pt; color: #94a3b8; font-style: italic; margin-bottom: 10px; background-color: #ffffff;">
                No additional table or reference remarks provided
              </div>
            `}

            <!-- Inline photos block -->
            <div style="margin-top: 8px;">
              ${photosHtml}
            </div>
          </td>
        </tr>
      </table>

      <!-- 7. REALISTIC SIGNATURE FLOATS IN WORD -->
      <table class="block-table" cellspacing="0" cellpadding="5" style="margin-top: 20px;">
        <tr>
          <!-- Authorized Signature -->
          <td style="width: 50%; padding-right: 15px;">
            <div class="sig-box">
              <div style="height: 50px; text-align: center; vertical-align: middle;">
                <p style="font-family: Arial, sans-serif; color: #94a3b8; font-size: 8.5pt; font-weight: bold; margin: 15px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  COMPUTER GENERATED. SIGN NO NEED
                </p>
              </div>
              <div class="sig-line">Authorized Signature</div>
              <div style="font-size: 7.5pt; font-weight: bold; color: #334155;">CEL-RON ENTERPRISES PTE LTD</div>
            </div>
          </td>
          <!-- Customer Acknowledgment -->
          <td style="width: 50%; padding-left: 15px;">
            <div class="sig-box">
              <div style="height: 50px; text-align: center; vertical-align: middle;">
                <p style="font-family: Arial, sans-serif; color: #94a3b8; font-size: 8.5pt; font-weight: bold; margin: 15px 0 0 0; letter-spacing: 0.5px; text-align: center;">
                  We Confirm the above Information.
                </p>
              </div>
              <div class="sig-line">Customer Acknowledgment</div>
              <div style="font-size: 7.5pt; font-weight: bold; color: #334155; text-transform: uppercase;">
                ${getFieldValue(form.customer, "SUNSAI ENGINEERING PTE LTD").toUpperCase()}
              </div>
            </div>
          </td>
        </tr>
      </table>

      <!-- 8. CENTRED WEBSITE DIVISION footer -->
      <table border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-top: 2px solid #1e3a8a; margin-top: 25px; padding-top: 10px; border-collapse: collapse;">
        <tr>
          <!-- Level 3 bizSAFE Logo -->
          <td style="width: 30%; text-align: left; vertical-align: middle;">
            ${form.bizSafeLogo ? `
              <img src="${form.bizSafeLogo}" width="138" height="44" style="width: 138px; height: 44px; border-radius: 4px;" alt="bizSAFE Logo" />
            ` : `
              <svg width="110" height="35" viewBox="0 0 110 35" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                <rect width="110" height="35" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
                <!-- Charcoal bold "SAFE" -->
                <text x="36" y="22" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-size="14" fill="#374151">SAFE</text>
                
                <!-- Red cursive-style "biz" -->
                <text x="8" y="24" font-family="'Brush Script MT', 'Comic Sans MS', cursive" font-weight="bold" font-size="18" fill="#dc2626">biz</text>
                
                <!-- The signature red swoosh line slashing from z across the top of SAFE -->
                <path d="M 12 25 Q 32 22 72 11" stroke="#dc2626" stroke-width="2" stroke-linecap="round" fill="none" />
                
                <!-- Green medical safety plus sign overlapping the SAFE area -->
                <g transform="translate(73, 10)">
                  <rect x="2.5" y="0" width="2.5" height="8" fill="#16a34a" rx="0.3" />
                  <rect x="0" y="2.75" width="7.5" height="2.5" fill="#16a34a" rx="0.3" />
                </g>

                <!-- Subscript numeral "3" -->
                <text x="91" y="28" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-size="11" fill="#374151">3</text>
              </svg>
            `}
          </td>
          
          <!-- Centered website links -->
          <td style="width: 40%; text-align: center; vertical-align: middle;">
            <div style="font-family: Arial, sans-serif; font-size: 11pt; font-weight: bold; letter-spacing: 3px; color: #1e3a8a; text-transform: uppercase;">
              WWW.CELRON.NET
            </div>
          </td>
          
          <!-- ISO 9001 quality certificate icon -->
          <td style="width: 30%; text-align: right; vertical-align: middle;">
            ${form.isoLogo ? `
              <img src="${form.isoLogo}" width="138" height="44" style="width: 138px; height: 44px; border-radius: 4px;" alt="ISO 9001 Logo" />
            ` : `
              <svg width="110" height="35" viewBox="0 0 110 35" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                <rect width="110" height="35" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
                <circle cx="22" cy="17" r="11" fill="#1e3a8a"/>
                <circle cx="22" cy="17" r="11" stroke="#ffffff" stroke-width="0.75" fill="none"/>
                <path d="M11 17H33M22 6V28M15 11.5C18 14 18 20 15 22.5M29 11.5C26 14 26 20 29 22.5" stroke="#ffffff" stroke-width="0.5" fill="none"/>
                <text x="39" y="15" font-family="Arial, sans-serif" font-weight="bold" font-size="10" fill="#1e3a8a">ISO 9001</text>
                <text x="39" y="23" font-family="Arial, sans-serif" font-weight="bold" font-size="6.5" fill="#1e3a8a" letter-spacing="0.5">2015 CERTIFIED</text>
                <text x="39" y="29" font-family="Arial, sans-serif" font-weight="bold" font-size="5" fill="#64748b" letter-spacing="0.3">QUALITY MANAGEMENT</text>
              </svg>
            `}
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  // Standard Blob stream mapping to target MS Word attachment
  const blob = new Blob(["\ufeff" + documentHtml], {
    type: "application/msword;charset=utf-8",
  });

  // Client-side auto click download trigger
  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.href = url;
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  
  // Clean context leftovers
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
}
