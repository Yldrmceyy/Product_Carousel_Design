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
  background-color: #f9f9f9; /* Daha açık bir arka plan */
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-family: "Roboto", sans-serif; /* Adelle'ye benzeyen modern sans-serif yazı tipi */
  font-size: 24px; /* Başlık boyutu */
  font-weight: 300; /* Normal kalınlık */
  color: #333; /* Siyahımsı bir renk */
  text-align: left; /* Sol hizalama */
  padding-bottom: 20px; /* Alt boşluk */
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
  text-align: left; /* Ürün detaylarını sola hizala */
  border: 1px solid #eaeaea; /* Daha açık bir sınır */
  border-radius: 2px;
  position: relative;
 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* Daha hafif gölge */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: scale(1.02); /* Hover'da büyüme efekti */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Daha belirgin gölge */
}

.product-card img {
  width: 100%;
  height: auto;
  margin-bottom: 2px; 
  border-bottom: 1px solid #eaeaea; /* Resmin altında ince bir çizgi */
  border-radius: 1px;
}

.product-card h3 {
  font-family: "Roboto", sans-serif; /* Yazı tipi */
  font-size: 14px; /* Yazı boyutu */
  color: #333; /* Yazı rengi */
  font-weight: 400; /* Yazı kalınlığı */
  padding: 2px 4px;
  line-height: 1.4; 
  max-height: 40px; 
  overflow: hidden; 
  text-overflow: ellipsis; /* Uzun metinlerde üç nokta ekler */
  display: -webkit-box; /* Flex tabanlı görüntü */
  -webkit-line-clamp: 2; /* En fazla 2 satır */
  -webkit-box-orient: vertical; /* Metni dikeyde hizala */
}

.product-card p {
  font-family: "Roboto", sans-serif; /* Yazı tipi */
  font-size: 18px; /* Yazı boyutu */
  color: #0038ae; /* Fiyat rengi */
  font-weight: bold; /* Yazı kalınlığı */
  padding: 2px 4px;
  text-align: left; /* Sol hizalama */
  min-height: 24px; /* Sabit yükseklik, fiyatların hizalanması için */
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
  color: #0038ae

;
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
    const currentScroll =
      parseInt(carousel.css("transform").split(",")[4]) || 0;
    const maxScroll =
      productWidth * $(".product-card").length -
      $(".carousel-wrapper").outerWidth();

    let newScroll = currentScroll + direction * productWidth;

    // Clamp scroll position
    if (newScroll > 0) newScroll = 0;
    if (Math.abs(newScroll) > maxScroll) newScroll = -maxScroll;

    carousel.css("transform", `translateX(${newScroll}px)`);
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
