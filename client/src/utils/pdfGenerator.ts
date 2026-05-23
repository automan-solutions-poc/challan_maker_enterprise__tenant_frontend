import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

export const generatePDF = async (challan: any) => {
  const doc = new jsPDF();
  const qrData = await QRCode.toDataURL(`CHALLAN:${challan.challan_no}|SN:${challan.serial_number}`);

  // Header
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('SERVICE CHALLAN', 20, 25);

  doc.setFontSize(10);
  doc.text(`No: ${challan.challan_no}`, 160, 20);
  doc.text(`Date: ${new Date(challan.date || challan.created_at).toLocaleDateString()}`, 160, 26);

  // Customer Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER DETAILS', 20, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${challan.customer_name}`, 20, 65);
  doc.text(`Phone: ${challan.contact_number}`, 20, 71);
  doc.text(`Email: ${challan.email}`, 20, 77);

  // Device Info
  doc.setFont('helvetica', 'bold');
  doc.text('DEVICE DETAILS', 110, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Serial/Model: ${challan.serial_number}`, 110, 65);
  doc.text(`Status: ${challan.status.toUpperCase()}`, 110, 71);

  // Problem Table
  let accessories = [];
  try {
    accessories = typeof challan.accessories === 'string' ? JSON.parse(challan.accessories) : (challan.accessories || []);
  } catch(e) { accessories = []; }

  autoTable(doc, {
    startY: 90,
    head: [['Description of Problem', 'Accessories Received']],
    body: [[challan.problem, (Array.isArray(accessories) ? accessories : []).join(', ')]],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }
  });

  // QR Code
  doc.addImage(qrData, 'PNG', 160, 250, 30, 30);
  doc.setFontSize(8);
  doc.text('Scan to track status', 160, 285);

  // Footer
  doc.setFontSize(10);
  doc.text('Terms & Conditions:', 20, 250);
  doc.setFontSize(8);
  doc.text('1. Not responsible for data loss.', 20, 256);
  doc.text('2. Items not collected within 30 days will be disposed.', 20, 261);

  if (challan.status === 'delivered') {
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(60);
    doc.text('DELIVERED', 50, 150, { angle: 45 });
  }

  doc.save(`Challan_${challan.challan_no}.pdf`);
};
