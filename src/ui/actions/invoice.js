import { updateState } from 'redux-jetpack'
import server from '../constants'
import 'isomorphic-fetch'

export async function create(data) {
  data.rows = data.rows.reduce(
    (out, row) => row.name === "" ? out : out.concat(row), []
  )
  console.log("Create invoice action data", data)
  const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }
  const res = await fetch(`${server()}/api/invoice/create`, options)
  console.log('Create Invoice Action Result -> ', res)
  res.status === 200
    ? res.json().then(
      resData => updateState('redirect', redirect => `/invoice/${resData.iid}`)
    )
    : updateState('redirect', redirect => '/invoice/no-data/')
}

export async function display(id) {
  console.log('Display invoice ', id)
  const res = await fetch(`${server()}/api/invoice/${id}`)
  console.log('Display Invoice Action Result -> ', res)
  let resData
  if (res.status === 200) {
    resData = await res.json()
    console.log('Invoice Response Data -> ', resData)
    updateState('invoice', invoice => resData)
  } else console.log('No data found')
}

export async function edit(id) {
  console.log('Edit invoice ', id)
  const res = await fetch(`${server()}/api/invoice/${id}`)
  console.log('Display Invoice Action Result -> ', res)
  let resData
  if (res.status === 200) {
    resData = await res.json()
    console.log('Invoice Response Data -> ', resData)
    updateState('invoice', invoice => resData)
  } else console.log('No data found')
}

export async function remove(id) {
  console.log('Delete invoice ', id)
  const res = await fetch(`${server()}/api/invoice/delete/${id}`)
  console.log('Delete Invoice Action Result -> ', res)
  if (res.status === 200) {
    updateState('invoice', invoice => resData)
  } else console.log('Record not found')
}
