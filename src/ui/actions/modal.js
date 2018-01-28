import { updateState } from 'redux-jetpack'

export function open(message) {
  console.log('Modal Message -> ', message)
  updateState('modal', modal => ({
    active: true,
    message
  }))
}

export function close() {
  console.log('Close Modal')
  updateState('modal', modal => ({
    active: false,
    message: ''
  }))
}
