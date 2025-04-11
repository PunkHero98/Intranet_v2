
$(document).ready(function () {
  lightGallery(document.getElementById('lightgallery'), {
    plugins: [lgZoom, lgThumbnail],
    speed: 500,
    zoom: true,
    thumbnail: true,
    download: false
  });

  $('.file-item').on('click', async function () {
    const filePath = $(this).find('.file-name').attr('title');
    const fileExt = filePath.split('.').pop().toLowerCase();
    console.log( fileExt);
    $('#previewContent').html('<p>Loading preview...</p>');
    $('#filePreviewModal').fadeIn();

    if (fileExt === 'pdf') {
      $('#previewContent').html('<p>Loading PDF preview...</p>');
      const loadingTask = pdfjsLib.getDocument({ url: filePath });
      loadingTask.promise.then(async pdf => {
        const numPages = pdf.numPages;
        $('#previewContent').html(''); // clear loading text

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement('canvas');
          canvas.className = 'pdf-canvas';
          canvas.style.width = '100%';
          const ctx = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };

          await page.render(renderContext).promise;
          $('#previewContent').append(canvas);
        }
      }).catch(err => {
          $('#previewContent').html('<p style="color:red;">Failed to load PDF: ' + err.message + '</p>');
      });
    } else if (['xlsx', 'xls'].includes(fileExt)) {
      const response = await fetch(filePath);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });

      // Tạo dropdown chọn sheet
      let sheetSelector = `<label for="sheetSelect">Select sheet: </label>
      <select id="sheetSelect" class="form-select form-select-sm d-inline w-auto ms-2 mb-2">`;

      workbook.SheetNames.forEach((name, i) => {
        sheetSelector += `<option value="${name}">${name}</option>`;
      });
      sheetSelector += `</select>`;

      // Khởi tạo content ban đầu là sheet đầu tiên
      const firstSheetHtml = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
      $('#previewContent').html(sheetSelector + firstSheetHtml);

      // Bắt sự kiện đổi sheet
      $('#sheetSelect').on('change', function () {
        const selectedSheet = $(this).val();
        const html = XLSX.utils.sheet_to_html(workbook.Sheets[selectedSheet]);
        $('#previewContent').html(sheetSelector + html);
      });
    } else {
      $('#previewContent').html('<p>Unsupported file type for preview.</p>');
    }
  });

  $('#closePreview').on('click', function () {
    $('#filePreviewModal').fadeOut();
  });
});

$("button.backButton").on("click", function () {
  window.history.back();
});

let slideIndex1 = 1;
showSlides1(slideIndex1);

// Next/previous controls
function plusSlides1(n) {
  showSlides1((slideIndex1 += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides1((slideIndex1 = n));
}

function showSlides1(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex1 = 1;
  }
  if (n < 1) {
    slideIndex1 = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace("activePic", "");
  }
  slides[slideIndex1 - 1].style.display = "block";
  dots[slideIndex1 - 1].className += " activePic";
}
