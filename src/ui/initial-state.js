  export default {
  redirect: null,
  highlightProductMatch: null,
  products: [],
  productMatches: [],
  customers: [],
  customerMatches: [],
  currentActive: "",
  modal: {
    active: false,
    message: ""
  },
  input: {
    date: "",
    igst: false,
    customer: {
      cid: "",
      cname: "",
      caddress: "",
      cgstid: ""
    },
    rows: [
      {
        pid: "",
        name: "",
        mrp: "",
        price: "",
        quantity: "",
        gst: ""
      }
    ]
  },
  invoice: {},
  productManage: {
    update: {
      row: null
    },
    insert: {},
    remove: {
      id: null,
      name: null
    },
    activeModal: ""
  },
  report: {
    from: "",
    to: "",
    out: {
      rows: [],
      total: 0
    }
  }
};
