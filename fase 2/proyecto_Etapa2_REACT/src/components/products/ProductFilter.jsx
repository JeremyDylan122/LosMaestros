import React from 'react';
import { Search, Filter, ArrowUpDown, Tag, AlertOctagon } from 'lucide-react';

export const ProductFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onlyOffers,
  onOffersChange,
  onlyCritical,
  onCriticalChange,
  isStaff = false
}) => {
  return (
    <div className="bento-card" style={{ marginBottom: 'var(--space-xl)', padding: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
        {/* BUSCADOR DE TEXTO / SKU */}
        <div style={{ position: 'relative' }}>
          <label htmlFor="search-product" className="label-tactile" style={{ fontSize: '0.8rem' }}>
            Buscar Producto / Código
          </label>
          <div style={{ position: 'relative', marginTop: '0.25rem' }}>
            <input
              id="search-product"
              type="text"
              className="input-tactile"
              placeholder="Ej. Cemento, Taladro, MC001..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
          </div>
        </div>

        {/* SELECTOR DE CATEGORÍA */}
        <div>
          <label htmlFor="category-select" className="label-tactile" style={{ fontSize: '0.8rem' }}>
            Categoría de Ferretería
          </label>
          <select
            id="category-select"
            className="select-tactile"
            value={activeCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            style={{ marginTop: '0.25rem' }}
          >
            <option value="ALL">Todas las Categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* ORDENAMIENTO POR PRECIO */}
        <div>
          <label htmlFor="sort-select" className="label-tactile" style={{ fontSize: '0.8rem' }}>
            Ordenar por Precio
          </label>
          <select
            id="sort-select"
            className="select-tactile"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{ marginTop: '0.25rem' }}
          >
            <option value="default">Orden por Defecto</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A - Z</option>
          </select>
        </div>

        {/* FILTROS TÁCTILES RÁPIDOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={onlyOffers}
              onChange={(e) => onOffersChange(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Tag size={15} color="var(--color-accent)" /> Solo Productos en Oferta
            </span>
          </label>

          {isStaff && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-danger)' }}>
              <input
                type="checkbox"
                checked={onlyCritical}
                onChange={(e) => onCriticalChange(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-danger)' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <AlertOctagon size={15} /> Solo Stock Crítico (Alerta Reposición)
              </span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
