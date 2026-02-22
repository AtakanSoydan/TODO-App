import { useState, useEffect, useCallback } from "react"; // React'ın temel durum yönetimi ve yan etki Hookları
import TodoForm from "../components/TodoForm"; 
import TodoList from "../components/TodoList"; 
import FilterBar from "../components/FilterBar"; 
import Dashboard from "../components/Dashboard";
import { createTodo } from "../interfaces/ITodo"; // Görev oluşturmak için yardımcı fonksiyon (ID atama ve varsayılan değerler için)
import { FiSun, FiMoon } from "react-icons/fi"; // Tema ikonları

const Home = () => {
  // ===========================================
  // --- TEMEL DURUMLAR (STATES) ---
  // ===========================================

  // Görevleri localStorage'dan al, yoksa boş dizi ile başla
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // Arama ve filtreleme kriterleri
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priority: "all",
    status: "all",
    sortBy: "none"
  });

  // Hangi görevin düzenlendiğini takip eder (null ise düzenleme yok)
  const [editingId, setEditingId] = useState(null);

  // Koyu tema durumu: Kullanıcının son tercihini hatırla, yoksa açık tema başlat
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // ===========================================
  // --- YAN ETKİLER (EFFECTS) ---
  // ===========================================

  // Görevler her değiştiğinde tarayıcı hafızasına (localStorage) kaydet
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Tema değiştiğinde HTML etiketine 'dark' sınıfını ekle veya çıkar
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ===========================================
  // --- GÖREV İŞLEMLERİ (CRUD) ---
  // ===========================================

  // Yeni görev ekler
  const addTodo = (todoData) => {
    const newTodo = createTodo(todoData);
    setTodos((prev) => [...prev, newTodo]);
  };

  // Görevi siler
  // ID'si verilen görevi listeden çıkarır
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Görevin durumunu (Yapıldı/Yapılacak) tersine çevirir
  const toggleStatus = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === "pending" ? "completed" : "pending" }
          : todo
      )
    );
  };

  // Düzenlenen görevi günceller ve düzenleme modunu kapatır
  // ID'si eşleşen görevi günceller, diğerlerini olduğu gibi bırakır
  const updateTodo = (updatedTodo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
    setEditingId(null);
  };

  // Bir görevi düzenleme moduna alır veya iptal eder
  // Eğer todo parametresi varsa o görevin ID'sini düzenleme moduna alır, yoksa düzenleme modunu kapatır
  const startEdit = (todo) => {
    setEditingId(todo ? todo.id : null);
  };

  // ============================================
  // --- FİLTRELEME VE SIRALAMA ---
  // ============================================

  // Filtre bileşeninden gelen yeni ayarları kaydeder
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Mevcut görevleri seçili filtrelere ve sıralama ayarlarına göre listeler
  const filteredTodos = todos
    .filter((todo) => {
      const matchSearch = todo.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.category === "all" || todo.category === filters.category;
      const matchPriority = filters.priority === "all" || todo.priority === filters.priority;
      const matchStatus = filters.status === "all" || todo.status === filters.status;

      return matchSearch && matchCategory && matchPriority && matchStatus;
    })
    .sort((a, b) => {
      if (filters.sortBy === "priority") {
        const order = { high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      if (filters.sortBy === "duration") {
        return a.duration - b.duration;
      }
      return 0;
    });
    
  // ============================================
  // --- ARAYÜZ (RENDER) ---
  // ============================================

  return (
    // Ana arka plan rengi temanın durumuna göre değişir
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex justify-center py-10">
      <div className="w-full max-w-3xl px-4">
        
        {/* Üst Kısım: Başlık ve Tema Butonu */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Görev Yönetim Paneli
          </h1>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Temayı Değiştir"
          >
            {isDarkMode ? <FiSun className="text-2xl" /> : <FiMoon className="text-2xl" />}
          </button>
        </div>

        {/* Görev Ekleme Formu */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6 transition-colors">
          <TodoForm addTodo={addTodo} />
        </div>

        {/* Filtreleme Çubuğu */}
        <FilterBar onFilterChange={handleFilterChange} />

        {/* Görev Listesi (Kaydırılabilir alan) */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl shadow-inner mt-6 max-h-[55vh] overflow-y-auto transition-colors">
          <TodoList
            todos={filteredTodos}
            deleteTodo={deleteTodo}
            toggleStatus={toggleStatus}
            startEdit={startEdit}
            updateTodo={updateTodo}
            editingId={editingId}
          />
        </div>

        {/* İstatistikler (Dashboard) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-8 transition-colors">
          <Dashboard todos={todos} />
        </div>

      </div>
    </div>
  );
};

export default Home;