import { useState } from "react";
import { FiPlus, FiAlertCircle } from "react-icons/fi"; // Uyarı ikonu (FiAlertCircle) eklendi

const TodoForm = ({ addTodo }) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "medium",
    hours: "",
    minutes: "",
    category: "Yazılım",
    status: "pending",
  });

  // --- YENİ EKLENEN KISIM: Hata Mesajı Hafızası ---
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "hours" || name === "minutes") {
      if (Number(value) < 0) return;
      if (name === "minutes" && Number(value) > 59) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Kullanıcı bir şeyler yazmaya/değiştirmeye başladığında eski hatayı ekrandan sil
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. KONTROL: Görev ismi boş mu?
    if (!formData.title.trim()) {
      setError("Lütfen bir görev ismi giriniz.");
      return; // İşlemi burada durdur
    }

    const totalMinutes = (Number(formData.hours) || 0) * 60 + (Number(formData.minutes) || 0);

    // 2. KONTROL: Süre 0 mı?
    if (totalMinutes === 0) {
      setError("Lütfen görev için bir süre (saat veya dakika) belirleyiniz.");
      return; // İşlemi burada durdur
    }

    // Sorun yoksa görevi ekle
    addTodo({
      title: formData.title,
      priority: formData.priority,
      duration: totalMinutes,
      category: formData.category,
      status: formData.status,
    });

    // Formu temizle ve hatayı sıfırla
    setFormData({
      title: "",
      priority: "medium",
      hours: "",
      minutes: "",
      category: "Yazılım",
      status: "pending",
    });
    setError(""); // Başarılı eklemeden sonra hatayı temizle
  };

  const inputStyles = "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Görev İsmi */}
      <input
        type="text"
        name="title"
        placeholder="Yeni bir görev yazın..."
        value={formData.title}
        onChange={handleChange}
        className={`w-full ${inputStyles}`}
      />

      <div className="flex gap-2">
        <select name="priority" value={formData.priority} onChange={handleChange} className={`w-1/3 ${inputStyles}`}>
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>

        <input
          type="number"
          name="hours"
          placeholder="Saat"
          min="0"
          value={formData.hours}
          onChange={handleChange}
          className={`w-1/3 ${inputStyles}`}
        />

        <input
          type="number"
          name="minutes"
          placeholder="Dak."
          min="0"
          max="59"
          value={formData.minutes}
          onChange={handleChange}
          className={`w-1/3 ${inputStyles}`}
        />
      </div>

      <div className="flex gap-2">
        <select name="category" value={formData.category} onChange={handleChange} className={`w-1/2 ${inputStyles}`}>
          <option>Yazılım</option>
          <option>Ders</option>
          <option>Ev-Market Alışverişi</option>
          <option>İş</option>
          <option>Diğer</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange} className={`w-1/2 ${inputStyles}`}>
          <option value="pending">Yapılacak</option>
          <option value="completed">Yapıldı</option>
        </select>
      </div>

      {/* Hata Varsa Ekranda Göster --- */}
      {error && (
        <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-sm font-medium animate-pulse">
          <FiAlertCircle className="text-lg" />
          <span>{error}</span>
        </div>
      )}

      {/* Gönder Butonu */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
      >
        <FiPlus className="text-xl" /> Görev Ekle
      </button>
    </form>
  );
};

export default TodoForm;