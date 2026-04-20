# 🧠 WWDead Mah Brainz

A persistent **per-character memory recorder** for WWDead that captures your *Since your last visit…* events and stores them locally — with rich Discord export, link preservation, timestamp clustering, and a draggable brain UI.

---

## ✨ Features

### 🧠 Automatic Memory Capture

* Records **Since your last visit** entries
* Saves per-character (multi-character safe)
* Stores timestamp + location + raw HTML
* No server, no tracking — localStorage only

---

### Timestamp Clustering

Multiple events from the same refresh are grouped into **one memory block**

Instead of:
```
10:32 — someone spoke
10:32 — you heard footsteps
10:32 — you were attacked
```

You get:
```
10:32
• someone spoke
• you heard footsteps
• you were attacked
```
---

### 🎛 Brain UI

Floating draggable brain:
```
🧠
```

Click to open memory panel.

Features:
* Scrollable history
* Clustered events
* Timestamp + location
* Discord export button
* Export dropdown
* Memory wipe

---

###  Export Options

Dropdown includes:
* Full Brain (HTML)
* Full Brain (Google Docs)
* Complete Memory Wipe

---

### 📄Discord ANSI Export

Each memory exports formatted like:

```ansi
🧠 From the rotting brainz of: Ed
══════════════════════════════

2026-04-20 4:20:20 UTC
Bromilow Library

────────────────────

[Shaun](https://wwdead.com/classic/profile/xxx)
said "Right, we take Pete's car, we go over to Mum's kill Phil, grab Liz, go to the Burchell Arms, have a nice cold pint, and wait for all this to blow over.”"
```

✔ Preserves player links
✔ ANSI color formatting
✔ Ready to paste into Discord
✔ Cluster-safe

---

## 🧠 Per Character Storage

Each character gets their own brain:

```
wwdead_memryz_<playerID>
```

Switch characters = separate memory.

---

## 💾 Data Storage

Stored locally in browser:

* localStorage only
* no network calls
* no tracking
* no external servers

---

## Testing

Working For Greasemonkey and Tampermonkey (Firefox/Chrome)
---

## 🎯 Designed For

* roleplay logging
* zombie speech capture
* survivor intel tracking
* revive logs
* raid memory
* Discord storytelling

## License

Free for WWDead community use.

Brainz welcome.
