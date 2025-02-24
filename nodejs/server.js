const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');  

const server = express();
server.use(cors());  
server.use(bodyParser.json());

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'blog'
});

db.connect(function(err) {
    if (err) {
        console.log("Error  connecting to db");
    } else {
        console.log("Successfully connected to the DB");
    }
});

server.listen(8085, function check(error) {
    if (error) {
        console.log("Error To Set the  Port. Please check it");
    } else {
        console.log("Post successfully connected to 8085");
    }
});

server.post("/api/blog/add", (req, res) => {
    let details = {
        title : req.body.title,
        content: req.body.content,
    };
    let sql = "INSERT INTO posts SET ?";
    db.query(sql, details, (error) => {
        if (error) {
            res.send({status: false, message: "Blog Posting is failed"});
        } else {
            res.send({status: true, message: "Blog is successfully posted"});
        }
    });
});

server.get("/api/blog/", (req, res) => {
    let sql = "SELECT * FROM posts"; 

    db.query(sql, function(error, result) { 
        if (error) {
            console.log("Database connection error");
            res.send({ status: false, message: "Database connection error" });
        } else {
            res.send({ status: true, data: result }); 
        }
    });
});

server.delete("/api/blog/delete/:id", (req, res) => {
    let blogId = req.params.id;
    let sql = "DELETE FROM posts WHERE id = ?";

    db.query(sql, [blogId], (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to delete blog post" });
        } else if (result.affectedRows === 0) {
            res.send({ status: false, message: "Blog post not found" });
        } else {
            res.send({ status: true, message: "Blog post deleted successfully" });
        }
    });
});

server.post("/api/comment/add", (req, res) => {
    let commentDetails = {
        post_id: req.body.post_id,
        content: req.body.content,
    };

    let sql = "INSERT INTO comments SET ?";
    db.query(sql, commentDetails, (error) => {
        if (error) {
            res.send({ status: false, message: "Failed to add comment" });
        } else {
            res.send({ status: true, message: "Comment added successfully" });
        }
    });
});

server.get("/api/comments/:post_id", (req, res) => {
    let postId = req.params.post_id;
    let sql = "SELECT * FROM comments WHERE post_id = ?";

    db.query(sql, [postId], (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to retrieve comments" });
        } else {
            res.send({ status: true, data: result });
        }
    });
});

server.delete("/api/comment/delete/:id", (req, res) => {
    let commentId = req.params.id;
    let sql = "DELETE FROM comments WHERE id = ?";

    db.query(sql, [commentId], (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to delete comment" });
        } else if (result.affectedRows === 0) {
            res.send({ status: false, message: "Comment not found" });
        } else {
            res.send({ status: true, message: "Comment deleted successfully" });
        }
    });
});
