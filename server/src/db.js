import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'lucvan5_lab',
  password: process.env.DB_PASSWORD || 'md.CR8%O0vIt',
  database: process.env.DB_NAME || 'lucvan5_lab',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 10,
  enableKeepAlive: true,
})

export default pool
