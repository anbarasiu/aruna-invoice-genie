import { updateState } from 'redux-jetpack'

export function captureDate(e) {
  const name = e.target.name
  const value = e.target.value
  console.log('Input -> ', name, value)
  updateState('report', report => ({
    ...report,
    [name]: value
  }))
}
