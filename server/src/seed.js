import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import pool from './db.js'

dotenv.config()

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin','clinic','workshop') NOT NULL,
      clinic_id INT NULL,
      INDEX idx_email (email),
      FOREIGN KEY (clinic_id) REFERENCES clinics(id)
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clinics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      email VARCHAR(255),
      address VARCHAR(255),
      INDEX idx_name (name)
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      doctor_name VARCHAR(255) NOT NULL,
      template_type VARCHAR(255) NOT NULL,
      foot_side ENUM('Izquierdo','Derecho','Ambos') NOT NULL,
      shoe_size VARCHAR(50) NOT NULL,
      conditions_json TEXT,
      observations TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_created_at (created_at),
      INDEX idx_patient_id (patient_id)
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(100),
      email VARCHAR(255),
      birth_date DATE,
      clinic VARCHAR(255),
      notes TEXT,
      INDEX idx_name (name)
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS invites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL UNIQUE,
      role ENUM('admin','clinic','workshop') NOT NULL,
      clinic_id INT NULL,
      used TINYINT(1) DEFAULT 0,
      expires_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      FOREIGN KEY (clinic_id) REFERENCES clinics(id)
    );
  `)

  const [rows] = await pool.query('SELECT id FROM users WHERE email=?', ['admin@lucvanlatam.com'])
  if (rows.length === 0) {
    const hash = await bcrypt.hash('$Lucv@n123', 10)
    await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      ['admin@lucvanlatam.com', hash, 'admin']
    )
    console.log('Usuario admin creado')
  } else {
    console.log('Usuario admin ya existe')
  }

  // Insert sample patients if none exist
  const [pRows] = await pool.query('SELECT id FROM patients LIMIT 1')
  if (pRows.length === 0) {
    await pool.query(`INSERT INTO patients (name, phone, email, birth_date, clinic, notes) VALUES
      ('María González', '+52 555 123 4567', 'maria@example.com', '1990-05-15', 'Clínica Dental Central', 'Paciente con diabetes tipo 2. Requiere seguimiento especial.'),
      ('Juan Pérez', '+52 555 234 5678', 'juan@example.com', '1983-08-22', 'Clínica Dental Central', 'Alergico a ciertos materiales. Verificar antes de cada tratamiento.'),
      ('Ana Martínez', '+52 555 345 6789', 'ana@example.com', '1995-11-10', 'Dental Care Plus', ''),
      ('Carlos López', '+52 555 456 7890', 'carlos@example.com', '1988-03-20', 'Odontología Integral', 'Practica deporte de alto rendimiento. Necesita plantillas deportivas.')
    `)
    console.log('Pacientes de muestra insertados')
  } else {
    console.log('Pacientes ya existen')
  }

  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })
