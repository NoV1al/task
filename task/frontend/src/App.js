import { useEffect, useState } from "react";
import {
  Trash2,
  CheckCircle2,
  Circle,
  CirclePlus,
} from "lucide-react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = "https://bens.pythonanywhere.com/api/taskko/";

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        is_completed: false,
      }),
    });

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await fetch(API_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: task.id,
        title: task.title,
        is_completed: !task.is_completed,
      }),
    });

    fetchTasks();
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgBlur1}></div>
      <div style={styles.bgBlur2}></div>

      <div style={styles.container}>
        <div style={{ marginBottom: 30 }}>
          <h1 style={styles.title}>Task mo hehehehehe</h1>
          <p style={styles.subtitle}>
            Gawin moto lahat
          </p>
        </div>

        {/* INPUT */}
        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            style={styles.input}
          />

          <button onClick={addTask} style={styles.addBtn}>
            <CirclePlus size={24} />
          </button>
        </div>

        {/* TASKS */}
        <div style={styles.tasksWrap}>
          {tasks.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyEmoji}>🌤️</div>
              <p>No tasks yet</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  ...styles.taskCard,
                  transform: task.is_completed
                    ? "scale(0.98)"
                    : "scale(1)",
                  background: task.is_completed
                    ? "rgba(212, 255, 218, 0.55)"
                    : "rgba(255,255,255,0.55)",
                }}
              >
                <div style={styles.taskLeft}>
                  <button
                    onClick={() => toggleComplete(task)}
                    style={{
                      ...styles.checkBtn,
                      transform: task.is_completed
                        ? "scale(1.15)"
                        : "scale(1)",
                    }}
                  >
                    {task.is_completed ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

                  <span
                    style={{
                      ...styles.taskText,
                      textDecoration: task.is_completed
                        ? "line-through"
                        : "none",
                      opacity: task.is_completed ? 0.6 : 1,
                    }}
                  >
                    {task.title}
                  </span>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  style={styles.deleteBtn}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #fef6ec, #f8e8dc, #efe0ff)",
    fontFamily: "Poppins, sans-serif",
    padding: 20,
  },

  bgBlur1: {
    position: "absolute",
    width: 300,
    height: 300,
    background: "#ffd6a5",
    borderRadius: "50%",
    filter: "blur(100px)",
    top: -80,
    left: -80,
    opacity: 0.6,
  },

  bgBlur2: {
    position: "absolute",
    width: 280,
    height: 280,
    background: "#d7c8ff",
    borderRadius: "50%",
    filter: "blur(100px)",
    bottom: -80,
    right: -80,
    opacity: 0.5,
  },

  container: {
    width: "100%",
    maxWidth: 620,
    padding: 35,
    borderRadius: 32,
    background: "rgba(255,255,255,0.35)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
    position: "relative",
    zIndex: 2,
  },

  title: {
    margin: 0,
    fontSize: "2.7rem",
    color: "#5d4037",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    color: "#8d6e63",
    fontSize: "1rem",
  },

  inputRow: {
    display: "flex",
    gap: 14,
    marginBottom: 28,
  },

  input: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.4)",
    outline: "none",
    fontSize: "1rem",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    transition: "0.3s",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },

  addBtn: {
    border: "none",
    borderRadius: 18,
    padding: "0 22px",
    cursor: "pointer",
    color: "white",
    background:
      "linear-gradient(135deg, #ffb36b, #ff8e8e)",
    transition: "0.25s ease",
    boxShadow: "0 8px 20px rgba(255,150,120,0.35)",
  },

  tasksWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  taskCard: {
    padding: 18,
    borderRadius: 22,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.35s ease",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.35)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },

  taskLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  taskText: {
    fontSize: "1.02rem",
    color: "#5d4037",
    transition: "0.3s",
  },

  checkBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#66bb6a",
    transition: "0.25s ease",
  },

  deleteBtn: {
    border: "none",
    background: "rgba(255,255,255,0.6)",
    color: "#ff6b6b",
    padding: 11,
    borderRadius: 14,
    cursor: "pointer",
    transition: "0.25s ease",
  },

  empty: {
    textAlign: "center",
    padding: 50,
    borderRadius: 22,
    background: "rgba(255,255,255,0.4)",
    color: "#8d6e63",
    backdropFilter: "blur(12px)",
  },

  emptyEmoji: {
    fontSize: "2rem",
    marginBottom: 10,
  },
};
