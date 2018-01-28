import { pgPromise, db } from './db'
import converter from 'number-to-words'
require("babel-core/register")
require("babel-polyfill")


export async function get(req, res) {
  console.log('Get Customers')

  const cGet = productid => db.manyOrNone('SELECT * FROM customer')

  try {
    const customers = await cGet()
    console.log('Customers  -> ', customers)
    res.status(200).json({ customers })
  } catch(e) {
    console.log('Get Customers Error -> ', e)
    res.status(500)
  }
}
