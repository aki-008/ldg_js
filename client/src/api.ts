const BASE = "http://localhost:3000";

const headers = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("token")
    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
    : {}),
});

export const api = {
  register: (email: string, username: string, password: string) =>
    fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, username, password }),
    }).then((r) => r.json()),

  login: (email: string, password: string) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json()),

  getTodos: () =>
    fetch(`${BASE}/todos`, { headers: headers() }).then((r) => r.json()),

  createTodo: (title: string) =>
    fetch(`${BASE}/todos`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ title }),
    }).then((r) => r.json()),

  toggleTodo: (id: string) =>
    fetch(`${BASE}/todos/${id}`, { method: "PATCH", headers: headers() }).then(
      (r) => r.json(),
    ),

  deleteTodo: (id: string) =>
    fetch(`${BASE}/todos/${id}`, { method: "DELETE", headers: headers() }).then(
      (r) => r.json(),
    ),
};
