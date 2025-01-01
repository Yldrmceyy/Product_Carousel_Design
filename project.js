() => {
  const init = () => {
    self.buildHTML();
    self.buildCSS();
    self.setEvents();
    self.fetchProducts();
  };

  const fetchProducts = async () => {
    const localProducts = localStorage.getItem("products");
    if (localProducts) {
      return JSON.parse(localProducts); // Local Storage'dan veri varsa onu döndür.
    }

    // API'den veri çek.
    const response = await fetch(
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
    );
    const products = await response.json();
    localStorage.setItem("products", JSON.stringify(products)); // Local Storage'a kaydet.

    return products;
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

  const buildCSS = () => {
    const css = `
        .carousel-container {
            position: relative;
            overflow: hidden;
            margin-top: 20px;
        }
        .carousel {
            display: flex;
            transition: transform 0.3s ease;
        }
        .carousel-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: black;
            color: white;
            border: none;
            cursor: pointer;
        }
        .carousel-btn.left {
            left: 10px;
        }
        .carousel-btn.right {
            right: 10px;
        }
        .product-card {
            flex: 0 0 calc(100% / 6.5);
            margin: 5px;
        }
    `;
    $('<style>').html(css).appendTo('head');
};


  init();
};
