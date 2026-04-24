import React from 'react';
import type { InvoiceData } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export default function InvoicePreview({ data, previewRef }: InvoicePreviewProps) {
  const subtotal = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div
      ref={previewRef}
      className="bg-white p-10 shadow-sm border border-slate-200"
      style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }} // A4 size approximation
    >
      <div className="flex justify-between items-start mb-12">
        <div className="w-1/2">
          {data.business.logo ? (
            <img src={data.business.logo} alt="Business Logo" className="h-16 object-contain mb-4" />
          ) : (
            <div className="h-16 mb-4 flex items-end">
              <span className="text-2xl font-bold text-slate-800">{data.business.name || 'Your Business'}</span>
            </div>
          )}
          <div className="text-sm text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">{data.business.name}</p>
            <p>{data.business.email}</p>
            <p className="whitespace-pre-line">{data.business.address}</p>
          </div>
        </div>

        <div className="w-1/2 text-right">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-wider">INVOICE</h1>
          <div className="text-sm text-slate-600 space-y-1">
            <p><span className="font-semibold text-slate-800">Invoice No:</span> {data.details.invoiceNumber}</p>
            <p><span className="font-semibold text-slate-800">Date:</span> {data.details.issueDate}</p>
            <p><span className="font-semibold text-slate-800">Due Date:</span> {data.details.dueDate}</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 border-b pb-2">Bill To</h2>
        <div className="text-sm text-slate-600 space-y-1 mt-4">
          <p className="font-semibold text-slate-800 text-base">{data.client.name || 'Client Name'}</p>
          <p>{data.client.email}</p>
          <p className="whitespace-pre-line">{data.client.address}</p>
        </div>
      </div>

      <table className="w-full text-left mb-8">
        <thead>
          <tr className="border-b-2 border-slate-800 text-slate-800 text-sm">
            <th className="py-3 font-bold uppercase tracking-wider">Description</th>
            <th className="py-3 font-bold uppercase tracking-wider text-center w-24">Qty</th>
            <th className="py-3 font-bold uppercase tracking-wider text-right w-32">Price</th>
            <th className="py-3 font-bold uppercase tracking-wider text-right w-32">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item, index) => (
            <tr key={index} className="border-b border-slate-200">
              <td className="py-4 text-sm text-slate-800">{item.description || '-'}</td>
              <td className="py-4 text-sm text-slate-600 text-center">{item.quantity}</td>
              <td className="py-4 text-sm text-slate-600 text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="py-4 text-sm text-slate-800 text-right font-medium">
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between py-2 text-sm text-slate-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-200">
            <span>Tax ({data.taxRate}%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-4 text-lg font-bold text-slate-800">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
