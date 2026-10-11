import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { productService } from '../services/productService';

const CartContext = createContext();

const CART_STORAGE_KEY = 'carrito_v2';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    return storageService.get(CART_STORAGE_KEY, []);
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    storageService.set(CART_STORAGE_KEY, cartItems);
  }, [cartItems]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  /**
   * Agrega un producto al carrito respetando el stock disponible
   * @param {Object} product 
   * @param {number} quantity 
   * @returns {boolean}
   */
  const addToCart = (product, quantity = 1) => {
    // Verificar stock fresco desde productService
    const freshProduct = productService.getProductById(product.id) || product;

    if (freshProduct.stock <= 0) {
      showNotification(`No hay stock disponible para ${freshProduct.nombre}.`, 'danger');
      return false;
    }

    const existingIndex = cartItems.findIndex(it => Number(it.id) === Number(product.id));

    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].cantidad;
      const desiredQty = currentQty + quantity;

      if (desiredQty > freshProduct.stock) {
        showNotification(
          `Stock máximo alcanzado para ${freshProduct.nombre} (${freshProduct.stock} unidades en bodega).`,
          'warning'
        );
        return false;
      }

      const updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        cantidad: desiredQty,
        stock: freshProduct.stock,
        precio: freshProduct.precio
      };
      setCartItems(updated);
      showNotification(`Se agregaron ${quantity} unidad(es) de ${freshProduct.nombre}.`, 'success');
      return true;
    } else {
      if (quantity > freshProduct.stock) {
        showNotification(
          `Solo hay ${freshProduct.stock} unidades disponibles de ${freshProduct.nombre}.`,
          'warning'
        );
        return false;
      }

      const newItem = {
        id: freshProduct.id,
        codigo: freshProduct.codigo,
        nombre: freshProduct.nombre,
        categoria: freshProduct.categoria,
        precio: freshProduct.precio,
        enOferta: freshProduct.enOferta,
        descuento: freshProduct.descuento,
        stock: freshProduct.stock,
        unidad: freshProduct.unidad,
        imagen: freshProduct.imagen,
        cantidad: quantity
      };

      setCartItems([...cartItems, newItem]);
      showNotification(`"${freshProduct.nombre}" agregado al carrito.`, 'success');
      return true;
    }
  };

  /**
   * Modifica la cantidad de un producto en el carrito (+1 o -1)
   * @param {number|string} productId 
   * @param {number} delta 
   */
  const updateQuantity = (productId, delta) => {
    const item = cartItems.find(it => Number(it.id) === Number(productId));
    if (!item) return;

    const freshProduct = productService.getProductById(productId);
    const stockMax = freshProduct ? freshProduct.stock : item.stock;

    const newQty = item.cantidad + delta;

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQty > stockMax) {
      showNotification(`No hay más existencias. Stock máximo: ${stockMax} unidades.`, 'warning');
      return;
    }

    setCartItems(cartItems.map(it => 
      Number(it.id) === Number(productId)
        ? { ...it, cantidad: newQty, stock: stockMax }
        : it
    ));
  };

  /**
   * Elimina un producto del carrito
   * @param {number|string} productId 
   */
  const removeFromCart = (productId) => {
    const item = cartItems.find(it => Number(it.id) === Number(productId));
    setCartItems(cartItems.filter(it => Number(it.id) !== Number(productId)));
    if (item) {
      showNotification(`"${item.nombre}" eliminado del carrito.`, 'info');
    }
  };

  /**
   * Vacía completamente el carrito
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Cálculos reactivos
  const totalCount = cartItems.reduce((acc, it) => acc + it.cantidad, 0);

  const totalPrice = cartItems.reduce((acc, it) => {
    const unitPrice = it.enOferta && it.descuento > 0
      ? Math.round(it.precio * (1 - it.descuento / 100))
      : it.precio;
    return acc + (unitPrice * it.cantidad);
  }, 0);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    totalPrice,
    isEmpty: cartItems.length === 0,
    notification,
    clearNotification: () => setNotification(null)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};
