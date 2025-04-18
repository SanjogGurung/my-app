// src/components/CartDrawer.jsx
import { Drawer, Button, Typography, Box, IconButton, Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, deleteItem, clearCart } from '../redux/store/cartSlice';
import CloseIcon from '@mui/icons-material/Close';

export default function CartDrawer({ isOpen, onClose }) {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 350, padding: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Your Cart ({cart.totalQuantity})</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {cart.items.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          <>
            {cart.items.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Typography>{item.name}</Typography>
                <Typography>
                  {item.quantity} × ${item.price.toFixed(2)} = ${item.totalPrice.toFixed(2)}
                </Typography>
                <Button onClick={() => dispatch(removeItem(item.id))}>-</Button>
                <Button onClick={() => dispatch(deleteItem(item.id))}>Remove</Button>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Total: ${cart.totalPrice.toFixed(2)}</Typography>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => dispatch(clearCart())}
              sx={{ mt: 2 }}
            >
              Clear Cart
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
}