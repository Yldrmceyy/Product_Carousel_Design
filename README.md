# Product Carousel Project

## Overview

This project involves creating a **Product Carousel** for a product page on [LC Waikiki](https://www.lcwaikiki.com). The goal is to replicate the carousel design visible on LC Waikiki’s product pages with enhanced interactivity and responsiveness.

---

## Features

1. **Dynamic Product Fetching**

   - Fetches a product list using a GET request from:
     ```
     https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json
     ```
   - Retrieves the product list from `localStorage` if available.

2. **Carousel Design**

   - Displays 6.5 products in the carousel at a time.
   - Smooth navigation for one product to the left or right with arrow buttons.

3. **Interactive Features**

   - Clicking a product opens its respective page in a new tab.
   - Clicking the heart icon toggles favorite status:
     - **Unselected**: Displays a bordered heart.
     - **Selected**: Displays a **filled blue heart**.
   - Favorite preferences are stored in `localStorage` and retained after page refresh.

4. **Responsiveness**

   - Supports desktop, tablet, and mobile devices.
   - Dynamically adjusts visible product count based on screen size.

5. **Customizable**
   - Developed using only **JavaScript** and **jQuery**.
   - Fully customizable CSS created dynamically using JavaScript.

---

## Technical Details

### File Description

- **Main JavaScript File**: Contains the core logic for fetching, rendering, and managing the carousel and interactivity.
- **Dynamic CSS**: CSS styles are appended dynamically for easy integration.

### Functionality Highlights

- **Initialization**: Fetches product data and builds the HTML and CSS structure on runtime.
- **Scroll Behavior**:
  - Implements smooth transitions.
  - Ensures no partial products are visible at the start or end of the carousel.
- **Favorites Management**:
  - Handles click events for toggling the heart icon state.
  - Syncs with `localStorage` to persist user preferences.

---

## How to Use

1. **Include jQuery**:
   Add the following script to ensure jQuery is available:
   ```html
   <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
   ```
2. **Execute the Script**:

   - Open Chrome Developer Tools.
   - Paste the script code into the Console and run.

3. **Integration**:

   - Ensure the website includes a .product-detail element where the carousel will be appended

## Requirements

- Use JavaScript and jQuery only.
- Avoid third-party libraries such as Bootstrap or Swiper.
- The carousel should:
  - Be responsive across devices.
  - Provide a smooth scrolling experience.
  - Display and retain favorite states using localStorage.
