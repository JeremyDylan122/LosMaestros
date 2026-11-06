import { orderService } from '../../services/orderService';
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { productService } from '../../services/productService';
import { storageService } from '../../services/storageService';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AuthProvider } from '../../context/AuthContext';
import { serverSession, serverUsers } from '../helpers/serverSession';
import { userApiService } from '../../services/userApiService';

describe('Fase 3 - Módulo Catálogo e Inventario (Jeremy)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    storageService.clearAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Integración API REST asíncrona de Catálogo (productService)', () => {
    it('debe consultar productos desde API REST y actualizar almacenamiento local', async () => {
      const mockApiProducts = [
        { id: 101, codigo: 'FASE3-001', nombre: 'Pintura Epóxica Alto Tráfico', categoria: 'Pinturas', precio: 32990, stock: 40, stockMinimo: 10, enOferta: false }
      ];

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: mockApiProducts })
      });

      const prods = await productService.fetchProducts();
      expect(prods).toHaveLength(1);
      expect(prods[0].codigo).toBe('FASE3-001');

      // Verifica que storageService sincronizó los datos
      const local = storageService.get('products');
      expect(local.some(p => p.codigo === 'FASE3-001')).toBe(true);
    });

    it('debe crear un nuevo producto vía API REST POST', async () => {
      const nuevoProducto = {
        codigo: 'NUEVO-002',
        nombre: 'Soldadora Inverter 200A',
        categoria: 'Herramientas Eléctricas',
        precio: 149990,
        stock: 15,
        stockMinimo: 5
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => [{ id: 38, nombre: nuevoProducto.categoria }] }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...nuevoProducto, id: 202 })
      });

      const res = await productService.createProductApi(nuevoProducto, 'token-admin-jwt');
      expect(res.id).toBe(202);
      expect(res.codigo).toBe('NUEVO-002');
    });

    it('debe ajustar stock vía API REST PATCH', async () => {
      // Sembrar producto base
      productService.createProduct({
        codigo: 'ADJ-001',
        nombre: 'Tornillo Volcanita 6x1',
        categoria: 'Materiales de Construcción',
        precio: 1990,
        stock: 50,
        stockMinimo: 10
      });

      const prod = productService.getProductByCode('ADJ-001');

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...prod, stock: 70 })
      });

      const res = await productService.adjustStockApi(prod.id, 20, 'token-admin-jwt');
      expect(res.stock).toBe(70);
      expect(productService.getProductById(prod.id).stock).toBe(70);
    });

    it('debe eliminar producto vía API REST DELETE', async () => {
      const prod = productService.createProduct({
        codigo: 'DEL-001',
        nombre: 'Cinta Aisladora',
        categoria: 'Electricidad',
        precio: 990,
        stock: 20,
        stockMinimo: 5
      });

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 204
      });

      const ok = await productService.deleteProductApi(prod.id, 'token-admin-jwt');
      expect(ok).toBe(true);
      expect(productService.getProductById(prod.id)).toBeNull();
    });
  });

  describe('Restricción RBAC: VENDEDOR en modo sólo lectura en AdminDashboard', () => {
    function renderAdminDashboard(userSession, path = '/admin/productos') {
      vi.spyOn(productService, 'fetchProducts').mockResolvedValue(productService.getProducts());
      vi.spyOn(productService, 'fetchCriticalStock').mockResolvedValue([]);
      vi.spyOn(productService, 'fetchCategories').mockResolvedValue(['Materiales de Construcción']);
      vi.spyOn(orderService, 'getOrders').mockResolvedValue([]);
      serverSession(userSession.id);
      vi.spyOn(userApiService, 'getUsers').mockResolvedValue(serverUsers);
      return render(
        <MemoryRouter initialEntries={[path]}>
          <AuthProvider>
            <Routes>
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );
    }

    it('el perfil ADMINISTRADOR visualiza botón de crear producto y acciones de edición', async () => {
      renderAdminDashboard({ id: 1, nombre: 'Carlos', rol: 'ADMIN' }, '/admin/productos');

      // Botón "Nuevo Producto" debe estar visible para ADMIN
      expect(await screen.findByRole('button', { name: /nuevo producto/i })).toBeInTheDocument();
    });

    it('el perfil VENDEDOR no visualiza botón de creación y ve etiquetas "Solo Lectura"', async () => {
      renderAdminDashboard({ id: 2, nombre: 'Vendedor Mesón', rol: 'VENDEDOR' }, '/admin/productos');

      // Botón "Nuevo Producto" NO debe existir para VENDEDOR
      expect(screen.queryByRole('button', { name: /nuevo producto/i })).not.toBeInTheDocument();

      // Debe indicar que las filas están en Solo Lectura
      const soloLectura = await screen.findAllByText(/solo lectura/i);
      expect(soloLectura.length).toBeGreaterThan(0);
      await screen.findByText('VENDEDOR', { selector: '.admin-user-role-badge' });
      expect(screen.queryByText('Usuarios (Admin)')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^Usuarios/ })).not.toBeInTheDocument();
      expect(userApiService.getUsers).not.toHaveBeenCalled();
    });

    it('el perfil VENDEDOR en la pestaña Resumen no puede realizar ajustes rápidos de stock ni editar', async () => {
      renderAdminDashboard({ id: 2, nombre: 'Vendedor Mesón', rol: 'VENDEDOR' }, '/admin');

      // Botón "Nuevo Producto" no debe estar presente en el resumen
      expect(screen.queryByRole('button', { name: /nuevo producto/i })).not.toBeInTheDocument();

      // No debe haber botones de ajuste de stock (+1, +5, -1) para vendedor
      expect(screen.queryByRole('button', { name: /\+5 reabastecer/i })).not.toBeInTheDocument();
      await waitFor(() => expect(userApiService.getProfile).toHaveBeenCalled());
    });
  });
});
