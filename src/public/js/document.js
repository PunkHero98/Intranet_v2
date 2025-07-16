
const http_request = window.location.origin; // Use the current origin for requests
let currentContextFolderId = null;
let currentContextFolderName = null;
let currentContextDocumentId = null;
let currentContextDocumentName = null;
let currentFileVersion = null;
let documentData = [];
let allowedFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx' , '.ppt', '.pptx'];
let isLoading = false; // Flag to prevent multiple loads
 
// ======================================================================
// | I. Folder and File UI Handlers                                     |
// ======================================================================
 
// ==== 1. Fetch document data from backend and render tree ====
async function fetchDocumentData() {
  try {
    const response = await fetch(`http://${http_request}/document/site`);
    const data = await response.json();
    if(data.success) {
      documentData = data.data;
      renderTree(documentData);
    } else {
      console.error("Failed to fetch document data:", data.message);
    }
  } catch (error) {
    console.error("Error fetching document data:", error);
  }
};
 
// ==== 2. Show context menu for folder ====
function showContextMenu(x, y, folderId, folderName) {
  const menu = document.getElementById('contextMenu');
  menu.style.top = `${y}px`;
  menu.style.left = `${x}px`;
  menu.style.display = 'block';
 
  currentContextFolderId = folderId;
  currentContextFolderName = folderName;
}
 
// ==== 3. Show context menu for document ====
function showContextMenuDocument(x, y, folderId, folderName) {
  const menu = document.getElementById('contextMenuDocument');
  menu.style.top = `${y}px`;
  menu.style.left = `${x}px`;
  menu.style.display = 'block';
 
  currentContextFolderId = folderId;
  currentContextFolderName = folderName;
}
 
// ==== 4. Render loading animation ====
function renderLoading(){
  return `
  <div id="loading" class="loading-document position-absolute top-50 start-50 translate-middle text-center">
    <h5 class="text-primary loading-wave">
      <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span><span>.</span><span>.</span><span>.</span>
    </h5>
    <p class="text-muted">Please wait while we load the documents.</p>
  </div>
  `;
}
 
// ==== 5. Show notification alert ====
function showNotification(title, message, removeClass, addClass) {
  const alert = $(".alert-intranet");
  alert.css({ display: "block", opacity: "1" });
  alert.find("strong").html(title);
  alert.find("span").html(message);
  alert.removeClass(removeClass).addClass(addClass);
 
  // Auto-hide notification after 3 seconds
  setTimeout(() => {
    alert.css("opacity", "0");
    setTimeout(() => {
      alert.css("display", "none");
    }, 500);    // Wait for transition to complete
  }, 3000);
}
 
// ==== 6. Render folder/document tree structure ====
function renderTree(documentDatas) {
  const container = document.querySelector('.document-intranet div.smallDocArea ul.tree');
  container.innerHTML = '';       // Clear previous render
 
  documentDatas.forEach(folder => {
    container.appendChild(renderFolder(folder));
  });
}
 
// ==== 7. Render a single folder and its contents ====
function renderFolder(folder) {
  const li = document.createElement('li');
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.setAttribute('data-folder-id', folder.id);
  summary.className = 'folderItem d-flex align-items-center justify-content-between p-2';

  const documentCount = folder.documents.length;
  const subfolderCount = folder.children.length;

  let metaInfo = [];
  if (subfolderCount > 0) metaInfo.push(`${subfolderCount} folders`);
  if (documentCount > 0) metaInfo.push(`${documentCount} files`);

  summary.innerHTML = `
  <div class="d-flex align-items-center gap-2">
    <i class="bi bi-folder-fill text-warning"></i>
    <span class="fw-semibold">${folder.name}</span>
  </div>
  <div class="text-muted d-flex align-items-center gap-3 small">
    ${subfolderCount > 0 ? `<span><i class="bi bi-folder2-open me-1"></i>${subfolderCount}</span>` : ''}
    ${documentCount > 0 ? `<span><i class="bi bi-file-earmark-text me-1"></i>${documentCount}</span>` : ''}
  </div>
`;


  details.appendChild(summary);

  const ul = document.createElement('ul');

  // Documents trực tiếp
  folder.documents.forEach(doc => {
    const docLi = document.createElement('li');
    docLi.className = 'documentItem d-flex align-items-center justify-content-between';
    docLi.setAttribute('data-document-id', doc.id);
    docLi.innerHTML = `
      <div>
        <i class="${getFileIconClass(doc.fileName)}"></i>
        ${doc.title}
      </div>
      <i class="bi bi-info-circle documentInfo position-relative" data-version="${doc.version}">
        <div class="custom-tooltip">
          <strong>Document version:</strong> ${doc.version}<br>
          <strong>Uploaded by:</strong> ${doc.uploader.username}<br>
          <strong>Working site:</strong> ${doc.uploader.user_working_site}<br>
          <strong>Date uploaded:</strong> ${formatDate(doc.createdAt)}<br>
        </div>
      </i>
    `;
    ul.appendChild(docLi);
  });

  // Subfolders
  folder.children.forEach(child => {
    ul.appendChild(renderFolder(child));
  });

  details.appendChild(ul);
  li.appendChild(details);
  return li;
}
 
// ==== 8. Format date string to readable format ====
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}
 
// ==== 9. Render uploaded file info in description container ====
function renderFileDescription(file) {
  $('#fileUploadContainer').addClass('d-none');           // Hide the upload container
  $('#fileDescriptionContainer').removeClass('d-none');   // Show the file description container
  const container = $('#fileDescriptionContainer');
  container.empty();                        // Clear previous content
 
  const fileName = file.name;
  const fileSize = formatFileSize(file.size)                      // Convert to MB
  const fileIconClass = `${getFileIconClass(fileName)} fs-2`;     // Get the icon class based on file type
  const fileDescription = `
      <div class="file-info-containerDocument d-flex align-items-center p-3 mb-2 bg-light border rounded shadow-sm" data-index="0">
        <div class="me-3">
          <i class="${fileIconClass}"></i>
        </div>
        <div class="flex-grow-1" >
          <div class="file-name fw-semibold text-truncate d-block" title="${fileName}">${fileName}</div>
          <small class="text-muted" title="${fileSize}">Size: ${fileSize}</small>
        </div>
        <div class="ms-3 flex-shrink-0">
          <button class="btn btn-sm btn-outline-danger deleteFileBtn" title="Remove file">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
  `;
 
  container.append(fileDescription);                                            // Append the file description to the container
  const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));  // Set the file name in the input field
  $('#fileName').val(fileNameWithoutExt);                                       // Set the file name in the input field
};
 
// ==== 10. Format file size to MB, KB or Bytes ====
function formatFileSize(size) {
  if (size >= 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  } else if (size >= 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else {
    return size + ' Bytes';
  }
};
 
// ==== 11. Get file icon class based on file extension ====
function getFileIconClass(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'bi bi-file-earmark-pdf-fill text-danger';
    case 'doc':
    case 'docx':
      return 'bi bi-file-earmark-word-fill text-primary';
    case 'xls':
    case 'xlsx':
      return 'bi bi-file-earmark-excel-fill text-success';
    case 'ppt':
    case 'pptx':
      return 'bi bi-file-earmark-ppt-fill text-danger';
    default:
      return 'bi bi-file-earmark-fill text-secondary';
  }
}
 
// ==== 12. Open "Add Folder" modal (from root) ====
function openAddFolderModal() {
  const modal = new bootstrap.Modal(document.getElementById("addFolderModal"));
  $('#parentFolderName').val('Root folder');
  modal.show();
}
 
// ==== 13. Open "Add File" modal (from root) ====
function openAddFileModal() {
  const modal = new bootstrap.Modal(document.getElementById("addFileModal"));
  $('#parentFolderNameForAddFile').html('Root folder');
  modal.show();
}
 
// ==== 14. Validate uploaded file type and size ====
function validateFile(file) {
  const fileName = file.name;
  const ext = fileName.split('.').pop().toLowerCase();
  const isValidFileType = allowedFileTypes.includes(`.${ext}`);
  if (!isValidFileType) {
    showNotification("Fail  ", "Invalid file type. Please upload a valid file.", "alert-success", "alert-danger");
    $('#fileInput').val('');        // Clear the input field
    return;
  }
 
  // Check size of the file
  const fileSize = file.size / (1024 * 1024);   // Convert to MB
  if(fileSize > 10) {                           // Check if file size exceeds 10MB
    showNotification("Fail  ", "File size exceeds 10MB. Please upload a smaller file.", "alert-success", "alert-danger");
    $('#fileInput').val('');                    // Clear the input field
    return;
  };
 
  
}
// ==== 15. Open "Update File" modal (from root) ====
function openUpdateFileModal() {
  const modal = new bootstrap.Modal(document.getElementById("updateFileModal"));
  $('#parentFolderNameForUpdateFile').html('Root folder');
  modal.show();
}

// ==== 16. function renderFile for New Input ====
function renderFileDescriptionForNewInput(file) {
  $('#fileUploadContainerForUpdate').addClass('d-none');           // Hide the upload container
  $('#fileDescriptionContainerForUpdate').removeClass('d-none');   // Show the file description container
  const container = $('#fileDescriptionContainerForUpdate');
  container.empty();                        // Clear previous content
 
  const fileName = file.name;
  const fileSize = formatFileSize(file.size)                      // Convert to MB
  const fileIconClass = `${getFileIconClass(fileName)} fs-2`;     // Get the icon class based on file type
  const fileDescription = `
      <div class="file-info-containerDocument d-flex align-items-center p-3 mb-2 bg-light border rounded shadow-sm" data-index="0">
        <div class="me-3">
          <i class="${fileIconClass}"></i>
        </div>
        <div class="flex-grow-1" >
          <div class="file-name fw-semibold text-truncate d-block" title="${fileName}">${fileName}</div>
          <small class="text-muted" title="${fileSize}">Size: ${fileSize}</small>
        </div>
        <div class="ms-3 flex-shrink-0">
          <button class="btn btn-sm btn-outline-danger deleteFileBtn" title="Remove file">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
  `;
 
  container.append(fileDescription);                                            // Append the file description to the container
  // const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));  // Set the file name in the input field
  // $('#fileName').val(fileNameWithoutExt);                                       // Set the file name in the input field
};

// ======================================================================
// | II. Document & Folder Event Handling                               |
// ======================================================================
 
// ==== 1. Document Ready Initialization ====
$(document).ready(() => {
  $('.add-Btn').hide();       // Hide the "Add" button
  fetchDocumentData();        // Fetch document data on page load
});
 
// ==== 2. Show context menu for folders ====
$(document).on('contextmenu', 'summary', function(e) {
  e.preventDefault();                                           // Prevent default context menu
  const folderId = $(this).data('folder-id');                   // Get folder ID
  const folderName = $(this).text().trim();                     // Get folder name
  showContextMenu(e.pageX, e.pageY, folderId, folderName);      // Show custom context menu
});
 
// ==== 3. Show context menu for documents ====
$(document).on('contextmenu', '.documentItem', function(e) {
  e.preventDefault();
  const documentId = $(this).data('document-id');
  const documentName = $(this).children('div').text().trim();
  const documentVersion = $(this).find('.documentInfo').data('version');
  showContextMenuDocument(e.pageX, e.pageY, documentId, documentName);
  currentFileVersion = documentVersion;  // Store current document version
  currentContextDocumentId = documentId;
  currentContextDocumentName = documentName;
});
 
// ==== 4. Show tooltip for document info ====
$(document).on('mouseover', '.documentInfo', function(e) {
  const tooltip = $(this).find('.custom-tooltip');
  const mouseX = e.pageX;
  const mouseY = e.pageY;
  const tooltipRect = tooltip[0].getBoundingClientRect();
 
  if (mouseY + tooltipRect.height + 10 > window.innerHeight) {
    tooltip.addClass('tooltip-top');                            // Show tooltip above if it overflows
  } else {
    tooltip.removeClass('tooltip-top');
  }
});
 
// ==== 5. Handle click on document items ====
$(document).on('click', '.documentItem',async function(e) {
  e.preventDefault();                                                               // Prevent default click behavior
  const documentId = $(this).data('document-id');                                   // Get document ID
  const documentName = $(this).text().trim();                                       // Get document name
  const mainArea = document.querySelector('.document-intranet .mainArea');
  const loading = renderLoading();                                                  // Show loading animation
 
  try {
    mainArea.innerHTML = loading;
    if (isLoading) return;
    isLoading = true; // Set loading state to true
    const response = await fetch(`http://${http_request}/document/${documentId}`);
   
    if(!response.ok) {
      throw new Error("Failed to fetch document data");
    };
 
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
 
    mainArea.innerHTML = `<div id="pdfViewer" style="width: 100%; overflow: auto;"></div>`;
    const pdfViewer = document.getElementById("pdfViewer");

    const pdf = await pdfjsLib.getDocument(blobUrl).promise;
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.4 });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext("2d");
      const renderContext = { canvasContext: context, viewport: viewport };
      await page.render(renderContext).promise;

      pdfViewer.appendChild(canvas);
    }
    isLoading = false; // Reset loading state
  } catch(err) {
    console.error("Error fetching document data:", err);
  }
});
 
// ==== 6. Open confirm delete modal for document ====
$(document).on('click', '#deleteDocument', async function() {
  if (!currentContextDocumentId) {
    showNotification("Fail  ", "No document selected", "alert-success", "alert-danger");
    return;
  }
 
  const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    $('#confirmDeleteBtn').css('display', 'none');              // Hide folder delete button
    $('#confirmDeleteDocumentBtn').css('display', 'block');     // Show document delete button
    $('.confirmDeleteFolderName').text(`${currentContextDocumentName} document`);
  modal.show();
});
 
// ==== 7. Confirm delete document ====
$(document).on('click', '#confirmDeleteDocumentBtn', async function() {
  try {
    const documentId = currentContextDocumentId;
    const response = await fetch(`http://${http_request}/document/delete/document/${documentId}`, {
      method: 'DELETE',
    });
 
    const data = await response.json();
    if (data.success) {
      showNotification("Success", "Document deleted successfully", "alert-danger", "alert-success");
      const modalInstance = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
      modalInstance.hide();
 
      setTimeout(() => {              // Reload after deletion
        window.location.reload();
      }, 1000);
    } else {
      showNotification("Fail  ", data.message || "An error occurred", "alert-success", "alert-danger");
    }
  } catch (err) {
    console.error("Error deleting document:", err);
    showNotification("Error", "An error occurred while deleting the document", "alert-success", "alert-danger");
  }
});
 
// ==== 8. Confirm delete folder ====
$(document).on('click', '#confirmDeleteBtn', async function() {
  try {
    const folderId = currentContextFolderId;
    const response = await fetch(`http://${http_request}/document/delete/folder/${folderId}`, {
      method: 'DELETE',
    });
 
    const data = await response.json();
    if (data.success) {
      showNotification("Success", "Folder deleted successfully", "alert-danger", "alert-success");
      const modalInstance = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
      modalInstance.hide();
 
      setTimeout(() => {              // Reload after deletion
        window.location.reload();
      }, 1000);
    } else {
      showNotification("Fail", data.message || "An error occurred", "alert-success", "alert-danger");
    }
  } catch (err) {
    console.error("Error deleting folder:", err);
  }
});
 
// ==== 9. Delete uploaded file ====
$(document).on('click', '.deleteFileBtn', function () {
  const container = $(this).closest('.file-info-containerDocument');
  container.remove();                                 // Remove file container
  $('#fileUploadContainer').removeClass('d-none');    // Show upload area
  $('#fileDescriptionContainer').addClass('d-none');  // Hide description area
  $('#fileInput').val('');                            // Reset input file
  $('#fileName').val('');
});
 
// ==== 10. Handle drag and drop file upload ====
$(document).on('dragenter dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#uploadFileButton').addClass('dragover');                        // Show drag effect
    $('#uploadFileButton').find('.drop-text').removeClass('d-none');    // Show "drop file" text
  });
 
// ==== 11. Handle drop or drag leave ====
$(document).on('dragleave drop', function (e) {
  e.preventDefault();
  e.stopPropagation();
  $('#uploadFileButton').removeClass('dragover');
  $('#uploadFileButton').find('.drop-text').addClass('d-none');
});
 
// ==== 12. Handle file drop event ====
$(document).on('drop', function (e) {
  e.preventDefault();
  const files = e.originalEvent.dataTransfer.files;
 
  if (files.length > 1) {
    showNotification("Fail  ", "Please upload only one file at a time.", "alert-success", "alert-danger");
    return;
  }
 
  if (files.length === 1) {
    const file = files[0];
    $('#fileInput')[0].files = files;
 
    validateFile(file);           // Validate the file
    renderFileDescription(file);  // Show file info
  }
});
 
// ======================================================================
// | III. Document Management Actions                                   |
// ======================================================================
 
// ==== 1. Handle folder creation ====
$('#addFolderModal .btn-primary').on('click', async () => {
  try {
    const folderName = $('#folderName').val().trim();
    const fatherId = currentContextFolderId || null;
    const folderPath = currentContextFolderName || null;
 
    if(!folderName) {
      showNotification("Fail  ", "Folder name is required", "alert-success", "alert-danger");
      return;
    };
 
    const response = await fetch(`http://${http_request}/document/addFolder`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({folderName, fatherId, folderPath}),
    });
 
    const result = await response.json();
 
    if (response.ok) {
      showNotification("Success", "Folder created successfully", "alert-danger", "alert-success");
      $('#folderName').val('');
    } else {
      showNotification("Fail  ", result.message || "An error occurred", "alert-success", "alert-danger");
    }
 
    $('#addFolderModal').modal('hide');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    showNotification("Error", "An error occurred while creating the folder", "alert-success", "alert-danger");
    console.error("Error:", err);
  }
});
 
// ==== 2. Handle file input change ====
$('#fileInput').on('change', function (e) {
  if (e.target.files.length > 1) {
    showNotification("Fail  ", "Please upload only one file at a time.", "alert-success", "alert-danger");
    return;
  }
  validateFile(e.target.files[0]);
  renderFileDescription(e.target.files[0]);
});
 
// ==== 3. Trigger file input via button click ====
$('#uploadFileButton').on('click', () => $('#fileInput').trigger('click'));
 
 
// ==== 4. Handle file upload ====
$('#submitUploadFile').on('click', async () =>{
  try {
    const fileInput = document.getElementById('fileInput');
    const fileName = $('#fileName').val().trim();
    const folderId = currentContextFolderId || null;
    const fileVersion = $('#fileVersion').val().trim() || '1.0'; // Default version if not provided
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('fileVersion', fileVersion);
    formData.append('fileName', fileName);
    formData.append('folderId', folderId);
    const response = await fetch(`http://${http_request}/document/uploadFile`, {
      method: 'POST',
      body: formData,
    });
 
    const result = await response.json();
 
    if (response.ok) {
      showNotification("Success", "File uploaded successfully", "alert-danger", "alert-success");
      $('#fileName').val('');
    } else {
      showNotification("Fail  ", result.message || "An error occurred", "alert-success", "alert-danger");
    }
 
    $('#addFileModal').modal('hide');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    showNotification("Error", "An error occurred while uploading the file", "alert-success", "alert-danger");
    console.error("Error:", err);
  }
});
 
// ==== 5. Toggle custom user input based on access type ====
$('input[name="accessType"]').on('change', function () {
  if ($(this).val() === 'custom') {
    $('#customUserContainer').removeClass('d-none');
  } else {
    $('#customUserContainer').addClass('d-none');
  }
});
 
// ==== 6. Handle document/folder search ====
$('.document-intranet #searchInput').on('keydown', function() {
  const searchValue = $(this).val().toLowerCase();
  const newDocuments = documentData.filter(folder => {
    const folderName = folder.name.toLowerCase();
    const documents = folder.documents.filter(doc => {
      const docName = doc.title.toLowerCase();
      return docName.includes(searchValue);
    });
    return folderName.includes(searchValue) || documents.length > 0;
  });
  renderTree(newDocuments);
  if (searchValue === '') {
    renderTree(documentData);       // Reset tree if input is cleared
  }
});
 
// ==== 7. Show history modal ====
$('#historyButton').on('click', function(e) {
  e.preventDefault();
  const modal = new bootstrap.Modal(document.getElementById("historyModal"));
  modal.show();
})
 
// ==== 8. Load document history when modal is shown ====
$('#historyModal').on('show.bs.modal', async function() {
  const $content = $('#historyContent');
  $content.html(`
    <div class="text-center">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Loading history...</p>
    </div>
  `);
 
  try {
    const res = await fetch(`http://${http_request}/document/history`);
    if (!res.ok) throw new Error('Network response was not ok');
   
    const data = await res.json();
 
    if (!data || data.data.length === 0) {
      $content.html(`<p class="text-muted">No history found.</p>`);
      return;
    }
 
    const listItems = data.data.map(item => `
      <li class="list-group-item">
        <strong>${item.description}</strong><br>
        <small>${new Date(item.timestamp).toLocaleString()}</small>
      </li>
    `).join('');
 
    $content.html(`<ul class="list-group">${listItems}</ul>`);
  } catch (err) {
    console.error("Failed to fetch history:", err);
    $content.html(`<p class="text-danger">Failed to load history.</p>`);
  }
});

// ==== 9. Handle file upload button click ====
$('#updateFileButton').on('click', () => $('#newFileInput').trigger('click'));

// ==== 10. Handle new file input change ====
$('#newFileInput').on('change', function (e) {
  if (e.target.files.length > 1) {
    showNotification("Fail  ", "Please upload only one file at a time.", "alert-success", "alert-danger");
    return;
  }
  validateFile(e.target.files[0]);
  renderFileDescriptionForNewInput(e.target.files[0]);
  $('')
});

// ======================================================================
// | IV. UI Button & Input Event Handler                                |
// ======================================================================
 
// ==== 1. Disable file name input by default ====
document.getElementById('fileName').disabled = true;
 
// ==== 2. Hide context menu when clicking outside ====
document.addEventListener('click', () => {
  document.getElementById('contextMenu').style.display = 'none';
  document.getElementById('contextMenuDocument').style.display = 'none';
});
 
// ==== 3. Handle "Add File" button click ====
document.getElementById('addFile').addEventListener('click', () => {
  $('#addFileModal').modal('show');                                 // Open modal to add file
  $('#parentFolderNameForAddFile').html(currentContextFolderName);  // Set folder name in modal
});
 
// ==== 4. Handle "Add Folder" button click ====
document.getElementById('addFolder').addEventListener('click', () => {
  $('#addFolderModal').modal('show');                   // Open modal to add folder
  $('#parentFolderName').val(currentContextFolderName); // Set parent folder name in input
});
 
// ==== 5. Handle file name type radio button change ====
document.querySelectorAll('input[name="fileNameType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const input = document.getElementById('fileName');
    input.disabled = document.getElementById('originalName').checked;
  });
});
 
// ==== 6. Handle "Delete Folder" button click ====
document.getElementById('deleteFolder').addEventListener('click', async () => {
  if (!currentContextFolderId) {
    showNotification("Fail  ", "No folder selected", "alert-success", "alert-danger");
    return;
  }
 
  const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
  $('#confirmDeleteBtn').css('display', 'block');           // Show delete button for folder
  $('#confirmDeleteDocumentBtn').css('display', 'none');    // Hide delete button for document
  $('.confirmDeleteFolderName').text(`${currentContextFolderName} folder`);
  modal.show();
});

// ==== 7. Handle "Update File" button click ====
document.getElementById('updateVersionDocument').addEventListener('click', () => {
  if (!currentContextDocumentId) {
    showNotification("Fail  ", "No document selected", "alert-success", "alert-danger");
    return;
  }
  let newFileVersion = parseFloat(currentFileVersion) + 0.1; // Increment version by 0.1
  newFileVersion = newFileVersion.toFixed(1); // Format to one decimal place
 
  $('#updateVersionModal').modal('show');                     // Open modal to update file
  $('#newFileVersion').val(newFileVersion); // Set new file version in input
  $('#documentInputNameForUpdate').val(currentContextFolderName); // Set folder name in modal
  // $('#fileNameForUpdate').val(currentContextDocumentName); // Set current document name in input
});

// ==== 8. Handle prevent contextmenu in canvas ====
document.addEventListener("contextmenu", function (e) {
  // Chặn toàn bộ trang hoặc kiểm tra target là canvas
  if (e.target.nodeName === "CANVAS" || e.target.closest("#pdfViewer")) {
    e.preventDefault();
  }
});

// ==== 9. Handle "Update File" modal name changing ====
document.querySelectorAll('input[name="updateFileNameType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const input = document.getElementById('documentInputNameForUpdate');
    input.disabled = document.getElementById('originalDocName').checked;
  });
});