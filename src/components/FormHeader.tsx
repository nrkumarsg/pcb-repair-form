import React from "react";

interface FormHeaderProps {
  celronLogo?: string;
}

export default function FormHeader({ celronLogo }: FormHeaderProps) {
  return (
    <div id="form-header" className="flex justify-between items-start bg-white pb-3 border-b border-gray-200 font-sans tracking-normal leading-normal text-xs text-gray-800">
      {/* LEFT: COLORFUL LOGO MATCHING SCREENSHOT */}
      <div className="flex flex-col items-start justify-start pr-4">
        {celronLogo ? (
          <img 
            src={celronLogo} 
            alt="CEL-RON Logo" 
            className="h-24 max-w-[280px] object-contain" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex items-center gap-2">
            {/* Brand-accurate High-fidelity SVG of Celtic-Maritime Gear & Sails Logo */}
            <svg
              viewBox="0 0 160 110"
              className="w-16 h-16 shrink-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Blue waves */}
              <path
                d="M 10,90 Q 35,75 70,90 T 130,90 T 150,90"
                stroke="#0ea5e9"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M 10,97 Q 45,82 80,97 T 145,97"
                stroke="#1d4ed8"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Vessel Sail - Red and Blue Accent as in new screenshot */}
              <path
                d="M 60,75 C 70,35 105,15 140,25 C 125,48 105,65 60,75 Z"
                fill="#1d4ed8" /* dark blue */
                opacity="0.95"
              />
              <path
                d="M 65,73 C 85,48 120,35 135,28 C 105,60 81,71 65,73 Z"
                fill="#ef4444" /* bright red sail highlight */
              />
              
              {/* Sail Mast base */}
              <path
                d="M 50,76 L 145,76 L 135,82 L 55,82 Z"
                fill="#1e3a8a"
              />

              {/* Gear in the left background */}
              <g transform="translate(35, 48)">
                {/* Gear spikes */}
                <circle cx="0" cy="0" r="18" stroke="#f97316" strokeWidth="4" strokeDasharray="5 2.5" />
                <circle cx="0" cy="0" r="15" fill="white" stroke="#f97316" strokeWidth="1.5" />
                
                {/* Inner propeller */}
                <path
                  d="M -9,-2 C -5,-9 5,-9 9,-2 C 5,5 -5,5 -9,-2 Z"
                  fill="#1e293b"
                  transform="rotate(0)"
                />
                <path
                  d="M -9,-2 C -5,-9 5,-9 9,-2 C 5,5 -5,5 -9,-2 Z"
                  fill="#1e293b"
                  transform="rotate(60)"
                />
                <path
                  d="M -9,-2 C -5,-9 5,-9 9,-2 C 5,5 -5,5 -9,-2 Z"
                  fill="#1e293b"
                  transform="rotate(120)"
                />
                <circle cx="0" cy="0" r="5" fill="#f97316" />
                <circle cx="0" cy="0" r="2" fill="white" />
              </g>
            </svg>

            <div>
              <span className="block text-[15px] font-extrabold tracking-wider text-[#dc2626] font-sans leading-none">
                CEL-RON
              </span>
              <span className="block text-[7.5px] font-bold tracking-[0.16em] text-cyan-800 uppercase mt-1 leading-none">
                ENTERPRISES PTE LTD
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: COMPACT HEADER BUSINESS INFORMATION */}
      <div className="flex flex-col items-end text-right font-sans shrink-0">
        <p className="m-0 leading-none">
          <span className="text-[15px] sm:text-[17px] font-black text-[#dc2626] tracking-wide font-sans">
            CEL-RON
          </span>{' '}
          <span className="text-[13px] sm:text-[15px] font-bold text-gray-800 tracking-normal font-sans inline-block ml-1">
            ENTERPRISES PTE LTD
          </span>
        </p>
        
        {/* Business Registration */}
        <p className="text-[10px] text-gray-900 font-bold m-0 mt-1 uppercase tracking-wide">
          UEN NO. 201436227C
        </p>

        {/* Full Address */}
        <p className="text-[9.5px] text-gray-600 font-semibold m-0 mt-0.5 max-w-[280px] leading-snug">
          10, Jln. Besar, "Sim Lim Tower" #03-05, Singapore 208787
        </p>

        {/* Communication channels */}
        <p className="text-[9px] text-gray-700 m-0 mt-0.5 leading-snug">
          Phone: <span className="font-bold text-gray-900">+65 81962270</span> &middot; Email: <span className="font-bold text-gray-900">sales@celron.net</span>
        </p>
        <p className="text-[9.5px] text-blue-700 font-bold m-0 mt-0.5 tracking-wide">
          www.celron.net
        </p>
      </div>
    </div>
  );
}
