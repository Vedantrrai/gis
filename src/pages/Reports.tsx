import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Layers, 
  CheckCircle2, 
  Code, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AnalysisResponse } from '../types/analysis';
import { exportPDFReport, exportAnalysisCSV, exportGeoJSONFile } from '../utils/exportUtils';
import { LOCATION_PRESETS } from '../data/demoData';

interface ReportsProps {
  currentAnalysis: AnalysisResponse;
}

export const Reports: React.FC<ReportsProps> = ({ currentAnalysis }) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingGeoJSON, setIsExportingGeoJSON] = useState(false);

  const matchedLocation = LOCATION_PRESETS.find(p => 
    p.name.toLowerCase().includes(currentAnalysis.location.toLowerCase())
  ) || LOCATION_PRESETS[0];

  const handleDownloadPDF = () => {
    setIsExportingPDF(true);
    try {
      exportPDFReport(currentAnalysis);
    } finally {
      setTimeout(() => setIsExportingPDF(false), 800);
    }
  };

  const handleDownloadCSV = () => {
    setIsExportingCSV(true);
    try {
      exportAnalysisCSV(currentAnalysis, `geovision-${matchedLocation.id}-metrics.csv`);
    } finally {
      setTimeout(() => setIsExportingCSV(false), 500);
    }
  };

  const handleDownloadGeoJSON = () => {
    setIsExportingGeoJSON(true);
    try {
      exportGeoJSONFile(currentAnalysis.geojson, `geovision-${matchedLocation.id}-polygons.geojson`);
    } finally {
      setTimeout(() => setIsExportingGeoJSON(false), 500);
    }
  };

  return (
    <div className="space-y-5 pb-10 max-w-5xl mx-auto">
      {/* Header & Export Actions */}
      <div className="bg-white border border-[#E9EBEF] rounded-xl p-5 shadow-geo flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF8F0] border border-[#16A765]/20 flex items-center justify-center text-[#16A765]">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#17191D] tracking-tight">
              Reports & Intelligence Dossier
            </h2>
          </div>
          <p className="text-xs text-[#777D87] mt-0.5">
            Export validated bi-temporal satellite analytics for geospatial planning and academic documentation.
          </p>
        </div>

        {/* Real Working Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="px-3.5 py-1.5 rounded-lg bg-[#16A765] hover:bg-[#087D4A] text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            id="download-pdf-report-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPDF ? 'Generating...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            disabled={isExportingCSV}
            className="px-3 py-1.5 rounded-lg bg-[#F7F8FA] hover:bg-[#F3F4F6] border border-[#E9EBEF] text-[#17191D] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            id="download-csv-metrics-btn"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#16A765]" />
            <span>{isExportingCSV ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handleDownloadGeoJSON}
            disabled={isExportingGeoJSON}
            className="px-3 py-1.5 rounded-lg bg-[#F7F8FA] hover:bg-[#F3F4F6] border border-[#E9EBEF] text-[#17191D] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            id="download-geojson-export-btn"
          >
            <Code className="w-3.5 h-3.5 text-[#5B9DE8]" />
            <span>{isExportingGeoJSON ? 'Exporting...' : 'Export GeoJSON'}</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Card */}
      <div className="bg-white border border-[#E9EBEF] rounded-xl p-6 md:p-7 space-y-6 shadow-geo">
        {/* Top Dossier Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#E9EBEF] gap-2">
          <div>
            <div className="text-[10px] text-[#087D4A] font-semibold tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#16A765]" />
              <span>RESEARCH DOSSIER • GEOVISION-AI</span>
            </div>
            <h3 className="text-lg font-semibold text-[#17191D] tracking-tight mt-0.5">
              Bi-Temporal Land Cover & Change Detection Summary
            </h3>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[#777D87] block uppercase">Job Reference</span>
            <span className="text-xs font-mono text-[#5B9DE8] font-semibold">{currentAnalysis.analysis_id}</span>
          </div>
        </div>

        {/* Section 1: Target Coordinates & Metadata */}
        <div>
          <h4 className="text-xs font-semibold text-[#17191D] mb-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A765]"></span>
            1. Target Region & Epoch Specification
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF]">
              <span className="text-[#777D87] text-[10px] block">Monitored Region</span>
              <span className="text-xs font-semibold text-[#17191D] mt-0.5 block">{currentAnalysis.location}</span>
              <span className="text-[10px] text-[#777D87]">{matchedLocation.region}, {matchedLocation.country}</span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF]">
              <span className="text-[#777D87] text-[10px] block">Temporal Window</span>
              <span className="text-xs font-semibold text-[#17191D] mt-0.5 block">
                {currentAnalysis.before_year} → {currentAnalysis.after_year}
              </span>
              <span className="text-[10px] text-[#777D87]">
                {(currentAnalysis.after_year - currentAnalysis.before_year)} Year Transition
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF]">
              <span className="text-[#777D87] text-[10px] block">Sensor Dataset</span>
              <span className="text-xs font-semibold text-[#17191D] mt-0.5 block uppercase">
                {currentAnalysis.dataset}
              </span>
              <span className="text-[10px] text-[#777D87]">Multispectral MSI</span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF]">
              <span className="text-[#777D87] text-[10px] block">Model Confidence</span>
              <span className="text-xs font-semibold text-[#087D4A] mt-0.5 block">
                {(currentAnalysis.confidence * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-[#777D87]">Vision-MAE Latent Score</span>
            </div>
          </div>
        </div>

        {/* Section 2: Core Key Metrics */}
        <div>
          <h4 className="text-xs font-semibold text-[#17191D] mb-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5B9DE8]"></span>
            2. Quantitative Change Metrics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#777D87] block uppercase">Total Area Altered</span>
                <span className="text-xl font-bold text-[#17191D] mt-0.5 block">{currentAnalysis.changed_area_km2} km²</span>
              </div>
              <Layers className="w-6 h-6 text-[#A0A5AE]" />
            </div>

            <div className="p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#777D87] block uppercase">Urban Expansion</span>
                <span className="text-xl font-bold text-[#087D4A] mt-0.5 block">+{currentAnalysis.urban_change_percent}%</span>
              </div>
              <CheckCircle2 className="w-6 h-6 text-[#16A765]" />
            </div>

            <div className="p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#777D87] block uppercase">Vegetation Depletion</span>
                <span className="text-xl font-bold text-[#E45B5B] mt-0.5 block">{currentAnalysis.vegetation_loss_km2} km²</span>
              </div>
              <ShieldCheck className="w-6 h-6 text-[#E45B5B]" />
            </div>
          </div>
        </div>

        {/* Section 3: Classified Anomaly Features */}
        <div>
          <h4 className="text-xs font-semibold text-[#17191D] mb-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E45B5B]"></span>
            3. Delineated Polygon Features ({currentAnalysis.geojson?.features?.length || 0})
          </h4>

          <div className="space-y-2">
            {(currentAnalysis.geojson?.features || []).map((feat, idx) => {
              const p = feat.properties as any;
              if (!p) return null;
              return (
                <div 
                  key={idx}
                  className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      p.type === 'urban' ? 'bg-[#16A765]' : p.type === 'vegetation_loss' ? 'bg-[#E45B5B]' : 'bg-[#5B9DE8]'
                    }`} />
                    <div>
                      <div className="font-semibold text-[#17191D]">{p.name || `Polygon Feature #${idx + 1}`}</div>
                      <div className="text-[11px] text-[#777D87] mt-0.5">
                        {p.changeType || p.type} • Extent: <strong className="text-[#17191D]">{p.areaHectares} ha</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px]">
                    <div className="text-right">
                      <span className="text-[#777D87] block">Confidence</span>
                      <span className="text-[#087D4A] font-semibold">{(p.confidenceScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#777D87] block">Spectral Delta</span>
                      <span className="text-[#17191D] font-mono font-medium">{p.spectralDeviationIndex}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Academic Disclaimer */}
        <div className="pt-3 border-t border-[#E9EBEF] text-xs text-[#777D87] space-y-1.5">
          <div className="text-[#17191D] font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A765]" />
            Methodological Footnote & Verification Status
          </div>
          <p className="leading-relaxed text-[11px]">
            GeoVision AI operates using a self-supervised Masked Autoencoder (MAE) architecture tuned on multi-spectral earth observation data. Feature distance vectors are extracted without requiring pixel-level annotation masks during pre-training.
          </p>
          <div className="p-2 rounded bg-[#F7F8FA] border border-[#E9EBEF] text-[11px] text-[#777D87]">
            {currentAnalysis.is_demo 
              ? 'Notice: Current report displays simulated verification data. Connect to live inference backend to generate operational mission records.'
              : 'Notice: This report is certified by direct connection to the live GeoVision inference service.'}
          </div>
        </div>
      </div>
    </div>
  );
};
