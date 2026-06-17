export interface PCBRepairForm {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string; // Internal title to identify the form in the history list (e.g. "Morning Carina Crane PCB")
  
  // CUSTOMER INFO
  customer: string;
  vesselName: string;
  
  // COLLECTION INFO
  collectedFrom: string;
  collectedDate: string;
  orderedBy: string;
  
  // SYSTEM INFO
  systemDetail: string;
  maker: string;
  model: string;
  serialNo: string;
  
  // PCB INFO
  pcbNoMarkings: string;
  problems: string;
  symptoms: string;
  
  // ATTACHMENTS INFO
  attachmentsText?: string; // Additional notes, tables, data, photos references in right text field
  remark?: string; // Additional remarks for Part 2 or elsewhere
  
  // Images (Base64 strings or ObjectUrls)
  photos: string[];
  bizSafeLogo?: string;
  isoLogo?: string;
  celronLogo?: string;
  repairStatus?: string;
}
