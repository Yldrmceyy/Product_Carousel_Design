// const script = document.createElement("script");
// script.src = "https://code.jquery.com/jquery-3.6.4.min.js";
// script.type = "text/javascript";
// document.getElementsByTagName("head")[0].appendChild(script);

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
        return JSON.parse(localProducts); 
      }

      const response = await fetch(
        "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
      );
      const products = await response.json();

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
              <a href="${product.url}" target="_blank">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} TL</p>
              </a>
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
        padding: 10px 40px;
        background-color: #f9f9f9; 
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      h2 {
        font-family: "Roboto", sans-serif; 
        font-size: 30px; 
        font-weight: 300; 
        color: #333; 
        text-align: left; 
        padding-bottom: 20px; 
      }

      .carousel-wrapper {
        overflow: hidden;
        position: relative;
      }

      .carousel {
        display: flex;
        transition: transform 0.5s ease-in-out;
        gap: 5px;
      }

      .product-card {
        flex: 0 0 calc(100% / 6.5);
        background: #fff;
        text-align: left; 
        border: 1px solid #eaeaea; 
        border-radius: 2px;
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
      }

      .product-card:hover {
        transform: scale(1.02); 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); 
      }

      .product-card img {
        width: 100%;
        height: auto;
        margin-bottom: 2px; 
        border-bottom: 1px solid #eaeaea; 
        border-radius: 1px;
        overflow: hidden;
      }

      .product-card h3 {
        font-family: "Roboto", sans-serif; 
        font-size: 14px;
        color: #333; 
        font-weight: 400; 
        padding: 2px 4px;
        line-height: 1.4; 
        max-height: 40px; 
        overflow: hidden; 
        text-overflow: ellipsis;
        display: -webkit-box; 
        -webkit-line-clamp: 2; 
        -webkit-box-orient: vertical; 
      }

      .product-card p {
        font-family: "Roboto", sans-serif;
        font-size: 18px; 
        color: #0038ae; 
        font-weight: bold; 
        padding: 2px 4px;
        text-align: left; 
        min-height: 24px; 
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
        color: #0038ae;
      }

      .heart-icon.favorited::after {
        content: "♥"; 
        color: #0038ae; 
        font-size: 20px;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .carousel-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        background-color: rgba(0, 0, 0, 0.1);
        color: #333;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .carousel-btn:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }

      .carousel-btn.left {
        left: 10px;
      }

      .carousel-btn.right {
        right: 10px;
      }

      @media (max-width: 768px) {
        .product-card {
          flex: 0 0 calc(100% / 2);
        }
      }

      @media (max-width: 480px) {
        .product-card {
          flex: 0 0 100%;
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
    const productWidth = $(".product-card").outerWidth(true);
    const visibleWidth = $(".carousel-container").outerWidth();
    const totalWidth = productWidth * $(".product-card").length;

    const currentScroll =
      parseInt(carousel.css("transform").split(",")[4]) || 0;

    let maxScroll = -(totalWidth - visibleWidth);
    maxScroll -= 100;

    let newScrollPosition = currentScroll + direction * productWidth;

    if (newScrollPosition > 0) {
      newScrollPosition = 0;
    }

    if (Math.abs(newScrollPosition) > Math.abs(maxScroll)) {
      newScrollPosition = maxScroll;
    }

    carousel.css("transform", `translateX(${newScrollPosition}px)`);

    console.log(
      `Current Scroll: ${currentScroll}, New Scroll: ${newScrollPosition}`
    );
  };

  const toggleFavorite = (e) => {
    const heartIcon = $(e.target);
    const productCard = heartIcon.closest(".product-card");
    const product = {
      id: productCard.data("id"),
      name: productCard.find("h3").text(),
      img: productCard.find("img").attr("src"),
      price: productCard.find("p").text(),
      url: productCard.find("a").attr("href"),
    };

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = favorites.some((fav) => fav.id === product.id);

    if (exists) {
      favorites = favorites.filter((fav) => fav.id !== product.id);
      heartIcon.removeClass("favorited");
    } else {
      favorites.push(product);
      heartIcon.addClass("favorited");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.forEach((fav) => {
      const heartIcon = $(`.product-card[data-id="${fav.id}"] .heart-icon`);
      heartIcon.addClass("favorited");
    });
  };

  $(document).ready(() => {
    init();
  });
})();
