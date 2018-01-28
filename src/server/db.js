import pgPromise from 'pg-promise'

const connection = {
  host: 'localhost',
  port: 5432,
  database: 'aruna',
  user: 'anbu',
  password: 'pswd'
}

const db = pgPromise()(process.env.DATABASE_URL || connection)

export { db }
export { pgPromise }
