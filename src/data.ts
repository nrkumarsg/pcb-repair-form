import { PCBRepairForm } from "./types";

const getTodayStr = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const SAMPLE_PCB_FORM: PCBRepairForm = {
  id: "sample-form-1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  title: "Morning Carina Crane PCB",
  customer: "Brosna shipping",
  vesselName: "MORNING CARINA",
  collectedFrom: "GRIFFIN, JLN AMPAS",
  collectedDate: getTodayStr(),
  orderedBy: "CV PRASAD",
  systemDetail: "ENGINE ROOM CRANE PCB'S 3PCS",
  maker: "",
  model: "",
  serialNo: "",
  pcbNoMarkings: "THB-150D – 2PCS\nTHB-150C – 1PC.",
  problems: "",
  symptoms: "",
  attachmentsText: "",
  remark: "PCB track damaged, components burned due to power surge. Repair of components and tracks is recommended.",
  photos: [] // Will be populated with interactive placeholders if empty
};
