// Step-1
  //  1. CSV DATA SOURCES
   
const PEOPLE_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=People&headers=1";

const GROUPS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=Groups&headers=1";

const MEMBERSHIPS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=Memberships&headers=1";

const POSTS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=Posts&headers=1";

/* =========================================================
   2. DATA ARRAYS
   ========================================================= */

let people = [];

let groups = [];

let memberships = [];

let posts = [];

/* =========================================================
   3. CURRENT VIEW
   ========================================================= */

let currentView = "roster";

let selectedGroupId = null;

let selectedLeaderId = null;

let selectedPersonId = null;

/* =========================================================
   4. LOAD CSV
   ========================================================= */

async function loadTab(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not load CSV data.");
  }

  const csvText = await response.text();

  return parseCSV(csvText);
}

/* =========================================================
   5. CSV PARSER
   ========================================================= */

function parseCSV(text) {
  const rows = [];

  let row = [];

  let field = "";

  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      field += '"';

      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(field);

      field = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(field);

      field = "";

      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);

    rows.push(row);
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());

  return rows.slice(1).map((values) => {
    const object = {};

    headers.forEach((header, index) => {
      object[header] = (values[index] || "").trim();
    });

    return object;
  });
}

/* =========================================================
   6. FIND PERSON
   ========================================================= */

function findPerson(id) {
  return people.find((person) => person.person_id === id);
}

/* =========================================================
   7. FIND GROUP
   ========================================================= */

function findGroup(id) {
  return groups.find((group) => group.group_id === id);
}

/* =========================================================
   8. PERSON NAME
   ========================================================= */

function getPersonName(id) {
  const person = findPerson(id);

  if (person) {
    return person.full_name;
  }

  return "Unknown person";
}

/* =========================================================
   9. ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}

/* =========================================================
   10. STATUS MESSAGE
   ========================================================= */

function setStatus(message, error = false) {
  const status = document.getElementById("status");

  status.textContent = message;

  status.classList.toggle("error", error);
}

// One helper for every "select a.."/"not found" card. 

function messageCard(little,message,isEmpty = false) {
  return `
<div class ="card>
<h2>${escapeHTML(title)}</h2>
<p class=${isEmpty ? "empty" : ""}">${escapHTML(message)}</p>
 </dive> 
 `;
}
// Used by group board, leader channel: tuen a list of post into HTML. 
function postsListHTML(postList) {
  if (postList.length === 0) {
    return `<div class="empty">No posts yet.</div>`;
  }
  return postList.map(renderPost).join("");
}
// Newest post first.

function newestFirst(a, b) {
  return new Date(b.date) - new Date(a.date);
}
/* =========================================================
   11. NAVIGATION
   ========================================================= */

function setupNavigation() {
  const buttons = document.querySelectorAll(".nav-button");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      currentView = this.dataset.view;

      updateNavigation();

      buildPicker();

      renderCurrentView();
    });
  });
}

/* =========================================================
   12. UPDATE NAVIGATION
   ========================================================= */

function updateNavigation() {
  const buttons = document.querySelectorAll(".nav-button");

  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === currentView);
  });
}

/* =========================================================
   13. BUILD PICKER
   ========================================================= */

function buildPicker() {
  const picker = document.getElementById("picker");

  let html = "";

  /* GROUP PICKER */

  if (currentView === "roster" || currentView === "group-board") {
    html += `
            <div class="picker-group">

                <h2 class="picker-title">
                    Choose a Group
                </h2>

                <div class="button-list">
        `;

    groups.forEach((group) => {
      const active = group.group_id === selectedGroupId;

      html += `
                <button
                    class="picker-button ${active ? "active" : ""}"
                    data-group-id="${escapeHTML(group.group_id)}">

                    ${escapeHTML(group.group_name)}

                    (${escapeHTML(group.period)})

                </button>
            `;
    });

    html += `
                </div>

            </div>
        `;
  }

  /* LEADER PICKER */

  if (currentView === "leader-channel") {
    const leaders = people.filter((person) => person.role === "leader");

    html += `
            <div class="picker-group">

                <h2 class="picker-title">
                    Choose a Leader
                </h2>

                <div class="button-list">
        `;

    leaders.forEach((leader) => {
      const active = leader.person_id === selectedLeaderId;

      html += `
                <button
                    class="picker-button ${active ? "active" : ""}"
                    data-leader-id="${escapeHTML(leader.person_id)}">

                    ${escapeHTML(leader.full_name)}

                </button>
            `;
    });

    html += `
                </div>

            </div>
        `;
  }

  /* PERSON PICKER */

  if (currentView === "history") {
    html += `
            <div class="picker-group">

                <h2 class="picker-title">
                    Choose a Person
                </h2>

                <div class="button-list">
        `;

    people.forEach((person) => {
      const active = person.person_id === selectedPersonId;

      html += `
                <button
                    class="picker-button ${active ? "active" : ""}"
                    data-person-id="${escapeHTML(person.person_id)}">

                    ${escapeHTML(person.full_name)}

                </button>
            `;
    });

    html += `
                </div>

            </div>
        `;
  }

  picker.innerHTML = html;

  /* GROUP EVENTS */

  picker.querySelectorAll("[data-group-id]").forEach((button) => {
    button.addEventListener("click", function () {
      selectedGroupId = this.dataset.groupId;

      buildPicker();

      renderCurrentView();
    });
  });

  /* LEADER EVENTS */

  picker.querySelectorAll("[data-leader-id]").forEach((button) => {
    button.addEventListener("click", function () {
      selectedLeaderId = this.dataset.leaderId;

      buildPicker();

      renderCurrentView();
    });
  });

  /* PERSON EVENTS */

  picker.querySelectorAll("[data-person-id]").forEach((button) => {
    button.addEventListener("click", function () {
      selectedPersonId = this.dataset.personId;

      buildPicker();

      renderCurrentView();
    });
  });
}

/* =========================================================
   14. RENDER CURRENT VIEW
   ========================================================= */

function renderCurrentView() {
  if (currentView === "roster") {
    renderRoster(selectedGroupId);
  } else if (currentView === "group-board") {
    renderGroupBoard(selectedGroupId);
  } else if (currentView === "leader-channel") {
    renderLeaderChannel(selectedLeaderId);
  } else if (currentView === "history") {
    renderHistory(selectedPersonId);
  }
}

/* =========================================================
   15. ROSTER
   ========================================================= */

function renderRoster(groupId) {
  const content = document.getElementById("content");

  if (!groupId) {
    content.innerHTML = `
            <div class="card">

                <h2>Roster</h2>

                <p>
                    Select a group above.
                </p>

            </div>
        `;

    return;
  }

  const group = findGroup(groupId);

  if (!group) {
    content.innerHTML = `
            <div class="card">

                <h2>Roster</h2>

                <p class="empty">
                    Group not found.
                </p>

            </div>
        `;

    return;
  }

  /* FIND LEADER */

  const leader = findPerson(group.leader_id);

  /* FILTER MEMBERSHIPS */

  const groupMemberships = memberships.filter(
    (membership) => membership.group_id === groupId,
  );

  /* MAP MEMBERSHIPS TO PEOPLE */

  const members = groupMemberships

    .map((membership) => findPerson(membership.person_id))

    .filter((person) => person);

  let membersHTML = "";

  if (members.length === 0) {
    membersHTML = `
            <div class="empty">
                No members found.
            </div>
        `;
  } else {
    membersHTML = `
            <ul class="member-list">
        `;

    members.forEach((member) => {
      membersHTML += `
                <li class="member">

                    ${escapeHTML(member.full_name)}

                </li>
            `;
    });

    membersHTML += `
            </ul>
        `;
  }

  content.innerHTML = `

        <div class="card">

            <h2>

                ${escapeHTML(group.group_name)}

                -

                ${escapeHTML(group.period)}

            </h2>


            <p class="meta">

                Group ID:
                ${escapeHTML(group.group_id)}

            </p>


            <h3>
                Leader
            </h3>


            <p>

                ${leader ? escapeHTML(leader.full_name) : "Unknown leader"}

                <span
                    class="leader-badge">

                    Leader

                </span>

            </p>


            <h3>
                Members
            </h3>


            ${membersHTML}

        </div>

    `;
}

/* =========================================================
   16. GROUP BOARD
   ========================================================= */

function renderGroupBoard(groupId) {
  const content = document.getElementById("content");

  if (!groupId) {
    content.innerHTML = `
            <div class="card">

                <h2>
                    Group Board
                </h2>

                <p>
                    Select a group above.
                </p>

            </div>
        `;

    return;
  }

  const group = findGroup(groupId);

  if (!group) {
    content.innerHTML = `
            <div class="card">

                <h2>
                    Group Board
                </h2>

                <p class="empty">
                    Group not found.
                </p>

            </div>
        `;

    return;
  }

  /* FILTER POSTS */

  const groupPosts = posts

    .filter((post) => post.board_type === "group" && post.board_id === groupId)

    /* SORT NEWEST FIRST */

    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let postsHTML = "";

  if (groupPosts.length === 0) {
    postsHTML = `
            <div class="empty">
                No posts yet.
            </div>
        `;
  } else {
    groupPosts.forEach((post) => {
      postsHTML += renderPost(post);
    });
  }

  content.innerHTML = `

        <div class="card">

            <h2>

                ${escapeHTML(group.group_name)}

                -

                ${escapeHTML(group.period)}

            </h2>


            <p class="meta">
                Group Board
            </p>


            ${postsHTML}

        </div>

    `;
}

/* =========================================================
   17. LEADER CHANNEL
   ========================================================= */

function renderLeaderChannel(leaderId) {
  const content = document.getElementById("content");

  if (!leaderId) {
    content.innerHTML = `
            <div class="card">

                <h2>
                    Leader Channel
                </h2>

                <p>
                    Select a leader above.
                </p>

            </div>
        `;

    return;
  }

  const leader = findPerson(leaderId);

  if (!leader) {
    content.innerHTML = `
            <div class="card">

                <h2>
                    Leader Channel
                </h2>

                <p class="empty">
                    Leader not found.
                </p>

            </div>
        `;

    return;
  }

  /* FILTER LEADER POSTS */

  const leaderPosts = posts

    .filter(
      (post) => post.board_type === "leader" && post.board_id === leaderId,
    )

    /* NEWEST FIRST */

    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let postsHTML = "";

  if (leaderPosts.length === 0) {
    postsHTML = `
            <div class="empty">
                No posts yet.
            </div>
        `;
  } else {
    leaderPosts.forEach((post) => {
      postsHTML += renderPost(post);
    });
  }

  content.innerHTML = `

        <div class="card">

            <h2>

                ${escapeHTML(leader.full_name)}

                - Leader Channel

            </h2>


            <p class="meta">

                Leader ID:
                ${escapeHTML(leader.person_id)}

            </p>


            ${postsHTML}

        </div>

    `;
}

/* =========================================================
   18. HISTORY
   ========================================================= */

function renderHistory(personId) {
  const content = document.getElementById("content");

  if (!personId) {
    content.innerHTML = messageCard("History", "Select a person above.");
    return ;
  }
  const person = findPerson(personId);
  if (!person) {
    content.innerHTML = messageCard("History", "Person not found.", true);
    return;
  }
            
  /* ==========================================
       PART 1:
       FIND GROUPS OF THIS PERSON
       ========================================== */

  const theirGroups = memberships

    /* FILTER */

    .filter((membership) => membership.person_id === personId)

    /* MAP */

    .map((membership) => findGroup(membership.group_id))

    /* REMOVE MISSING GROUPS */

    .filter((group) => group)

    /* SORT BY PERIOD */

    .sort((a, b) =>a.period.localeCompare(b.period, undefined, { numeric: true })); 

  /* ==========================================
       PART 2:
       FIND UNIQUE LEADERS
       ========================================== */

  const leaderIds = new Set(theirGroups.map((group) => group.leader_id));

  const leaders = Array.from(leaderIds)

    .map((leaderId) => findPerson(leaderId))

    .filter((leader) => leader);

  /* ==========================================
       GROUP HTML
       ========================================== */
 // FIX 2: each leader is a button. data-open-leader stores the leader's id
  // so the click handler below knows which channel to open.
  const leadersHTML =
    leaders.length === 0
      ? `<div class="empty">No leader channels found.</div>`
      : `<ul class="history-list">
           ${leaders.map((l) => `
             <li>
               <button class="link-button" data-open-leader="${escapeHTML(l.person_id)}">
                 ${escapeHTML(l.full_name)}
               </button>
             </li>`).join("")}
         </ul>`;

  content.innerHTML = `
    <div class="card">
      <h2>${escapeHTML(person.full_name)} - History</h2>
      <p class="meta">Person ID: ${escapeHTML(person.person_id)}</p>

      <h3>Groups They Have Been In</h3>
      ${groupsHTML}

      <h3>Leader Channels</h3>
      ${leadersHTML}
    </div>
  `;

  // This must come AFTER innerHTML, because the buttons only exist now.
  
  content.querySelectorAll("[data-open-leader]").forEach((button) => {
    button.addEventListener("click", function () {
      selectedLeaderId = this.dataset.openLeader;  
      
      // 1. remember the leader
      currentView = "leader-channel";  
      
      
      // 2. switch the view
      showCurrentView();                           // 3. nav + picker + content
    });
  });
}



/* =========================================================
   19. RENDER POST
   ========================================================= */

function renderPost(post) {
  const author = findPerson(post.author_id);

  let attachmentHTML = "";

  if (post.attachment_label && post.attachment_label.trim() !== "") {
    attachmentHTML = `

            <div class="attachment">

                Attachment:
                ${escapeHTML(post.attachment_label)}

            </div>

        `;
  }

  return `

        <article class="post">

            <div>

                <span class="post-author">

                    ${author ? escapeHTML(author.full_name) : "Unknown author"}

                </span>


                <span class="post-date">

                    ${escapeHTML(post.date)}

                </span>

            </div>


            <p class="post-text">

                ${escapeHTML(post.text)}

            </p>


            ${attachmentHTML}

        </article>

    `;
}

/* =========================================================
   20. START APPLICATION
   ========================================================= */

async function startApplication() {
  try {
    setStatus("Loading data...");

    /* LOAD ALL FOUR SHEETS */
    [people,groups,memberships,posts] = await Promise.all([
      loadTab(PEOPLE_CSV_URL),
      loadTab(GROUPS_CSV_URL),
      loadTab(MEMBERSHIPS_CSV_URL),
      loadTab(POSTS_CSV_URL)
    ]);
    
    /* INITIAL SELECTIONS */

    if (groups.length > 0) {
      selectedGroupId = groups[0].group_id;
    }

    const firstLeader = people.find((person) => person.role === "leader");

    if (firstLeader) {
      selectedLeaderId = firstLeader.person_id;
    }

    if (people.length > 0) {
      selectedPersonId = people[0].person_id;
    }

    /* SETUP */

    setupNavigation();

    updateNavigation();

    buildPicker();

    renderCurrentView();

    setStatus("Data loaded successfully.");

    /* CONSOLE */
} catch (error) {
    console.error(error);   // keep this one: it helps when something breaks

    setStatus(
      "Unable to load the data. Please check your internet connection and Google Sheet access.",
      true
    );

    document.getElementById("content").innerHTML =
      messageCard("Data Loading Error", error.message);
  }
}
    
/* =========================================================
   21. RUN APPLICATION
   ========================================================= */

startApplication();
