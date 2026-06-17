import React from "react";
import { PCBRepairForm } from "../types";
import { FolderOpen, Plus, Copy, Trash2, Pencil, Search, X } from "lucide-react";
import { calculateJobNumber } from "../utils/jobRef";

interface SavedDraftsProps {
  savedForms: PCBRepairForm[];
  activeFormId: string;
  onLoadForm: (id: string) => void;
  onNewForm: () => void;
  onCloneForm: (formToClone: PCBRepairForm) => void;
  onDeleteForm: (id: string) => void;
}

export default function SavedDrafts({
  savedForms,
  activeFormId,
  onLoadForm,
  onNewForm,
  onCloneForm,
  onDeleteForm,
}: SavedDraftsProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const getDraftDisplayText = (sf: PCBRepairForm) => {
    const jobRef = calculateJobNumber(sf, savedForms);
    
    let dateText = "N.A.";
    if (sf.collectedDate) {
      const parts = sf.collectedDate.split("-");
      if (parts.length === 3) {
        dateText = `${parts[2]}/${parts[1]}/${parts[0].slice(-2)}`;
      } else {
        dateText = sf.collectedDate;
      }
    }

    const customerText = sf.customer || "N.A.";
    const vesselText = sf.vesselName || "N.A.";
    const repairStatusText = sf.repairStatus || "WALK IN / DIAGNOSTIC";

    return `${jobRef} - ${dateText} - ${customerText} - ${vesselText} - ${repairStatusText}`;
  };

  // Universal Search Filtering
  const filteredForms = savedForms.filter((sf) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    
    const jobRef = calculateJobNumber(sf, savedForms).toLowerCase();
    const customer = (sf.customer || "").toLowerCase();
    const vessel = (sf.vesselName || "").toLowerCase();
    const status = (sf.repairStatus || "WALK IN / DIAGNOSTIC").toLowerCase();
    const title = (sf.title || "").toLowerCase();
    const maker = (sf.maker || "").toLowerCase();
    const model = (sf.model || "").toLowerCase();
    const serialNo = (sf.serialNo || "").toLowerCase();
    const problems = (sf.problems || "").toLowerCase();
    const symptoms = (sf.symptoms || "").toLowerCase();
    
    let dateText = "n.a.";
    if (sf.collectedDate) {
      const parts = sf.collectedDate.split("-");
      if (parts.length === 3) {
        dateText = `${parts[2]}/${parts[1]}/${parts[0].slice(-2)}`.toLowerCase();
      } else {
        dateText = sf.collectedDate.toLowerCase();
      }
    }

    return (
      jobRef.includes(q) ||
      customer.includes(q) ||
      vessel.includes(q) ||
      status.includes(q) ||
      title.includes(q) ||
      maker.includes(q) ||
      model.includes(q) ||
      serialNo.includes(q) ||
      problems.includes(q) ||
      symptoms.includes(q) ||
      dateText.includes(q)
    );
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 select-none">
          <FolderOpen className="h-3.5 w-3.5 text-slate-500" />
          Active Repair Jobs DraftS ({savedForms.length})
        </h3>
        <button
          onClick={onNewForm}
          type="button"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer select-none"
          title="Create a new blank repair form"
          id="btn-new-form"
        >
          <Plus className="h-3.5 w-3.5" />
          New Blank Draft
        </button>
      </div>

      {/* UNIVERSAL SEARCH BAR */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="h-3.5 w-3.5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search job ref, date, customer, vessel, maker, status..."
          className="w-full text-xs pl-8.5 pr-8 py-2 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-400 font-medium"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
        {filteredForms.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg bg-slate-50/30">
            <p className="text-xs text-slate-400 font-semibold select-none">No matching drafts found.</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[11px] text-blue-600 hover:underline font-bold mt-1 cursor-pointer"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          filteredForms.map((sf) => (
            <div
              key={sf.id}
              className={`flex items-center justify-between p-2.5 rounded-lg text-xs border transition-all ${
                sf.id === activeFormId
                  ? "bg-blue-50/70 border-blue-200 font-semibold text-blue-700 shadow-3xs"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <button
                type="button"
                onClick={() => onLoadForm(sf.id)}
                className="flex-1 text-left truncate font-bold text-[11px] text-blue-700/90 hover:text-blue-800 max-w-[75%] cursor-pointer whitespace-nowrap"
                title={`Open draft: ${getDraftDisplayText(sf)}`}
              >
                {getDraftDisplayText(sf)}
              </button>
              
              {confirmDeleteId === sf.id ? (
                <div className="flex items-center gap-1.5 animate-fadeIn shrink-0 ml-2">
                  <span className="text-[10px] font-black text-red-650 uppercase tracking-tight select-none">Confirm Delete?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteForm(sf.id);
                      setConfirmDeleteId(null);
                    }}
                    className="px-1.5 py-0.5 bg-red-650 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 opacity-80 hover:opacity-100 ml-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadForm(sf.id);
                      setTimeout(() => {
                        const inputElement = document.getElementById("input-repair-status") || document.getElementById("input-form-title");
                        if (inputElement) {
                          inputElement.scrollIntoView({ behavior: "smooth", block: "center" });
                          (inputElement as HTMLElement).focus();
                        }
                      }, 120);
                    }}
                    className="p-1 hover:bg-amber-50 hover:text-amber-600 rounded text-amber-500 cursor-pointer"
                    title="Edit this draft parameter values"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onCloneForm(sf)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                    title="Clone this form"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  {savedForms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(sf.id)}
                      className="p-1 hover:bg-red-50 hover:text-red-600 rounded text-slate-400 cursor-pointer"
                      title="Delete form"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
