import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const TodoForm = ({ addTodo }) => {
  // Yeni eklenecek görevin verilerini tutan state
  const [formData, setFormData] = useState({
    title: "",
    priority: "medium",
    hours: "",
    minutes: "",
    category: "Yazılım",
    status: "pending",
  });

  // Kullanıcı forma yazı yazdığında state'i günceller
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Süre girişlerinde hatalı değerleri engelle
    if (name === "hours" || name === "minutes") {
      if (Number(value) < 0) return; // Negatif giriş yapılamaz
      if (name === "minutes" && Number(value) > 59) return; // Dakika 59'u geçemez
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form gönderildiğinde (Görev Ekle butonuna basıldığında) çalışır
  const handleSubmit = (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller

    // Sadece boşluk girilmişse veya isim boşsa işlemi iptal et
    if (!formData.title.trim()) return;

    // Saat ve dakikayı toplam dakika cinsine çevir (Boş bırakılmışsa 0 kabul et)
    const totalMinutes = (Number(formData.hours) || 0) * 60 + (Number(formData.minutes) || 0);

    // Üst bileşene (Home.jsx) veriyi gönder
    addTodo({
      title: formData.title,
      priority: formData.priority,
      duration: totalMinutes,
      category: formData.category,
      status: formData.status,
    });

    // İşlem bitince formu temizle (Varsayılan ayarlara döndür)
    setFormData({
      title: "",
      priority: "medium",
      hours: "",
      minutes: "",
      category: "Yazılım",
      status: "pending",
    });
  };

  // Ortak input CSS sınıfları (Dark mode destekli)
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
        {/* Öncelik Seçimi */}
        <select name="priority" value={formData.priority} onChange={handleChange} className={`w-1/3 ${inputStyles}`}>
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>

        {/* Saat Girişi */}
        <input
          type="number"
          name="hours"
          placeholder="Saat"
          min="0"
          value={formData.hours}
          onChange={handleChange}
          className={`w-1/3 ${inputStyles}`}
        />

        {/* Dakika Girişi */}
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

      {/* Kategori Seçimi */}
      <select name="category" value={formData.category} onChange={handleChange} className={`w-full ${inputStyles}`}>
        <option>Yazılım</option>
        <option>Ders</option>
        <option>Ev-Market Alışverişi</option>
        <option>İş</option>
        <option>Diğer</option>
      </select>

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