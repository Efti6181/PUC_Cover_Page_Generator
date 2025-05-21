document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const logoUpload = document.getElementById('logo-upload');
    const universityNameInput = document.getElementById('university-name');
    const departmentNameInput = document.getElementById('department-name');
    const indexTypeInput = document.getElementById('index-type');
    const courseCodeInput = document.getElementById('course-code');
    const courseTitleInput = document.getElementById('course-title');
    const studentNameInput = document.getElementById('student-name');
    const studentIdInput = document.getElementById('student-id');
    const semesterInput = document.getElementById('semester');
    const sectionInput = document.getElementById('section');
    const fontFamilySelect = document.getElementById('font-family');
    const fontSizeSelect = document.getElementById('font-size');
    const textColorInput = document.getElementById('text-color');
    const boldBtn = document.getElementById('bold-btn');
    const underlineBtn = document.getElementById('underline-btn');
    const addExperimentBtn = document.getElementById('add-experiment');
    const generateBtn = document.getElementById('generate-btn');
    
    // Preview elements
    const universityLogo = document.getElementById('university-logo');
    const previewUniversityName = document.getElementById('preview-university-name');
    const previewDepartmentName = document.getElementById('preview-department-name');
    const previewIndexType = document.getElementById('preview-index-type');
    const previewCourseCode = document.getElementById('preview-course-code');
    const previewCourseTitle = document.getElementById('preview-course-title');
    const previewStudentName = document.getElementById('preview-student-name');
    const previewStudentId = document.getElementById('preview-student-id');
    const previewSemester = document.getElementById('preview-semester');
    const previewSection = document.getElementById('preview-section');
    const experimentsTbody = document.getElementById('experiments-tbody');
    const previewContent = document.getElementById('preview-content');
    
    // Initialize with default experiments
    const defaultExperiments = [
      { no: '1', name: ' ' },
      { no: '2', name: '' },
      { no: '3', name: ' ' },
      { no: '4', name: ' ' },
      { no: '5', name: ' ' },
      { no: '6', name: '' },
      { no: '7', name: '' },
      { no: '8', name: ' ' }
    ];
    
    // Add default experiments to the editor
    const experimentsContainer = document.getElementById('experiments-container');
    experimentsContainer.innerHTML = ''; // Clear default
    
    defaultExperiments.forEach(exp => {
      addExperimentRow(exp.no, exp.name);
    });
    
    // Update experiments table
    updateExperimentsTable();
    
    // Event listeners for input changes
    logoUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          universityLogo.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    universityNameInput.addEventListener('input', function() {
      previewUniversityName.textContent = this.value;
    });
    
    departmentNameInput.addEventListener('input', function() {
      previewDepartmentName.textContent = this.value;
    });
    
    indexTypeInput.addEventListener('input', function() {
      previewIndexType.textContent = this.value;
    });
    
    courseCodeInput.addEventListener('input', function() {
      previewCourseCode.textContent = this.value;
    });
    
    courseTitleInput.addEventListener('input', function() {
      previewCourseTitle.textContent = this.value;
    });
    
    studentNameInput.addEventListener('input', function() {
      previewStudentName.textContent = this.value;
    });
    
    studentIdInput.addEventListener('input', function() {
      previewStudentId.textContent = this.value;
    });
    
    semesterInput.addEventListener('input', function() {
      // Handle superscript for ordinals
      let semesterText = this.value;
      if (semesterText.endsWith('st') || semesterText.endsWith('nd') || semesterText.endsWith('rd') || semesterText.endsWith('th')) {
        const num = semesterText.slice(0, -2);
        const suffix = semesterText.slice(-2);
        previewSemester.innerHTML = num + '<sup>' + suffix + '</sup>';
      } else {
        previewSemester.textContent = semesterText;
      }
    });
    
    sectionInput.addEventListener('input', function() {
      previewSection.textContent = this.value;
    });
    
    // Text styling
    fontFamilySelect.addEventListener('change', function() {
      previewContent.style.fontFamily = this.value;
    });
    
    fontSizeSelect.addEventListener('change', function() {
      previewContent.style.fontSize = this.value;
    });
    
    textColorInput.addEventListener('input', function() {
      previewContent.style.color = this.value;
    });
    
    let isBold = false;
    boldBtn.addEventListener('click', function() {
      isBold = !isBold;
      this.classList.toggle('active');
      previewContent.style.fontWeight = isBold ? 'bold' : 'normal';
    });
    
    let isUnderlined = false;
    underlineBtn.addEventListener('click', function() {
      isUnderlined = !isUnderlined;
      this.classList.toggle('active');
      previewContent.style.textDecoration = isUnderlined ? 'underline' : 'none';
    });
    
    // Add experiment row
    addExperimentBtn.addEventListener('click', function() {
      const rows = document.querySelectorAll('.experiment-row');
      const nextNo = rows.length + 1;
      addExperimentRow(nextNo, '');
      updateExperimentsTable();
    });
    
    // Remove experiment row
    experimentsContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-row')) {
        e.target.closest('.experiment-row').remove();
        // Renumber experiments
        const rows = document.querySelectorAll('.experiment-row');
        rows.forEach((row, index) => {
          row.querySelector('.experiment-no').value = index + 1;
        });
        updateExperimentsTable();
      }
    });
    
    // Update experiments when input changes
    experimentsContainer.addEventListener('input', function(e) {
      if (e.target.classList.contains('experiment-no') || e.target.classList.contains('experiment-name')) {
        updateExperimentsTable();
      }
    });
    
    // Generate and print
    generateBtn.addEventListener('click', function() {
      window.print();
    });
    
    // Function to add experiment row to editor
    function addExperimentRow(no, name) {
      const row = document.createElement('div');
      row.className = 'experiment-row';
      row.innerHTML = `
        <input type="text" class="experiment-no" placeholder="No." value="${no}" />
        <input type="text" class="experiment-name" placeholder="Name of Experiment" value="${name}" />
        <button class="remove-row">✕</button>
      `;
      experimentsContainer.appendChild(row);
    }
    
    // Function to update experiments table in preview
    function updateExperimentsTable() {
      experimentsTbody.innerHTML = '';
      const rows = document.querySelectorAll('.experiment-row');
      
      rows.forEach(row => {
        const no = row.querySelector('.experiment-no').value;
        const name = row.querySelector('.experiment-name').value;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${no}</td>
          <td contenteditable="true">${name}</td>
        `;
        
        // Add event listener to update the input field when the table cell is edited
        const nameCell = tr.querySelector('td[contenteditable="true"]');
        nameCell.addEventListener('input', function() {
          const rowIndex = Array.from(tr.parentNode.children).indexOf(tr);
          const experimentRows = document.querySelectorAll('.experiment-row');
          if (experimentRows[rowIndex]) {
            experimentRows[rowIndex].querySelector('.experiment-name').value = this.textContent;
          }
        });
        
        experimentsTbody.appendChild(tr);
      });
    }
    
    // Make tables resizable
    function makeTableResizable(table) {
      const cols = table.querySelectorAll('th, td');
      
      [].forEach.call(cols, function(col) {
        // Add a resizer element to the column
        const resizer = document.createElement('div');
        resizer.classList.add('resize-handle');
        
        // Set the height
        resizer.style.height = `${table.offsetHeight}px`;
        
        // Add a resizer element to the column
        col.appendChild(resizer);
        
        // Will be implemented in a future version
        createResizableColumn(col, resizer);
      });
    }
    
    function createResizableColumn(col, resizer) {
      let x = 0;
      let w = 0;
      
      const mouseDownHandler = function(e) {
        x = e.clientX;
        
        // Get the current width
        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        
        resizer.classList.add('resizing');
      };
      
      const mouseMoveHandler = function(e) {
        // Calculate the width change
        const dx = e.clientX - x;
        
        // Update the width
        col.style.width = `${w + dx}px`;
      };
      
      const mouseUpHandler = function() {
        resizer.classList.remove('resizing');
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
      
      resizer.addEventListener('mousedown', mouseDownHandler);
    }
    
    // Initialize resizable tables
    // Note: This is a placeholder for future implementation
    // makeTableResizable(document.getElementById('student-table'));
    // makeTableResizable(document.getElementById('experiments-table'));
  });