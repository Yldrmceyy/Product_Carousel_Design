const script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-3.6.4.min.js";
script.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(script);

(() => {
  const init = async () => {
    const products = await fetchProducts();
    buildHTML(products);
    buildCSS();
    setEvents();
    loadFavorites();
  };

  const fetchProducts = async () => {
    try {
      const localProducts = localStorage.getItem("products");
      if (localProducts) {
        return JSON.parse(localProducts); // Local storage'dan veri yükleniyor
      }

      const response = await fetch(
        "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
      );
      const products = await response.json();

      // Local storage'a ürünler kaydediliyor
      localStorage.setItem("products", JSON.stringify(products));
      return products;
    } catch (error) {
      console.error("Ürünler yüklenirken hata oluştu:", error);
      return [];
    }
  };

  const buildHTML = (products) => {
    const html = `
            <div class="carousel-container">
                <h2>You Might Also Like</h2>
                <div class="carousel">
                    ${products
                      .map(
                        (product) => `
                        <div class="product-card" data-id="${product.id}">
                            <img src="${product.img}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.price} TL</p>
                            <button class="heart-icon">♡</button>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <button class="carousel-btn left"><</button>
                <button class="carousel-btn right">></button>
            </div>
        `;
    $(".product-detail").append(html);
  };

  const buildCSS = () => {
    const css = `
            .carousel-container {
                position: relative;
                overflow: hidden;
                margin: 20px auto;
                padding: 10px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .carousel {
                display: flex;
                gap: 10px;
                transition: transform 0.3s ease-in-out;
            }
            .product-card {
                flex: 0 0 calc(100% / 6.5);
                background: #fff;
                text-align: center;
                border: 1px solid #ddd;
                border-radius: 8px;
                position: relative;
                padding: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .product-card img {
                width: 100%;
                height: auto;
                border-bottom: 1px solid #ddd;
            }
            .product-card h3 {
                font-size: 14px;
                color: #333;
                margin: 8px 0;
            }
            .product-card p {
                font-size: 16px;
                color: #f15a24;
                font-weight: bold;
                margin: 5px 0;
            }
            .heart-icon {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 20px;
                cursor: pointer;
                color: #aaa;
                border: none;
                background: none;
                transition: color 0.3s ease;
            }
            .heart-icon.favorited {
                color: blue;
            }
           .carousel-btn {
    position: absolute;
    top: 50%; 
    transform: translateY(-50%); 
    width: 40px; 
    height: 40px; 
    background-color: rgba(0, 0, 0, 0.5);
    color: white; 
    border: none; 
    border-radius: 50%;
    font-size: 18px; 
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease; 
    z-index: 10;
}

.carousel-btn:hover {
    background-color: rgba(0, 0, 0, 0.8); 
    }

.carousel-btn.left {
    left: 10px; 
}

.carousel-btn.right {
    right: 10px; 
}

            @media (max-width: 768px) {
                .product-card {
                    flex: 0 0 calc(100% / 2); /* Mobilde 2 ürün görünür */
                }
            }
            @media (max-width: 480px) {
                .product-card {
                    flex: 0 0 100%; /* Mobilde tam genişlik */
                }
            }
        `;
    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  const setEvents = () => {
    $(".carousel-btn.left").on("click", () => scrollCarousel(1));
    $(".carousel-btn.right").on("click", () => scrollCarousel(-1));
    $(".carousel").on("click", ".heart-icon", toggleFavorite);
  };

  const scrollCarousel = (direction) => {
    const carousel = $(".carousel");
    const currentScroll =
      parseInt(carousel.css("transform").split(",")[4]) || 0;
    const productWidth = $(".product-card").outerWidth(true);
    const newScroll = currentScroll + direction * productWidth;
    carousel.css("transform", `translateX(${newScroll}px)`);
  };

  const toggleFavorite = (e) => {
    const heartIcon = $(e.target);
    const productId = heartIcon.closest(".product-card").data("id");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(productId)) {
      favorites = favorites.filter((id) => id !== productId);
      heartIcon.removeClass("favorited");
    } else {
      favorites.push(productId);
      heartIcon.addClass("favorited");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.forEach((id) => {
      $(`.product-card[data-id="${id}"].heart-icon`).addClass("favorited");
    });
  };

  $(document).ready(() => {
    init();
  });
})();
