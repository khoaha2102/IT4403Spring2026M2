let allBooks = [];
const resultsPerPage = 10;

$(document).ready(function () {
  $("#pageSelect").hide();

  $("#searchBtn").on("click", function () {
    const query = $("#searchInput").val().trim();

    if (query === "") {
      $("#message").text("Please enter a search term.");
      $("#results").html("");
      $("#pageSelect").hide();
      return;
    }

    searchBooks(query);
  });

  $("#pageSelect").on("change", function () {
    const page = parseInt($(this).val());
    displayPage(page);
  });
});

function searchBooks(query) {
  $("#message").text("Loading books...");
  $("#results").html("");
  $("#pageSelect").hide();

  const encodedQuery = encodeURIComponent(query);

  const request1 = $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&startIndex=0&maxResults=40`);
  const request2 = $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&startIndex=40&maxResults=20`);

  $.when(request1, request2)
    .done(function (response1, response2) {
      const items1 = response1[0].items || [];
      const items2 = response2[0].items || [];

      allBooks = [...items1, ...items2].slice(0, 60);

      if (allBooks.length === 0) {
        $("#message").text("No books found.");
        return;
      }

      $("#message").text(`Showing ${allBooks.length} result(s).`);
      setupPagination();
      displayPage(1);
    })
    .fail(function () {
      $("#message").text("There was an error retrieving book data.");
    });
}

function setupPagination() {
  const totalPages = Math.ceil(allBooks.length / resultsPerPage);
  const $pageSelect = $("#pageSelect");

  $pageSelect.html("");

  for (let i = 1; i <= totalPages; i++) {
    $pageSelect.append(`<option value="${i}">Page ${i}</option>`);
  }

  if (totalPages > 0) {
    $pageSelect.show();
  }
}

function displayPage(page) {
  const start = (page - 1) * resultsPerPage;
  const end = start + resultsPerPage;
  const booksToDisplay = allBooks.slice(start, end);

  $("#results").html("");

  booksToDisplay.forEach(function (book) {
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

    $("#results").append(card);
  });

  $("#pageSelect").val(page);
}
