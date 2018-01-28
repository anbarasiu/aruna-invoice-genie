import { getState, updateState } from 'redux-jetpack'
import server from '../constants'
import 'isomorphic-fetch'

export async function get() {
  console.log('Get Customers -> ')
  const res = await fetch(`${server()}/api/customer`)
  if (res.status === 200)
    res.json().then(
      resData => {
        updateState('customers', customers => resData.customers)
        updateState('customerMatches', customerMatches => resData.customers)
      }
    )
  else console.log('No data found')
}

export function findMatches(partname) {
  console.log('Find Customer Match -> ', partname)
  const customers = getState(state => state.customers)
  const matchRegex = new RegExp(partname, 'i')
  const customerMatches = customers.filter(customer => (matchRegex).test(customer.cname))
  console.log('Customer Matches -> ', customerMatches)
  updateState('customerMatches', state => customerMatches)
}

export function clearMatches() {
  updateState('customerMatches', customerMatches => null)
}
