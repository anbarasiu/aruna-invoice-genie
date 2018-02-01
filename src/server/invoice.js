import { pgPromise, db } from './db'
import converter from 'number-to-words'
require("babel-core/register")
require("babel-polyfill")

export async function put(req, res) {
  console.log('Create invoice')
  console.log(req.query)
  console.log(req.body)

  const input = req.body
  const data = req.body.rows

  const columnSet = pgPromise().helpers.ColumnSet(
    ['invoiceid', 'productid', 'price', 'quantity', 'usedgst'],
    { table: 'invoiceproduct' }
  )

  const customerInsert = c => db.one(`INSERT INTO customer(cname, caddress, cgstid)
    VALUES($1, $2, $3)
    RETURNING cid`,
    [c.cname, c.caddress, c.cgstid]
  )

  const invoiceInsert = (date, igst, cid) => db.one(`INSERT INTO invoice(dt, igst, storeid, customerid)
    VALUES($1, $2, $3, $4)
    RETURNING iid`,
    [date, igst, 1, cid]
  )

  const invoiceDataInsert = (data, invoiceid) =>
    db.any(
      pgPromise().helpers.insert(
        rowDataConstructor(data, invoiceid), columnSet
      ) + 'RETURNING ipid'
    )

  const rowDataConstructor = (data, invoiceid) =>
    data.map(row => Object.assign(
      {},
      { invoiceid, productid: row.pid, price: row.price, quantity: row.quantity, usedgst: row.gst }
    ))

  const productAdder = r =>
    db.one(
      `INSERT INTO product(name, mrp, price, gst)
      VALUES($1, $2, $3, $4)
      RETURNING pid`,
      [r.name, r.mrp, r.price, r.gst]
    )

  const productIdAdder = async row => {
    const productAdderResult = await productAdder(row)
    const pid = productAdderResult.pid
    return { ...row, pid }
  }

    const productIdGenerator = async data =>
      await Promise.all(
        data.map(row =>
          row.pid === ''
            ? productIdAdder(row)
            : row
        )
      )

  try {
    const customer = input.customer.cname === '' && input.customer.cgstid === ''
      ? { cid: null }
      : input.customer.cid !== ''
        ? input.customer
        : await customerInsert(input.customer)
    console.log('Customer Data -> ', customer)

    const date = input.date === "" ? new Date() : input.date

    console.log('Date check -> ', date)

    const { iid } = await invoiceInsert(date, input.igst, customer.cid)

    const verifiedData = await productIdGenerator(data)
    console.log('Modified Data', verifiedData)

    const batchRowInsert = await invoiceDataInsert(verifiedData, iid)
    console.log('Invoice Products Populated', batchRowInsert)

    res.status(200).json({ iid })
  } catch(e) {
    console.log('Invoice Creation Error -> ', e)
    res.status(500)
  }

}


export async function get(req, res) {
  console.log('Show Invoice')
  console.log(req.params.id)

  const invoiceGet = invoiceid => db.one('SELECT * FROM invoice WHERE iid = $1', [invoiceid])
  const customerGet = customerid => db.one('SELECT * FROM customer WHERE cid = $1', [customerid])
  const storeGet = storeid => db.one('SELECT * FROM store WHERE sid = $1', [storeid])
  const invoiceListGet = invoiceid => db.many('SELECT * FROM invoiceproduct WHERE invoiceid = $1', [invoiceid])
  const productGet = productid => db.one('SELECT * FROM product WHERE pid = $1', [productid])
  const calculateGst = (productList, igst) => productList.map(
    productRow => {
      const amount = productRow.price * productRow.quantity
      const bprice = productRow.gst === 0
        ? amount
        : ((100 / (100 + productRow.gst)) * amount)
      const gstAmount = amount - bprice
      return igst
        ? {
          ...productRow,
          bprice: bprice.toFixed(2),
          amount: amount.toFixed(2),
          igst: gstAmount.toFixed(2)
        }
        : {
          ...productRow,
          bprice: bprice.toFixed(2),
          amount: amount.toFixed(2),
          cgst: (gstAmount / 2).toFixed(2),
          sgst: (gstAmount / 2).toFixed(2)
        }
    }
  )
  const calculateTotal = productList => productList.reduce(
    (out, product) => (
      {
        bpriceTotal: out.bpriceTotal + parseFloat(product.bprice),
        cgstTotal: out.cgstTotal + parseFloat(product.cgst),
        sgstTotal: out.sgstTotal + parseFloat(product.sgst),
        igstTotal: out.igstTotal + parseFloat(product.igst),
        total: out.total + parseFloat(product.amount)
      }
    ),
    { bpriceTotal: 0, cgstTotal: 0, sgstTotal: 0, igstTotal: 0, total: 0 }
  )

  const twoDecimal = obj => Object.keys(obj).reduce((acc, cur) => {
    acc[cur] = typeof obj[cur]  === 'number' ? obj[cur].toFixed(2) : obj[cur]
    return acc;
  }, {});

  try {
    const { iid, dt, igst, storeid, customerid } = await invoiceGet(req.params.id)
    console.log('Invoice Get -> ', iid, dt, storeid, customerid)

    const plainProductList = await invoiceListGet(iid)
    console.log('Product List -> ', plainProductList)

    const detailedProductList = await Promise.all(
      plainProductList.map(async p => {
        const productData = await productGet(p.productid)
        delete productData.price
        console.log('Product Data -> ', productData)
        return { ...p, ...productData }
      })
    )
    console.log('Super Product List -> ', detailedProductList)

    const productList = calculateGst(detailedProductList, igst)
    console.log('Complete Product List -> ', productList)

    const { sname, saddress, sgstid } = await storeGet(storeid)
    console.log('Store Get -> ', sname, saddress, sgstid)

    const { cname, caddress, cgstid } = customerid ? await customerGet(customerid) : { cname: null, caddress: null, cgstid: null }

    const { bpriceTotal, cgstTotal, sgstTotal, igstTotal, total } = twoDecimal(calculateTotal(productList))

    const totalInWords = converter.toWords(total)

    console.log('Total Calculated -> ', total)

    console.log(iid, dt.toString().substring(0, 15), igst,
      sname, saddress, sgstid,
      cname, caddress, cgstid,
      bpriceTotal, cgstTotal, sgstTotal, igstTotal, total, totalInWords,
      productList)
    res.status(200).json({
      iid, dt: dt.toString().substring(0, 15), igst,
      sname, saddress, sgstid,
      cname, caddress, cgstid,
      bpriceTotal, cgstTotal, sgstTotal, igstTotal, total, totalInWords,
      productList
    })

  } catch(e) {
    console.log('Show Invoice Error -> ', e)
    res.status(500)
  }
}

export async function del(req, res) {
  const invoiceid = req.params.id
  const invoiceDel = invoiceid => db.one('DELETE FROM invoice WHERE iid = $1', [invoiceid])

  try {
    const success = await invoiceDel(invoiceid)
    res.status(200)
  } catch(e) {
    console.log('Invoice Delete Error -> ', e)
    res.status(500)
  }
}

export async function update(req, res) {
  const invoiceid = req.params.id
  const invoiceUpdate = invoiceid => db.one('DELETE FROM invoice WHERE iid = $1', [invoiceid])

  try {
    const success = await invoiceUpdate(invoiceid)
    res.status(200)
  } catch(e) {
    console.log('Invoice Update Error -> ', e)
    res.status(500)
  }
}
