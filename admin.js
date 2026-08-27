import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  auth
} from "./firebase.js";

import app from "./firebase.js";


const db = getFirestore(app);


/* ================= AUTH ================= */

onAuthStateChanged(auth, user => {

  if (!user) {
    window.location.href = "login.html";
  }

});


/* ================= LOGOUT ================= */

document
  .getElementById("logoutBtn")
  .addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

  });


/* ================= ANGGOTA ================= */

const membersRef =
  collection(db, "members");


let membersData = [];


onSnapshot(membersRef, snapshot => {

  membersData = [];

  snapshot.forEach(item => {

    membersData.push({
      id: item.id,
      ...item.data()
    });

  });

  renderMembers();

});


function renderMembers() {

  const container =
    document.getElementById("memberList");

  container.innerHTML = "";

  document.getElementById("memberCount")
    .textContent = membersData.length;


  if (membersData.length === 0) {

    container.innerHTML = `
      <div class="empty-box">
        👥
        <p>Belum ada anggota.</p>
      </div>
    `;

    return;

  }


  membersData.forEach(member => {

    const firstLetter =
      member.name
        ? member.name.charAt(0).toUpperCase()
        : "?";


    container.innerHTML += `

      <div class="member-admin">

        <div class="member-admin-avatar">
          ${firstLetter}
        </div>

        <h3>
          ${escapeHTML(member.name)}
        </h3>

        <p>
          ${escapeHTML(member.role || "Siswa")}
        </p>

        <div class="admin-actions">

          <button
            class="edit-action"
            onclick="editMember('${member.id}')">
            ✏️ Edit
          </button>

          <button
            class="delete-action"
            onclick="deleteMember('${member.id}')">
            🗑️ Hapus
          </button>

        </div>

      </div>

    `;

  });

}


/* OPEN MEMBER */

window.openMemberModal = function(member = null) {

  document
    .getElementById("memberModal")
    .classList.add("show");


  if (member) {

    document.getElementById("memberModalTitle")
      .textContent = "Edit Anggota";

    document.getElementById("memberId")
      .value = member.id;

    document.getElementById("memberName")
      .value = member.name;

    document.getElementById("memberRole")
      .value = member.role || "Siswa";

  } else {

    document.getElementById("memberModalTitle")
      .textContent = "Tambah Anggota";

    document.getElementById("memberForm")
      .reset();

    document.getElementById("memberId")
      .value = "";

  }

};


window.closeMemberModal = function() {

  document
    .getElementById("memberModal")
    .classList.remove("show");

};


/* SAVE MEMBER */

document
  .getElementById("memberForm")
  .addEventListener("submit", async event => {

    event.preventDefault();

    const id =
      document.getElementById("memberId").value;

    const name =
      document.getElementById("memberName").value.trim();

    const role =
      document.getElementById("memberRole").value;


    if (!name) return;


    try {

      if (id) {

        await updateDoc(
          doc(db, "members", id),
          {
            name,
            role,
            updatedAt: serverTimestamp()
          }
        );

      } else {

        await addDoc(
          membersRef,
          {
            name,
            role,
            createdAt: serverTimestamp()
          }
        );

      }

      closeMemberModal();

    } catch (error) {

      alert(
        "Gagal menyimpan anggota."
      );

      console.error(error);

    }

  });


/* EDIT MEMBER */

window.editMember = function(id) {

  const member =
    membersData.find(item => item.id === id);

  if (member) {
    openMemberModal(member);
  }

};


/* DELETE MEMBER */

window.deleteMember = async function(id) {

  const yakin =
    confirm(
      "Hapus anggota ini?"
    );

  if (!yakin) return;


  try {

    await deleteDoc(
      doc(db, "members", id)
    );

  } catch (error) {

    alert(
      "Gagal menghapus anggota."
    );

  }

};


/* ================= JADWAL ================= */

const scheduleRef =
  collection(db, "schedule");


let scheduleData = [];


onSnapshot(scheduleRef, snapshot => {

  scheduleData = [];

  snapshot.forEach(item => {

    scheduleData.push({
      id: item.id,
      ...item.data()
    });

  });

  renderSchedule();

});


function renderSchedule() {

  const tbody =
    document.getElementById("scheduleList");

  tbody.innerHTML = "";

  document.getElementById("scheduleCount")
    .textContent = scheduleData.length;


  if (scheduleData.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          Belum ada jadwal.
        </td>
      </tr>
    `;

    return;

  }


  const dayOrder = {
    "Senin": 1,
    "Selasa": 2,
    "Rabu": 3,
    "Kamis": 4,
    "Jumat": 5,
    "Sabtu": 6
  };


  scheduleData.sort(
    (a,b) =>
      (dayOrder[a.day] || 99) -
      (dayOrder[b.day] || 99)
  );


  scheduleData.forEach(item => {

    tbody.innerHTML += `

      <tr>

        <td>
          ${escapeHTML(item.day)}
        </td>

        <td>
          ${escapeHTML(item.subject)}
        </td>

        <td>
          ${escapeHTML(item.time)}
        </td>

        <td>

          <div class="schedule-action">

            <button
              class="edit-action"
              onclick="editSchedule('${item.id}')">
              ✏️
            </button>

            <button
              class="delete-action"
              onclick="deleteSchedule('${item.id}')">
              🗑️
            </button>

          </div>

        </td>

      </tr>

    `;

  });

}


/* OPEN SCHEDULE */

window.openScheduleModal =
function(schedule = null) {

  document
    .getElementById("scheduleModal")
    .classList.add("show");


  if (schedule) {

    document.getElementById(
      "scheduleModalTitle"
    ).textContent = "Edit Jadwal";


    document.getElementById(
      "scheduleId"
    ).value = schedule.id;


    document.getElementById(
      "scheduleDay"
    ).value = schedule.day;


    document.getElementById(
      "scheduleSubject"
    ).value = schedule.subject;


    document.getElementById(
      "scheduleTime"
    ).value = schedule.time;

  } else {

    document.getElementById(
      "scheduleModalTitle"
    ).textContent = "Tambah Jadwal";


    document.getElementById(
      "scheduleForm"
    ).reset();


    document.getElementById(
      "scheduleId"
    ).value = "";

  }

};


window.closeScheduleModal =
function() {

  document
    .getElementById("scheduleModal")
    .classList.remove("show");

};


/* SAVE SCHEDULE */

document
  .getElementById("scheduleForm")
  .addEventListener("submit", async event => {

    event.preventDefault();


    const id =
      document.getElementById(
        "scheduleId"
      ).value;


    const day =
      document.getElementById(
        "scheduleDay"
      ).value;


    const subject =
      document.getElementById(
        "scheduleSubject"
      ).value.trim();


    const time =
      document.getElementById(
        "scheduleTime"
      ).value.trim();


    if (!subject || !time) return;


    try {

      if (id) {

        await updateDoc(
          doc(db, "schedule", id),
          {
            day,
            subject,
            time,
            updatedAt: serverTimestamp()
          }
        );

      } else {

        await addDoc(
          scheduleRef,
          {
            day,
            subject,
            time,
            createdAt: serverTimestamp()
          }
        );

      }


      closeScheduleModal();

    } catch (error) {

      alert(
        "Gagal menyimpan jadwal."
      );

      console.error(error);

    }

  });


/* EDIT SCHEDULE */

window.editSchedule = function(id) {

  const schedule =
    scheduleData.find(
      item => item.id === id
    );


  if (schedule) {
    openScheduleModal(schedule);
  }

};


/* DELETE SCHEDULE */

window.deleteSchedule =
async function(id) {

  const yakin =
    confirm(
      "Hapus jadwal ini?"
    );

  if (!yakin) return;


  try {

    await deleteDoc(
      doc(db, "schedule", id)
    );

  } catch (error) {

    alert(
      "Gagal menghapus jadwal."
    );

  }

};


/* ================= SECURITY ================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

    }
