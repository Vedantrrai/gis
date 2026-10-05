import { jsPDF } from 'jspdf';
import { AnalysisResponse } from '../types/analysis';

/**
 * Trigger download of raw GeoJSON file
 */
export function exportGeoJSONFile(geojson: GeoJSON.FeatureCollection, filename = 'geovision-change-detection.geojson') {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Trigger download of analysis statistics as CSV
 */
export function exportAnalysisCSV(analysis: AnalysisResponse, filename = 'geovision-change-metrics.csv') {
  const rows = [
    ['Metric', 'Value', 'Unit', 'Notes'],
    ['Analysis ID', analysis.analysis_id, '', analysis.is_demo ? 'SAMPLE DEMO DATA' : 'BACKEND INFERENCE'],
    ['Location', `"${analysis.location}"`, '', ''],
    ['Comparison Baseline Year', analysis.before_year.toString(), 'Year', ''],
    ['Comparison Target Year', analysis.after_year.toString(), 'Year', ''],
    ['Satellite Sensor / Platform', analysis.dataset, '', ''],
    ['Total Detected Area Changed', analysis.changed_area_km2.toString(), 'km²', 'Thresholded spectral deviation'],
    ['Urban Expansion Rate', `+${analysis.urban_change_percent}`, '%', 'Impervious surface expansion'],
    ['Vegetation Loss', analysis.vegetation_loss_km2.toString(), 'km²', 'NDVI negative delta'],
    ['Self-Supervised Model Confidence', `${(analysis.confidence * 100).toFixed(1)}`, '%', 'Mean feature distance margin'],
    ['Analysis Timestamp', analysis.processed_at, 'ISO8601', ''],
    [],
    ['Feature ID', 'Name', 'Change Category', 'Area (Hectares)', 'Confidence', 'Prior Land Cover', 'Post Land Cover'],
  ];

  if (analysis.geojson && analysis.geojson.features) {
    analysis.geojson.features.forEach((feat) => {
      const p = feat.properties as any;
      if (p) {
        rows.push([
          p.id || '',
          `"${p.name || ''}"`,
          `"${p.changeType || p.type || ''}"`,
          p.areaHectares ? p.areaHectares.toString() : '',
          p.confidenceScore ? `${(p.confidenceScore * 100).toFixed(1)}%` : '',
          `"${p.priorLandCover || ''}"`,
          `"${p.postLandCover || ''}"`
        ]);
      }
    });
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Generate a professional GIS Intelligence PDF Report using jsPDF
 */
export function exportPDFReport(analysis: AnalysisResponse) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background banner (Crisp Light Surface)
  doc.setFillColor(247, 248, 250); // #F7F8FA
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent line (Primary Green)
  doc.setFillColor(22, 167, 101); // #16A765
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Title
  doc.setTextColor(23, 25, 29); // #17191D
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('GEOVISION AI — SATELLITE CHANGE DOSSIER', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(119, 125, 135); // #777D87
  doc.text('Self-Supervised Satellite Image Change Detection & GIS Analytics', 14, 26);
  doc.text(`Generated: ${new Date().toUTCString()} | Status: ${analysis.is_demo ? 'DEMO / SIMULATED' : 'VERIFIED INFERENCE'}`, 14, 33);

  // Top Section: Metadata Grid
  doc.setTextColor(21, 29, 38);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. EXECUTIVE SUMMARY & TARGET METRICS', 14, 56);

  // Metadata Box
  doc.setDrawColor(40, 51, 64);
  doc.setFillColor(245, 248, 250);
  doc.roundedRect(14, 61, pageWidth - 28, 38, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(70, 80, 95);
  doc.setFont('helvetica', 'bold');
  doc.text('Target Location:', 18, 69);
  doc.text('Comparison Baseline:', 18, 77);
  doc.text('Target Comparison:', 18, 85);
  doc.text('Satellite Sensor:', 18, 93);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.location, 60, 69);
  doc.text(`${analysis.before_year} Epoch (Baseline Reference)`, 60, 77);
  doc.text(`${analysis.after_year} Epoch (Post-Expansion)`, 60, 85);
  doc.text(`${analysis.dataset.toUpperCase()} Multispectral MSI (10m Res)`, 60, 93);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(70, 80, 95);
  doc.text('Analysis Job ID:', 115, 69);
  doc.text('Confidence Score:', 115, 77);
  doc.text('Algorithm Architecture:', 115, 85);
  doc.text('Data Classification:', 115, 93);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.analysis_id, 155, 69);
  doc.text(`${(analysis.confidence * 100).toFixed(1)}%`, 155, 77);
  doc.text('Self-Supervised Vision Transformer', 155, 85);
  doc.text(analysis.is_demo ? 'Illustrative Sample Dossier' : 'Field Operational', 155, 93);

  // Key KPI Cards on PDF
  const cardWidth = (pageWidth - 28 - 9) / 4;
  const startY = 106;

  // Card 1: Total Changed Area
  doc.setFillColor(240, 245, 250);
  doc.roundedRect(14, startY, cardWidth, 26, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL CHANGED AREA', 17, startY + 7);
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analysis.changed_area_km2} km²`, 17, startY + 18);

  // Card 2: Urban Expansion
  doc.setFillColor(240, 245, 250);
  doc.roundedRect(14 + cardWidth + 3, startY, cardWidth, 26, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('URBAN EXPANSION', 17 + cardWidth + 3, startY + 7);
  doc.setFontSize(14);
  doc.setTextColor(40, 150, 60);
  doc.setFont('helvetica', 'bold');
  doc.text(`+${analysis.urban_change_percent}%`, 17 + cardWidth + 3, startY + 18);

  // Card 3: Vegetation Loss
  doc.setFillColor(240, 245, 250);
  doc.roundedRect(14 + (cardWidth + 3) * 2, startY, cardWidth, 26, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('VEGETATION LOSS', 17 + (cardWidth + 3) * 2, startY + 7);
  doc.setFontSize(14);
  doc.setTextColor(220, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analysis.vegetation_loss_km2} km²`, 17 + (cardWidth + 3) * 2, startY + 18);

  // Card 4: Model Confidence
  doc.setFillColor(240, 245, 250);
  doc.roundedRect(14 + (cardWidth + 3) * 3, startY, cardWidth, 26, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('CHANGE CONFIDENCE', 17 + (cardWidth + 3) * 3, startY + 7);
  doc.setFontSize(14);
  doc.setTextColor(14, 116, 144);
  doc.setFont('helvetica', 'bold');
  doc.text(`${(analysis.confidence * 100).toFixed(1)}%`, 17 + (cardWidth + 3) * 3, startY + 18);

  // Section 2: Detailed Feature Breakdown
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 29, 38);
  doc.text('2. DETECTED GEOSPATIAL POLYGONS & ANOMALIES', 14, 145);

  let curY = 154;
  const features = analysis.geojson?.features || [];

  features.slice(0, 4).forEach((feat, index) => {
    const p = feat.properties as any;
    if (!p) return;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, curY, pageWidth - 28, 22, 2, 2, 'FD');

    // Bullet indicator
    doc.setFillColor(p.type === 'urban' ? 100 : p.type === 'vegetation_loss' ? 220 : 50, 150, 100);
    doc.circle(19, curY + 7, 2.2, 'F');

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${p.name || 'Unnamed Zone'}`, 24, curY + 8);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Type: ${p.changeType || 'General Change'}  |  Extent: ${p.areaHectares || 0} ha  |  Confidence: ${(p.confidenceScore * 100).toFixed(1)}%`, 24, curY + 14);
    
    if (p.notes) {
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Observation: ${p.notes.substring(0, 95)}${p.notes.length > 95 ? '...' : ''}`, 24, curY + 19);
    }

    curY += 25;
  });

  // Section 3: Methodology & Scientific Notes
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 29, 38);
  doc.text('3. RESEARCH METHODOLOGY & DISCLAIMER', 14, curY + 8);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const disclaimerText = 
    'GeoVision AI utilizes a bi-temporal self-supervised representation learning backbone (Contrastive / Masked Autoencoder) ' +
    'trained on multispectral Sentinel-2 & Landsat-8 imagery without requiring extensive manual pixel-level segmentation labels. ' +
    'Changes are identified through cross-attention feature distance thresholding with atmospheric and seasonal co-registration correction. ' +
    (analysis.is_demo
      ? 'NOTICE: This export represents illustrative demo data generated for system verification and interface preview.'
      : 'NOTICE: This report is generated from direct live inference results from the GeoVision computing pipeline.');

  const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 28);
  doc.text(splitDisclaimer, 14, curY + 16);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('GeoVision AI Research Platform • Department of Computer Science & Engineering', 14, 287);
  doc.text(`Page 1 of 1`, pageWidth - 28, 287);

  doc.save(`GeoVision-Report-${analysis.location.replace(/[^a-zA-Z0-9]/g, '_')}-${analysis.before_year}-${analysis.after_year}.pdf`);
}
