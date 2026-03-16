$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  if (!bookId) {
    $("#bookDetails").html("<p>No book ID was provided.</p>");
    return;
  }

  loadBookDetails(bookId);
});

function loadBookDetails(bookId) {
  const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

  $.getJSON(url)
    .done(function (book) {
      const volumeInfo = book.volumeInfo || {};
      const saleInfo = book.saleInfo || {};

      const title = volumeInfo.title || "No title available";
      const authors = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown author";
      const publisher = volumeInfo.publisher || "Unknown publisher";
      const description = volumeInfo.description || "No description available.";

      let image = "https://via.placeholder.com/220x320?text=No+Cover";

      if (volumeInfo.imageLinks) {
        image =
          volumeInfo.imageLinks.large ||
          volumeInfo.imageLinks.medium ||
          volumeInfo.imageLinks.small ||
          volumeInfo.imageLinks.thumbnail ||
          image;

        image = image.replace("http://", "https://");
      }

      let price = "Not available";
      if (saleInfo.listPrice) {
        price = `${saleInfo.listPrice.amount} ${saleInfo.listPrice.currencyCode}`;
      }

      const detailsHtml = `
        <div class="details-layout">
          <div class="details-images">
            <img src="${image}" alt="Cover image for ${title}">
          </div>

          <div class="details-info">
            <h2>${title}</h2>
            <p><span class="label">Authors:</span> ${authors}</p>
            <p><span class="label">Publisher:</span> ${publisher}</p>
            <p><span class="label">Price:</span> ${price}</p>

            <p><span class="label">Description:</span></p>
            <p>${description}</p>

            <a class="back-link" href="index.html">← Back to Search</a>
          </div>
        </div>
      `;

      $("#bookDetails").html(detailsHtml);
    })
    .fail(function () {
      $("#bookDetails").html("<p>Unable to load book details.</p>");
    });
}
