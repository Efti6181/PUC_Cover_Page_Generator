document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const logoUpload = document.getElementById('logoUpload');
    const logoContainer = document.getElementById('logoContainer');
    const departmentName = document.getElementById('departmentName');
    const coverPageType = document.getElementById('coverPageType');
    const deptNamePreview = document.getElementById('deptNamePreview');
    const coverTypePreview = document.getElementById('coverTypePreview');
    const previewSection = document.getElementById('previewSection');
    const generateBtn = document.getElementById('generateBtn');
    const firstTable = document.getElementById('firstTable');
    const secondTable = document.getElementById('secondTable');

    // Text customization elements
    const fontSize = document.getElementById('fontSize');
    const fontFamily = document.getElementById('fontFamily');
    const textColor = document.getElementById('textColor');
    
    // Text formatting buttons
    const boldText = document.getElementById('boldText');
    const italicText = document.getElementById('italicText');
    const underlineText = document.getElementById('underlineText');
    const superscriptText = document.getElementById('superscriptText');
    const subscriptText = document.getElementById('subscriptText');
    
    // Table customization elements
    const rowHeightRange = document.getElementById('rowHeightRange');
    const rowHeightValue = document.getElementById('rowHeightValue');
    const cellPaddingRange = document.getElementById('cellPaddingRange');
    const cellPaddingValue = document.getElementById('cellPaddingValue');
    const tableWidthRange = document.getElementById('tableWidthRange');
    const tableWidthValue = document.getElementById('tableWidthValue');

    // Store the current selection
    let selectedRange = null;
    let formatButtons = [boldText, italicText, underlineText, superscriptText, subscriptText];
    let currentEditableField = null;

    // Convert all regular inputs to editable divs for rich text formatting
    function convertInputsToEditableDivs() {
        // Convert date inputs to editable divs
        document.querySelectorAll('input[type="date"].table-input').forEach(dateInput => {
            const parent = dateInput.parentNode;
            const value = dateInput.value;
            
            // Create editable div
            const editableDiv = document.createElement('div');
            editableDiv.className = 'editable-field';
            editableDiv.contentEditable = true;
            editableDiv.dataset.placeholder = 'Select date...';
            editableDiv.dataset.originalType = 'date';
            
            if (value) {
                editableDiv.textContent = new Date(value).toLocaleDateString();
            }
            
            // Replace input with div
            // parent.replaceChild(editableDiv, dateInput);
            
            // Add date picker functionality
            editableDiv.addEventListener('click', function() {
                const datePicker = document.createElement('input');
                datePicker.type = 'date';
                datePicker.style.position = 'absolute';
                datePicker.style.opacity = '0';
                datePicker.style.height = '1px';
                datePicker.style.width = '1px';
                
                document.body.appendChild(datePicker);
                datePicker.focus();
                datePicker.click();
                
                datePicker.addEventListener('change', function() {
                    const selectedDate = new Date(this.value);
                    editableDiv.textContent = selectedDate.toLocaleDateString();
                    document.body.removeChild(datePicker);
                });
                
                datePicker.addEventListener('blur', function() {
                    document.body.removeChild(datePicker);
                });
            });
        });
        
        // Convert select inputs to editable divs
        document.querySelectorAll('select.table-input').forEach(selectInput => {
            const parent = selectInput.parentNode;
            const options = Array.from(selectInput.options).map(opt => opt.text);
            const selectedValue = selectInput.options[selectInput.selectedIndex]?.text || '';
            
            // Create editable div
            const editableDiv = document.createElement('div');
            editableDiv.className = 'editable-field';
            editableDiv.contentEditable = true;
            editableDiv.dataset.placeholder = 'Select option...';
            editableDiv.dataset.originalType = 'select';
            editableDiv.dataset.options = JSON.stringify(options);
            
            if (selectedValue) {
                editableDiv.textContent = selectedValue;
            }
            
            // Replace select with div
            parent.replaceChild(editableDiv, selectInput);
            
            // Add dropdown functionality
            editableDiv.addEventListener('click', function(e) {
                // Only show dropdown if not already editing text
                if (window.getSelection().toString().length === 0) {
                    showDropdown(this, JSON.parse(this.dataset.options));
                }
            });
        });
    }
    
    // Show dropdown for select-like editable divs
    function showDropdown(element, options) {
        // Remove any existing dropdowns
        const existingDropdown = document.querySelector('.custom-dropdown');
        if (existingDropdown) {
            document.body.removeChild(existingDropdown);
        }
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'custom-dropdown';
        
        // Position dropdown below the element
        const rect = element.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left + window.scrollX}px`;
        dropdown.style.width = `${rect.width}px`;
        dropdown.style.maxHeight = '200px';
        dropdown.style.overflowY = 'auto';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.border = '1px solid #d1d5db';
        dropdown.style.borderRadius = '0.375rem';
        dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        dropdown.style.zIndex = '1000';
        
        // Add options
        options.forEach(option => {
            if (!option) return; // Skip empty options
            
            const optionElement = document.createElement('div');
            optionElement.className = 'dropdown-option';
            optionElement.textContent = option;
            optionElement.style.padding = '0.5rem';
            optionElement.style.cursor = 'pointer';
            
            optionElement.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#f3f4f6';
            });
            
            optionElement.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'white';
            });
            
            optionElement.addEventListener('click', function() {
                element.textContent = option;
                document.body.removeChild(dropdown);
            });
            
            dropdown.appendChild(optionElement);
        });
        
        // Add to body
        document.body.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && e.target !== element) {
                if (document.body.contains(dropdown)) {
                    document.body.removeChild(dropdown);
                }
                document.removeEventListener('click', closeDropdown);
            }
        });
    }

    // Add delete buttons to all table rows
    function addDeleteButtons() {
        const tableRows = document.querySelectorAll('.form-table tr');
        tableRows.forEach(row => {
            // Check if the row already has a delete button
            if (!row.querySelector('.delete-row')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-row';
                deleteBtn.innerHTML = '×';
                deleteBtn.title = 'Delete row';
                deleteBtn.onclick = () => row.remove();
                row.querySelector('td:last-child').appendChild(deleteBtn);
            }
        });
    }

    // Initialize delete buttons
    addDeleteButtons();

    // Make table cells editable
    document.querySelectorAll('.form-table td:first-child').forEach(cell => {
        cell.contentEditable = true;
    });

    // Convert inputs to editable divs for rich text formatting
    convertInputsToEditableDivs();

    // Logo upload handler
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                logoContainer.innerHTML = `<img src="${e.target.result}" alt="University Logo">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Department name handler
    departmentName.addEventListener('input', (e) => {
        deptNamePreview.textContent = e.target.value;
    });

    // Cover page type handler
    coverPageType.addEventListener('input', (e) => {
        coverTypePreview.textContent = e.target.value;
    });

    // Make editable fields work with formatting
    document.querySelectorAll('.editable-field, [contenteditable="true"]').forEach(field => {
        field.addEventListener('focus', function() {
            currentEditableField = this;
            enableControls();
            
            // Save selection when clicking inside editable field
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                selectedRange = selection.getRangeAt(0);
            }
        });
        
        field.addEventListener('blur', function() {
            // Don't disable controls immediately to allow button clicks
            setTimeout(() => {
                if (!document.activeElement.closest('.text-formatting-toolbar') && 
                    !document.activeElement.closest('.customization-grid') &&
                    document.activeElement !== textColor) {
                    currentEditableField = null;
                    disableControls();
                }
            }, 100);
        });
        
        field.addEventListener('keyup', function() {
            // Save selection after typing
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                selectedRange = selection.getRangeAt(0);
                updateFormatButtonStates();
            }
        });
        
        field.addEventListener('mouseup', function() {
            // Save selection after mouse release
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                selectedRange = selection.getRangeAt(0);
                updateFormatButtonStates();
            }
        });
    });

    // Selection handler
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            selectedRange = selection.getRangeAt(0);
            
            // Check if selection is within an editable field
            const editableField = findEditableFieldParent(selection.anchorNode);
            if (editableField) {
                currentEditableField = editableField;
                enableControls();
                updateFormatButtonStates();
            } else if (previewSection.contains(selection.anchorNode)) {
                // Enable the customization controls for other elements in preview
                enableControls();
                updateFormatButtonStates();
            } else {
                // Don't disable immediately to allow button clicks
                setTimeout(() => {
                    if (!document.activeElement.closest('.text-formatting-toolbar') && 
                        !document.activeElement.closest('.customization-grid') &&
                        document.activeElement !== textColor) {
                        disableControls();
                    }
                }, 100);
            }
        }
    });

    // Find if a node is inside an editable field
    function findEditableFieldParent(node) {
        while (node && node !== document) {
            if ((node.classList && node.classList.contains('editable-field')) || 
                (node.getAttribute && node.getAttribute('contenteditable') === 'true')) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    // Helper function to convert RGB to HEX
    function rgbToHex(rgb) {
        const rgbArray = rgb.match(/\d+/g);
        if (!rgbArray) return '#000000';
        return '#' + rgbArray.map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    // Helper function to enable controls
    function enableControls() {
        fontSize.disabled = false;
        fontFamily.disabled = false;
        textColor.disabled = false;
        formatButtons.forEach(btn => btn.disabled = false);
        
        // Update controls to match current selection if possible
        if (selectedRange) {
            const parentElement = selectedRange.commonAncestorContainer.parentElement || selectedRange.commonAncestorContainer;
            const computedStyle = window.getComputedStyle(parentElement);
            
            fontSize.value = findClosestFontSize(computedStyle.fontSize);
            fontFamily.value = findClosestFontFamily(computedStyle.fontFamily);
            textColor.value = rgbToHex(computedStyle.color);
        }
    }

    // Find closest font size in select options
    function findClosestFontSize(size) {
        const sizeInPx = parseInt(size);
        const options = Array.from(fontSize.options).map(opt => parseInt(opt.value));
        const closest = options.reduce((prev, curr) => 
            Math.abs(curr - sizeInPx) < Math.abs(prev - sizeInPx) ? curr : prev
        );
        return `${closest}px`;
    }

    // Find closest font family in select options
    function findClosestFontFamily(family) {
        const fontName = family.split(',')[0].replace(/['"]/g, '').trim();
        const options = Array.from(fontFamily.options).map(opt => opt.value);
        
        // Try to find exact match
        const exactMatch = options.find(opt => opt.toLowerCase() === fontName.toLowerCase());
        if (exactMatch) return exactMatch;
        
        // Default to first option if no match
        return options[0];
    }

    // Helper function to disable controls
    function disableControls() {
        fontSize.disabled = true;
        fontFamily.disabled = true;
        textColor.disabled = true;
        formatButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('active');
        });
    }

    // Apply style to selected text
    function applyStylesToSelection() {
        if (!selectedRange) return;

        // Focus the editable field to ensure commands work
        if (currentEditableField) {
            currentEditableField.focus();
            
            // Restore the selection
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(selectedRange);
            
            // Apply styles
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('fontSize', false, getFontSizeValue());
            document.execCommand('fontName', false, fontFamily.value);
            document.execCommand('foreColor', false, textColor.value);
            
            // Save the new selection
            if (selection.rangeCount > 0) {
                selectedRange = selection.getRangeAt(0);
            }
        }
    }
    
    // Get font size value for execCommand (1-7 scale)
    function getFontSizeValue() {
        const size = parseInt(fontSize.value);
        // Map pixel sizes to 1-7 scale approximately
        if (size <= 10) return 1;
        if (size <= 13) return 2;
        if (size <= 16) return 3;
        if (size <= 18) return 4;
        if (size <= 24) return 5;
        if (size <= 32) return 6;
        return 7;
    }

    // Apply formatting to selected text
    function applyFormatting(format) {
        if (!selectedRange) return;
        
        // If we have an editable field, focus it
        if (currentEditableField) {
            currentEditableField.focus();
            
            // Restore the selection
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(selectedRange);
        }
        
        // Apply the formatting command
        document.execCommand('styleWithCSS', false, true);
        
        switch(format) {
            case 'bold':
                document.execCommand('bold', false, null);
                break;
            case 'italic':
                document.execCommand('italic', false, null);
                break;
            case 'underline':
                document.execCommand('underline', false, null);
                break;
            case 'superscript':
                document.execCommand('superscript', false, null);
                break;
            case 'subscript':
                document.execCommand('subscript', false, null);
                break;
        }
        
        // Save the new selection
        const newSelection = window.getSelection();
        if (newSelection.rangeCount > 0) {
            selectedRange = newSelection.getRangeAt(0);
        }
        
        // Update button states
        updateFormatButtonStates();
    }
    
    // Update format button states based on current selection
    function updateFormatButtonStates() {
        boldText.classList.toggle('active', document.queryCommandState('bold'));
        italicText.classList.toggle('active', document.queryCommandState('italic'));
        underlineText.classList.toggle('active', document.queryCommandState('underline'));
        superscriptText.classList.toggle('active', document.queryCommandState('superscript'));
        subscriptText.classList.toggle('active', document.queryCommandState('subscript'));
    }

    // Text customization handlers
    fontSize.addEventListener('change', applyStylesToSelection);
    fontFamily.addEventListener('change', applyStylesToSelection);
    textColor.addEventListener('input', applyStylesToSelection);
    
    // Text formatting handlers
    boldText.addEventListener('click', () => applyFormatting('bold'));
    italicText.addEventListener('click', () => applyFormatting('italic'));
    underlineText.addEventListener('click', () => applyFormatting('underline'));
    superscriptText.addEventListener('click', () => applyFormatting('superscript'));
    subscriptText.addEventListener('click', () => applyFormatting('subscript'));

    // Table customization handlers
    function updateTableStyles() {
        const rowHeight = rowHeightRange.value + 'px';
        const cellPadding = cellPaddingRange.value + 'px';
        const tableWidth = tableWidthRange.value + '%';
        
        // Update display values
        rowHeightValue.textContent = rowHeight;
        cellPaddingValue.textContent = cellPadding;
        tableWidthValue.textContent = tableWidth;
        
        // Apply to tables
        document.querySelectorAll('.form-table').forEach(table => {
            table.style.width = tableWidth;
            
            table.querySelectorAll('tr').forEach(row => {
                row.style.height = rowHeight;
            });
            
            table.querySelectorAll('td').forEach(cell => {
                cell.style.padding = cellPadding;
            });
        });
    }
    
    // Initialize table styles
    updateTableStyles();
    
    // Add event listeners for table customization
    rowHeightRange.addEventListener('input', updateTableStyles);
    cellPaddingRange.addEventListener('input', updateTableStyles);
    tableWidthRange.addEventListener('input', updateTableStyles);

    // Initially disable controls
    disableControls();

    // Generate and print handler
    generateBtn.addEventListener('click', () => {
        // Prepare for printing
        prepareForPrint();
        window.print();
        // Restore after printing
        setTimeout(restoreAfterPrint, 1000);
    });

    // Prepare document for printing
    function prepareForPrint() {
        // Hide all UI elements that shouldn't be printed
        document.querySelectorAll('.custom-dropdown, .dropdown-option').forEach(el => {
            el.style.display = 'none';
        });
        
        // Remove all contenteditable attributes for printing
        document.querySelectorAll('[contenteditable]').forEach(element => {
            element.setAttribute('data-was-editable', 'true');
            element.removeAttribute('contenteditable');
        });
        
        // Remove all form control indicators
        document.querySelectorAll('.editable-field').forEach(field => {
            field.classList.add('print-mode');
        });
        
        // Remove all borders from editable fields
        document.querySelectorAll('.editable-field, .table-input').forEach(field => {
            field.dataset.originalBorder = field.style.border || '';
            field.style.border = 'none';
        });
        
        // Add print-specific styles
        const style = document.createElement('style');
        style.id = 'print-style-overrides';
        style.textContent = `
            @page { 
                size: A4 portrait; 
                margin: 25.4mm; /* 1 inch margin */
            }
            @media print {
                html, body, .preview-section {
                    background-color: white !important;
                }
                body::before, body::after, 
                .preview-section::before, .preview-section::after,
                header, footer {
                    display: none !important;
                    content: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Restore form controls after printing
    function restoreAfterPrint() {
        // Restore contenteditable attributes
        document.querySelectorAll('[data-was-editable]').forEach(element => {
            element.setAttribute('contenteditable', 'true');
            element.removeAttribute('data-was-editable');
        });
        
        // Restore editable fields
        document.querySelectorAll('.editable-field').forEach(field => {
            field.classList.remove('print-mode');
        });
        
        // Restore borders
        document.querySelectorAll('.editable-field, .table-input').forEach(field => {
            if (field.dataset.originalBorder) {
                field.style.border = field.dataset.originalBorder;
                delete field.dataset.originalBorder;
            }
        });
        
        // Remove print style overrides
        const printStyle = document.getElementById('print-style-overrides');
        if (printStyle) {
            printStyle.remove();
        }
    }
    
    // Also listen for the browser's afterprint event
    window.addEventListener('afterprint', restoreAfterPrint);

    // Table resizing functionality
    const tableContainers = document.querySelectorAll('.table-container');
    
    tableContainers.forEach(container => {
        const resizer = container.querySelector('.table-resizer');
        const table = container.querySelector('table');
        
        let startX, startWidth;
        
        function initResize(e) {
            startX = e.clientX;
            startWidth = parseInt(document.defaultView.getComputedStyle(table).width, 10);
            document.documentElement.classList.add('resizing');
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            
            e.preventDefault();
        }
        
        function resize(e) {
            const width = startWidth + e.clientX - startX;
            if (width > 300) { // Minimum width
                table.style.width = width + 'px';
            }
        }
        
        function stopResize() {
            document.documentElement.classList.remove('resizing');
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }
        
        resizer.addEventListener('mousedown', initResize);
    });
});