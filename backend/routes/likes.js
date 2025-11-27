const express = require("express");
const router = express.Router();
const db = require("../db");

// LIKE / UNLIKE BLOG
router.patch("/:id", (req, res) => {
  const blogId = req.params.id;
  const { user } = req.body;

  // Get current likes
  db.query("SELECT likes FROM blogs WHERE id = ?", [blogId], (err, result) => {
    if (err) return res.status(500).json(err);

    let likes = result[0].likes ? JSON.parse(result[0].likes) : [];

    // Toggle like / unlike
    if (likes.includes(user)) {
      likes = likes.filter(u => u !== user);
    } else {
      likes.push(user);
    }

    // Save it back to DB
    db.query("UPDATE blogs SET likes = ? WHERE id = ?", [JSON.stringify(likes), blogId], (err2) => {
      if (err2) return res.status(500).json(err2);

      return res.json({ success: true, likes });
    });
  });
});

module.exports = router;
