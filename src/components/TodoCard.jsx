import { useState } from "react";
import { FiClock, FiCheck, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

// Öncelik durumuna göre arkaplan ve yazı renkleri (Dark mode destekli)
const priorityColors = {
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const TodoCard = ({ todo, deleteTodo, toggleStatus, startEdit, updateTodo, editingId }) => {
  // Bu kartın düzenleme modunda olup olmadığını kontrol et
  const isEditing = editingId === todo.id;

  // Sadece düzenleme modunda kullanılacak geçici veriler
  const [editData, setEditData] = useState(null);

  // Ortak input CSS sınıfları (Dark mode destekli)
  const inputStyles = "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  // Düzenle butonuna basıldığında mevcut verileri forma doldur
  const handleStartEdit = () => {
    setEditData({
      title: todo.title,
      priority: todo.priority,
      category: todo.category,
      hours: Math.floor(todo.duration / 60),
      minutes: todo.duration % 60,
    });
    startEdit(todo);
  };

  // Düzenleme formundaki değişiklikleri yakala
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Saat ve dakika girişlerinde hatalı değerleri engelle
    if (name === "hours" || name === "minutes") {
      if (Number(value) < 0) return; // Negatif olamaz
      if (name === "minutes" && Number(value) > 59) return; // Dakika 59'u geçemez
    }

    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Düzenlemeyi onayla ve kaydet
  const handleSave = () => {
    const updated = {
      ...todo,
      title: editData.title,
      priority: editData.priority,
      category: editData.category,
      duration: (Number(editData.hours) || 0) * 60 + (Number(editData.minutes) || 0),
    };
    updateTodo(updated);
  };

  // --- DÜZENLEME MODU GÖRÜNÜMÜ ---
  if (isEditing && editData) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3 transition-colors">
        <input
          name="title"
          value={editData.title}
          onChange={handleChange}
          className={`w-full ${inputStyles}`}
        />

        <div className="flex gap-2">
          <select name="priority" value={editData.priority} onChange={handleChange} className={`w-1/3 ${inputStyles}`}>
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>

          <input
            type="number"
            name="hours"
            min="0"
            value={editData.hours}
            onChange={handleChange}
            className={`w-1/3 ${inputStyles}`}
          />

          <input
            type="number"
            name="minutes"
            min="0"
            max="59"
            value={editData.minutes}
            onChange={handleChange}
            className={`w-1/3 ${inputStyles}`}
          />
        </div>

        <select name="category" value={editData.category} onChange={handleChange} className={`w-full ${inputStyles}`}>
          <option>Yazılım</option>
          <option>Ders</option>
          <option>Ev-Market Alışverişi</option>
          <option>İş</option>
          <option>Diğer</option>
        </select>

        <div className="flex justify-end gap-3 mt-2">
          <button onClick={() => startEdit(null)} className="text-gray-500 dark:text-gray-400 hover:underline">
            İptal
          </button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors">
            Kaydet
          </button>
        </div>
      </div>
    );
  }

  // --- NORMAL GÖRÜNÜM MODU ---
  const hours = Math.floor(todo.duration / 60);
  const minutes = todo.duration % 60;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 border border-transparent dark:border-gray-700 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {todo.title}
          </h3>

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
            <span>{todo.category}</span>
            <span>•</span>
            <FiClock className="text-gray-400" />
            <span>{hours}s {minutes}dk</span>
          </div>
        </div>

        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
          {todo.priority === "low" ? "Düşük" : todo.priority === "medium" ? "Orta" : "Yüksek"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        
        {/* Durum Değiştirme Butonu */}
        <button
          onClick={() => toggleStatus(todo.id)}
          className={`px-3 py-1.5 rounded text-sm flex items-center gap-1.5 transition-colors ${
            todo.status === "completed"
              ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/60"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {todo.status === "completed" ? (
            <><FiCheck className="text-lg" /> Yapıldı</>
          ) : (
            <><FiX className="text-lg" /> Yapılmadı</>
          )}
        </button>

        {/* Aksiyon Butonları */}
        <div className="flex gap-3">
          <button onClick={handleStartEdit} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1 transition-colors">
            <FiEdit2 /> Düzenle
          </button>
          <button onClick={() => deleteTodo(todo.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center gap-1 transition-colors">
            <FiTrash2 /> Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;