import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Parses and converts any OKLCH color strings inside standard CSS output to RGB/RGBA.
 * This prevents html2canvas from crashing because of Tailwind v4's OKLCH color values.
 */
export function convertOklchStringToRgbString(str: string): string {
  if (!str || typeof str !== "string") return str;
  if (!str.includes("oklch")) return str;

  // Match oklch(L C H) or oklch(L C H / A) with arbitrary spacing or commas
  const regex = /oklch\(\s*([\d.]+%?)\s*[\s,]\s*([\d.]+)\s*[\s,]\s*([\d.]+)(?:\s*[\s,/]\s*([\d.]+%?))?\s*\)/g;

  return str.replace(regex, (match, lStr, cStr, hStr, aStr) => {
    let L = lStr.endsWith("%") ? parseFloat(lStr) / 100 : parseFloat(lStr);
    let C = parseFloat(cStr);
    let H = parseFloat(hStr);
    let A = aStr ? (aStr.endsWith("%") ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;

    // Convert OKLCH to sRGB using the standard W3C formula
    let hRad = (H * Math.PI) / 180;
    let a = C * Math.cos(hRad);
    let b = C * Math.sin(hRad);

    let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    let s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    // Prevent invalid power domains
    let l = l_ > 0 ? Math.pow(l_, 3) : 0;
    let m = m_ > 0 ? Math.pow(m_, 3) : 0;
    let s = s_ > 0 ? Math.pow(s_, 3) : 0;

    let r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const transfer = (c: number) => {
      return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    };

    let finR = Math.round(Math.max(0, Math.min(1, transfer(r_lin))) * 255);
    let finG = Math.round(Math.max(0, Math.min(1, transfer(g_lin))) * 255);
    let finB = Math.round(Math.max(0, Math.min(1, transfer(b_lin))) * 255);

    if (A === 1) {
      return `rgb(${finR}, ${finG}, ${finB})`;
    } else {
      return `rgba(${finR}, ${finG}, ${finB}, ${A})`;
    }
  });
}

/**
 * Parses and converts any OKLab color strings inside standard CSS output to RGB/RGBA.
 * This prevents html2canvas from crashing because of modern Tailwind oklab values.
 */
export function convertOklabStringToRgbString(str: string): string {
  if (!str || typeof str !== "string") return str;
  if (!str.includes("oklab")) return str;

  // Match oklab(L a b) or oklab(L a b / A) with arbitrary spacing or commas
  const regex = /oklab\(\s*([\d.]+%?)\s*[\s,]\s*([+-]?[\d.]+)\s*[\s,]\s*([+-]?[\d.]+)(?:\s*[\s,/]\s*([\d.]+%?))?\s*\)/g;

  return str.replace(regex, (match, lStr, aStr, bStr, aValStr) => {
    let L = lStr.endsWith("%") ? parseFloat(lStr) / 100 : parseFloat(lStr);
    let a = parseFloat(aStr);
    let b = parseFloat(bStr);
    let A = aValStr ? (aValStr.endsWith("%") ? parseFloat(aValStr) / 100 : parseFloat(aValStr)) : 1;

    let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    let s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    // Prevent invalid power domains
    let l = l_ > 0 ? Math.pow(l_, 3) : 0;
    let m = m_ > 0 ? Math.pow(m_, 3) : 0;
    let s = s_ > 0 ? Math.pow(s_, 3) : 0;

    let r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const transfer = (c: number) => {
      return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    };

    let finR = Math.round(Math.max(0, Math.min(1, transfer(r_lin))) * 255);
    let finG = Math.round(Math.max(0, Math.min(1, transfer(g_lin))) * 255);
    let finB = Math.round(Math.max(0, Math.min(1, transfer(b_lin))) * 255);

    if (A === 1) {
      return `rgb(${finR}, ${finG}, ${finB})`;
    } else {
      return `rgba(${finR}, ${finG}, ${finB}, ${A})`;
    }
  });
}

/**
 * Runs all color normalization routines to produce HTML2canvas compatible styles.
 */
export function normalizeColorString(str: string): string {
  let res = str;
  if (res && typeof res === "string") {
    if (res.includes("oklch")) {
      res = convertOklchStringToRgbString(res);
    }
    if (res.includes("oklab")) {
      res = convertOklabStringToRgbString(res);
    }
  }
  return res;
}

/**
 * Capture an HTML element and download it as a high-fidelity PDF
 * @param elementId The id of the HTML element to capture (e.g. 'repair-form-printable')
 * @param filename The name of the downloaded file
 * @param onProgress Callback to update loading states
 */
export async function exportToPDF(
  elementId: string, 
  filename: string, 
  onProgress?: (loading: boolean) => void
): Promise<boolean> {
  if (onProgress) onProgress(true);

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    if (onProgress) onProgress(false);
    return false;
  }

  // Save original styles and back them up
  const originalBoxShadow = element.style.boxShadow;
  const originalBorder = element.style.border;
  
  element.style.boxShadow = "none";
  element.style.border = "none";

  // Back up original host computed styles method
  const originalHostGetComputedStyle = window.getComputedStyle;

  // Intercept standard window computed styles so oklch and oklab value requests are returned as plain rgb strings
  window.getComputedStyle = function (elt, pseudoElt) {
    const styles = originalHostGetComputedStyle(elt, pseudoElt);
    return new Proxy(styles, {
      get(target, prop) {
        if (prop === "getPropertyValue") {
          return function (propertyName: string) {
            const val = target.getPropertyValue(propertyName);
            return normalizeColorString(val);
          };
        }
        const value = Reflect.get(target, prop);
        if (typeof value === "function") {
          return value.bind(target);
        }
        if (typeof value === "string") {
          return normalizeColorString(value);
        }
        return value;
      }
    });
  };

  let canvas;
  try {
    // 2. Capture the element using high-scale html2canvas (essential for text crispness)
    canvas = await html2canvas(element, {
      scale: 2.5, // Crisp high-res export
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794, // Standard A4 width reference in pixels
      windowHeight: 1123, // Standard A4 height reference in pixels
      onclone: (clonedDoc) => {
        const clonedWindow = clonedDoc.defaultView;
        if (clonedWindow) {
          const originalClonedGetComputedStyle = clonedWindow.getComputedStyle;
          clonedWindow.getComputedStyle = function (elt, pseudoElt) {
            const styles = originalClonedGetComputedStyle(elt, pseudoElt);
            return new Proxy(styles, {
              get(target, prop) {
                if (prop === "getPropertyValue") {
                  return function (propertyName: string) {
                    const val = target.getPropertyValue(propertyName);
                    return normalizeColorString(val);
                  };
                }
                const value = Reflect.get(target, prop);
                if (typeof value === "function") {
                  return value.bind(target);
                }
                if (typeof value === "string") {
                  return normalizeColorString(value);
                }
                return value;
              }
            });
          };
        }

        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Disable any parent scaling transforms that skew bounding boxes
          let p: HTMLElement | null = clonedElement;
          while (p) {
            p.style.transform = "none";
            p.style.transformOrigin = "top left";
            p.style.filter = "none";
            p = p.parentElement;
          }

          // Inject custom typography styling overrides to prevent any letter-spacing (tracking) or custom fonts 
          // from causing character collision (scribbling) and squishing, while preserving proper spacing.
          const style = clonedDoc.createElement("style");
          style.innerHTML = `
            #repair-form-printable * {
              letter-spacing: normal !important;
              word-spacing: normal !important;
              font-family: Arial, Helvetica, sans-serif !important;
              font-feature-settings: "liga" 0, "clig" 0 !important;
              font-variant-ligatures: none !important;
              text-rendering: geometricPrecision !important;
            }
            #repair-form-printable .font-mono,
            #repair-form-printable code,
            #repair-form-printable [class*="font-mono"] {
              font-family: "Courier New", Courier, monospace !important;
            }
          `;
          clonedDoc.head.appendChild(style);

          // Clear/Empty the visual text elements of the interactive form fields
          // so they don't get baked onto the background image of the canvas,
          // preventing double-laid text
          const interactiveEl = clonedDoc.getElementById("pdf-problems-symptoms");
          if (interactiveEl) {
            interactiveEl.style.color = "transparent"; // Hide from canvas capture
            interactiveEl.innerHTML = ""; // Clear text/placeholder so background is clean white
          }
        }
      }
    });
  } catch (error) {
    console.error("Failed to generate canvas:", error);
    if (onProgress) onProgress(false);
    return false;
  } finally {
    // Restore original styles & handlers immediately
    element.style.boxShadow = originalBoxShadow;
    element.style.border = originalBorder;
    window.getComputedStyle = originalHostGetComputedStyle;
  }

  try {
    // 3. Initiate PDF layout
    const imgData = canvas.toDataURL("image/png", 1.0);
    
    // Create A4 PDF: Portrait ('p'), Unit: mm, Format: A4 [210, 297]
    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297

    // Dynamically calculate the image height proportionally based on canvas aspect ratio
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Check if the content fits within a single page or requires high-fidelity page splitting
    if (imgHeight <= pdfHeight) {
      // Single Page - draw exact proportion at top without vertical squashing
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight, undefined, "FAST");
    } else {
      // Multi-page canvas slice logic (rocksolid sliding viewport slice)
      let leftHeight = imgHeight;
      let position = 0;

      while (leftHeight > 0) {
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
        leftHeight -= pdfHeight;
        position -= pdfHeight;
        
        // Add next page if there is leftover content height
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    
    // 4. Inject interactive editable PDF form fields on top of the calculated layout pages
    const problemsSymptomsEl = document.getElementById("pdf-problems-symptoms");

    if (problemsSymptomsEl) {
      const containerRect = element.getBoundingClientRect();
      const mmPerPx = pdfWidth / containerRect.width;

      const addTextField = (targetEl: HTMLElement | null, fieldName: string) => {
        if (!targetEl) return;
        const rect = targetEl.getBoundingClientRect();
        
        // Relative pixel boundaries within container
        const relLeft = rect.left - containerRect.left;
        const relTop = rect.top - containerRect.top;
        const relWidth = rect.width;
        const relHeight = rect.height;

        // Convert to millimeters
        const leftMm = relLeft * mmPerPx;
        const topMm = relTop * mmPerPx;
        const widthMm = relWidth * mmPerPx;
        const heightMm = relHeight * mmPerPx;

        // Correct page matching Index
        const pageNum = Math.floor(topMm / pdfHeight) + 1;
        const pageTopMm = topMm % pdfHeight;

        // Go to that page in the PDF document context
        if (pdf.internal.pages.length >= pageNum) {
          pdf.setPage(pageNum);
        }

        try {
          const textField = new (pdf as any).AcroForm.TextField();
          textField.Rect = [leftMm, pageTopMm, widthMm, heightMm];
          textField.multiline = true;
          textField.value = targetEl.getAttribute("data-raw-value") || "";
          textField.fieldName = fieldName;
          
          // Style setting (font size, color, background, borders, etc.)
          textField.fontSize = 11;
          
          pdf.addField(textField);
        } catch (e) {
          console.error(`Failed to inject interactive PDF field for ${fieldName}:`, e);
        }
      };

      addTextField(problemsSymptomsEl, "reported_problems_symptoms");
    }
    
    // Save generated PDF
    pdf.save(`${filename}.pdf`);

    if (onProgress) onProgress(false);
    return true;
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    if (onProgress) onProgress(false);
    return false;
  }
}
