# ShopEase

A front-end e-commerce single-page application built with React 19, Vite, React Router, and Firebase Authentication. Product catalog data is retrieved from the FakeStore REST API, state is shared across views using React Context API, and cart items persist in the browser via `localStorage`.

---

## Overview

ShopEase was developed to implement and test core React patterns in a realistic application flow:
- Fetching and displaying remote API data.
- Global client-side state management without third-party state libraries (Redux/Zustand).
- Multi-page navigation, dynamic routing, and protected routes using React Router.
- Authentication lifecycle handling with Firebase Auth (Sign up, Sign in, Profile updates, and Session listener).
- Full shopping cart logic (quantity controls, price math, and browser persistence).
- Component-scoped CSS organization and animation effects using Framer Motion.

---

## Screenshots

<!-- Add your screenshots below once ready -->
> _Screenshot placeholders: Add images to an `assets/` or `screenshots/` directory and link them here._
>
> Example: `![ShopEase Home](screenshots/home.png)`

---

## Features

### Product Catalog & Details
- **Remote Data Fetching:** Fetches a list of 20 products from FakeStore API on initial load with a loading state.
- **Search Filter:** Real-time text search that filters products by title.
- **Category Filter:** Quick-filter buttons for `all`, `men's clothing`, `women's clothing`, `jewelery`, and `electronics`.
- **Dynamic Product View (`/products/:id`):** Reads the product `id` from URL parameters using `useParams` and looks up the corresponding item from global state.

### Shopping Cart System
- **Add to Cart:** Clicking "Add to Cart" checks if the item already exists in the cart:
  - If yes: increments item `quantity` by 1.
  - If no: adds the product object with `quantity: 1`.
- **Quantity Adjustments:** Users can increment (`+`) or decrement (`-`) quantities directly from the cart view.
- **Automatic Deletion:** Decreasing an item's quantity to 0 automatically removes it from the cart array.
- **Direct Removal:** Dedicated delete button (`×`) removes an item regardless of quantity.
- **Cart Persistence:** Cart state is initialized from `localStorage` on load and automatically synced whenever cart items change.
- **Calculations:** Real-time recalculation of item subtotal (`price * quantity`), cart total, and item badge counts in the navigation bar.
- **Clear Cart:** Single-action button to empty the cart completely.

### User Authentication & Protected Routes
- **Registration (`/register`):** Creates accounts via Firebase `createUserWithEmailAndPassword`, and immediately saves the chosen username to the Firebase profile via `updateProfile`.
- **Login (`/login`):** Authenticates existing users with `signInWithEmailAndPassword`, providing user-friendly error messages for invalid credentials.
- **Session Persistence:** An active listener (`onAuthStateChanged`) monitors login state across page refreshes.
- **Context-Aware Navigation:** The navigation bar conditionally renders user greeting and a "Logout" button when authenticated, or "Login" / "Register" links when logged out.
- **Protected Checkout (`/checkout`):** Wrapped with a custom `<ProtectedRoute>` component. If an unauthenticated visitor attempts to access the checkout route, they are redirected to `/login`.

### Checkout Flow
- **Order Summary:** Displays itemized list of products in the cart, item count, subtotal, fixed shipping fee ($10), and grand total.
- **Shipping Information Form:** Captures recipient name, email, phone, street address, city, and payment method selection.
- **Order Simulation:** Submitting the checkout form clears the cart from state and `localStorage`, then renders a success confirmation view.

### Routing & UI Polish
- **Custom 404 Route (`*`):** Renders a styled `<NotFound />` component for any undefined URLs, with a link back to the homepage.
- **Smooth Animations:** Framer Motion provides staggered card entrances, hover lifts, button tap scaling, and smooth error alert mounts.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core UI library (functional components, hooks, Context API) |
| **Vite 8** | Development server, module bundler, and build tool |
| **React Router v6** | Client-side routing, route parameters, redirects, and route guarding |
| **Firebase Auth v13** | User account creation, authentication, profile updates, and session listening |
| **Framer Motion** | Micro-interactions and UI entrance/exit animations |
| **React Icons (fa6)** | Icons for cart and user interface elements |
| **Vanilla CSS** | Component-specific stylesheets stored in a centralized directory |

---

## Project Structure

```text
ShopEase---React-E-Commerce-Web-App_Simpel/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable and page-level React components
│   │   ├── AuthDetails.jsx      # Standalone user account details component
│   │   ├── Cart.jsx             # Shopping cart page with quantity controls
│   │   ├── CheckOutPage.jsx     # Shipping address form and order review
│   │   ├── Home.jsx             # Basic home view component
│   │   ├── LoginPage.jsx        # Login form with Firebase signIn handler
│   │   ├── NavBar.jsx           # Top navigation bar with auth & cart indicators
│   │   ├── NotFound.jsx         # 404 fallback page for unmatched routes
│   │   ├── ProductDetails.jsx   # Individual product view using useParams
│   │   ├── ProductList.jsx      # Product grid with search and category filters
│   │   ├── ProtectedRoute.jsx   # Route guard redirecting guests to /login
│   │   ├── RegisterPage.jsx     # Registration form with Firebase create/update
│   │   └── firebase.js          # Firebase app initialization and auth export
│   │
│   ├── context/             # Global state architecture
│   │   ├── ProductContext.js    # Context creation (kept in pure JS for Fast Refresh)
│   │   └── ProductProvider.jsx  # Provider component containing state & action handlers
│   │
│   ├── styles/              # Dedicated stylesheets per component
│   │   ├── AuthDetails.css
│   │   ├── Cart.css
│   │   ├── CheckOutPage.css
│   │   ├── LoginPage.css
│   │   ├── NavBar.css
│   │   ├── NotFound.css
│   │   ├── ProductDetails.css
│   │   ├── ProductList.css
│   │   └── RegisterPage.css
│   │
│   ├── App.css              # Application-level styling
│   ├── App.jsx              # Main router definition and context wrapping
│   ├── index.css            # Base CSS reset, typography, and container layout
│   └── main.jsx             # Application root rendering into index.html
│
├── index.html               # Main HTML entry point
├── package.json             # Scripts and dependency declarations
├── eslint.config.js         # ESLint configuration
└── vite.config.js           # Vite build configuration
```

---

## How It Works

### 1. Global State Management (`ProductProvider.jsx` & `ProductContext.js`)
All shared application state lives in `<ProductProvider />`, which wraps the `<BrowserRouter />` and entire component tree in `App.jsx`.

```
ProductProvider (owns state: products, cart, user, loading, authLoading)
  └── App Container
        ├── NavBar (consumes user, logout, cart)
        └── Routes
              ├── ProductList (consumes products, addToCart, loading)
              ├── ProductDetails (consumes products, addToCart)
              ├── Cart (consumes cart, quantity controls, clearCart)
              └── CheckOutPage (consumes cart, clearCart, user)
```

To comply with Vite's React Fast Refresh ESLint rule (`react-refresh/only-export-components`), the Context definition is separated:
- `ProductContext.js` only exports `createContext()`.
- `ProductProvider.jsx` only exports the React provider component.

### 2. Product Data Flow
1. On initial mount of `ProductProvider`, an async `fetchProducts()` call requests data from `https://fakestoreapi.com/products`.
2. `loading` is set to `true` while the request is in flight.
3. Upon response, data is stored in `products` state, and `loading` is set to `false`.
4. `ProductList.jsx` receives `products`, runs local search and category filter checks, and maps the filtered array into product card components.
5. In `ProductDetails.jsx`, the route parameter `:id` is parsed via `parseInt(useParams().id)` and matched against `products.find()`.

### 3. Shopping Cart & LocalStorage
- **Initialization:** The `cart` state uses lazy initialization inside `useState`:
  ```javascript
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  ```
- **Sync:** A `useEffect` hook with `[cart]` as a dependency serializes the array to `localStorage.setItem("cart", JSON.stringify(cart))` on every change.
- **Quantity Updates:** Actions use functional state updates (`setCart(prevCart => ...)`) to avoid race conditions.

### 4. Authentication Lifecycle
- `onAuthStateChanged(auth, callback)` runs once inside `ProductProvider`.
- When a user signs in or registers, Firebase notifies the listener and updates `user`.
- `authLoading` is set to `false` after the first auth event fires, preventing flash redirects in `<ProtectedRoute />`.
- Logging out triggers `signOut(auth)`, which resets `user` to `null` across all components.

### 5. Route Protection (`ProtectedRoute.jsx`)
`ProtectedRoute` acts as a wrapper around private views:
```jsx
<Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <CheckOutPage />
    </ProtectedRoute>
  }
/>
```
If `authLoading` is active, it renders a brief loading notice. If `user` is `null`, it renders `<Navigate to="/login" replace />`. If `user` exists, it renders the protected child component.

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ali-Tobar/ShopEase---React-E-Commerce-Web-App_Simpel.git
   cd ShopEase---React-E-Commerce-Web-App_Simpel
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to the local URL displayed in your terminal (usually `http://localhost:5173/`).

---

## Firebase Configuration

This project uses Firebase Authentication for user accounts.

Firebase configuration is initialized in `src/components/firebase.js`:
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

### Enabling Authentication in Firebase Console:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create or select a Firebase project.
3. In the left sidebar, navigate to **Build** > **Authentication**.
4. Click the **Sign-in method** tab.
5. Enable **Email/Password** as a provider.

> **Note on Security:** For production deployments or public repositories, it is recommended to move these credentials into an untracked `.env` file (e.g. `VITE_FIREBASE_API_KEY`) and add `.env` to `.gitignore`.

---

## Available Scripts

In the project root, you can run:

- `npm run dev`: Starts the local Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles production-ready bundle files into the `dist/` directory.
- `npm run lint`: Runs ESLint to verify code style and check for syntax or React hook errors.
- `npm run preview`: Locally serves the production build from `dist/` to verify behavior before deployment.

---

## Important Implementation Notes

1. **Context & Provider Separation:**
   `ProductContext` is separated from `ProductProvider` into two distinct files (`ProductContext.js` and `ProductProvider.jsx`). This prevents ESLint from flagging non-component exports in JSX files under the `react-refresh/only-export-components` rule.

2. **String to Number Conversion in Dynamic Routes:**
   URL parameters obtained via `useParams()` are always strings (e.g. `"1"`). Because FakeStore API returns numerical IDs (`1`), comparison requires `parseInt(id)`:
   ```javascript
   const product = products.find((item) => item.id === parseInt(id));
   ```

3. **Lazy Initial State for LocalStorage:**
   Passing a callback function to `useState(() => ...)` ensures `localStorage.getItem` is only executed once during mounting, rather than on every re-render.

4. **ProductList Filename Compatibility:**
   `src/components/ProductList.jsx` handles catalog logic. `src/components/ProsuctList.jsx` re-exports `ProductList` to maintain backward compatibility with previous imports.

---

## Known Limitations

- **Simulated Checkout:** Placing an order clears the cart and displays a confirmation message, but does not interact with a payment processor (Stripe/PayPal) or save the order to a database.
- **Read-Only API:** Product data comes from FakeStore API, which does not support persistent creation or editing of products on the live server.
- **Fixed Shipping Cost:** Shipping is hardcoded to $10 whenever cart total is greater than zero.
- **Client-Side Auth State:** User profiles are stored in Firebase Auth, but additional customer metadata (order history, saved addresses) is not yet stored in a database (such as Cloud Firestore).

---

## Future Improvements

- [ ] Connect Cloud Firestore to store past orders and user shipping addresses.
- [ ] Implement pagination or infinite scroll for product catalogs with large datasets.
- [ ] Add toast notifications for cart actions ("Item added to cart") instead of basic alert modals.
- [ ] Move Firebase config values into Vite environment variables (`.env`).
- [ ] Add unit and component tests using Vitest and React Testing Library.
- [ ] Integrate a payment gateway test mode (e.g. Stripe Elements).

---

## Author

- **Developer:** [Ali Tobar](https://github.com/Ali-Tobar)
- **Project Repository:** [ShopEase---React-E-Commerce-Web-App_Simpel](https://github.com/Ali-Tobar/ShopEase---React-E-Commerce-Web-App_Simpel)
