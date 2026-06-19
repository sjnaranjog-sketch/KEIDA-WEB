const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Middleware to ensure UTF-8 charset for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

app.use(express.static(path.join(__dirname)));

app.post('/submit', async (req, res) => {
  const { language, question, filename, answer, timestamp } = req.body;
  const safeLanguage = language || 'unknown';
  const safeQuestion = question || filename || 'unknown';
  const safeAnswer = answer || '';
  const ts = timestamp || new Date().toISOString();

  // Prepare SQL INSERT
  const insertSQL = `INSERT INTO responses(language,question,filename,answer,timestamp) VALUES('${safeLanguage.replace(/'/g,"''")}','${safeQuestion.replace(/'/g,"''")}','${(filename||'').replace(/'/g,"''")}','${safeAnswer.replace(/'/g,"''")}','${ts}');\n`;

  try {
    // Try to use sqlite3 if available
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.join(__dirname, 'responses.db');
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, language TEXT, question TEXT, filename TEXT, answer TEXT, timestamp TEXT)`);
      db.run(`INSERT INTO responses(language,question,filename,answer,timestamp) VALUES(?,?,?,?,?)`, [safeLanguage, safeQuestion, filename, safeAnswer, ts], function(err){
        if (err) {
          // fallback
          fs.appendFileSync(path.join(__dirname,'pending_inserts.sql'), insertSQL);
          res.json({status:'ok','stored':'file-fallback'});
        } else {
          res.json({status:'ok','stored':'sqlite',id:this.lastID});
        }
      });
    });

    db.close();
  } catch (err) {
    // No sqlite3 available or other error - write SQL to pending file
    fs.appendFileSync(path.join(__dirname,'pending_inserts.sql'), insertSQL);
    res.json({status:'ok','stored':'file-fallback'});
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
