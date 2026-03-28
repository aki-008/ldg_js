import { useState, useEffect } from "react";
import { api } from "./api";
import "./App.css";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [view, setView] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) loadTodos();
  }, [token]);

  const loadTodos = async () => {
    const res = await api.getTodos();
    if (res.todos) setTodos(res.todos);
  };

  const handleLogin = async () => {
    const res = await api.login(email, password);
    if (res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setError("");
    } else setError(res.error || "Login failed");
  };

  const handleRegister = async () => {
    const res = await api.register(email, username, password);
    if (res.user) {
      setView("login");
      setError("Registered! Please login.");
    } else setError(res.error || "Register failed");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setTodos([]);
  };

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    const res = await api.createTodo(newTodo);
    if (res.todo) {
      setTodos([res.todo, ...todos]);
      setNewTodo("");
    }
  };

  const handleToggle = async (id: string) => {
    const res = await api.toggleTodo(id);
    if (res.todo) setTodos(todos.map((t) => (t.id === id ? res.todo : t)));
  };

  const handleDelete = async (id: string) => {
    await api.deleteTodo(id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  if (!token)
    return (
      <div
        style={{ maxWidth: 400, margin: "80px auto", fontFamily: "sans-serif" }}
      >
        <h2>{view === "login" ? "Login" : "Register"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: 8,
            padding: 8,
          }}
        />
        {view === "register" && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: 8,
              padding: 8,
            }}
          />
        )}
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: 8,
            padding: 8,
          }}
        />
        <button
          onClick={view === "login" ? handleLogin : handleRegister}
          style={{
            width: "100%",
            padding: 10,
            background: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {view === "login" ? "Login" : "Register"}
        </button>
        <p style={{ textAlign: "center", marginTop: 12 }}>
          {view === "login" ? "No account? " : "Have an account? "}
          <span
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => {
              setView(view === "login" ? "register" : "login");
              setError("");
            }}
          >
            {view === "login" ? "Register" : "Login"}
          </span>
        </p>
      </div>
    );

  return (
    <div
      style={{ maxWidth: 500, margin: "60px auto", fontFamily: "sans-serif" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>My Todos</h2>
        <button
          onClick={handleLogout}
          style={{ padding: "6px 14px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          placeholder="New todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{ flex: 1, padding: 8 }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "8px 16px",
            background: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>
      {todos.length === 0 && (
        <p style={{ color: "#888" }}>No todos yet. Add one above!</p>
      )}
      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id)}
          />
          <span
            style={{
              flex: 1,
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "#aaa" : "#111",
            }}
          >
            {todo.title}
          </span>
          <button
            onClick={() => handleDelete(todo.id)}
            style={{
              color: "red",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
