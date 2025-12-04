let userId = null;
let token = null;
let currentPage = 0;

async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });

    const data = await res.json();

    token = data.token;
    userId = data.userId;

    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";

    loadFeed();
    loadMatches();
}

async function register() {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPass").value;

    await fetch("/api/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, password})
    });

    alert("Cuenta creada. Ahora inicia sesión.");
}

async function loadFeed() {
    const res = await fetch(`/api/pets/feed?userId=${userId}&page=${currentPage}&size=1`, {
        headers: {"Authorization": `Bearer ${token}`}
    });

    const json = await res.json();

    if (json.content.length === 0) {
        document.getElementById("pet").innerHTML = "<h3>No hay más mascotas</h3>";
        return;
    }

    const pet = json.content[0];

    document.getElementById("pet").innerHTML = `
        <h3>${pet.name}</h3>
        <p>${pet.description}</p>
        <img src="${pet.imageUrl}" width="200">
    `;
}

async function swipe(type) {
    await fetch("/api/swipe", {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify({
            userId,
            petId: document.querySelector("#pet img").dataset.id,
            type
        })
    });

    currentPage++;
    loadFeed();
    loadMatches();
}

async function loadMatches() {
    const res = await fetch(`/api/matches/${userId}`, {
        headers: {"Authorization": `Bearer ${token}`}
    });

    const data = await res.json();

    document.getElementById("matches").innerHTML =
        data.map(m => `<p>🐾 Match con ${m.petName}</p>`).join("");
}
