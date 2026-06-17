import { PCBRepairForm } from "../types";

/**
 * Calculates the dynamic job number for a given form.
 * Format is JOB. REF: CEL-YYYY-PCB-XXXX where XXXX is a running number starting from 3000.
 */
export function calculateJobNumber(form: PCBRepairForm, savedForms: PCBRepairForm[] = [form]): string {
  // Sort forms ascending by createdAt to establish a stable chronological running number
  const sorted = [...savedForms].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  const index = sorted.findIndex((f) => f.id === form.id);
  const runningNumber = index !== -1 ? 3000 + index : 3000;
  
  // Extract year from collectedDate or fallback to createdAt
  let year = "2026";
  if (form.collectedDate) {
    const parts = form.collectedDate.split("-");
    if (parts.length === 3) {
      year = parts[0];
    } else {
      year = new Date(form.collectedDate).getFullYear().toString();
    }
  } else if (form.createdAt) {
    year = new Date(form.createdAt).getFullYear().toString();
  }

  // Handle default mock sample dates gracefully if they return NaN (e.g. invalid date formats)
  if (isNaN(Number(year)) || year.length !== 4) {
    year = "2020"; // Return 2020 for the original sample form
  }

  return `CEL-${year}-PCB-${runningNumber}`;
}
