document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');

  const links = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');

  function showSection(id) {
    sections.forEach(sec => {
      sec.classList.remove('active');
      if (sec.id === id) sec.classList.add('active');
    });
  }

  links.forEach(link => {
    const target = link.getAttribute('href').replace('#', '');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', '#' + target);
      showSection(target);
      if (target === 'calendrier') loadReservations();
    });
  });

  const initial = location.hash.replace('#', '') || 'accueil';
  showSection(initial);

  const form = document.getElementById('reservationForm');
  const confirmation = document.getElementById('confirmationReservation');

  form?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nom = document.getElementById('nomReservation').value;
    const email = document.getElementById('emailReservation').value;
    const date = document.getElementById('dateReservation').value;
    const heure = document.getElementById('heureReservation').value;

    await db.collection("reservations").add({
      title: nom,
      email: email,
      start: date + 'T' + heure
    });

    confirmation.innerHTML = "<p>Réservation confirmée pour " + nom + ".</p>";
    form.reset();
  });

  const fideliteForm = document.getElementById('registerForm');
  const confirmationFid = document.getElementById('confirmationFidelite');

  fideliteForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nom = document.getElementById('nomFidelite').value;
    const email = document.getElementById('emailFidelite').value;

    await db.collection("clients").add({ nom, email, points: 0 });
    confirmationFid.innerHTML = "<p>Bienvenue, " + nom + " !</p>";
    fideliteForm.reset();
  });

  const searchBtn = document.getElementById('searchClientBtn');
  const searchInput = document.getElementById('searchClientInput');
  const resultBox = document.getElementById('clientResult');

  searchBtn?.addEventListener('click', async () => {
    const search = searchInput.value.trim().toLowerCase();
    const snapshot = await db.collection("clients").get();
    const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const found = clients.find(c => c.nom.toLowerCase() === search || c.email.toLowerCase() === search);

    if (found) {
      resultBox.innerHTML = 
        <p><strong>Nom :</strong> ${found.nom}</p>
        <p><strong>Email :</strong> ${found.email}</p>
        <p><strong>Points :</strong> <span id="pointsDisplay">${found.points}</span></p>
        <button id="addPoint">+ Ajouter 1 point</button>
        <button id="removePoint">– Retirer 1 point</button>
      ;
      document.getElementById('addPoint').addEventListener('click', async () => {
        await db.collection("clients").doc(found.id).update({ points: found.points + 1 });
        document.getElementById('pointsDisplay').innerText = found.points + 1;
        found.points++;
      });
      document.getElementById('removePoint').addEventListener('click', async () => {
        const newPoints = Math.max(0, found.points - 1);
        await db.collection("clients").doc(found.id).update({ points: newPoints });
        document.getElementById('pointsDisplay').innerText = newPoints;
        found.points = newPoints;
      });
    } else {
      resultBox.innerHTML = "<p>Aucun client trouvé.</p>";
    }
  });

  const showAllClientsBtn = document.getElementById('showAllClients');
  const clientList = document.getElementById('clientList');

  showAllClientsBtn?.addEventListener('click', async () => {const snapshot = await db.collection("clients").get();
    clientList.innerHTML = '';
    if (snapshot.empty) {
      clientList.innerHTML = '<li>Aucun client enregistré.</li>';
    } else {
      snapshot.forEach(doc => {
        const c = doc.data();
        const li = document.createElement('li');
        li.textContent = ${c.nom} (${c.email}) – ${c.points} point(s);
        clientList.appendChild(li);
      });
    }
  });

  async function loadReservations() {
    const calendarEl = document.getElementById('calendar');
    calendarEl.innerHTML = '';
    const snapshot = await db.collection("reservations").get();
    const events = snapshot.docs.map(doc => doc.data());

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'fr',
      height: 500,
      events
    });
    calendar.render();
  }

  if (initial === 'calendrier') loadReservations();
});
