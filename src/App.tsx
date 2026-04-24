import { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import type { InvoiceData } from './types';

const initialInvoiceData: InvoiceData = {
  business: {
    name: '',
    email: '',
    address: '',
    logo: null,
  },
  client: {
    name: '',
    email: '',
    address: '',
  },
  details: {
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  lineItems: [
    { id: uuidv4(), description: '', quantity: 1, unitPrice: 0 }
  ],
  taxRate: 0,
};

function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialInvoiceData);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceData.details.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Invoice Generator</h1>
            <p className="mt-2 text-sm text-slate-600">Create professional invoices in seconds.</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <Download className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Download as PDF'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
          </div>
          
          <div className="w-full lg:w-1/2 bg-slate-200 rounded-xl p-4 flex justify-center overflow-y-auto shadow-inner" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            <div className="transform scale-[0.6] sm:scale-75 md:scale-90 lg:scale-[0.8] xl:scale-[0.85] origin-top">
              <InvoicePreview data={invoiceData} previewRef={previewRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
