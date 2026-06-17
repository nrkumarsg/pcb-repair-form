/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { PCBRepairForm } from "./types";
import { SAMPLE_PCB_FORM } from "./data";
import FormEditor from "./components/FormEditor";
import FormPreview from "./components/FormPreview";
import SavedDrafts from "./components/SavedDrafts";
import BrandingSettings from "./components/BrandingSettings";
import { exportToPDF } from "./utils/pdfExport";
import { exportToWord } from "./utils/wordExport";
import { 
  FileDown, 
  FileText,
  Printer, 
  CloudLightning, 
  Trash, 
  Check, 
  RefreshCw, 
  Activity, 
  Scale, 
  Info,
  Wrench,
  Settings
} from "lucide-react";

export default function App() {
  // Saved forms database in localStorage
  const [savedForms, setSavedForms] = useState<PCBRepairForm[]>(() => {
    try {
      const stored = localStorage.getItem("celron_pcb_forms");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove the second photo (index 1) if form has multiple photos
          return parsed.map((form) => {
            const updated = { ...form };
            if (updated.photos && updated.photos.length >= 2) {
              updated.photos = updated.photos.filter((_, idx) => idx !== 1);
            }
            // Auto-update sample static/mockup date to today's date dynamically
            if (updated.collectedDate === "2020-01-03") {
              const date = new Date();
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              updated.collectedDate = `${year}-${month}-${day}`;
            }
            return updated;
          });
        }
      }
    } catch (e) {
      console.warn("Could not read saved forms from localStorage.", e);
    }
    return [SAMPLE_PCB_FORM];
  });

  // Currently loaded active form
  const [activeFormId, setActiveFormId] = useState<string>(() => {
    return savedForms[0]?.id || SAMPLE_PCB_FORM.id;
  });

  const activeForm = savedForms.find((f) => f.id === activeFormId) || savedForms[0] || SAMPLE_PCB_FORM;

  // Toggle state to display the cardboard-box sample markup on empty/no attachments
  const [showSamplePhoto, setShowSamplePhoto] = useState<boolean>(true);

  // Management state for Branding Settings (Image 2 dedicated page modal)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // States for loaders and status indicators
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger floating status toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync savedForms list with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("celron_pcb_forms", JSON.stringify(savedForms));
    } catch (e) {
      console.error("Failed to sync forms with localStorage", e);
    }
  }, [savedForms]);

  // Handle updates to the loaded active form
  const handleFormChange = (updatedForm: PCBRepairForm) => {
    setSavedForms((prev) => 
      prev.map((f) => (f.id === updatedForm.id ? updatedForm : f))
    );
  };

  // Create a brand new blank form
  const handleCreateNewForm = () => {
    const newForm: PCBRepairForm = {
      id: "form_" + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: "New Repair Draft - " + new Date().toLocaleDateString(),
      customer: "",
      vesselName: "",
      collectedFrom: "",
      collectedDate: new Date().toISOString().split("T")[0],
      orderedBy: "",
      systemDetail: "",
      maker: "",
      model: "",
      serialNo: "",
      pcbNoMarkings: "",
      problems: "",
      symptoms: "",
      attachmentsText: "",
      remark: "",
      photos: []
    };
    setSavedForms((prev) => [newForm, ...prev]);
    setActiveFormId(newForm.id);
    setShowSamplePhoto(false); // Hide demo mock upon starting a blank canvas
    triggerToast("Created a new blank PCB repair template!");
  };

  // Clone an existing form to speed up multi-entry editing
  const handleCloneForm = (formToClone: PCBRepairForm) => {
    const cloned: PCBRepairForm = {
      ...formToClone,
      id: "form_clone_" + Date.now(),
      title: `${formToClone.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSavedForms((prev) => [cloned, ...prev]);
    setActiveFormId(cloned.id);
    triggerToast(`Cloned draft: "${formToClone.title}"`);
  };

  // Delete a form from local database
  const handleDeleteForm = (idToDelete: string) => {
    if (savedForms.length <= 1) {
      triggerToast("Cannot delete the only remaining form template.");
      return;
    }
    const idx = savedForms.findIndex((f) => f.id === idToDelete);
    const updated = savedForms.filter((f) => f.id !== idToDelete);
    setSavedForms(updated);
    
    // Auto-select another form if deleting current active
    if (idToDelete === activeFormId) {
      const nextActive = updated[idx === 0 ? 0 : idx - 1] || updated[0];
      setActiveFormId(nextActive.id);
    }
    triggerToast("Removed PCB Repair draft from history.");
  };

  // Reset current form to pristine sample from user's image
  const handleResetToSample = () => {
    // Generate new active ID to bypass caching if needed, but preserve layout
    const resetSample: PCBRepairForm = {
      ...SAMPLE_PCB_FORM,
      id: activeForm.id, // Replace existing active form's contents
      updatedAt: new Date().toISOString()
    };
    handleFormChange(resetSample);
    setShowSamplePhoto(true); // Re-show demo mock
    triggerToast("Loaded CEL-RON official sample values from screenshot!");
  };

  // Trigger high-fidelity PDF Generation
  const handleDownloadPDF = async () => {
    const filename = (activeForm.title || "pcb_repair_form")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_");
      
    setIsExporting(true);
    triggerToast("Compiling page details... Please wait.");

    // Minor delay to let state render fully
    setTimeout(async () => {
      const success = await exportToPDF(
        "repair-form-printable", 
        filename, 
        setIsExporting
      );
      if (success) {
        triggerToast("A4 PCB Repair Form downloaded successfully!");
      } else {
        triggerToast("Failed to compile SVG/Canvas into PDF. Use standard 'Print' as fallback.");
      }
    }, 450);
  };

  // Clear current fields to start typing fresh on active template
  const handleClearFields = () => {
    const cleared: PCBRepairForm = {
      ...activeForm,
      customer: "",
      vesselName: "",
      collectedFrom: "",
      collectedDate: new Date().toISOString().split("T")[0],
      orderedBy: "",
      systemDetail: "",
      maker: "",
      model: "",
      serialNo: "",
      pcbNoMarkings: "",
      problems: "",
      symptoms: "",
      attachmentsText: "",
      remark: "",
      photos: []
    };
    handleFormChange(cleared);
    setShowSamplePhoto(false);
    triggerToast("Cleared current form inputs.");
  };

  // Execute browser printing
  const handleBrowserPrint = () => {
    triggerToast("Opening browser Print dialog... Ready to save as PDF.");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col">
      
      {/* 1. TOP PORTAL CONTROLS HEADER */}
      <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shrink-0 print:hidden select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-lg text-white">
            P
          </div>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight">
            CEL-RON PCB Repair Portal <span className="text-slate-400 font-normal hidden sm:inline ml-2">| Repair Service Hub</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          {/* Settings gear button to open Image 2 Branding Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-705 border border-slate-700/60 text-slate-200 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Open Document Branding & Certification Settings Page"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Document Branding Settings</span>
          </button>

          <span className="bg-blue-900/50 px-3 py-1 rounded border border-blue-700 text-blue-200">
            Case: #{activeForm.vesselName ? activeForm.vesselName.replace(/\s+/g, "-").toUpperCase() : "ACTIVE-DRAFT"}
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-700 font-semibold text-xs flex items-center justify-center border border-slate-600 text-slate-200">
            MS
          </div>
        </div>
      </header>

      {/* DEDICATED BRANDING SETTINGS PAGE OVERLAY */}
      <BrandingSettings
        form={activeForm}
        onChange={handleFormChange}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* TOAST SYSTEM CONTAINER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0e1e38] text-white border-l-4 border-blue-500 shadow-xl py-3.5 px-5 rounded-r-lg max-w-sm flex items-center gap-3 animation-slideIn font-medium text-xs print:hidden">
          <Check className="h-4 w-4 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LOADER EXPORTING MODAL COVERAGE */}
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 text-center max-w-xs border border-gray-100 flex flex-col items-center gap-4">
            <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
            <div>
              <p className="font-bold text-slate-850 text-sm">Generating Repair Document</p>
              <p className="text-xs text-slate-500 mt-1">Compiling layout elements, scale-rendering textures and drawing embedded JPEG/PNG photos...</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[85%] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CORE WORKSPACE */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-6 p-6 max-w-[1900px] mx-auto w-full print:bg-white print:p-0 print:border-none min-h-0">
        
        {/* LEFT WORKSPACE PANEL: INPUT FIELDS FORM EDITOR */}
        <section className="flex flex-col gap-4 print:hidden">
          {/* Quick instructions alert info box */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                i
              </div>
              <div className="text-xs text-blue-800 leading-relaxed">
                <p className="font-bold mb-0.5">Field Service Note:</p>
                Type diagnostics, customer info & vessel details below. Attach PCB photos or toggle representation sample. Downloader will output professional certification PDF automatically.
              </div>
            </div>
          </div>

          <FormEditor
            form={activeForm}
            onChange={handleFormChange}
            onResetToSample={handleResetToSample}
            showSamplePhoto={showSamplePhoto}
            onToggleSamplePhoto={setShowSamplePhoto}
          />

          <SavedDrafts
            savedForms={savedForms}
            activeFormId={activeFormId}
            onLoadForm={(id) => setActiveFormId(id)}
            onNewForm={handleCreateNewForm}
            onCloneForm={handleCloneForm}
            onDeleteForm={handleDeleteForm}
          />
        </section>

        {/* RIGHT WORKSPACE PANEL: REAL-TIME A4 PREVIEW & OUT-TOOLS */}
        <section className="flex flex-col gap-4 items-center justify-start h-full pb-10">
          
          {/* TOOLBAR BUTTONS BANNER */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 shadow-sm p-4 rounded-xl print:hidden">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-ping"></div>
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase select-none flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5" />
                Live A4 Simulation Preview
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Clear fields action */}
              <button
                onClick={handleClearFields}
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all border border-slate-200"
                title="Wipe form inputs to start empty"
              >
                <Trash className="h-3.5 w-3.5" />
                Clear Inputs
              </button>

              {/* Native Print button helper */}
              <button
                onClick={handleBrowserPrint}
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-350 rounded-lg transition-all"
                title="Open system native print commands"
              >
                <Printer className="h-3.5 w-3.5" />
                Browser Print
              </button>

              {/* Download PDF button helper */}
              <button
                onClick={handleDownloadPDF}
                type="button"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all text-center shrink-0"
                title="Download high-resolution certified PDF"
              >
                <FileDown className="h-4 w-4" />
                EXPORT PDF
              </button>

              {/* Export Word button helper */}
              <button
                onClick={() => {
                  triggerToast("Formatting Word Document... Please wait.");
                  exportToWord(activeForm, showSamplePhoto, savedForms);
                  triggerToast("Word document download started!");
                }}
                type="button"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all text-center shrink-0 cursor-pointer"
                title="Download editable Microsoft Word formatting sheet"
              >
                <FileText className="h-4 w-4" />
                EXPORT WORD
              </button>
            </div>
          </div>

          {/* PRINT-SHEET PAPER SCALE VIEWPORT CONSTRAINTS */}
          <div className="w-full overflow-x-auto p-4 bg-slate-200/40 border border-slate-200/80 rounded-2xl shadow-inner scrollbar-thin print:bg-white print:p-0 print:border-none min-h-[350mm] flex items-start justify-center">
            <div className="origin-top scale-[0.72] sm:scale-[0.85] md:scale-[0.88] lg:scale-[0.95] xl:scale-[1.0] transition-transform duration-200 print:scale-100">
              <FormPreview 
                form={activeForm} 
                showSamplePhoto={showSamplePhoto} 
                savedForms={savedForms}
              />
            </div>
          </div>
        </section>
      </main>

      {/* 3. FOOTER SIGNATURES */}
      <footer className="bg-white border-t border-slate-200 px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-[11px] font-medium text-slate-500 shrink-0 print:hidden mt-auto gap-4">
        <div>Technician ID: <span className="text-slate-900 font-bold uppercase">#TC-7729 (Mark S.)</span></div>
        <div className="text-center sm:text-left">
          <span className="font-bold text-slate-700">CEL-RON Enterprises Pte Ltd</span> &middot; Singapore Registry
        </div>
        <div className="flex gap-6 uppercase tracking-wide">
          <span className="text-green-600 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 
            Online Sync Active
          </span>
        </div>
      </footer>
    </div>
  );
}
