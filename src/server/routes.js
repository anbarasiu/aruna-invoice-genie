// Some day
// export { * as invoice } from './invoice'
// export { * as product } from './product'
// export { * as customer } from './customer'

// TODO: Clean up everything. Modularize.
import * as invoice from './invoice'
import * as product from './product'
import * as customer from './customer'
import * as report from './report'

export default { invoice, product, customer, report }
