// Anonymous "self-invoking" function
(function() {
    var startingTime = new Date().getTime();
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 20);
        }
    };

    // Start polling...
    checkReady(function($) {
        $(function() {
            var endingTime = new Date().getTime();
            var tookTime = endingTime - startingTime;
            window.alert("jQuery is loaded, after " + tookTime + " milliseconds!");
        });
    });
})();


(() => {
    const init = async () => {
        const products = await fetchProducts();
        if (products) {
            buildHTML(products);
            buildCSS();
            setEvents();
            loadFavorites();
        } else {
            console.error("Products could not be fetched!");
        }
    };

    const fetchProducts = async () => {
        const localProducts = localStorage.getItem("products");
        if (localProducts) {
            return JSON.parse(localProducts);
        }
        try {
            const response = await fetch(
                "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
            );
            const products = await response.json();
            localStorage.setItem("products", JSON.stringify(products));
            return products;
        } catch (error) {
            console.error("Failed to fetch products:", error);
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
                                    <h4>${product.price} TRY</h4>
                                </a>
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
        $(".product-grid").append(html);
    };

    const buildCSS = () => {
        const css = `
            .carousel-container {
                position: relative;
                overflow: hidden;
                margin: 20px auto;
                width: 100%;
                padding: 10px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .carousel {
                display: flex;
                transition: transform 0.3s ease-in-out;
            }
            .product-card {
                flex: 0 0 calc(100% / 6.5);
                margin: 5px;
                text-align: center;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                background-color: #fff;
            }
            .product-card img {
                width: 100%;
                height: auto;
            }
            .product-card h3, .product-card h4 {
                margin: 5px 0;
            }
            .heart-icon {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 18px;
                color: #aaa;
            }
            .heart-icon.favorited {
                color: blue;
            }
            .carousel-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: #f15a24;
                color: white;
                border: none;
                border-radius: 50%;
                padding: 10px;
                cursor: pointer;
            }
            .carousel-btn.left {
                left: 10px;
            }
            .carousel-btn.right {
                right: 10px;
            }
        `;
        $("<style>").html(css).appendTo("head");
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
            $(`.product-card[data-id="${id}"] .heart-icon`).addClass(
                "favorited"
            );
        });
    };

    $(document).ready(() => {
        init();
    });
})();
