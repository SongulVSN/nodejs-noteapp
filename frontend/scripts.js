const API_URL = "http://localhost:3000/notes";
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const incompleteNotesContainer = document.getElementById("incompleteNotes");
const completedNotesContainer = document.getElementById("completedNotes");

let isEditing = false;
let currentEditId = null;

async function fetchNotes() {
  const response = await fetch(API_URL);
  const notes = await response.json();
  renderNotes(notes);
}

function renderNotes(notes) {
  incompleteNotesContainer.innerHTML = "";
  completedNotesContainer.innerHTML = "";

  for (const id in notes) {
    const note = notes[id];
    const noteCard = `
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title">${note.title}</h5>
      <p class="card-text">${note.content}</p>
      <div class="d-flex align-items-center gap-2 mt-3">
        <button class="btn btn-outline-warning btn-sm" onclick="startEdit('${id}', '${note.title}', '${note.content}')">
          <i class="bi bi-pencil-square"></i> Düzenle
        </button>
        <button class="btn btn-outline-danger btn-sm" onclick="deleteNote('${id}')">
          <i class="bi bi-trash"></i> Sil
        </button>
        <button class="btn btn-${note.completed ? "secondary" : "success"} btn-sm" onclick="toggleNoteStatus('${id}', ${note.completed})">
          <i class="bi ${note.completed ? "bi-x-circle" : "bi-check-circle"}"></i> ${note.completed ? "Tamamlanmamış Yap" : "Tamamlandı"}
        </button>
      </div>
    </div>
  </div>
`;


    if (note.completed) {
      completedNotesContainer.innerHTML += noteCard;
    } else {
      incompleteNotesContainer.innerHTML += noteCard;
    }
  }
}

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const noteData = {
    title: titleInput.value,
    content: contentInput.value,
    completed: false,
  };

  if (isEditing) {
    await fetch(`${API_URL}/${currentEditId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
  }

  resetForm();
  fetchNotes();
});

function startEdit(id, title, content) {
  isEditing = true;
  currentEditId = id;
  titleInput.value = title;
  contentInput.value = content;
}

function resetForm() {
  isEditing = false;
  currentEditId = null;
  titleInput.value = "";
  contentInput.value = "";
}

async function deleteNote(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchNotes();
}

async function toggleNoteStatus(id, currentStatus) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !currentStatus }),
  });
  fetchNotes();
}

fetchNotes();
