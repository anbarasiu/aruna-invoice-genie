import { getState, updateState } from 'redux-jetpack'
import server from '../constants'
import 'isomorphic-fetch'

export async function get() {
  console.log('Get Products -> ')
  const res = await fetch(`${server()}/api/product`)
  let resData
  if (res.status === 200) {
    resData = await res.json()
    updateState('products', products => resData.products)
  } else console.log('No data found')
}

export function findMatches(partname) {
  const products = getState(state => state.products)
  const matchRegex = new RegExp(partname, 'i')
  const productMatches = products.filter(product => (matchRegex).test(product.name))
  updateState('productMatches', state => productMatches)
}

export function clearMatches() {
  updateState('productMatches', productMatches => null)
}

export async function create(data) {
  console.log('Create Product Server Call Action -> ', data)
  const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }
  const res = await fetch(`${server()}/api/product/create`, options)
  try {
    const activeModal = res.status === 200 ? 'create-success' : 'create-failure'
    updateState('productManage', productManage =>
    ({
      ...productManage,
      activeModal
    }))
  } catch(e) {
    console.log('Product Update Error -> ', e)
    updateState('productManage', productManage => (
      { ...productManage, activeModal: "create-failure" }
    ))
  }
}

export async function update(data) {
  console.log('Update Product Server Call Action -> ', data)
  const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }
  try {
    const res = await fetch(`${server()}/api/product/update`, options)
    console.log(res)
    const activeModal = res.status === 200 ? "update-success" : "update-failure"
    updateState('productManage', productManage =>
    ({
      ...productManage,
      activeModal
    }))
  } catch(e) {
    console.log('Product Update Error -> ', e)
    updateState('productManage', productManage => (
      { ...productManage, activeModal: "update-failure" }
    ))
  }
}

export async function remove(pid) {
  const res = await fetch(`${server()}/api/product/delete/${pid}`)
  try {
    const activeModal = res.status === 200 ? "delete-success" : "delete-failure"
    updateState('productManage', productManage =>
    ({
      ...productManage,
      activeModal
    }))
  } catch (e) {
    console.log('Product Remove Error -> ', e)
    updateState('productManage', productManage => (
      { ...productManage, activeModal: "delete-failure" }
    ))
  }
}
