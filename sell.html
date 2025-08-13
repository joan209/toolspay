import { 
  auth, 
  onAuthStateChanged, 
  listGiftcards, 
  createTradeRequest 
} from './firebase-auth.js';

let selectedCardId = null;

const loader = document.getElementById("loader");
const container = document.querySelector(".container");
const giftcardList = document.getElementById("giftcard-list");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  
  loader.style.display = "block";
  
  const cards = await listGiftcards();
  giftcardList.innerHTML = "";
  
  cards.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "giftcard-item";
    cardDiv.innerHTML = `
      <img src="${card.logoUrl}" alt="${card.name}" />
      <p>${card.name}</p>
    `;
    cardDiv.addEventListener("click", () => {
      document.querySelectorAll(".giftcard-item").forEach(c => c.classList.remove("selected"));
      cardDiv.classList.add("selected");
      selectedCardId = card.id;
    });
    giftcardList.appendChild(cardDiv);
  });

  loader.style.display = "none";
  container.style.display = "block";
});

document.getElementById("sellForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedCardId) {
    alert("Please select a gift card type.");
    return;
  }

  const amount = document.getElementById("amount").value;
  const country = document.getElementById("country").value;
  const file = document.getElementById("uploadProof").files[0];

  const user = auth.currentUser;
  if (!user) return;

  try {
    await createTradeRequest({
      uid: user.uid,
      email: user.email,
      cardId: selectedCardId,
      usd: amount,
      countryCode: country,
      uploadFile: file
    });

    alert("Request submitted successfully!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
});
