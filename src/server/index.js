import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import r from './routes'

const app = express()

app.use(cors())
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(path.resolve(__dirname, '../..')))

app.get('/api/invoice/:id', r.invoice.get)
app.get('/api/invoice/delete/:id', r.invoice.del)
app.post('/api/invoice/create', r.invoice.put)
app.post('/api/invoice/update', r.invoice.update)
app.get('/api/product/delete/:id', r.product.remove)
app.post('/api/product/update', r.product.update)
app.post('/api/product/create', r.product.put)
app.get('/api/product', r.product.get)
app.get('/api/customer', r.customer.get)
app.get('/api/report/:from/:to', r.report.get)


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../..', 'index.html'));
});

app.listen(process.env.PORT || 9000, () => {
  console.log(`App listening on port probably 9k!`)
})
