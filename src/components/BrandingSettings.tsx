import React, { useRef } from "react";
import { PCBRepairForm } from "../types";
import { Upload, Trash2, X, Settings } from "lucide-react";

interface BrandingSettingsProps {
  form: PCBRepairForm;
  onChange: (updatedForm: PCBRepairForm) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function BrandingSettings({
  form,
  onChange,
  isOpen,
  onClose,
}: BrandingSettingsProps) {
  const celronLogoInputRef = useRef<HTMLInputElement>(null);
  const bizSafeInputRef = useRef<HTMLInputElement>(null);
  const isoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "bizSafe" | "iso" | "celron") => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please upload image files only.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const logoKey = type === "bizSafe" ? "bizSafeLogo" : type === "iso" ? "isoLogo" : "celronLogo";
          onChange({
            ...form,
            [logoKey]: reader.result,
            updatedAt: new Date().toISOString()
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col justify-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Block */}
        <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700">
              <Settings className="h-4 w-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                System Branding Settings
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Configure document letterhead & footer certification bodies</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 focus:bg-slate-200 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Close Settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Logo Upload Body Content (Matches Image 2 exactly) */}
        <div className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Custom Branding & Document Logos (Optional)
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-2xl font-medium">
                Customize the letterhead and certification logos. Upload your high-contrast PNG/JPEG images to display on the generated A4 repair form header or footer.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {/* Cel-Ron Letterhead Logo Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-4 shadow-3xs hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black text-[#dc2626] uppercase tracking-wider block">
                      Cel-Ron Brand Logo
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">
                      {form.celronLogo ? "Custom logo uploaded" : "Using default SVG"}
                    </span>
                  </div>
                  {form.celronLogo && (
                    <button
                      type="button"
                      onClick={() => onChange({ ...form, celronLogo: undefined, updatedAt: new Date().toISOString() })}
                      className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors"
                      title="Remove custom Cel-Ron logo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {form.celronLogo ? (
                  <div className="h-24 flex items-center justify-center p-2 bg-slate-50 rounded-lg border border-slate-250/60">
                    <img src={form.celronLogo} className="max-h-full max-w-full object-contain" alt="Cel-Ron thumbnail" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="h-24 flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 text-slate-400 rounded-lg text-xs italic select-none">
                    No custom Cel-Ron image
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => celronLogoInputRef.current?.click()}
                  className="w-full bg-slate-100 hover:bg-slate-200/85 text-slate-700 py-2 px-3 rounded-md text-xs font-semibold border border-slate-200/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {form.celronLogo ? "Replace logo image" : "Upload logo image"}
                </button>
                <input
                  ref={celronLogoInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, "celron")}
                />
              </div>

              {/* bizSAFE Logo Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-4 shadow-3xs hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      bizSAFE Logo
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">
                      {form.bizSafeLogo ? "Custom image uploaded" : "Using default logo"}
                    </span>
                  </div>
                  {form.bizSafeLogo && (
                    <button
                      type="button"
                      onClick={() => onChange({ ...form, bizSafeLogo: undefined, updatedAt: new Date().toISOString() })}
                      className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors"
                      title="Remove custom bizSAFE logo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {form.bizSafeLogo ? (
                  <div className="h-24 flex items-center justify-center p-2 bg-slate-50 rounded-lg border border-slate-250/60">
                    <img src={form.bizSafeLogo} className="max-h-full max-w-full object-contain" alt="bizSAFE thumbnail" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="h-24 flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 text-slate-400 rounded-lg text-xs italic select-none">
                    No custom bizSAFE image
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => bizSafeInputRef.current?.click()}
                  className="w-full bg-slate-100 hover:bg-slate-200/85 text-slate-700 py-2 px-3 rounded-md text-xs font-semibold border border-slate-200/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {form.bizSafeLogo ? "Replace logo image" : "Upload logo image"}
                </button>
                <input
                  ref={bizSafeInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, "bizSafe")}
                />
              </div>

              {/* ISO 9001 Logo Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-4 shadow-3xs hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      ISO 9001 Logo
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">
                      {form.isoLogo ? "Custom image uploaded" : "Using default logo"}
                    </span>
                  </div>
                  {form.isoLogo && (
                    <button
                      type="button"
                      onClick={() => onChange({ ...form, isoLogo: undefined, updatedAt: new Date().toISOString() })}
                      className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors"
                      title="Remove custom ISO 9001 logo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {form.isoLogo ? (
                  <div className="h-24 flex items-center justify-center p-2 bg-slate-50 rounded-lg border border-slate-250/60">
                    <img src={form.isoLogo} className="max-h-full max-w-full object-contain" alt="ISO thumbnail" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="h-24 flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 text-slate-400 rounded-lg text-xs italic select-none">
                    No custom ISO 9001 image
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => isoInputRef.current?.click()}
                  className="w-full bg-slate-100 hover:bg-slate-200/85 text-slate-700 py-2 px-3 rounded-md text-xs font-semibold border border-slate-200/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {form.isoLogo ? "Replace logo image" : "Upload logo image"}
                </button>
                <input
                  ref={isoInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, "iso")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area with Action */}
        <div className="p-5 border-t border-slate-150 bg-slate-50 rounded-b-xl flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            Save & Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}
