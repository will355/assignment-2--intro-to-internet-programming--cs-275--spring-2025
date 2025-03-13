// -----------------------------------------------------------------------------
// This file includes deliberate formatting errors in order for you to verify
// that ESLint and EditorConfig are working properly. If both tools are, indeed,
// working correctly, then you’d see errors in your editor about indentation and
// improper use of footmarks instead of back ticks. When you save this file,
// your editor should strip all excess newlines and whitespace characters from
// the file. If both of these events occur, then ESLint and EditorConfig are
// working correctly.
//
// DON’T PROCEED UNTIL YOU’RE SURE ESLINT AND EDITORCONFIG ARE WORKING CORRECTLY
// -----------------------------------------------------------------------------
window.onload = () => {
    fetch(`json/data.json`) // Ensure correct path
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok`);
            return response.json();
        })
        .then(data => {
            console.log(`Fetched Data:`, data); // Debugging
            displayAlbums(data);
        })
        .catch(error => console.error(`Error fetching JSON:`, error));
};

function displayAlbums(albums) {
    let slidesContainer = document.querySelector(`.carousel-slides`);
    slidesContainer.innerHTML = ``;

    albums.forEach(album => {
        console.log(album);

        let slide = document.createElement(`div`);
        slide.classList.add(`slide`);

        let imagePath = album.cover_image.path.startsWith("img/")
            ? album.cover_image.path
            : `img/${album.cover_image.path}`;

        slide.innerHTML = `
        <div class="album-cover">
          <a href="${album.cover_image.url}" target="_blank">
            <img src="${imagePath}" alt="${album.cover_image.alt_content}"
            width="${album.cover_image.width}"
            height="${album.cover_image.height}"
            onerror="this.onerror=null; this.src='img/default.jpg';">
          </a>
          <p class="credit">Photo by <a href="${album.cover_image.url}"
          target="_blank">${album.cover_image.credit}</a></p>
        </div>
        <div class="album-info">
          <h2><a href="${album.url}" target="_blank">${album.album}</a></h2>
          <p class="artist">${album.artist}</p>
          <blockquote class="review">
            "${album.review.content}"
            <br><small>— <a href="${album.review.url}" target="_blank">${album.review.source}</a></small>
          </blockquote>
        </div>
      `;

        slidesContainer.appendChild(slide);
    });

    setupCarousel();
}

function setupCarousel() {
    const slidesContainer = document.querySelector(`.carousel-slides`);
    const slides = document.querySelectorAll(`.slide`);
    const prevButton = document.querySelector(`.carousel-navigation a:first-child`);
    const nextButton = document.querySelector(`.carousel-navigation a:last-child`);

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        if (currentIndex < 0) currentIndex = totalSlides - 1;
        if (currentIndex >= totalSlides) currentIndex = 0;
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }


    prevButton.addEventListener(`click`, (e) => {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });

    nextButton.addEventListener(`click`, (e) => {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    });

    window.addEventListener("resize", updateCarousel);
}
