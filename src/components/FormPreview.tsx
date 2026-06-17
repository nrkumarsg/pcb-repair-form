import React from "react";
import { PCBRepairForm } from "../types";
import FormHeader from "./FormHeader";
import { calculateJobNumber } from "../utils/jobRef";

interface FormPreviewProps {
  form: PCBRepairForm;
  showSamplePhoto: boolean;
  savedForms?: PCBRepairForm[];
}

export default function FormPreview({ form, showSamplePhoto, savedForms }: FormPreviewProps) {
  // Format Date to DD-MM-YYYY or custom date
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

  // Generate a dynamic, realistic job number based on collection date or draft title
  const getJobNumber = () => {
    return calculateJobNumber(form, savedForms);
  };

  // Helper to render value or custom placeholders
  const renderValue = (value: string, placeholderType: "optional_blue" | "required_red" | "normal") => {
    if (value && value.trim() !== "") {
      return (
        <span className="text-gray-900 font-bold whitespace-pre-wrap">
          {value}
        </span>
      );
    }

    if (placeholderType === "optional_blue") {
      return (
        <span className="text-sky-500 italic font-semibold">
          if possible please fill it up
        </span>
      );
    }

    if (placeholderType === "required_red") {
      return (
        <span className="text-gray-300 italic font-medium">
          please fill in
        </span>
      );
    }

    return <span className="text-gray-400 italic font-medium">N.A</span>;
  };

  return (
    <div 
      id="repair-form-printable" 
      className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-2xl border border-gray-200 select-none print:shadow-none print:border-none flex flex-col justify-start font-sans text-[11px] text-gray-800"
      style={{ boxSizing: "border-box", padding: "0.8in" }}
    >
      {/* 1. BRANDING HEADER */}
      <FormHeader celronLogo={form.celronLogo} />

      {/* 2. SUBTITLE BANNER: PCB REPAIR FORM */}
      <div className="bg-blue-900 text-white px-4 py-2.5 mt-3.5 select-none rounded-lg flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
        <span className="text-sky-200">
          JOB. REF: <span className="text-white font-semibold font-mono">{getJobNumber()}</span>
        </span>
        <h2 className="text-[14px] font-black text-white tracking-widest font-sans">
          PCB REPAIR FORM
        </h2>
        <span className="text-sky-200">
          DATE: <span className="text-white font-semibold">{formatDateString(form.collectedDate)}</span>
        </span>
      </div>

      {/* 3. DUAL COLUMN INFO BOXES (TO BOX vs CASE DETAILS) */}
      <div className="grid grid-cols-[1.1fr_0.9fr] gap-4 mt-4">
        
        {/* LEFT BOX: TO CUSTOMER */}
        <div className="border border-slate-300 rounded-lg p-3.5 flex flex-col justify-between bg-slate-50/40">
          <div>
            <div className="text-[9px] font-bold text-blue-900 tracking-wide uppercase mb-1">
              TO:
            </div>
            <div className="text-[13px] font-extrabold text-gray-900 leading-snug">
              {form.customer ? form.customer : <span className="text-gray-400 italic font-normal">Sunsai Engineering Pte Ltd</span>}
            </div>
            <div className="text-[10px] text-gray-600 font-medium leading-relaxed mt-1.5 whitespace-pre-wrap">
              {form.collectedFrom ? form.collectedFrom : <span className="text-gray-400 italic font-normal">Blk 290D, #15-366, Singapore 651290</span>}
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-3 pt-2.5">
            <span className="text-[9px] font-bold text-slate-500 block uppercase">
              ATTN / CONTACT PERSON:
            </span>
            <span className="text-[11px] font-bold text-slate-800">
              {form.orderedBy ? form.orderedBy : <span className="text-gray-400 italic font-normal">AL. Pandiselvam BE</span>}
            </span>
          </div>
        </div>

        {/* RIGHT BOX: CASE MATRIX */}
        <div className="border border-slate-300 rounded-lg bg-white overflow-hidden text-[10px]">

          <div className="grid grid-cols-[110px_1fr] border-b border-slate-100 last:border-b-0">
            <div className="bg-slate-50 border-r border-slate-300 px-3 py-1.5 text-blue-900 font-extrabold uppercase tracking-wide">
              VESSEL / PROJ
            </div>
            <div className="px-3 py-1.5 font-bold text-slate-900 truncate">
              {form.vesselName ? form.vesselName.toUpperCase() : "MORNING CARINA"}
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] border-b border-slate-100 last:border-b-0">
            <div className="bg-slate-50 border-r border-slate-300 px-3 py-1.5 text-blue-900 font-extrabold uppercase tracking-wide">
              REPAIR STATUS
            </div>
            <div className="px-3 py-1.5 font-extrabold text-amber-600">
              {form.repairStatus || "WALK IN / DIAGNOSTIC"}
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] border-b border-slate-100 last:border-b-0">
            <div className="bg-slate-50 border-r border-slate-300 px-3 py-1.5 text-blue-900 font-extrabold uppercase tracking-wide">
              JOB. REF
            </div>
            <div className="px-3 py-1.5 font-mono text-emerald-700 font-bold">
              {getJobNumber()}
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] border-b border-slate-100 last:border-b-0">
            <div className="bg-slate-50 border-r border-slate-300 px-3 py-1.5 text-blue-900 font-extrabold uppercase tracking-wide">
              TECHNICIAN
            </div>
            <div className="px-3 py-1.5 font-bold text-gray-800">
              Mark S. / N.R.KUMAR
            </div>
          </div>
        </div>
      </div>

      {/* 5. PART 1: SYSTEM SPECIFICATION DETAILS (REDESIGNED: HORIZONTAL GRID) */}
      <div className="mt-3.5 select-none animate-fadeIn">
        <div className="bg-blue-900 text-white px-3.5 py-2 font-bold uppercase tracking-wider text-[9.5px] rounded-t-lg flex items-center justify-between">
          <span>PART 1: EQUIPMENT DESCRIPTION & SPECIFICATIONS</span>
          <span className="text-[7.5px] bg-sky-600 px-2 py-0.5 rounded text-white font-semibold">TECHNICAL INFO</span>
        </div>
        <div className="grid grid-cols-3 border-x border-b border-slate-300 text-[11px] min-h-[68px] divide-x divide-slate-300 shadow-xs bg-slate-50/10 rounded-b-lg overflow-hidden">
          {/* COLUMN 1: SYSTEM DETAIL */}
          <div className="flex flex-col">
            <div className="bg-slate-100 border-b border-slate-300 px-3 py-1.5 text-center font-bold text-blue-900 uppercase text-[8.5px] tracking-wider select-none">
              System Detail
            </div>
            <div className="p-2.5 text-gray-900 flex-grow flex items-center justify-center text-center">
              {form.systemDetail ? (
                <span className="font-semibold text-slate-800 whitespace-pre-wrap">{form.systemDetail}</span>
              ) : (
                <span className="text-slate-400 font-medium italic">N.A</span>
              )}
            </div>
          </div>

          {/* COLUMN 2: MAKER & MODEL */}
          <div className="flex flex-col">
            <div className="bg-slate-100 border-b border-slate-300 px-3 py-1.5 text-center font-bold text-blue-900 uppercase text-[8.5px] tracking-wider select-none">
              Maker & Model
            </div>
            <div className="p-2.5 text-gray-900 flex-grow flex flex-col justify-center items-center text-center gap-1">
              {form.maker || form.model || form.serialNo ? (
                <>
                  {form.maker && <div className="font-bold text-blue-950 uppercase">{form.maker}</div>}
                  {form.model && <div className="text-slate-700 font-medium text-[10px]">Model: {form.model}</div>}
                  {form.serialNo && <div className="text-slate-500 font-mono text-[9px]">S/N: {form.serialNo}</div>}
                </>
              ) : (
                <span className="text-slate-400 font-medium italic">N.A</span>
              )}
            </div>
          </div>

          {/* COLUMN 3: PCB MARKINGS */}
          <div className="flex flex-col">
            <div className="bg-slate-100 border-b border-slate-300 px-3 py-1.5 text-center font-bold text-blue-900 uppercase text-[8.5px] tracking-wider select-none">
              PCB Markings
            </div>
            <div className="p-2.5 text-gray-900 flex-grow flex items-center justify-center text-center">
              {form.pcbNoMarkings ? (
                <span className="font-mono text-[10px] text-slate-800 leading-relaxed font-semibold whitespace-pre-wrap">{form.pcbNoMarkings}</span>
              ) : (
                <span className="text-slate-400 font-medium italic">N.A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: REPORTED PROBLEMS & WITNESSED SYMPTOMS */}
      <div className="mt-4 select-none flex-grow flex flex-col">
        <div className="bg-blue-900 text-white px-3.5 py-1.5 font-bold uppercase tracking-wider text-[9.5px] rounded-t-lg flex items-center justify-between">
          <span>PART 2: REPORTED PROBLEMS & WITNESSED SYMPTOMS</span>
          <span className="text-[7.5px] bg-slate-500 px-1.5 py-0.5 rounded text-white font-semibold">DIAGNOSTIC DETAILS</span>
        </div>
        <div className="border-x border-b border-slate-300 text-[11px] flex flex-col shadow-xs bg-slate-50/10 rounded-b-lg overflow-hidden">
          {/* PROBLEMS & WITNESSED SYMPTOMS IN 100% WIDTH */}
          <div className="p-3.5 text-gray-900 flex flex-col gap-3">
            <div>
              <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 select-none">
                Reported Problems & Witnessed Symptoms
              </span>
              <div 
                id="pdf-problems-symptoms"
                data-raw-value={form.problems || ""}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded text-slate-800 font-semibold leading-relaxed whitespace-pre-wrap text-[11px] min-h-[130px]"
              >
                {renderValue(form.problems, "required_red")}
              </div>
            </div>
          </div>

          {/* ATTACHED CONTENT (TEXT / TABLES AND PHOTOS AS A SEPARATE ROW INTERNALLY) */}
          <div className="bg-slate-50 border-t border-slate-300 p-3.5 flex flex-col gap-3">
            {/* REMARK PANE (MOVED HERE AS ANOTHER PANE ABOVE THE PHOTOS GRID) */}
            <div>
              <span className="block text-[8px] font-bold text-indigo-700 uppercase tracking-widest mb-1 select-none">
                REMARK
              </span>
              <div className="bg-white border border-slate-300 p-3 rounded text-[10.5px] leading-relaxed text-slate-850 whitespace-pre-wrap font-semibold">
                {renderValue(form.remark || "", "normal")}
              </div>
            </div>

            {/* If there is attachment text notes reference, render it in 100% width */}
            {form.attachmentsText && form.attachmentsText.trim() !== "" && (
              <div className="bg-white border border-slate-300 p-3 rounded text-[10.5px] leading-relaxed text-slate-850 whitespace-pre-wrap font-medium">
                {form.attachmentsText}
              </div>
            )}

            {/* Photos Grid Container with provision to add 2 to 3 photos in the one row */}
            <div className="w-full">
              {form.photos.length === 0 && !showSamplePhoto ? (
                <div className="flex flex-col items-center justify-center p-3 text-gray-400 text-center bg-white border border-dashed border-slate-300 rounded min-h-[90px]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[8.5px] font-semibold text-gray-400">No attached PCB pictures</span>
                </div>
              ) : (
                /* Dynamic grid view for up to 3 photos in a single row */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {form.photos.map((photo, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg overflow-hidden relative bg-white flex items-center justify-center p-1.5 h-[165px] shadow-2xs animate-fadeIn">
                      <img
                        src={photo}
                        alt={`Attachment ${index + 1}`}
                        className="max-h-full max-w-full object-contain rounded"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                  {showSamplePhoto && (
                    <div className="border border-dashed border-sky-300 rounded-lg p-3 h-[165px] bg-amber-50/25 flex flex-col items-center justify-center relative shadow-2xs">
                      <div className="scale-[0.75] origin-center">
                        <div className="w-[120px] bg-amber-200 border border-amber-500 rounded p-1.5 text-center font-mono text-[9px] font-bold text-slate-800 leading-tight">
                          MORNING CARINA PCB
                        </div>
                      </div>
                      <span className="absolute bottom-1.5 text-center text-[7px] font-bold text-sky-750 font-sans tracking-wide uppercase">
                        SAMPLE PHOTO
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 7. AUTH SIGNATURES AND CUSTOMER ACKNOWLEDGMENT CODES */}
      <div className="grid grid-cols-2 gap-6 mt-3 select-none pt-1">
        {/* Left Signature Block */}
        <div className="border border-slate-300 rounded-lg pt-2 pb-3.5 px-3 text-center bg-slate-50/20 relative">
          <div className="h-9 flex items-center justify-center">
            <p className="text-[10px] font-bold text-slate-400 select-none tracking-wide text-center">
              COMPUTER GENERATED. SIGN NO NEED
            </p>
          </div>
          <div className="border-t border-slate-350 pt-1.5 text-[8px] font-bold uppercase tracking-wider text-slate-500">
            AUTHORIZED SIGNATURE
          </div>
          <div className="text-[7.5px] font-extrabold text-slate-800 mt-1">
            CEL-RON ENTERPRISES PTE LTD
          </div>
        </div>

        {/* Right Signature Block */}
        <div className="border border-slate-300 rounded-lg pt-2 pb-3.5 px-3 text-center bg-slate-50/20 relative">
          <div className="h-9 flex items-center justify-center">
            <p className="text-[9.5px] font-bold text-slate-400 select-none tracking-wide text-center">
              We Confirm the above Information.
            </p>
          </div>
          <div className="border-t border-slate-350 pt-1.5 text-[8px] font-bold uppercase tracking-wider text-slate-500">
            CUSTOMER ACKNOWLEDGMENT
          </div>
          <div className="text-[7.5px] font-extrabold text-slate-800 mt-1">
            {form.customer ? form.customer.toUpperCase() : "SUNSAI ENGINEERING PTE LTD"}
          </div>
        </div>
      </div>

      {/* 8. CENTERED FOOTER WEB ADDRESS */}
      <div className="mt-6 border-t-2 border-blue-900 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        {/* bizSAFE 3 Logo container */}
        <div className="flex-shrink-0">
          {form.bizSafeLogo ? (
            <img 
              src={form.bizSafeLogo} 
              className="h-11 w-auto max-w-[150px] object-contain rounded" 
              alt="bizSAFE Logo" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <svg width="110" height="35" viewBox="0 0 110 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
              <rect width="110" height="35" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1"/>
              {/* Charcoal bold "SAFE" */}
              <text x="36" y="22" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="950" fontSize="14" fill="#374151" letterSpacing="0">SAFE</text>
              
              {/* Red cursive-style "biz" */}
              <text x="8" y="24" fontFamily="'Brush Script MT', 'Comic Sans MS', 'Apple Chancery', cursive" fontWeight="bold" fontSize="18" fill="#dc2626">biz</text>
              
              {/* The signature red swoosh line slashing from z across the top of SAFE */}
              <path d="M 12 25 Q 32 22 72 11" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
              
              {/* Green medical safety plus sign overlapping the SAFE area */}
              <g transform="translate(73, 10)">
                <rect x="2.5" y="0" width="2.5" height="8" fill="#16a34a" rx="0.3" />
                <rect x="0" y="2.75" width="7.5" height="2.5" fill="#16a34a" rx="0.3" />
              </g>

              {/* Subscript numeral "3" */}
              <text x="91" y="28" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="900" fontSize="11" fill="#374151">3</text>
            </svg>
          )}
        </div>

        <span className="text-[11px] font-black tracking-[0.3em] text-blue-950 block">
          WWW.CELRON.NET
        </span>

        {/* ISO 9001 Logo container */}
        <div className="flex-shrink-0">
          {form.isoLogo ? (
            <img 
              src={form.isoLogo} 
              className="h-11 w-auto max-w-[150px] object-contain rounded" 
              alt="ISO 9001 Logo" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <svg width="110" height="35" viewBox="0 0 110 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
              <rect width="110" height="35" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1"/>
              <circle cx="22" cy="17" r="11" fill="#1e3a8a"/>
              <circle cx="22" cy="17" r="11" stroke="#ffffff" strokeWidth="0.75" fill="none"/>
              <path d="M11 17H33M22 6V28M15 11.5C18 14 18 20 15 22.5M29 11.5C26 14 26 20 29 22.5" stroke="#ffffff" strokeWidth="0.5" fill="none"/>
              <text x="39" y="15" fontFamily="sans-serif" fontWeight="800" fontSize="10" fill="#1e3a8a">ISO 9001</text>
              <text x="39" y="23" fontFamily="sans-serif" fontWeight="700" fontSize="6.5" fill="#1e3a8a" letterSpacing="0.5">2015 CERTIFIED</text>
              <text x="39" y="29" fontFamily="sans-serif" fontWeight="600" fontSize="5" fill="#64748b" letterSpacing="0.3">QUALITY MANAGEMENT</text>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
