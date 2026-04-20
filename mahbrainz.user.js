// ==UserScript==
// @name         TESTING WWDead Mah Brainz
// @namespace    wwdead-mah-brainz
// @version      1.0.1
// @description  Persistent per-character "memry" system with multi-format export
// @author       DTTL
// @include      /^https:\/\/wwdead\.com\/classic\/?(\?.*)?$/
// @include      /^https:\/\/wwdead\.com\/classic\/stats\/?(\?.*)?$/
// @license      GNU General Public License v2 or later; http://www.gnu.org/licenses/gpl.txt
// @grant        none
// ==/UserScript==

/**
 * Zamgrh integrated into the coding as much as possible.
 * Special thanks to Zanz and Babble Rabble for inspiration on Zamgrh.
 * Also special thanks to TommyVee for test piloting an earlier version
 * GNU General Public License v2 or later
 * http://www.gnu.org/licenses/gpl.txt
 */

(function () {
  "use strict";

  ////////////////////////////////////////////////////////////
  // SETTINGS
  ////////////////////////////////////////////////////////////

  const MAX_MEMRYZ = 4000;
  const VISIBLE_RENDER = 250;
  const LAST_CHAR_KEY = "wwdead_last_character";

  ////////////////////////////////////////////////////////////
  // CHARACTER
  ////////////////////////////////////////////////////////////

  function brn_grah_getCharacterIdentity() {
    const gt = document.querySelector(".gt");

    if (gt) {
      const link = gt.querySelector("a[href*='/profile/']");
      const name = gt.querySelector("b");

      if (link && name) {
        const match = link.href.match(/profile\/(\d+)/);

        if (match) {
          const data = {
            id: match[1],
            name: name.textContent.trim(),
          };

          localStorage.setItem(LAST_CHAR_KEY, JSON.stringify(data));
          return data;
        }
      }
    }

    const saved = localStorage.getItem(LAST_CHAR_KEY);
    if (saved) return JSON.parse(saved);

    return { id: "unknown", name: "zambah_void" };
  }

  ////////////////////////////////////////////////////////////
  // LOCATION (TRUE GRID CENTER — STRUCTURAL DETECTION)
  ////////////////////////////////////////////////////////////

  function brn_mrrh_getLocationSignal() {
    const grid = document.querySelector("table.c");
    if (!grid) return "unknown_harrh_place";

    const rows = grid.querySelectorAll("tr");
    if (rows.length < 3) return "unknown_harrh_place";

    // row 0 = suburb header
    // row 1 = north row
    // row 2 = CENTER ROW
    const centerRow = rows[2];
    const cells = centerRow.querySelectorAll("td");

    if (cells.length < 3) return "unknown_harrh_place";

    // middle cell = player location
    const centerCell = cells[1];

    // button inside
    const input = centerCell.querySelector("input");
    if (input && input.value) {
      return input.value.trim();
    }

    // plain text fallback
    const text = centerCell.textContent.trim().split("\n")[0];
    if (text) {
      return text;
    }

    return "unknown_harrh_place";
  }

  ////////////////////////////////////////////////////////////
  // INIT CHARACTER
  ////////////////////////////////////////////////////////////

  const CHAR = brn_grah_getCharacterIdentity();

  const PLAYER_ID = CHAR.id;
  const PLAYER_NAME = CHAR.name;

  const STORAGE_KEY = "wwdead_memryz_" + PLAYER_ID;
  const POS_KEY = "wwdead_memryz_pos_" + PLAYER_ID;

  ////////////////////////////////////////////////////////////
  // STORAGE
  ////////////////////////////////////////////////////////////

  function brn_hrr_loadMemryz() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  function brn_hrr_storeMemryz(mem) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mem));
  }

  ////////////////////////////////////////////////////////////
  // TIMESTAMP
  ////////////////////////////////////////////////////////////

  function brn_zz_timestab_create() {
    const now = new Date();

    return {
      timeISO: now.toISOString(),
      timeLocal: now.toISOString().replace("T", " ").split(".")[0] + " UTC",
    };
  }

  ////////////////////////////////////////////////////////////
  // 🧠 MEMORY WIPE
  ////////////////////////////////////////////////////////////

  function brn_complete_memry_wipe() {
    const ok = confirm("⚠️ Complete memory wipe? This cannot be undone.");
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    alert("🧠 memryz wiped clean... the brain is quiet now.");
    location.reload();
  }

  ////////////////////////////////////////////////////////////
  // 🧠 LINK-PRESERVING MARKDOWN EXTRACTOR
  ////////////////////////////////////////////////////////////

  function brn_extractMarkdownPreservingLinks(html) {
    const div = document.createElement("div");
    div.innerHTML = html;

    const links = div.querySelectorAll("a");

    links.forEach((a) => {
      const text = a.textContent.trim();
      const href = a.href;

      const md = `[${text}](${href})`;

      const span = document.createElement("span");
      span.textContent = md;

      a.replaceWith(span);
    });

    return div.textContent || div.innerText || "";
  }

  ////////////////////////////////////////////////////////////
  // CAPTURE
  ////////////////////////////////////////////////////////////

  function brn_gnn_captureSinceLastVisit() {
    const paragraphs = document.querySelectorAll("p");

    for (const p of paragraphs) {
      const bold = p.querySelector("b");
      if (!bold) continue;

      if (!bold.textContent.includes("Since your last")) continue;

      const ul = p.nextElementSibling;
      if (!ul || ul.tagName !== "UL") continue;

      const items = ul.querySelectorAll("li");

      let memryz = brn_hrr_loadMemryz();
      const location = brn_mrrh_getLocationSignal();

      items.forEach((li) => {
        const html = li.innerHTML;

        if (memryz.some((m) => m.html === html)) return;

        const { timeISO, timeLocal } = brn_zz_timestab_create();

        memryz.push({
          player: PLAYER_ID,
          playerName: PLAYER_NAME,
          location,
          timeISO,
          timeLocal,
          html,
          text: li.textContent.trim(),
        });
      });

      brn_hrr_storeMemryz(memryz);
    }
  }

  ////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////

  function brn_haa_createBrainUI() {
    const btn = document.createElement("div");
    btn.textContent = "🧠";

    btn.style.cssText = `
        position:fixed;
        top:10px;
        right:10px;
        z-index:9999;
        cursor:pointer;
        font-size:22px;
        user-select:none;
    `;

    const panel = document.createElement("div");

    panel.style.cssText = `
        position:fixed;
        top:40px;
        right:10px;
        width:360px;
        height:460px;
        background:#111;
        color:#0f0;
        border:1px solid #0f0;
        padding:8px;
        overflow-y:auto;
        display:none;
        z-index:9999;
        font-size:12px;
    `;

    btn.onclick = () => {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
      brn_rrr_renderBrain(panel);
    };

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    brn_drr_makeDraggable(panel);
    brn_drr_loadPosition(panel);
  }

  ////////////////////////////////////////////////////////////
  // RENDER
  ////////////////////////////////////////////////////////////
  function brn_rrr_renderBrain(panel) {
    const memryz = brn_hrr_loadMemryz();

    panel.innerHTML = "";

    const title = document.createElement("div");
    title.innerHTML = `<b>🧠 ${PLAYER_NAME} — memryz</b> (${memryz.length})`;
    panel.appendChild(title);
    panel.appendChild(document.createElement("hr"));

    ////////////////////////////////////////////////////
    // EXPORT DROPDOWN
    ////////////////////////////////////////////////////

    const exp = document.createElement("div");
    exp.innerHTML = "<i>📤 export memryz ▾</i>";
    exp.style.cursor = "pointer";

    const menu = document.createElement("div");
    menu.style.display = "none";
    menu.style.marginLeft = "10px";
    menu.style.fontSize = "11px";

    function opt(label, fn) {
      const el = document.createElement("div");
      el.innerHTML = label;
      el.style.cursor = "pointer";
      el.style.marginTop = "4px";
      el.onclick = fn;
      menu.appendChild(el);
    }

    opt("🧠 Full Brain (HTML)", brn_exportBrain_HTML);
    opt("📄 Full Brain (Google Docs)", brn_exportDocs_HTML);
    opt("🧠 Complete Memory Wipe", brn_complete_memry_wipe);

    exp.onclick = () => {
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    };

    panel.appendChild(exp);
    panel.appendChild(menu);

    ////////////////////////////////////////////////////
    // GROUP BY TIMESTAMP
    ////////////////////////////////////////////////////

    const grouped = {};

    memryz.forEach((m) => {
      if (!grouped[m.timeLocal]) {
        grouped[m.timeLocal] = {
          timeLocal: m.timeLocal,
          location: m.location,
          items: [],
        };
      }

      grouped[m.timeLocal].items.push(m);
    });

    const groupedArray = Object.values(grouped)
      .slice(-VISIBLE_RENDER)
      .reverse();

    ////////////////////////////////////////////////////
    // RENDER GROUPS
    ////////////////////////////////////////////////////

    groupedArray.forEach((group) => {
      const block = document.createElement("div");
      block.style.marginBottom = "14px";

      const stamp = document.createElement("div");
      stamp.innerHTML = `${group.timeLocal}<br><span style="opacity:.6">${group.location}</span>`;
      stamp.style.cssText = "font-size:10px;margin-bottom:4px;";

      const content = document.createElement("div");

      group.items.forEach((m) => {
        const item = document.createElement("div");
        item.style.marginBottom = "6px";
        item.innerHTML = m.html;

        content.appendChild(item);
      });

      const single = document.createElement("div");
      single.innerHTML = "<i>📄 copy memry (Discord ANSI)</i>";
      single.style.cursor = "pointer";
      single.style.fontSize = "10px";
      single.style.opacity = "0.7";

      single.onclick = () => brn_exportGroupMemry(group.items);

      block.appendChild(stamp);
      block.appendChild(content);
      block.appendChild(single);

      panel.appendChild(block);
    });
  }
  ////////////////////////////////////////////////////////////
  // FULL EXPORTS
  ////////////////////////////////////////////////////////////

  function brn_exportBrain_HTML() {
    const memryz = brn_hrr_loadMemryz();

    const html = memryz
      .map(
        (m) => `
        <div>
            <small>${m.timeLocal}</small><br>
            <small>${m.location}</small>
            <div>${m.html}</div>
        </div>
    `,
      )
      .join("<hr>");

    downloadBlob(html, `wwdead_brainz_${PLAYER_NAME}.html`, "text/html");
  }

  function brn_exportDocs_HTML() {
    const memryz = brn_hrr_loadMemryz();

    const html = `
        <div>
            <h2>🧠 ${PLAYER_NAME} Memryz</h2>
            ${memryz
              .map(
                (m) => `
                <div>
                    <p><b>${m.timeLocal}</b></p>
                    <p><i>${m.location}</i></p>
                    <div>${m.html}</div>
                    <hr>
                </div>
            `,
              )
              .join("")}
        </div>
    `;

    downloadBlob(html, `wwdead_memryz_docs_${PLAYER_NAME}.html`, "text/html");
  }

  ////////////////////////////////////////////////////////////
  // SINGLE MEMRY EXPORT (DISCORD ANSI + FIXED)
  ////////////////////////////////////////////////////////////

  function brn_exportSingleMemry(m) {
    const text = brn_extractMarkdownPreservingLinks(m.html);

    const output = `[2;31m🧠 From the rotting brainz of:[0m[2;37m ${PLAYER_NAME}[0m
[2;37m══════════════════════════════[0m

[2;32m${m.timeLocal}[0m
[2;32m${m.location}[0m

[2;37m────────────────────[0m

[2;36m${text}[0m`;

    navigator.clipboard.writeText("```ansi\n" + output + "\n```");

    alert("memry copied (Discord ANSI)");
  }
  ////////////////////////////////////////////////////////////
  // CLUSTER EXPORT (ADDED FIX)
  ////////////////////////////////////////////////////////////
  function brn_exportGroupMemry(items) {
    const text = items
      .map((m) => brn_extractMarkdownPreservingLinks(m.html))
      .join("\n\n");

    const first = items[0];

    const output = `[2;31m🧠 From the rotting brainz of:[0m[2;37m ${PLAYER_NAME}[0m
[2;37m══════════════════════════════[0m
[2;32m${first.timeLocal}[0m
[2;32m${first.location}[0m
[2;37m────────────────────[0m
[2;36m${text}[0m`;

    navigator.clipboard.writeText("```ansi\n" + output + "\n```");

    alert("cluster memry copied (Discord ANSI)");
  }

  ////////////////////////////////////////////////////////////
  // HELPERS
  ////////////////////////////////////////////////////////////

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  ////////////////////////////////////////////////////////////
  // DRAGGING
  ////////////////////////////////////////////////////////////

  function brn_drr_makeDraggable(el) {
    let isDown = false,
      offsetX,
      offsetY;

    el.addEventListener("mousedown", (e) => {
      isDown = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      el.style.left = e.clientX - offsetX + "px";
      el.style.top = e.clientY - offsetY + "px";
    });

    document.addEventListener("mouseup", () => {
      isDown = false;
      brn_drr_savePosition(el);
    });
  }

  function brn_drr_savePosition(panel) {
    localStorage.setItem(
      "wwdead_memryz_pos",
      JSON.stringify({
        left: panel.style.left,
        top: panel.style.top,
      }),
    );
  }

  function brn_drr_loadPosition(panel) {
    const pos = JSON.parse(localStorage.getItem("wwdead_memryz_pos"));
    if (pos) {
      panel.style.left = pos.left;
      panel.style.top = pos.top;
    }
  }

  ////////////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////////////

  brn_gnn_captureSinceLastVisit();
  brn_haa_createBrainUI();
})();
