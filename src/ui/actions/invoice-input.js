import { updateState } from 'redux-jetpack'

export function checkbox(input) {
  const name = input.target.value.toLowerCase()
  updateState('input', input => ({ ...input, [name]: !input[name] }))
}

export function date(input) {
  console.log('Date Tracked -> ', input.target.value)
  const date = input.target.value
  updateState('input', input => ({ ...input, date }))
}

export function textbox(input, row) {
  const name = input.target.name
  const value = input.target.value
  updateState('input', input => (
    {
      ...input,
      rows: Object.assign(
        [...input.rows],
        { [row]: { ...input.rows[row], [name]: value } }
      )
    }
  ))
}

export function radio(input, row) {
  const name = input.target.name
  const value = input.target.value
  updateState('input', input => (
    {
      ...input,
      rows: Object.assign(
        [...input.rows],
        { [row]: { ...input.rows[row], [name]: value } }
      )
    }
  ))
}

export function setProduct(row, match) {
  console.log('Set Product -> ', row, match)
  updateState('input', input => (
    {
      ...input,
      rows: Object.assign(
        [...input.rows],
        { [row]: match }
      )
    }
  ))
}

export function customerData(input) {
  console.log('Customer Data -> ', input)
  const name = input.target.name
  const value = input.target.value
  updateState('input', input => (
    {
      ...input,
      customer: { ...input.customer, [name]: value }
    }))
}

export function setCustomer(match) {
  console.log('Set Customer -> ', match)
  updateState('input', input => ( { ...input, customer: match } ))
}

export function setActive(row) {
  updateState('currentActive', currentActive => row)
}

export function newProduct(row) {
  updateState('input', input => ({
    ...input,
    rows: Object.assign(
      [...input.rows],
      { [row]: { ...input.rows[row], pid: "" } }
    )
  }))
}

export function newCustomer(row) {
  updateState('input', input => (
    {
      ...input,
      customer: { ...input.customer, cid: "" }
    }))
}

export function highlightProductMatch(op, matchCount) {
  const calc = {
    '+': no => ++no,
    '-': no => --no
  }
  console.log('Highlight Product Match -> ', op)
  updateState('highlightProductMatch', highlightProductMatch =>
    highlightProductMatch === null
      ? 0
      : calc[op]((highlightProductMatch + matchCount)) % matchCount
  )
}

export function clearProductHighlight() {
  updateState('highlightProductMatch', highlightProductMatch => null)
}

export function addRow() {
  updateState('input', input => (
    {
      ...input,
      rows: Object.assign([...input.rows],
        {
          [input.rows.length]: {
            pid: "",
            name: "",
            mrp: "",
            price: "",
            quantity: "",
            gst: ""
          }
        }
      )
    }
  ))
}
