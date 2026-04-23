export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
}

export interface BusinessDetails {
  name: string;
  email: string;
  address: string;
  logo: string | null;
}

export interface ClientDetails {
  name: string;
  email: string;
  address: string;
}

export interface InvoiceData {
  business: BusinessDetails;
  client: ClientDetails;
  details: InvoiceDetails;
  lineItems: LineItem[];
  taxRate: number;
}
