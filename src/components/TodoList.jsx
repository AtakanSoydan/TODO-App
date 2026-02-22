import TodoCard from "./TodoCard";

const TodoList = ({ todos, deleteTodo, toggleStatus, startEdit, updateTodo, editingId }) => {
  // Eğer filtrelenmiş listede veya genelde hiç görev yoksa uyarı metni göster
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-400 dark:text-gray-500 py-6">
        Gösterilecek görev bulunamadı.
      </div>
    );
  }

  // Görevler dizisindeki her bir eleman için bir TodoCard bileşeni oluştur
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleStatus={toggleStatus}
          startEdit={startEdit}
          updateTodo={updateTodo}
          editingId={editingId}
        />
      ))}
    </div>
  );
};

export default TodoList;