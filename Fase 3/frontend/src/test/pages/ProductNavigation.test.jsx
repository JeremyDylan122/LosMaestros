import React from 'react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Link, useNavigate } from 'react-router-dom';
import { Products } from '../../pages/Products';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { storageService } from '../../services/storageService';

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(productService, 'fetchProducts').mockImplementation(async () => productService.getProducts());
  vi.spyOn(productService, 'fetchCategories').mockResolvedValue(['Materiales de Construcción', 'Pinturas']);
});
afterEach(() => vi.restoreAllMocks());
function Navigation() {
  const navigate = useNavigate();
  return <><Link to="/productos">Catálogo completo</Link><button onClick={() => navigate(-1)}>Volver</button></>;
}
function setup(entries) {
  render(<MemoryRouter initialEntries={entries}><AuthProvider><CartProvider><Navigation /><Products /></CartProvider></AuthProvider></MemoryRouter>);
}
describe('Filtros del catálogo y navegación', async () => {
  it('retira la categoría anterior cuando se vuelve al catálogo sin filtros', async () => {
    setup(['/productos?categoria=Pinturas']);
    expect((await screen.findByLabelText('Categoría de Ferretería'))).toHaveValue('Pinturas');
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo completo' }));
    expect((await screen.findByLabelText('Categoría de Ferretería'))).toHaveValue('ALL');
    expect(screen.getAllByTestId(/^product-card-/)).toHaveLength(27);
  });
  it('no conserva ofertas activas después de volver al catálogo completo', async () => {
    setup(['/productos?ofertas=true']);
    expect((await screen.findByRole('checkbox', { name: /Solo Productos en Oferta/ }))).toBeChecked();
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo completo' }));
    expect((await screen.findByRole('checkbox', { name: /Solo Productos en Oferta/ }))).not.toBeChecked();
    expect(screen.getAllByTestId(/^product-card-/)).toHaveLength(27);
  });
  it('recupera el término de búsqueda al retroceder en el navegador', async () => {
    setup(['/productos?buscar=cemento', '/productos?buscar=pintura']);
    expect((await screen.findByLabelText('Buscar Producto / Código'))).toHaveValue('pintura');
    fireEvent.click(screen.getByRole('button', { name: 'Volver', exact: true }));
    expect((await screen.findByLabelText('Buscar Producto / Código'))).toHaveValue('cemento');
  });
  it('ordena por el precio con descuento que paga el cliente', async () => {
    const [first, second] = productService.getProducts();
    storageService.set('products', [{ ...first, precio: 100, enOferta: true, descuento: 50 }, { ...second, precio: 80, enOferta: false }]);
    setup(['/productos']);
    fireEvent.change((await screen.findByLabelText('Ordenar por Precio')), { target: { value: 'price-asc' } });
    expect(screen.getAllByTestId(/^product-card-/)[0]).toHaveAttribute('data-testid', `product-card-${first.id}`);
  });
});
