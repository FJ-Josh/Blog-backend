const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db"); // Make sure this is your MySQL connection

// Middleware
app.use(cors());
app.use(express.json());

// ===== REGISTER USER =====
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, message: "User Registered Successfully!" });
  });
});

// ===== LOGIN USER =====
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });

    if (result.length > 0) {
      res.json({
        success: true,
        message: "Login Successful!",
        user: result[0],
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
  });
});

// ===== LIKE / UNLIKE BLOG =====
app.patch("/blogs/:id/like", (req, res) => {
  const userId = Number(req.body.user);
  const blogId = Number(req.params.id);

  const getSQL = "SELECT likes FROM blogs WHERE id = ?";
  db.query(getSQL, [blogId], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });

    let likes = [];
    try {
      likes = JSON.parse(result[0].likes || "[]");
    } catch {
      likes = [];
    }

    likes = likes.map(Number);

    // Toggle like
    if (likes.includes(userId)) {
      likes = likes.filter(id => id !== userId);
    } else {
      likes.push(userId);
    }

    const updateSQL = "UPDATE blogs SET likes = ? WHERE id = ?";
    db.query(updateSQL, [JSON.stringify(likes), blogId], (err2) => {
      if (err2) return res.status(500).json({ success: false, error: err2 });

      res.json({
        success: true,
        count: likes.length,
        liked: likes.includes(userId),
      });
    });
  });
});

// ===== PROFILE =====
app.get("/profile/:id", (req, res) => {
  const userId = Number(req.params.id);
  const sql = "SELECT * FROM blogs WHERE user_id = ?";

  db.query(sql, [userId], (err, blogs) => {
    if (err) return res.status(500).json({ success: false, error: err });

    const totalBlogs = blogs.length;
    let totalLikes = 0;
    blogs.forEach(blog => {
      const arr = JSON.parse(blog.likes || "[]");
      totalLikes += arr.length;
    });

    res.json({
      totalBlogs,
      totalLikes,
      blogs,       // All blogs by this user
      likesGiven: 0 // Optional, you said to remove it later
    });
  });
});

// ===== BLOG ROUTES =====
const blogRoutes = require("./routes/blog");
app.use("/blogs", blogRoutes);

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
