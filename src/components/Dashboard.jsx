import { useMemo } from "react";

const Dashboard = ({ todos }) => {
  // --- İSTATİSTİK HESAPLAMALARI ---
  // Görevler dizisi (todos) değişmediği sürece bu verileri tekrar hesaplama (Performans için useMemo kullanıldı)
  const stats = useMemo(() => {
    const total = todos.length;
    const completedTodos = todos.filter((t) => t.status === "completed");
    const completed = completedTodos.length;
    const pending = total - completed;

    // Toplam dakikaları hesapla
    const totalMinutes = todos.reduce((acc, t) => acc + t.duration, 0);
    const completedMinutes = completedTodos.reduce((acc, t) => acc + t.duration, 0);

    // Tamamlanma oranını ve saatleri hesapla
    const completionRate = total === 0 ? 0 : ((completed / total) * 100).toFixed(0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const completedHours = (completedMinutes / 60).toFixed(1);

    // En çok görev eklenen kategoriyi bul
    const getMostUsedCategory = () => {
      if (todos.length === 0) return "-";
      const counts = {};
      todos.forEach((t) => {
        counts[t.category] = (counts[t.category] || 0) + 1;
      });
      // Sayıları sıralayıp en yüksek olanın ismini döndür
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    };

    return {
      total,
      completed,
      pending,
      completionRate,
      totalHours,
      completedHours,
      mostUsedCategory: getMostUsedCategory(),
    };
  }, [todos]);

  // --- ARAYÜZ (RENDER) ---
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        İstatistikler
      </h2>

      {/* Hiç görev yoksa uyarı göster, varsa kartları listele */}
      {stats.total === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Henüz istatistik oluşturacak bir görev verisi yok.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="Tamamlanan Görevler" value={stats.completed} />
          <DashboardCard title="Yapılacak Görevler" value={stats.pending} />
          <DashboardCard title="Tamamlanan Süre (Saat)" value={stats.completedHours} />
          <DashboardCard title="En Çok Yapılan Kategori" value={stats.mostUsedCategory} />
        </div>
      )}
    </div>
  );
};

// --- ALT BİLEŞEN: KART TASARIMI ---
const DashboardCard = ({ title, value }) => (
  <div className="bg-gray-50 dark:bg-gray-700 border border-transparent dark:border-gray-600 rounded-xl p-5 flex flex-col justify-between min-h-30 transition-colors">
    {/* Kart Başlığı */}
    <h3 className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
      {title}
    </h3>

    {/* Ayırıcı Çizgi */}
    <div className="border-t border-gray-200 dark:border-gray-600 my-3"></div>

    {/* Gösterilecek Veri */}
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default Dashboard;