export const createTodo = ({
  title,
  priority,
  duration,
  category,
  status
}) => {
  return {
    id: Date.now(),
    title,            // Görev İsmi
    priority,         // low | medium | high
    duration,         // dakika cinsinden tutacağız
    category,         // Yazılım | Ders | ...
    status,           // pending | completed
    createdAt: new Date().toISOString()
  };
};