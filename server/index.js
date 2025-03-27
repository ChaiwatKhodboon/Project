const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');

const port = 8000;

app.use(bodyParser.json());
app.use(cors());

let documents = [];

let conn = null;

const initMySQL = async () => {
   conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root', // Fixed typo here: was 'document'
    password: 'root',
    database: 'webdb',
    port: 8822
  });
};

const validateData = (documentsData) => {
  let errors = [];
  if (!documentsData.firstName) {
    errors.push('กรุณากรอกชื่อ');
  }
  if (!documentsData.lastName) {
    errors.push('กรุณากรอกนามสกุล');
  }
  if (!documentsData.age) {
    errors.push('กรุณากรอกอายุ');
  }
  if (!documentsData.gender) {
    errors.push('กรุณาเลือกเพศ');
  }
  if (!documentsData.interests) {
    errors.push('กรุณาเลือกความสนใจ');
  }
  if (!documentsData.description) {
    errors.push('กรุณากรอกคำอธิบาย');
  }
  return errors;
};

// path = GET /documents สำหรับ get documents ทั้งหมดที่บันทึกไว้
app.get('/documents', async (req, res) => {
  const results = await conn.query('SELECT * FROM documents');
  res.json(results[0]);
});

// path = POST /document สำหรับสร้าง document ใหม่
app.post('/documents', async (req, res) => {
  try {
    let documents = req.body;
    const errors = validateData(documents);
    if (errors.length > 0) {
      throw {
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        errors: errors
      };
    }
    const results = await conn.query('INSERT INTO documents SET ?', documents);
    res.json({
      message: 'Create document successfully',
      data: results[0]
    });
  } catch (error) {
    const errorMesssage = error.message || 'something went wrong';
    const errors = error.errors || [];
    console.error('error:', error.message);
    res.status(500).json({
      message: errorMesssage,
      errors: errors,
    });
  }
});

// path = GET /documents/:id สำหรับ ดึง documents รายคนออกมา
app.get('/documents/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query('SELECT * FROM documents WHERE id = ?', id);
    if (results[0].length == 0) {
      throw { statusCode: 404, message: 'document not found' };
    }
    res.json(results[0][0]);
  } catch (err) {
    console.log('error', err.message);
    let statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: 'something went wrong',
      errorMesssage: err.message
    });
  }
});

// path = PUT /documents/:id สำหรับแก้ไข documents รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/documents/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let updateDocuments = req.body;
    const results = await conn.query(
      'UPDATE documents SET ? WHERE id = ?',
      [updateDocuments, id]
    );
    res.json({
      message: 'Update document successfully',
      data: results[0]
    });
  } catch (err) {
    res.status(500).json({
      message: 'something went wrong',
      errorMesssage: err.message
    });
  }
});

// path = DELETE /documents/:id สำหรับลบ documents รายคน ตาม id ที่บันทึกเข้าไป
app.delete('/documents/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query('DELETE from documents WHERE id = ?', id);
    res.json({
      message: 'Delete document successfully',
      data: results[0]
    });
  } catch (err) {
    console.log('error', err.message);
    res.status(500).json({
      message: 'something went wrong',
      error: err.message
    });
  }
});

app.listen(port, async (req, res) => {
  await initMySQL();
  console.log('http server is running on port ' + port);
});
