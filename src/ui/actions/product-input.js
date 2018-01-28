import { updateState } from 'redux-jetpack'

export function initiateUpdate(row, product) {
  console.log('Initiate Update ->', row, product)
  updateState('productManage', productManage => ({
    ...productManage,
    update: { ...product, row }
  }))
}

export function captureUpdate(e) {
  const name = e.target.name
  const value = e.target.value
  updateState('productManage', productManage => ({
    ...productManage,
    update: { ...productManage.update, [name]: value }
  }))
}

export function confirmUpdate() {
  console.log('Confirm Update');
  updateState('productManage', productManage => ({
    ...productManage,
    activeModal: "update-confirm"
  }))
}

export function purgeUpdate() {
  console.log('Purging Update Data')
  updateState('productManage', productManage => ({
    ...productManage,
    update: {}
  }))
}

export function initiateDelete(id, name) {
  console.log('Initiate Delete of ', id, name);
  updateState('productManage', productManage => ({
    ...productManage,
    remove: { id, name },
    activeModal: 'delete-confirm'
  }))
}

export function initiateCreate() {
  console.log('Product Initiate Create')
  updateState('productManage', productManage => ({
    ...productManage,
    insert: {
      name: '',
      mrp: '',
      price: '',
      gst: ''
    }
  }))
}

export function captureInsert(e) {
  const name = e.target.name
  const value = e.target.value
  updateState('productManage', productManage => ({
    ...productManage,
    insert: { ...productManage.insert, [name]: value }
  }))
}

export function purgeInsert() {
  console.log('Purging Insert Data')
  updateState('productManage', productManage => ({
    ...productManage,
    insert: {}
  }))
}

export function closeModal() {
  updateState('productManage', productManage => ({
    ...productManage,
    activeModal: ""
  }))
}
