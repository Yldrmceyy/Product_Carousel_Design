() => {
  const init = () => {
    self.buildHTML();
    self.buildCSS();
    self.setEvents();
  };

  const buildHTML = () => {
    const html = `
           <div class="carousel-container">
            <h2>You Might Also Like</h2>
            <div class="carousel">
                ${products
                  .map(
                    (product) => `
                    <div class="product-card" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <button class="heart-icon">♡</button>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <button class="carousel-btn left">←</button>
            <button class="carousel-btn right">→</button>
        </div>
    `;

    $(".product-detail").append(html);
  };

  init();
};
