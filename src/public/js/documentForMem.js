const http_request = 'localhost:3000';
let documentData = [];
let isLoading = false;

// ======================================================================
// | I. Folder and File UI Handlers                                     |
// ======================================================================
 
// ==== 1. Fetch document data from backend and render tree ====
async function fetchDocumentData() {
  try {
    const response = await fetch(`http://${http_request}/document/getall`);
    const data = await response.json();
    if(data.success) {
      documentData = data.data;
      // renderDocumentTree(documentData);
      renderTree(documentData);
    } else {
      console.error("Failed to fetch document data:", data.message);
    }
  } catch (error) {
    console.error("Error fetching document data:", error);
  }
};

// ==== 2. Render folder/document tree structure ====
function renderTree(documentDatas) {
  const container = document.querySelector('.document-intranet div.smallDocArea ul.tree');
  container.innerHTML = '';       // Clear previous render
 
  documentDatas.forEach(folder => {
    container.appendChild(renderFolder(folder));
  });
}

// ==== 3. Render a single folder and its contents ====
function renderFolder(folder) {
  const li = document.createElement('li');
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.setAttribute('data-folder-id', folder.id);
  summary.innerHTML = `<i class="bi bi-folder-fill text-warning me-2"></i> ${folder.name} `;
  details.appendChild(summary);
 
  const ul = document.createElement('ul');
 
  // Documents in folder
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
      </i>`;
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

// ==== 4. Get file icon class based on file extension ====
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

// ==== 5. Render loading animation ====
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

// ==== 5. Format date string to readable format ====
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

// ======================================================================
// | II. Document & Folder Event Handling                               |
// ======================================================================

// ==== 1. Document Ready Initialization ====
$(document).ready(() => {
  $('.add-Btn').hide();       // Hide the "Add" button
  fetchDocumentData();        // Fetch document data on page load
});

// ==== 2. Handle click on document items ====
$(document).on('click', '.documentItem',async function(e) {
  e.preventDefault();                                                               // Prevent default click behavior
  const documentId = $(this).data('document-id');                                   // Get document ID
  const documentName = $(this).text().trim();                                       // Get document name
  const mainArea = document.querySelector('.document-intranet .mainArea');
  const loading = renderLoading();                                                  // Show loading animation
 
  try {
    mainArea.innerHTML = loading;
    if (isLoading) return; 
    isLoading = true;
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

// ======================================================================
// | III. Document Management Actions                                   |
// ======================================================================

// ==== 1. Handle document/folder search ====
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

// ==== 2. Handle prevent contextmenu in canvas ====
document.addEventListener("contextmenu", function (e) {
  // Chặn toàn bộ trang hoặc kiểm tra target là canvas
  if (e.target.nodeName === "CANVAS" || e.target.closest("#pdfViewer")) {
    e.preventDefault();
  }
});