
# 🛠 Technical Requirements Document (TRD)
**Feature Name:** Smart Compare  
**Document Owner:** Engineering Lead / Technical Product Manager  
**Related PRD:** Smart Compare Feature (V1)  

## 1. System Architecture Overview
For V1, the comparison feature will primarily rely on **client-side state management**. To ensure high performance and low latency, we do not need to create permanent database records for user comparison lists unless persistence across devices is required. 

*   **Guest Users:** Comparison list stored in `localStorage` or session state.
*   **Logged-in Users:** State can be synced to user preferences (optional for V1, otherwise use `localStorage`).
*   **Data Fetching:** When entering the comparison view, the frontend will call a batch API endpoint to retrieve the latest Price, Rating, and Stock status.

## 2. Frontend Implementation (Web & Mobile)
**State Management:**
*   Implement a global state (e.g., Redux, React Context, or Vuex) to manage the `compareList` array containing `product_id`s.
*   Maximum array length enforced at the state mutation level: 4 for Desktop, 2 for Mobile.

**Key Components to Build:**
1.  **Compare Checkbox/Button:** Added to Product Card component. Dispatches `ADD_TO_COMPARE` or `REMOVE_FROM_COMPARE`.
2.  **Sticky Compare Tray (Widget):** A floating action bar that reads the `compareList` length. Opens the comparison modal or navigates to `/compare`.
3.  **Comparison View (Grid):** 
    *   Use **CSS Grid** for the side-by-side layout to easily handle dynamic columns (2 to 4 columns).
    *   Mobile view: Implement a CSS Snap Scroll or horizontal overflow (`overflow-x: auto`) to allow swiping through products if more than 2 are allowed in future iterations.

## 3. API & Backend Requirements
We need a lightweight endpoint to fetch the specific data points for the comparison view. Reusing the standard Product Details endpoint might over-fetch data, so a dedicated lightweight batch endpoint is recommended.

**Endpoint:** `GET /api/v1/products/compare`
*   **Query Parameters:** `?ids=101,102,103` (Comma-separated product IDs)
*   **Rate Limiting:** Standard rate limits apply. Max 4 IDs per request.
*   **Response Payload (JSON):**
```json
{
  "success": true,
  "data": [
    {
      "product_id": "101",
      "title": "Wireless Noise-Cancelling Headphones",
      "image_url": "https://cdn.example.com/images/101.jpg",
      "price": {
        "currency": "USD",
        "current_price": 199.99,
        "original_price": 249.99,
        "discount_percentage": 20
      },
      "ratings": {
        "average_score": 4.5,
        "total_reviews": 1204
      },
      "stock_status": "IN_STOCK"
    }
  ]
}
```

## 4. Data Models / Database Impact
**No schema changes required for V1.** 
All data (Price, Ratings, Images) already exists in the `Products` and `Reviews` tables. 
*(Note for V2: If we want cross-device sync for logged-in users, we will need to add a `user_comparisons` table or add a JSON column to the `user_profiles` table).*

## 5. Security & Performance Considerations
*   **Caching:** Since pricing and inventory change, the `/compare` endpoint response should be cached via Redis, but with a short TTL (e.g., 5-10 minutes) to prevent users from seeing outdated prices or out-of-stock items as available.
*   **Input Validation:** The backend must sanitize the `ids` query parameter to prevent SQL injection or bad requests. Reject requests with more than 4 IDs.
*   **Lazy Loading:** Product images in the comparison table should be lazy-loaded to optimize LCP (Largest Contentful Paint).

## 6. Edge Cases to Handle
1.  **Item goes out of stock:** If a user has an item in their local comparison list, but it goes out of stock before they view the compare page, the UI must render an "Out of Stock" disabled state instead of the "Add to Cart" button.
2.  **Deleted Products:** If a `product_id` in `localStorage` no longer exists in the database (404), the backend should simply omit it from the response, and the frontend should silently remove that ID from the local state.
3.  **Varying Currencies:** If the platform supports multiple currencies, ensure all compared items are returned in the user's currently selected currency.