const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; // default mode
let selectedId = '';

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  console.log('id', id);
  
  if (id) {
    mode = 'EDIT';
    selectedId = id;
    
    try {
      const response = await axios.get(`${BASE_URL}/documents/${id}`);
      const documentData = response.data; // เปลี่ยนชื่อจาก `document` เป็น `documentData`

      let firstNameDOM = document.querySelector('input[name=firstname]');
      let lastNameDOM = document.querySelector('input[name=lastname]');
      let ageDOM = document.querySelector('input[name=age]');
      let descriptionDOM = document.querySelector('textarea[name=description]');
      
      firstNameDOM.value = documentData.firstName;
      lastNameDOM.value = documentData.lastName;
      ageDOM.value = documentData.age;
      descriptionDOM.value = documentData.description;

      let genderDOM = document.querySelectorAll('input[name=gender]');
      let interestDOMs = document.querySelectorAll('input[name=interest]');
      
      for (let i = 0; i < genderDOM.length; i++) {
        if (genderDOM[i].value === documentData.gender) {
          genderDOM[i].checked = true;
        }
      }

      for (let i = 0; i < interestDOMs.length; i++) {
        if (documentData.interests.includes(interestDOMs[i].value)) {
          interestDOMs[i].checked = true;
        }
      }

    } catch (error) {
      console.log('error', error);
    }
  }
};

const validateData = (documentData) => {
  let errors = [];
  if (!documentData.firstName) {
    errors.push('กรุณากรอกชื่อ');
  }
  if (!documentData.lastName) {
    errors.push('กรุณากรอกนามสกุล');
  }
  if (!documentData.age) {
    errors.push('กรุณากรอกอายุ');
  }
  if (!documentData.gender) {
    errors.push('กรุณาเลือกเพศ');
  }
  if (documentData.document.length === 0) {
    errors.push('กรุณาเลือกความสนใจ');
  }
  if (!documentData.note) {
    errors.push('กรุณากรอกคำอธิบาย');
  }
  return errors;
};

const submitData = async () => {
  let firstNameDOM = document.querySelector('input[name=firstname]');
  let lastNameDOM = document.querySelector('input[name=lastname]');
  let ageDOM = document.querySelector('input[name=age]');
  let genderDOM = document.querySelector('input[name=gender]:checked');
  let interestDOMs = document.querySelectorAll('input[name=document]:checked');
  let descriptionDOM = document.querySelector('textarea[name=note]');
  let messageDOM = document.getElementById('message');

  try {
      // ดึงข้อมูลจากฟอร์ม
      let gender = genderDOM ? genderDOM.value : '';  // เช็คว่าเลือก gender หรือไม่
      let interests = interestDOMs ? Array.from(interestDOMs).map(i => i.value) : []; // แก้ไขเป็น Array

      let documentData = {
          firstName: firstNameDOM.value,
          lastName: lastNameDOM.value,
          age: ageDOM.value,
          gender: gender,  // ส่งค่า gender ที่เลือก
          description: descriptionDOM.value,
          interests: interests // ส่งค่าความสนใจที่เลือก
      };

      console.log('submitData', documentData);

      // การตรวจสอบความถูกต้อง
      const errors = validateData(documentData);
      if (errors.length > 0) {
          throw { message: 'กรุณากรอกข้อมูลให้ครบถ้วน', errors: errors };
      }

      let message = 'บันทึกข้อมูลเรียบร้อยแล้ว';
      if (mode === 'CREATE') {
          const response = await axios.post(`${BASE_URL}/documents`, documentData);
          console.log('response', response.data);
      } else {
          const response = await axios.put(`${BASE_URL}/documents/${selectedId}`, documentData);
          message = 'แก้ไขข้อมูลเรียบร้อยแล้ว';
          console.log('response', response.data);
      }

      setTimeout(() => {
          window.location.href = 'documents.html';
      }, 1000);
      messageDOM.innerText = message;
      messageDOM.className = 'message success';

  } catch (error) {
      console.log('error message', error.message);
      console.log('error', error.errors);

      let htmlData = '<div>';
      htmlData += `<div> ${error.message} </div>`;
      htmlData += '<ul>';
      for (let i = 0; i < error.errors.length; i++) {
          htmlData += `<li> ${error.errors[i]} </li>`;
      }
      htmlData += '</ul>';
      htmlData += '</div>';

      messageDOM.innerHTML = htmlData;
      messageDOM.className = 'message danger';
  }
};
