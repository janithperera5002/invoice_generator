import type { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import type { InvoiceData } from '../types';
import LineItemsTable from './LineItemsTable';
import AILineItemGenerator from './AILineItemGenerator';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export default function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  const handleBusinessChange = (field: keyof InvoiceData['business'], value: string) => {
    onChange({ ...data, business: { ...data.business, [field]: value } });
  };

  const handleClientChange = (field: keyof InvoiceData['client'], value: string) => {
    onChange({ ...data, client: { ...data.client, [field]: value } });
  };

  const handleDetailsChange = (field: keyof InvoiceData['details'], value: string) => {
    onChange({ ...data, details: { ...data.details, [field]: value } });
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleBusinessChange('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-8">
      {/* Header / Logo */}
      <div className="flex justify-between items-start">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-slate-700 mb-2">Business Logo</label>
          <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-slate-400 focus:outline-none relative overflow-hidden group">
            {data.business.logo ? (
              <>
                <img src={data.business.logo} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium">Change Logo</span>
                </div>
              </>
            ) : (
              <span className="flex flex-col items-center space-y-2">
                <Upload className="w-6 h-6 text-slate-400" />
                <span className="font-medium text-slate-600 text-sm">Upload logo</span>
              </span>
            )}
            <input type="file" name="file_upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
          </label>
        </div>
        
        <div className="w-1/2 space-y-4">
          <div className="text-right">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">INVOICE</h2>
          </div>
          <div className="flex items-center justify-end gap-4">
            <label className="text-sm font-medium text-slate-600">Invoice No.</label>
            <input
              type="text"
              value={data.details.invoiceNumber}
              onChange={(e) => handleDetailsChange('invoiceNumber', e.target.value)}
              className="w-1/2 px-3 py-2 text-right border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <label className="text-sm font-medium text-slate-600">Issue Date</label>
            <input
              type="date"
              value={data.details.issueDate}
              onChange={(e) => handleDetailsChange('issueDate', e.target.value)}
              className="w-1/2 px-3 py-2 text-right border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <label className="text-sm font-medium text-slate-600">Due Date</label>
            <input
              type="date"
              value={data.details.dueDate}
              onChange={(e) => handleDetailsChange('dueDate', e.target.value)}
              className="w-1/2 px-3 py-2 text-right border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Business Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">From</h3>
          <input
            type="text"
            placeholder="Business Name"
            value={data.business.name}
            onChange={(e) => handleBusinessChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={data.business.email}
            onChange={(e) => handleBusinessChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Address"
            rows={3}
            value={data.business.address}
            onChange={(e) => handleBusinessChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Client Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">To</h3>
          <input
            type="text"
            placeholder="Client Name"
            value={data.client.name}
            onChange={(e) => handleClientChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Client Email"
            value={data.client.email}
            onChange={(e) => handleClientChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Client Address"
            rows={3}
            value={data.client.address}
            onChange={(e) => handleClientChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      <AILineItemGenerator
        onGenerate={(newItems) => {
          // If the only item is the default empty one, replace it. Otherwise append.
          const isEmptyDefault = data.lineItems.length === 1 && data.lineItems[0].description === '' && data.lineItems[0].unitPrice === 0;
          onChange({
            ...data,
            lineItems: isEmptyDefault ? newItems : [...data.lineItems, ...newItems]
          });
        }}
      />

      <LineItemsTable
        items={data.lineItems}
        onChange={(items) => onChange({ ...data, lineItems: items })}
      />

      {/* Footer / Totals */}
      <div className="flex justify-end pt-4 border-t">
        <div className="w-1/2 space-y-3">
          <div className="flex justify-between items-center text-slate-600">
            <span>Tax Rate (%)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={data.taxRate}
              onChange={(e) => onChange({ ...data, taxRate: parseFloat(e.target.value) || 0 })}
              className="w-32 px-3 py-2 text-right border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
