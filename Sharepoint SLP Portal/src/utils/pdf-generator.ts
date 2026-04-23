import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Helper to add a standardized header
const addHeader = (doc: jsPDF, title: string) => {
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, 25);
  
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 32);
  
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(20, 40, 190, 40);
};

export const generateHEP = (title: string, content: string[]) => {
  const doc = new jsPDF();
  addHeader(doc, title);
  
  doc.setTextColor(51, 65, 85); // slate-700
  doc.setFontSize(12);
  
  let y = 55;
  content.forEach((line, index) => {
    // Handle text wrapping
    const splitText = doc.splitTextToSize(`${index + 1}. ${line}`, 170);
    doc.text(splitText, 20, y);
    y += (splitText.length * 7) + 5;
    
    // Add new page if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });
  
  doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_hep.pdf`);
};

export const generateClinicalReport = (
  patientName: string, 
  date: string, 
  templateName: string,
  narrative: Record<string, string>
) => {
  const doc = new jsPDF();
  
  // Header - Professional Clinic Header
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('DocuArchitect Clinic', 20, 22);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('123 Speech Therapy Way, Suite 100 | City, ST 12345', 20, 28);
  doc.text('Phone: (555) 123-4567 | Fax: (555) 123-4568', 20, 33);
  
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(20, 45, 190, 45);

  // Patient Demographics Box
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(20, 55, 170, 25, 3, 3, 'F');
  
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Name:', 25, 63);
  doc.setFont('helvetica', 'normal');
  doc.text(patientName, 55, 63);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Service:', 120, 63);
  doc.setFont('helvetica', 'normal');
  doc.text(date, 155, 63);

  doc.setFont('helvetica', 'bold');
  doc.text('Document Type:', 25, 73);
  doc.setFont('helvetica', 'normal');
  doc.text(templateName, 55, 73);

  doc.setFont('helvetica', 'bold');
  doc.text('Provider:', 120, 73);
  doc.setFont('helvetica', 'normal');
  doc.text('Dr. Sarah Jenkins, CCC-SLP', 155, 73);

  let y = 95;

  // Sections
  Object.entries(narrative).forEach(([key, content]) => {
    if (!content) return;
    
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Section Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text(key.toUpperCase(), 20, y);
    y += 8;
    
    // Section Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    
    const splitText = doc.splitTextToSize(content, 170);
    
    // Check if content fits on current page
    if (y + (splitText.length * 5) > 270) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(splitText, 20, y);
    y += (splitText.length * 5) + 10;
  });
  
  // Signature Block
  if (y > 230) {
    doc.addPage();
    y = 20;
  }
  y += 20;
  
  doc.setDrawColor(15, 23, 42);
  doc.line(20, y, 90, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Electronically Signed By:', 20, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('Dr. Sarah Jenkins, CCC-SLP', 20, y + 12);
  doc.text(`Date: ${date}`, 20, y + 18);
  
  // Add page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
    doc.text('CONFIDENTIAL MEDICAL RECORD', 20, 285);
  }
  
  doc.save(`${templateName.replace(/[^a-z0-9]/gi, '_')}_${patientName.replace(/[^a-z0-9]/gi, '_')}_${date.replace(/\//g, '-')}.pdf`);
};

export const generatePostettePDF = (postette: any) => {
  try {
    if (!postette) throw new Error('No content provided for PDF generation');
    
    const doc = new jsPDF();
    addHeader(doc, postette.title);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont('helvetica', 'bold');
    doc.text(`Category: ${postette.category}`, 20, 48);
    if (postette.reference) {
      doc.text(`Reference: ${postette.reference}`, 20, 54);
    }
    
    let y = postette.reference ? 65 : 60;
    
    postette.sections.forEach((section: any, index: number) => {
      // Section Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235); // blue-600
      
      // Check if we need a new page for the title
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(`${index + 1}. ${section.title}`, 20, y);
      y += 8;
      
      // Section Content
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      
      if (section.type === 'bullets' && Array.isArray(section.content)) {
        section.content.forEach((bullet: string) => {
          const splitText = doc.splitTextToSize(`• ${bullet}`, 165);
          if (y + (splitText.length * 6) > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(splitText, 25, y);
          y += (splitText.length * 6) + 4;
        });
      } else {
        const contentText = typeof section.content === 'string' ? section.content : JSON.stringify(section.content);
        const splitText = doc.splitTextToSize(contentText, 170);
        
        if (y + (splitText.length * 6) > 280) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(splitText, 20, y);
        y += (splitText.length * 6) + 8;
      }
      
      y += 4; // Extra spacing between sections
    });
    
    doc.save(`${postette.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

export const generateProgressReport = (patientName: string, chartDataUrl: string, stats: any[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Patient Progress Report');
  
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient: ${patientName}`, 20, 50);
  
  // Add Stats Table
  (doc as any).autoTable({
    startY: 60,
    head: [['Metric', 'Value', 'Trend']],
    body: stats.map(s => [s.label, s.value, s.trend]),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { font: 'helvetica', fontSize: 10 }
  });
  
  // Add Chart Image
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  if (chartDataUrl) {
    doc.text('Performance Over Time:', 20, finalY + 15);
    doc.addImage(chartDataUrl, 'PNG', 20, finalY + 20, 170, 90);
  }
  
  doc.save(`Progress_Report_${patientName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
};
