document.addEventListener('DOMContentLoaded', function() {
    // Initialize date picker with today's date
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    document.getElementById('submissionDate').value = formattedDate;
    updateSubmissionDatePreview(formatDate(today));
    
    // Set up event listeners for form inputs
    setupEventListeners();
    
    // Initialize styling controls
    initStylingControls();
    
    // Make table cells resizable
    makeTableResizable();
});

function setupEventListeners() {
    // Logo upload
    document.getElementById('logoUpload').addEventListener('change', handleLogoUpload);
    
    // Background image upload
    document.getElementById('backgroundUpload').addEventListener('change', handleBackgroundUpload);
    
    // Gradient opacity slider
    document.getElementById('gradientOpacity').addEventListener('input', handleGradientOpacity);
    
    // Text inputs
    document.getElementById('universityName').addEventListener('input', function() {
        document.getElementById('universityNamePreview').textContent = this.value;
    });
    
    document.getElementById('departmentName').addEventListener('input', function() {
        document.getElementById('departmentNamePreview').textContent = this.value;
    });
    
    document.getElementById('assignmentTitle').addEventListener('input', function() {
        document.getElementById('assignmentTitlePreview').textContent = this.value;
    });
    
    document.getElementById('studentName').addEventListener('input', function() {
        document.getElementById('studentNamePreview').textContent = this.value;
    });
    
    document.getElementById('studentId').addEventListener('input', function() {
        document.getElementById('studentIdPreview').textContent = this.value;
    });
    document.getElementById('studentSection').addEventListener('input', function() {
        document.getElementById('studentSectionPreview').textContent = this.value;
    });
    document.getElementById('studentSemester').addEventListener('input', function() {
        document.getElementById('studentSemesterPreview').textContent = this.value;
    });
    
    document.getElementById('courseTitle').addEventListener('input', function() {
        document.getElementById('courseTitlePreview').textContent = this.value;
    });
    
    document.getElementById('instructorName').addEventListener('input', function() {
        document.getElementById('instructorNamePreview').textContent = this.value;
    });
    
    document.getElementById('submissionDate').addEventListener('change', function() {
        const date = new Date(this.value);
        updateSubmissionDatePreview(formatDate(date));
    });
    
    // Buttons
    document.getElementById('generateBtn').addEventListener('click', generateAndPrint);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('printBtn').addEventListener('click', printCoverPage);
    document.getElementById('toggleEditorBtn').addEventListener('click', toggleEditor);
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoPreview = document.getElementById('logoPreview');
            logoPreview.src = e.target.result;
            logoPreview.style.display = 'block';
            
            const universityLogoPreview = document.getElementById('universityLogoPreview');
            universityLogoPreview.src = e.target.result;
            universityLogoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const backgroundPreview = document.getElementById('backgroundPreview');
            backgroundPreview.src = e.target.result;
            backgroundPreview.style.display = 'block';
            
            const backgroundImagePreview = document.getElementById('backgroundImagePreview');
            backgroundImagePreview.src = e.target.result;
            backgroundImagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function handleGradientOpacity(event) {
    const opacity = event.target.value;
    const percentage = Math.round(opacity * 100);
    document.getElementById('opacityValue').textContent = percentage + '%';
    
    const gradientOverlay = document.getElementById('gradientOverlay');
    gradientOverlay.style.background = `linear-gradient(to bottom, rgba(255, 255, 255, ${opacity}) 0%, rgba(255, 255, 255, ${opacity - 0.1}) 100%)`;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function updateSubmissionDatePreview(formattedDate) {
    document.getElementById('submissionDatePreview').textContent = formattedDate;
}

function generateAndPrint() {
    // Validate form
    const requiredFields = [
        'universityName', 
        'departmentName', 
        'assignmentTitle', 
        'studentName', 
        'studentId', 
        'courseTitle', 
        'instructorName'
    ];
    
    let isValid = true;
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Print the cover page
    printCoverPage();
}

function printCoverPage() {
    // Hide editor panel for printing
    document.body.classList.add('editor-hidden');
    
    // Use browser print functionality
    window.print();
    
    // Show editor panel again after print dialog closes
    setTimeout(() => {
        document.body.classList.remove('editor-hidden');
    }, 1000);
}

function resetForm() {
    if (confirm('Are you sure you want to reset all fields?')) {
        // Reset text inputs
        document.getElementById('universityName').value = 'University Name';
        document.getElementById('departmentName').value = 'Department Name';
        document.getElementById('assignmentTitle').value = 'Assignment Title';
        document.getElementById('studentName').value = 'Your Name';
        document.getElementById('studentId').value = 'Your ID';
        document.getElementById('courseTitle').value = 'Course Name';
        document.getElementById('instructorName').value = 'Instructor Name';
        
        // Reset date to today
        const today = new Date();
        const formattedDate = today.toISOString().substr(0, 10);
        document.getElementById('submissionDate').value = formattedDate;
        
        // Reset logo
        document.getElementById('logoUpload').value = '';
        document.getElementById('logoPreview').style.display = 'none';
        document.getElementById('universityLogoPreview').src = '';
        
        // Reset background
        document.getElementById('backgroundUpload').value = '';
        document.getElementById('backgroundPreview').style.display = 'none';
        document.getElementById('backgroundImagePreview').src = '';
        
        // Reset gradient opacity
        document.getElementById('gradientOpacity').value = 0.7;
        document.getElementById('opacityValue').textContent = '70%';
        document.getElementById('gradientOverlay').style.background = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.6) 100%)';
        
        // Reset preview
        document.getElementById('universityNamePreview').textContent = 'University Name';
        document.getElementById('departmentNamePreview').textContent = 'Department Name';
        document.getElementById('assignmentTitlePreview').textContent = 'Assignment Title';
        document.getElementById('studentNamePreview').textContent = 'Your Name';
        document.getElementById('studentIdPreview').textContent = 'Your ID';
        document.getElementById('courseTitlePreview').textContent = 'Course Name';
        document.getElementById('instructorNamePreview').textContent = 'Instructor Name';
        updateSubmissionDatePreview(formatDate(today));
        
        // Reset styling
        resetStyling();
    }
}

function toggleEditor() {
    document.body.classList.toggle('editor-hidden');
}

function initStylingControls() {
    // Font family
    document.getElementById('fontFamily').addEventListener('change', applyTextStyling);
    
    // Font size
    document.getElementById('fontSize').addEventListener('change', applyTextStyling);
    
    // Text color
    document.getElementById('textColor').addEventListener('input', applyTextStyling);
    
    // Bold button
    document.getElementById('boldBtn').addEventListener('click', function() {
        this.classList.toggle('active');
        applyTextStyling();
    });
    
    // Underline button
    document.getElementById('underlineBtn').addEventListener('click', function() {
        this.classList.toggle('active');
        applyTextStyling();
    });
    
    // Element selector
    document.getElementById('elementSelector').addEventListener('change', highlightSelectedElement);
    
    // Initial highlight
    highlightSelectedElement();
    
    // Set initial gradient opacity display
    document.getElementById('opacityValue').textContent = '70%';
}

function applyTextStyling() {
    const elementId = document.getElementById('elementSelector').value;
    const element = document.getElementById(elementId);
    
    if (!element) return;
    
    // Apply font family
    const fontFamily = document.getElementById('fontFamily').value;
    element.style.fontFamily = fontFamily;
    
    // Apply font size
    const fontSize = document.getElementById('fontSize').value;
    let fontSizeValue;
    
    switch (fontSize) {
        case 'small':
            fontSizeValue = elementId === 'assignmentTitlePreview' ? '24px' : '16px';
            break;
        case 'medium':
            fontSizeValue = elementId === 'assignmentTitlePreview' ? '28px' : '18px';
            break;
        case 'large':
            fontSizeValue = elementId === 'assignmentTitlePreview' ? '32px' : '20px';
            break;
        default:
            fontSizeValue = '18px';
    }
    
    element.style.fontSize = fontSizeValue;
    
    // Apply text color
    const textColor = document.getElementById('textColor').value;
    element.style.color = textColor;
    
    // Apply bold
    const isBold = document.getElementById('boldBtn').classList.contains('active');
    element.style.fontWeight = isBold ? 'bold' : 'normal';
    
    // Apply underline
    const isUnderlined = document.getElementById('underlineBtn').classList.contains('active');
    element.style.textDecoration = isUnderlined ? 'underline' : 'none';
}

function highlightSelectedElement() {
    // Remove highlight from all elements
    const elements = [
        'universityNamePreview',
        'departmentNamePreview',
        'assignmentTitlePreview',
        'studentInfoPreview'
    ];
    
    elements.forEach(id => {
        document.getElementById(id).classList.remove('editable-highlight');
    });
    
    // Add highlight to selected element
    const selectedElement = document.getElementById('elementSelector').value;
    document.getElementById(selectedElement).classList.add('editable-highlight');
    
    // Update styling controls to match selected element
    updateStylingControls(selectedElement);
}

function updateStylingControls(elementId) {
    const element = document.getElementById(elementId);
    
    // Get computed styles
    const computedStyle = window.getComputedStyle(element);
    
    // Update font family selector
    const fontFamily = computedStyle.fontFamily;
    const fontFamilySelect = document.getElementById('fontFamily');
    for (let i = 0; i < fontFamilySelect.options.length; i++) {
        if (fontFamily.includes(fontFamilySelect.options[i].text)) {
            fontFamilySelect.selectedIndex = i;
            break;
        }
    }
    
    // Update font size selector
    const fontSize = parseInt(computedStyle.fontSize);
    const fontSizeSelect = document.getElementById('fontSize');
    if (fontSize <= 16) {
        fontSizeSelect.value = 'small';
    } else if (fontSize <= 20) {
        fontSizeSelect.value = 'medium';
    } else {
        fontSizeSelect.value = 'large';
    }
    
    // Update color picker
    const textColor = rgbToHex(computedStyle.color);
    document.getElementById('textColor').value = textColor;
    
    // Update bold button
    const isBold = computedStyle.fontWeight >= 700;
    const boldBtn = document.getElementById('boldBtn');
    if (isBold) {
        boldBtn.classList.add('active');
    } else {
        boldBtn.classList.remove('active');
    }
    
    // Update underline button
    const isUnderlined = computedStyle.textDecoration.includes('underline');
    const underlineBtn = document.getElementById('underlineBtn');
    if (isUnderlined) {
        underlineBtn.classList.add('active');
    } else {
        underlineBtn.classList.remove('active');
    }
}

function rgbToHex(rgb) {
    // Convert RGB to HEX
    if (!rgb || rgb === 'none') return '#000000';
    
    if (rgb.startsWith('#')) return rgb;
    
    const rgbArray = rgb.match(/\d+/g);
    if (!rgbArray || rgbArray.length < 3) return '#000000';
    
    const r = parseInt(rgbArray[0]);
    const g = parseInt(rgbArray[1]);
    const b = parseInt(rgbArray[2]);
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function resetStyling() {
    // Reset university name
    const universityName = document.getElementById('universityNamePreview');
    universityName.style.fontFamily = '';
    universityName.style.fontSize = '';
    universityName.style.color = '#16a085';
    universityName.style.fontWeight = '';
    universityName.style.textDecoration = '';
    
    // Reset department name
    const departmentName = document.getElementById('departmentNamePreview');
    departmentName.style.fontFamily = '';
    departmentName.style.fontSize = '';
    departmentName.style.color = '#555';
    departmentName.style.fontWeight = '';
    departmentName.style.textDecoration = '';
    
    // Reset assignment title
    const assignmentTitle = document.getElementById('assignmentTitlePreview');
    assignmentTitle.style.fontFamily = '';
    assignmentTitle.style.fontSize = '';
    assignmentTitle.style.color = '';
    assignmentTitle.style.fontWeight = '';
    assignmentTitle.style.textDecoration = '';
    
    // Reset student info
    const studentInfo = document.getElementById('studentInfoPreview');
    studentInfo.style.fontFamily = '';
    studentInfo.style.fontSize = '';
    studentInfo.style.color = '';
    studentInfo.style.fontWeight = '';
    studentInfo.style.textDecoration = '';
    
    // Reset styling controls
    document.getElementById('fontFamily').selectedIndex = 0;
    document.getElementById('fontSize').value = 'medium';
    document.getElementById('textColor').value = '#000000';
    document.getElementById('boldBtn').classList.remove('active');
    document.getElementById('underlineBtn').classList.remove('active');
}

function makeTableResizable() {
    const table = document.getElementById('infoTable');
    const rows = table.rows;
    
    for (let i = 0; i < rows.length; i++) {
        const firstCell = rows[i].cells[0];
        
        // Make the cell resizable
        firstCell.style.position = 'relative';
        firstCell.style.resize = 'horizontal';
        firstCell.style.overflow = 'auto';
        firstCell.style.minWidth = '120px';
        firstCell.style.maxWidth = '200px';
    }
}