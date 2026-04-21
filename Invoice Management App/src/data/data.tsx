export type InvoiceStatus = "paid" | "pending" | "draft"




export type Invoice = {
  id: string
  status: InvoiceStatus

  senderAddress: {
    street: string
    city: string
    postcode: string
    country: string
  }

  client: {
    name: string
    email: string
    address: {
      street: string
      city: string
      postcode: string
      country: string
    }
  }

  invoiceDate: string
  paymentTerms: string
  projectDescription: string

  items: {
    itemName: string
    quantity: number
    price: number
    total: number
  }[]

  grandTotal: number
}

export const invoices: Invoice[] = [
  {
    id: "RT3080",
    status: "paid",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postcode: "E1 3EZ",
      country: "United Kingdom"
    },
    client: {
      name: "Jensen Huang",
      email: "jensen@nvidia.com",
      address: {
        street: "1 NVIDIA Way",
        city: "Santa Clara",
        postcode: "95050",
        country: "United States"
      }
    },
    invoiceDate: "2026-04-21",
    paymentTerms: "Net 30 Days",
    projectDescription: "Website Redesign",
    items: [
      {
        itemName: "UI Design",
        quantity: 2,
        price: 250,
        total: 500
      }
    ],
    grandTotal: 500
  },

  {
    id: "RT3081",
    status: "pending",
    senderAddress: {
      street: "88 Baker Street",
      city: "London",
      postcode: "NW1 6XE",
      country: "United Kingdom"
    },
    client: {
      name: "Sarah Johnson",
      email: "sarah@gmail.com",
      address: {
        street: "12 Ocean Drive",
        city: "New York",
        postcode: "10001",
        country: "United States"
      }
    },
    invoiceDate: "2026-04-18",
    paymentTerms: "Net 7 Days",
    projectDescription: "Mobile App UI",
    items: [
      {
        itemName: "Wireframing",
        quantity: 3,
        price: 150,
        total: 450
      }
    ],
    grandTotal: 450
  },

  {
    id: "RT3082",
    status: "draft",
    senderAddress: {
      street: "45 King Street",
      city: "Manchester",
      postcode: "M1 4BT",
      country: "United Kingdom"
    },
    client: {
      name: "Michael Brown",
      email: "michael@startup.io",
      address: {
        street: "77 Silicon Avenue",
        city: "San Francisco",
        postcode: "94107",
        country: "United States"
      }
    },
    invoiceDate: "2026-04-10",
    paymentTerms: "Net 14 Days",
    projectDescription: "E-commerce Site",
    items: [
      {
        itemName: "Backend API",
        quantity: 1,
        price: 1200,
        total: 1200
      }
    ],
    grandTotal: 1200
  }
]