$(document).ready(function () {
  loadBookshelf();
});

function loadBookshelf() {
  $("#bookshelfMessage").text("Loading bookshelf books...");

  // Replace these sample IDs with your own Google Books public bookshelf volume IDs
  const myBookIds = [
    "zyTCAlFPjgYC",
    "m8dPPgAACAAJ",
    "uWbQDwAAQBAJ",
    "9W49EAAAQBAJ"
  ];

  const requests = myBookIds.map(function (id) {
    return $.getJSON(`https://www.googleapis.com/books/v1/volumes/${id}`);
  });

  $.when.apply($, requests)
    .done(function () {
      $("#bookshelfResults").html("");

      let responses = [];

      if (myBookIds.length === 1) {
        responses = [arguments];
      } else {
        responses = Array.from(arguments);
      }

      responses.forEach(function (response) {
        const book = response[0];
        const volumeInfo = book.volumeInfo || {};

        const title = volumeInfo.title || "No title available";
        const authors = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown author";
        const image = volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail
          ? volumeInfo.imageLinks.thumbnail
          : "https://via.placeholder.com/128x190?text=No+Cover";

        const card = `
          <div class="book-card">
            <img src="${image}" alt="Cover image for ${title}">
            <h3><a href="details.html?id=${book.id}">${title}</a></h3>
            <p>${authors}</p>
          </div>
        `;

        $("#bookshelfResults").append(card);
      });

      $("#bookshelfMessage").text(`Showing ${myBookIds.length} book(s) from my public bookshelf.`);
    })
    .fail(function () {
      $("#bookshelfMessage").text("There was an error loading your bookshelf.");
    });
}
