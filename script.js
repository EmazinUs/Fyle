let currentPage = 1;
let perPage = 10;
let totalRepositories = 0;

async function getRepositories() {
  const username = document.getElementById("username").value;
  const perPageSelect = document.getElementById("perPage");
  const searchInput = document.getElementById("search");
  const loader = document.getElementById("loader");

  perPage = parseInt(perPageSelect.value);
  currentPage = 1;

  try {
    loader.style.display = "block";

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}&sort=updated`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch repositories. Please check the username and try again."
      );
    }

    const linkHeader = response.headers.get("Link");
    if (linkHeader) {
      totalRepositories = parseInt(
        linkHeader
          .split(",")
          .find((s) => s.includes('rel="last"'))
          .split(";")[0]
          .match(/page=(\d+)/)[1]
      );
      updatePagination();
    }

    const repositories = await response.json();
    displayRepositories(repositories);

    searchInput.value = "";
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    loader.style.display = "none";
  }
}

function displayRepositories(repositories) {
  const repositoriesList = document.getElementById("repositories");
  repositoriesList.innerHTML = "";

  repositories.forEach((repo) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${repo.name}</strong>: ${
      repo.description ? repo.description : "No description available."
    } <a href="${repo.html_url}" target="_blank">Visit Repo</a>`;

    const topics = repo.topics
      .map((topic) => `<span class="topic">${topic}</span>`)
      .join("");
    listItem.innerHTML += `<div class="topics">${topics}</div>`;

    repositoriesList.appendChild(listItem);
  });
}

function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalRepositories / perPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.onclick = () => changePage(i);
    pagination.appendChild(pageButton);
  }
}

function changePage(page) {
  currentPage = page;
  getRepositories();
}
