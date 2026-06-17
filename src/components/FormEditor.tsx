import React, { useRef, useState } from "react";
import { PCBRepairForm } from "../types";
import { Trash2, Plus, Upload, Sparkles, FolderOpen, RefreshCw, Copy, CheckCircle } from "lucide-react";

interface FormEditorProps {
  form: PCBRepairForm;
  onChange: (updatedForm: PCBRepairForm) => void;
  onResetToSample: () => void;
  showSamplePhoto: boolean;
  onToggleSamplePhoto: (show: boolean) => void;
}

export default function FormEditor({
  form,
  onChange,
  onResetToSample,
  showSamplePhoto,
  onToggleSamplePhoto
}: FormEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState<string>("general");
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Handle text field changes
  const handleFieldChange = (field: keyof PCBRepairForm, value: string) => {
    onChange({
      ...form,
      [field]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  // Convert uploaded files to base64
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload image files only.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Add newly uploaded base64 photo to form
          const newPhotos = [...form.photos, reader.result];
          onChange({
            ...form,
            photos: newPhotos,
            updatedAt: new Date().toISOString()
          });
          onToggleSamplePhoto(false); // Hide mock sample when custom image uploaded
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (indexToRemove: number) => {
    const newPhotos = form.photos.filter((_, idx) => idx !== indexToRemove);
    onChange({
      ...form,
      photos: newPhotos,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div className="flex flex-col gap-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-h-[85vh] overflow-y-auto w-full">
      
      {/* SECTION: BREADCRUMBS & PRESETS ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            Configure Repair Parameters
          </h2>
          <p className="text-xs text-slate-500">Update form inputs to refresh the simulated document</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetToSample}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-lg transition-colors cursor-pointer"
            title="Load the exact data shown in the reference image"
            id="btn-load-sample"
          >
            <RefreshCw className="h-3 w-3 animate-spin-slow" />
            Load Pre-filled Sample
          </button>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-lg gap-1">
        <button
          onClick={() => setActiveSection("general")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
            activeSection === "general"
              ? "bg-white text-blue-700 shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
          id="editor-tab-general"
        >
          1. Customer Info
        </button>
        <button
          onClick={() => setActiveSection("system")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
            activeSection === "system"
              ? "bg-white text-blue-700 shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
          id="editor-tab-system"
        >
          2. Systems & Specs
        </button>
        <button
          onClick={() => setActiveSection("photos")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
            activeSection === "photos"
              ? "bg-white text-blue-700 shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
          id="editor-tab-photos"
        >
          3. Attachment Photos
        </button>
      </div>

      {/* INPUT FIELDS WORKSPACE */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        
        {/* TAB 1: GENERAL & VESSEL DETAILS */}
        {activeSection === "general" && (
          <div className="space-y-4 animation-fadeIn">
            {/* Form Title (Internal reference only) */}
            <div>
              <label htmlFor="input-form-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Internal Document Title
              </label>
              <input
                id="input-form-title"
                type="text"
                className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium"
                value={form.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="e.g. MORNING CARINA ER CRANE PCB"
              />
            </div>

            <div className="h-[1px] bg-slate-200 my-2"></div>

            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1.5 pt-2">
              Customer Info
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="input-customer" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  CUSTOMER NAME
                </label>
                <input
                  id="input-customer"
                  type="text"
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={form.customer}
                  onChange={(e) => handleFieldChange("customer", e.target.value)}
                  placeholder="Brosna shipping"
                />
              </div>

              <div>
                <label htmlFor="input-vessel" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  VESSEL NAME
                </label>
                <input
                  id="input-vessel"
                  type="text"
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={form.vesselName}
                  onChange={(e) => handleFieldChange("vesselName", e.target.value)}
                  placeholder="MORNING CARINA"
                />
              </div>

              <div>
                <label htmlFor="input-repair-status" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.55">
                  REPAIR STATUS
                </label>
                <input
                  id="input-repair-status"
                  type="text"
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold text-amber-700"
                  value={form.repairStatus || ""}
                  onChange={(e) => handleFieldChange("repairStatus", e.target.value)}
                  placeholder="WALK IN / DIAGNOSTIC"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1.5 pt-3">
              Collection Info
            </h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="input-col-from" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  COLLECTED FROM
                </label>
                <input
                  id="input-col-from"
                  type="text"
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={form.collectedFrom}
                  onChange={(e) => handleFieldChange("collectedFrom", e.target.value)}
                  placeholder="GRIFFIN, JLN AMPAS"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="input-col-date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    COLLECTION DATE
                  </label>
                  <input
                    id="input-col-date"
                    type="date"
                    className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={form.collectedDate}
                    onChange={(e) => handleFieldChange("collectedDate", e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="input-ordered" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    ORDERED BY
                  </label>
                  <input
                    id="input-ordered"
                    type="text"
                    className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={form.orderedBy}
                    onChange={(e) => handleFieldChange("orderedBy", e.target.value)}
                    placeholder="CV PRASAD"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setActiveSection("system")}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Next Step: System Specs &rarr;
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM DETAILS & SPECS */}
        {activeSection === "system" && (
          <div className="space-y-4 animation-fadeIn">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1.5 pt-2">
              System Info
            </h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="input-sys-detail" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  SYSTEM DETAIL
                </label>
                <textarea
                  id="input-sys-detail"
                  rows={2}
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={form.systemDetail}
                  onChange={(e) => handleFieldChange("systemDetail", e.target.value)}
                  placeholder="ENGINE ROOM CRANE PCB'S 3PCS"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="input-maker" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" title="Optional field - defaults to blue help message if blank">
                    MAKER
                  </label>
                  <input
                    id="input-maker"
                    type="text"
                    className="w-full text-sm border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={form.maker}
                    onChange={(e) => handleFieldChange("maker", e.target.value)}
                    placeholder="e.g. NOK"
                  />
                </div>

                <div>
                  <label htmlFor="input-model" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" title="Optional field - defaults to blue help message if blank">
                    MODEL
                  </label>
                  <input
                    id="input-model"
                    type="text"
                    className="w-full text-sm border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={form.model}
                    onChange={(e) => handleFieldChange("model", e.target.value)}
                    placeholder="e.g. SL-150"
                  />
                </div>

                <div>
                  <label htmlFor="input-sl" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" title="Optional field - defaults to blue help message if blank">
                    SL. NO
                  </label>
                  <input
                    id="input-sl"
                    type="text"
                    className="w-full text-sm border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={form.serialNo}
                    onChange={(e) => handleFieldChange("serialNo", e.target.value)}
                    placeholder="e.g. 78249-C"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1.5 pt-3">
              PCB Diagnostic Markings
            </h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="input-pcb-markings" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  PCB NO / MARKINGS
                </label>
                <textarea
                  id="input-pcb-markings"
                  rows={2}
                  className="w-full text-sm font-mono border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={form.pcbNoMarkings}
                  onChange={(e) => handleFieldChange("pcbNoMarkings", e.target.value)}
                  placeholder="e.g. THB-150D – 2PCS&#10;THB-150C – 1PC."
                />
              </div>

              <div>
                <label htmlFor="input-problems" className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-1.5">
                  REPORTED PROBLEMS & WITNESSED SYMPTOMS (Required / Default: Red message)
                </label>
                <textarea
                  id="input-problems"
                  rows={5}
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={form.problems}
                  onChange={(e) => handleFieldChange("problems", e.target.value)}
                  placeholder="Describe electrical problems experienced & visual/sensory symptoms witnessed..."
                />
              </div>

              <div>
                <label htmlFor="input-attachments-text" className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5">
                  Right Field: Attachments, Table references or Photos notes (Optional)
                </label>
                <textarea
                  id="input-attachments-text"
                  rows={3}
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={form.attachmentsText || ""}
                  onChange={(e) => handleFieldChange("attachmentsText", e.target.value)}
                  placeholder="Type extra notes, paste tables or photo descriptions to display on the right-hand column of Part 2..."
                />
              </div>

              <div>
                <label htmlFor="input-remark" className="block text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                  REMARK (Optional / e.g., Diagnostics/Action Remarks)
                </label>
                <textarea
                  id="input-remark"
                  rows={2}
                  className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={form.remark || ""}
                  onChange={(e) => handleFieldChange("remark", e.target.value)}
                  placeholder="Type official remarks or recommendations..."
                />
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveSection("general")}
                className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                &larr; Back
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("photos")}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Next Step: Photos &rarr;
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOM CUSTOMER PHOTOS */}
        {activeSection === "photos" && (
          <div className="space-y-4 animation-fadeIn">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1.5 pt-2">
              Customer PCB Photos
            </h3>

            {/* Toggle demo placeholder card board box */}
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-xs text-amber-900">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">Representative Sample Image</span>
                <span>Includes mock cardboard label from standard service photo</span>
              </div>
              <label htmlFor="toggle-demo-photo" className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-demo-photo"
                  type="checkbox"
                  checked={showSamplePhoto}
                  onChange={(e) => onToggleSamplePhoto(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Photo Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-500"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />
              <Upload className="h-8 w-8 mb-2 text-slate-400" />
              <p className="text-sm font-semibold select-none">
                Drag and drop client photos here
              </p>
              <p className="text-xs text-slate-400 mt-1 select-none">
                or click to browse from system files
              </p>
            </div>

            {/* List of Custom Uploaded Photos with Remove Option */}
            {form.photos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Uploaded customer photos ({form.photos.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {form.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-lg group overflow-hidden relative aspect-square bg-[#eceff1] flex items-center justify-center shadow-xs"
                    >
                      <img
                        src={photo}
                        className="max-h-full max-w-full object-contain"
                        alt={`Attachment ${index}`}
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(index);
                        }}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete photo"
                        id={`btn-delete-photo-${index}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveSection("system")}
                className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                &larr; Back
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
