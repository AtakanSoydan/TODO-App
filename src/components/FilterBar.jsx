import { useState, useEffect } from "react";

const FilterBar = ({ onFilterChange }) => {
  // Form alanlarındaki seçili değerleri tutan state
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priority: "all",
    status: "all",
    sortBy: "none",
  });

  // Filtreler her değiştiğinde üst bileşene (Home.jsx) haber ver
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Input veya select değiştiğinde state'i güncelleyen fonksiyon
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Ortak input ve select CSS sınıfları (Dark mode uyumlu)
  const inputStyles = "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6 space-y-3 transition-colors">
      
      {/* Arama Kutusu */}
      <input
        type="text"
        name="search"
        placeholder="Görev adına göre ara..."
        value={filters.search}
        onChange={handleChange}
        className={`w-full ${inputStyles}`}
      />

      {/* Seçim Filtreleri */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select name="category" value={filters.category} onChange={handleChange} className={inputStyles}>
          <option value="all">Tüm Kategoriler</option>
          <option>Yazılım</option>
          <option>Ders</option>
          <option>Ev-Market Alışverişi</option>
          <option>İş</option>
          <option>Diğer</option>
        </select>

        <select name="priority" value={filters.priority} onChange={handleChange} className={inputStyles}>
          <option value="all">Tüm Öncelikler</option>
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>

        <select name="status" value={filters.status} onChange={handleChange} className={inputStyles}>
          <option value="all">Tüm Durumlar</option>
          <option value="pending">Yapılacak</option>
          <option value="completed">Yapıldı</option>
        </select>

        <select name="sortBy" value={filters.sortBy} onChange={handleChange} className={inputStyles}>
          <option value="none">Sıralama Yok</option>
          <option value="priority">Önceliğe Göre</option>
          <option value="duration">Süreye Göre</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;