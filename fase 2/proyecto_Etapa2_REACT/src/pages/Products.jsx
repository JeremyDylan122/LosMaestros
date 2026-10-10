import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, RotateCcw } from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilter } from '../components/products/ProductFilter';
import { useAuth } from '../context/AuthContext';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isVendor, isAdmin } = useAuth();

  // Estados de filtros
  const [activeCategory, setActiveCategory] = useState(searchParams.get('categoria') || 'ALL');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('buscar') || '');
  const [sortBy, setSortBy] = useState('default');
  const [onlyOffers, setOnlyOffers] = useState(searchParams.get('ofertas') === 'true');
  const [onlyCritical, setOnlyCritical] = useState(false);

  useEffect(() => {
    const list = productService.getProducts();
    setProducts(list);
    setCategories(productService.getCategories());
  }, []);

  // Sincronizar URL si cambian query params
  useEffect(() => {
    const cat = searchParams.get('categoria');
    if (cat) setActiveCategory(cat);
    const off = searchParams.get('ofertas');
    if (off === 'true') setOnlyOffers(true);
  }, [searchParams]);

  // Filtrado y ordenamiento reactivo
  const filteredProducts = useMemo(() => {
    let result = productService.filterProducts({
      category: activeCategory,
      search: searchTerm,
      inOffer: onlyOffers,
      criticalOnly: onlyCritical
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.precio - a.precio);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return result;
  }, [products, activeCategory, searchTerm, sortBy, onlyOffers, onlyCritical]);

  const handleResetFilters = () => {
    setActiveCategory('ALL');
    setSearchTerm('');
    setSortBy('default');
    setOnlyOffers(false);
    setOnlyCritical(false);
    setSearchParams({});
  };

  return (
    <div className="container page-container">
      {/* CABECERA DE LA PÁGINA */}
      <div className="section-header">
        <span className="badge-tactile" style={{ backgroundColor: 'var(--color-primary)', marginBottom: '0.35rem' }}>
          CATÁLOGO EN LÍNEA &bull; +800 REFERENCIAS
        </span>
        <h1 className="section-title">
          <Package size={30} /> Catálogo de Materiales y Herramientas
        </h1>
        <p className="section-subtitle">
          Consulta existencias reales en mesón, precios de venta en CLP y ficha técnica por producto.
        </p>
      </div>

      {/* BARRA DE FILTROS TÁCTIL */}
      <ProductFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onlyOffers={onlyOffers}
        onOffersChange={setOnlyOffers}
        onlyCritical={onlyCritical}
        onCriticalChange={setOnlyCritical}
        isStaff={isVendor || isAdmin}
      />

      {/* RESULTADOS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Mostrando <span style={{ color: 'var(--color-secondary)' }}>{filteredProducts.length}</span> producto(s) encontrado(s)
        </div>
        {(activeCategory !== 'ALL' || searchTerm || onlyOffers || onlyCritical) && (
          <button 
            type="button"
            onClick={handleResetFilters}
            className="btn-tactile btn-tactile-sm"
            style={{ fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} /> Limpiar Filtros
          </button>
        )}
      </div>

      {/* GRILLA DE PRODUCTOS */}
      {filteredProducts.length > 0 ? (
        <div className="grid-3" data-testid="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bento-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-secondary)' }}>
            No se encontraron productos con los criterios seleccionados
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Prueba ajustando el término de búsqueda o seleccionando otra categoría de ferretería.
          </p>
          <button 
            type="button" 
            onClick={handleResetFilters} 
            className="btn-tactile btn-tactile-primary"
          >
            <RotateCcw size={16} /> Reestablecer Todos los Filtros
          </button>
        </div>
      )}
    </div>
  );
};
