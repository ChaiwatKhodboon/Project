const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
  // เรียกใช้ฟังก์ชัน loadData เมื่อลงหน้าหมายเลข
  await loadData();
};

const loadData = async () => {
  console.log('documents page loaded');

  //1. load user ทั้งหมด จาก api ที่เตรียมไว้
  const response = await axios.get(`${BASE_URL}/documents`);
  console.log(response.data);

  const documentsDOM = document.getElementById('documents');
  if (!documentsDOM) {
    console.log('ไม่พบ div ที่มี id="documents"');
    return;
  }

  //2. นำ user ทั้งหมด โหลดกลับเข้าไปใน html
  //สร้างตารางเพื่อแสดงข้อมูล 
  let htmlData = `
  <table border="1" cellspacing="1" cellpadding="10">
      <thead>
          <tr>
              <th>ID</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Interests</th>
              <th>Description</th>
              <th>Action</th>
          </tr>
      </thead>
      <tbody>
  `;

  // แสดงข้อมูลทั้งหมดจาก API
  for (let i = 0; i < response.data.length; i++) {
    let document = response.data[i];
    htmlData += `
      <tr>
          <td>${document.id}</td>
          <td>${document.firstName}</td>
          <td>${document.lastName}</td>
          <td>${document.age}</td>
          <td>${document.gender}</td>
          <td>${document.interests || '-'}</td>
          <td>${document.description || '-'}</td>
          <td>
              <a href="index.html?id=${document.id}"><button class='Edit'>Edit</button></a>
              <button class="delete" data-id="${document.id}">Delete</button>
          </td>
      </tr>
    `;
  }

  htmlData += `
            </tbody>
        </table>
    `;

  // นำข้อมูลที่สร้างไว้มาแสดงใน DOM
  documentsDOM.innerHTML = htmlData;

  //3. สร้าง event สำหรับลบข้อมูล 
  const deleteDOMs = document.getElementsByClassName('delete');
  for (let i = 0; i < deleteDOMs.length; i++) {
    deleteDOMs[i].addEventListener('click', async (event) => {
      const id = event.target.dataset.id;
      try {
        // ส่งคำขอลบข้อมูลจาก API
        await axios.delete(`${BASE_URL}/documents/${id}`);
        loadData(); // เรียกใช้ฟังก์ชันตัวเองเพื่อโหลดข้อมูลใหม่
      } catch (error) {
        console.log('Error deleting document:', error);
      }
    });
  }
};
