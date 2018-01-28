import { pgPromise, db } from './db'
import converter from 'number-to-words'
require("babel-core/register")
require("babel-polyfill")

export async function get(req, res) {
  console.log('Find Product Match')

  const productGet = productid => db.manyOrNone('SELECT * FROM product WHERE active = TRUE')

  try {
    const products = await productGet()
    console.log('Products -> ', products)
    res.status(200).json({ products })
  } catch(e) {
    console.log('Find Product Match Error -> ', e)
    res.status(500)
  }
}

export async function put(req, res) {
  console.log('Create Product')
  console.log(req.body)

  const addP = p =>
    db.one(
      `INSERT INTO product(name, mrp, price, gst)
      VALUES($1, $2, $3, $4)
      RETURNING pid`,
      [p.name, p.mrp, p.price, p.gst]
    )

  try {
    const created = await addP(req.body)
    console.log('Created Product -> ', created)
    res.status(200)
  } catch(e) {
    console.log('Create Product Error -> ', e)
    res.status(500)
  }
}

export async function update(req, res) {
  console.log('Update Product')
  console.log(req.body)

  const upP = p => db.oneOrNone(`
    UPDATE product
    SET name = $2, mrp = $3, price = $4, gst = $5
    WHERE pid = $1
    RETURNING pid`,
    [p.pid, p.name, p.mrp, p.price, p.gst])

  try {
    const updated = await upP(req.body)
    console.log('Updated Product -> ', updated)
    res.status(200)
  } catch(e) {
    console.log('Update Product Error -> ', e)
    res.status(500)
  }
}

export async function remove(req, res) {
  console.log('Delete Product')

  const delP = id => db.oneOrNone(`
    UPDATE product
    SET active=FALSE
    WHERE pid = $1
    RETURNING pid`,
    [id])

  try {
    const deleted = await delP(req.params.id)
    console.log('Deleted Product -> ', deleted)
    res.status(200)
  } catch(e) {
    console.log('Delete Product Error -> ', e)
    res.status(500)
  }
}
