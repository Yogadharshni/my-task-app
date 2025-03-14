import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


// import { Button, ButtonGroup, Grid, Typography, TextField, MenuItem, Card, CardMedia, CardContent, CardActions, Container, AppBar, Toolbar, IconButton, Badge, CircularProgress, Skeleton } from "@mui/material";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import { createContext, useContext, useEffect, useState } from "react";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import axios from "axios";

// const CartContext = createContext();
// const useCart = () => useContext(CartContext);

// const App = () => {
//   return (
//     <CartProvider>
//       <Router>
//         <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
//           <Toolbar>
//             <Typography 
//               variant="h6" 
//               sx={{ flexGrow: 1, fontWeight: "bold" }} 
//               component={Link} 
//               to="/" 
//               style={{ textDecoration: "none", color: "white" }}
//             >
//               Product Store
//             </Typography>
//             <CartIcon />
//           </Toolbar>
//         </AppBar>
//         <Container sx={{ mt: 4 }}>
//           <Routes>
//             <Route path="/" element={<ProductList />} />
//             <Route path="/cart" element={<Cart />} />
//           </Routes>
//         </Container>
//       </Router>
//     </CartProvider>
//   );
// };

// const CartIcon = () => {
//   const { cart } = useCart();
//   const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
//   return (
//     <IconButton color="inherit" component={Link} to="/cart">
//       <Badge badgeContent={cartCount} color="secondary">
//         <ShoppingCartIcon />
//       </Badge>
//     </IconButton>
//   );
// };

// const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   const addToCart = (product) => {
//     setCart((prev) => {
//       const existing = prev.find((item) => item.id === product.id);
//       return existing
//         ? prev.map((item) =>
//             item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//           )
//         : [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// const ProductList = () => {
//   const { addToCart } = useCart();
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(`https://dummyjson.com/products?limit=10&skip=${(page - 1) * 10}`)
//       .then((res) => {
//         setProducts(res.data.products);
//         setTotalPages(Math.ceil(res.data.total / 10));
//       })
//       .catch((error) => console.error("Error fetching products:", error))
//       .finally(() => setLoading(false));
//   }, [page]);

//   // Apply sorting and search
//   const filteredProducts = [...products]
//     .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
//     .sort((a, b) => (sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : 0));

//   return (
//     <>
//       {/* Search & Sorting */}
//       <TextField
//         fullWidth
//         placeholder="Search..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         select
//         fullWidth
//         value={sort}
//         onChange={(e) => setSort(e.target.value)}
//         sx={{ mb: 2 }}
//       >
//         <MenuItem value="">None</MenuItem>
//         <MenuItem value="low">Price: Low to High</MenuItem>
//         <MenuItem value="high">Price: High to Low</MenuItem>
//       </TextField>

//       {/* Product Grid */}
//       <Grid container spacing={2}>
//         {loading
//           ? Array.from(new Array(10)).map((_, index) => (
//               <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
//                 <Skeleton variant="rectangular" height={250} />
//                 <Skeleton />
//                 <Skeleton width="60%" />
//               </Grid>
//             ))
//           : filteredProducts.map((product) => (
//               <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
//                 <Card>
//                   <CardMedia
//                     component="img"
//                     height="140"
//                     image={product.images[0]}
//                     alt={product.title}
//                     onLoad={() => setLoading(false)}
//                   />
//                   <CardContent>
//                     <Typography variant="h6">{product.title}</Typography>
//                     <Typography variant="body2">${product.price}</Typography>
//                     <Typography variant="body2">Stock: {product.stock}</Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button 
//                       variant="contained" 
//                       disabled={product.stock === 0} 
//                       onClick={() => addToCart(product)}
//                     >
//                       {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))}
//       </Grid>
      
//       {/* Pagination */}
//       <Grid container justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
//         <ButtonGroup>
//           <Button 
//             variant="contained" 
//             disabled={page === 1} 
//             onClick={() => setPage(page - 1)}
//             sx={{ fontSize: "1rem", fontWeight: "bold", textTransform: "none" }}
//           >
//             Previous
//           </Button>
//           <Typography variant="h6" sx={{ mx: 2, display: "flex", alignItems: "center" }}>
//             Page {page} of {totalPages}
//           </Typography>
//           <Button 
//             variant="contained" 
//             disabled={page === totalPages} 
//             onClick={() => setPage(page + 1)}
//             sx={{ fontSize: "1rem", fontWeight: "bold", textTransform: "none" }}
//           >
//             Next
//           </Button>
//         </ButtonGroup>
//       </Grid>
//     </>
//   );
// };

// const Cart = () => {
//   const { cart, addToCart, removeFromCart } = useCart();
  
//   return (
//     <>
//       {cart.length ? (
//         cart.map((item) => (
//           <Card key={item.id} sx={{ mb: 2 }}>
//             <CardContent>
//               <Typography variant="h6">{item.title} (x{item.quantity})</Typography>
//               <Typography>${item.price * item.quantity}</Typography>
//             </CardContent>
//             <CardActions>
//               <Button variant="outlined" onClick={() => removeFromCart(item.id)}>-</Button>
//               <Typography>{item.quantity}</Typography>
//               <Button variant="outlined" onClick={() => addToCart(item)}>+</Button>
//             </CardActions>
//           </Card>
//         ))
//       ) : (
//         <Typography>No items in cart.</Typography>
//       )}
//     </>
//   );
// };

// export default App;
