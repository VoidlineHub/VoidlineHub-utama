const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// KONEKSI DATABASE
const mongoURI = "mongodb+srv://habilyusuf9:muhammadhabilyusuf9@cluster0.hunyw0i.mongodb.net/VoidlineData?retryWrites=true&w=majority";
mongoose.connect(mongoURI).then(() => console.log("✅ Connected to Voidline Database"));

// SCHEMA BAN
const BanSchema = new mongoose.Schema({
    hwid: { type: String, required: true, unique: true },
    reason: { type: String, default: "Violation of Terms" },
    date: { type: Date, default: Date.now }
});
const Ban = mongoose.model('Ban', BanSchema);

// --- 🌐 API UNTUK ROBLOX ---
app.get('/api/check', async (req, res) => {
    const { hwid } = req.query;
    try {
        const isBanned = await Ban.findOne({ hwid });
        if (isBanned) return res.json({ status: "banned", reason: isBanned.reason });
        res.json({ status: "clear" });
    } catch (e) { res.json({ status: "error" }); }
});

// --- 👑 DASHBOARD ADMIN ---
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#0a0a0a; color:white; font-family:sans-serif; text-align:center; padding:50px;">
            <h1 style="color:#00e1ff;">🔱 VOIDLINE EXECUTIVE</h1>
            <div style="background:#111; padding:20px; border-radius:10px; display:inline-block; border:1px solid #333;">
                <input id="hwid" placeholder="Target HWID" style="padding:10px; width:250px; background:#222; color:white; border:1px solid #444;">
                <button onclick="ban()" style="padding:10px; background:#ff0044; color:white; border:none; cursor:pointer;">BAN HWID</button>
            </div>
            <script>
                async function ban() {
                    const h = document.getElementById('hwid').value;
                    await fetch('/api/add', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ hwid: h })
                    });
                    alert('User Banned!');
                    location.reload();
                }
            </script>
        </body>
    `);
});

app.post('/api/add', async (req, res) => {
    try { await Ban.create({ hwid: req.body.hwid }); res.sendStatus(200); }
    catch (e) { res.sendStatus(500); }
});

module.exports = app;
             
