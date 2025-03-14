import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Badge,
  IconButton,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import { InputAdornment } from "@mui/material";

const CartContext = createContext();
const useCart = () => useContext(CartContext);

const App = () => {
  return (
    <CartProvider>
      <Router>
        <AppBar
          position="sticky"
          sx={{
            zIndex: 10,
            background: "linear-gradient(45deg, #40a7ff, #3F51B5)",
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
              component={Link}
              to="/"
              style={{ textDecoration: "none", color: "white" }}
            >
              Product Store
            </Typography>
            <CartIcon />
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Container>
      </Router>
    </CartProvider>
  );
};

const CartIcon = () => {
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <IconButton color="inherit" component={Link} to="/cart">
      <Badge badgeContent={cartCount} color="secondary">
        <ShoppingCartIcon sx={{ fontSize: 30 }} />
      </Badge>
    </IconButton>
  );
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev?.find((item) => item.id === product.id);
      return existing
        ? prev?.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
    });

    setProducts((prev) =>
      prev?.map((item) =>
        item.id === product.id ? { ...item, stock: item.stock - 1 } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const itemToRemove = prev?.find((item) => item.id === id);
      if (!itemToRemove) return prev;

      if (itemToRemove.quantity > 1) {
        return prev?.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev?.filter((item) => item.id !== id);
      }
    });

    setProducts((prev) =>
      prev?.map((item) =>
        item.id === id ? { ...item, stock: item.stock + 1 } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, products, setProducts }}
    >
      {children}
    </CartContext.Provider>
  );
};

const ProductList = () => {
  const { addToCart, removeFromCart, cart, products, setProducts } = useCart();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://dummyjson.com/products?limit=${productsPerPage}&skip=${
          (page - 1) * productsPerPage
        }`
      );
      setProducts(res.data.products);
      setTotalProducts(res.data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const filteredProducts = [...products]
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
        ? b.price - a.price
        : 0
    );

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const getCartQuantity = (productId) => {
    const cartItem = cart.find((item) => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ddd",
              },
              "&:hover fieldset": {
                borderColor: "#aaa",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3F51B5",
              },
            },
            transition: "all 0.3s",
            marginBottom: 2,
          }}
          InputProps={{
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearch("")}
                  edge="end"
                  size="small"
                  sx={{ color: "gray" }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          fullWidth
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          label="Sort by"
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            marginBottom: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ddd",
              },
              "&:hover fieldset": {
                borderColor: "#aaa",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3F51B5",
              },
            },
          }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="low">Price: Low to High</MenuItem>
          <MenuItem value="high">Price: High to Low</MenuItem>
        </TextField>
      </div>

      {/* Display Products */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderRadius: 2,
                boxShadow: 6,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)", boxShadow: 12 },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.images[0]}
                alt={product.title}
                sx={{
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  {product.title}
                </Typography>
                <Typography variant="body2" color="primary">
                  ${product.price}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Stock: {product.stock}
                </Typography>
              </CardContent>

              {getCartQuantity(product.id) > 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: "center", 
                    marginTop: "16px",
                    padding: "8px",
                    borderRadius: "8px",
                    boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9", 
                    "&:hover": {
                      backgroundColor: "#e0e0e0", 
                      boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)", 
                    },
                  }}
                >
                  {/* "-" Button */}
                  <Button
                    variant="outlined"
                    onClick={() => removeFromCart(product.id)}
                    disabled={getCartQuantity(product.id) == 0}
                    sx={{
                      minWidth: 30,
                      height: 30,
                      borderRadius: 2,
                      "&:disabled": {
                        backgroundColor: "#ddd",
                        color: "#aaa", 
                      },
                      "&:hover": {
                        backgroundColor: "#1976d2", 
                        borderColor: "#1976d2",
                        color: "white", 
                      },
                    }}
                  >
                    -
                  </Button>

                  {/* Quantity */}
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {getCartQuantity(product.id)}
                  </Typography>

                
                  <Button
                    variant="outlined"
                    onClick={() => addToCart(product)}
                    disabled={product.stock == 0}
                    sx={{
                      minWidth: 30,
                      height: 30,
                      borderRadius: 2,
                      "&:disabled": {
                        backgroundColor: "#ddd",
                        color: "#aaa", 
                      },
                      "&:hover": {
                        backgroundColor: "#1976d2",
                        borderColor: "#1976d2", 
                        color: "white", 
                      },
                    }}
                  >
                    +
                  </Button>
                </div>
              ) : (
                <div style={{ padding: "10px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    sx={{
                      borderRadius: 2,
                      "&:hover": { backgroundColor: "#3F51B5", boxShadow: 3 },
                    }}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Controls */}
      <div style={{ margin: "10px" }}>
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              sx={{
                padding: "6px 12px",
                borderRadius: 2,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1976d2" },
                fontSize: "0.875rem",
              }}
            >
              Previous
            </Button>
          </Grid>
          <Grid item sx={{ display: "flex", alignItems: "center", mx: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Page {page} of {totalPages}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || loading}
              sx={{
                padding: "6px 12px",
                borderRadius: 2,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1976d2" },
                fontSize: "0.875rem",
              }}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </div>

\
      {loading && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress sx={{ color: "#3F51B5" }} />
        </Grid>
      )}
    </>
  );
};

const Cart = () => {
  const { cart, addToCart, removeFromCart } = useCart();

  return (
    <Paper sx={{ p: 3, boxShadow: 6, borderRadius: 2 }}>
      {cart?.length ? (
        cart?.map((item) => (
          <Card
            key={item.id}
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              boxShadow: 3,
            }}
          >
            <Box>
              <Typography variant="h6">
                {item.title} (x{item.quantity})
              </Typography>
              <Typography>${item.price * item.quantity}</Typography>
            </Box>
            <CardActions>
              <Button
                variant="outlined"
                onClick={() => removeFromCart(item.id)}
              >
                -
              </Button>
              <Typography>{item.quantity}</Typography>
              <Button variant="outlined" onClick={() => addToCart(item)}>
                +
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography>No items in cart.</Typography>
      )}
    </Paper>
  );
};

export default App;
