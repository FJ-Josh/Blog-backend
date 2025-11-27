const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL BLOGS
router.get("/", (req, res) => {
  db.query("SELECT * FROM blogs ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ADD BLOG
router.post("/add", (req, res) => {
  const { title, content, user_id } = req.body;

  const sql = `
    INSERT INTO blogs (title, content, user_id, likes)
    VALUES (?, ?, ?, '[]')
  `;

  db.query(sql, [title, content, user_id], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Blog Created Successfully!");
  });
});

router.put("/:id", (req, res) => {
  const blogId = req.params.id;
  const { title, content } = req.body;

  const sql = "UPDATE blogs SET title = ?, content = ? WHERE id = ?";
  db.query(sql, [title, content, blogId], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Blog updated successfully!");
  });
});

router.delete("/:id", (req, res) => {
  const blogId = req.params.id;

  const sql = "DELETE FROM blogs WHERE id = ?";
  db.query(sql, [blogId], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Blog deleted successfully!");
  });
});


module.exports = router;
