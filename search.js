let allBooks = [];
const resultsPerPage = 10;

const API_KEY = "AIzaSyB2gMpdf1dDa2hKR3j9Zoe5vgJGSrPw7rU";

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

  $("#searchInput").on("keypress", function (e) {
    if (e.which === 13) {
      $("#searchBtn").click();
    }
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

  const url1 = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&printType=books&startIndex=0&maxResults=40&key=${API_KEY}`;
  const url2 = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&printType=books&startIndex=40&maxResults=20&key=${API_KEY}`;

  $.getJSON(url1)
    .done(function (data1) {
      const items1 = data1.items || [];

      $.getJSON(url2)
        .done(function (data2) {
          const items2 = data2.items || [];
          allBooks = [...items1, ...items2].slice(0, 60);
          finishSearchResults();
        })
        .fail(function () {
          allBooks = items1.slice(0, 60);
          finishSearchResults();
        });
    })
    .fail(function () {
      $("#message").text("There was an error retrieving book data.");
    });
}

function finishSearchResults() {
  if (allBooks.length === 0) {
    $("#message").text("No books found.");
    $("#results").html("");
    $("#pageSelect").hide();
    return;
  }

  $("#message").text(`Showing ${allBooks.length} result(s).`);
  setupPagination();
  displayPage(1);
}

function setupPagination() {
  const totalPages = Math.ceil(allBooks.length / resultsPerPage);
  const $pageSelect = $("#pageSelect");

  $pageSelect.html("");

  for (let i = 1; i <= totalPages; i++) {
    $pageSelect.append(`<option value="${i}">Page ${i}</option>`);
  }

  if (totalPages > 1) {
    $pageSelect.show();
  } else {
    $pageSelect.hide();
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

    let image = "https://via.placeholder.com/128x190?text=No+Cover";
    if (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) {
      image = volumeInfo.imageLinks.thumbnail.replace("http://", "https://");
    }

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
