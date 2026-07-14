const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const RECIPES = [
  { id: "lentils", name: "Lentejas con verduras", icon: "🥘", time: "40 min", color: "#f2d7bd", ingredients: [["Legumbres", "Lentejas", "250 g"], ["Verdura", "Zanahorias", "2 ud"], ["Verdura", "Cebolla", "1 ud"], ["Verdura", "Pimiento verde", "1 ud"]] },
  { id: "salmon", name: "Salmón con verduras", icon: "🐟", time: "25 min", color: "#d9e7df", ingredients: [["Pescadería", "Salmón", "2 lomos"], ["Verdura", "Calabacín", "1 ud"], ["Verdura", "Brócoli", "1 ud"]] },
  { id: "tortilla", name: "Tortilla de patatas", icon: "🍳", time: "35 min", color: "#f5e4a8", ingredients: [["Huevos y lácteos", "Huevos", "6 ud"], ["Verdura", "Patatas", "700 g"], ["Verdura", "Cebolla", "1 ud"]] },
  { id: "pasta", name: "Pasta al pesto", icon: "🍝", time: "20 min", color: "#dce8c9", ingredients: [["Despensa", "Pasta", "300 g"], ["Verdura", "Albahaca", "1 manojo"], ["Despensa", "Piñones", "40 g"], ["Huevos y lácteos", "Parmesano", "80 g"]] },
  { id: "chicken", name: "Pollo al horno", icon: "🍗", time: "50 min", color: "#eed2bd", ingredients: [["Carnicería", "Muslos de pollo", "4 ud"], ["Verdura", "Patatas", "500 g"], ["Verdura", "Limón", "1 ud"]] },
  { id: "salad", name: "Ensalada completa", icon: "🥗", time: "15 min", color: "#d9e8c6", ingredients: [["Verdura", "Mezcla de lechugas", "1 bolsa"], ["Verdura", "Tomates", "3 ud"], ["Despensa", "Atún", "2 latas"], ["Huevos y lácteos", "Huevos", "2 ud"]] },
  { id: "cream", name: "Crema de calabaza", icon: "🍲", time: "35 min", color: "#f3cda7", ingredients: [["Verdura", "Calabaza", "800 g"], ["Verdura", "Puerro", "1 ud"], ["Huevos y lácteos", "Nata", "200 ml"]] },
  { id: "tacos", name: "Tacos caseros", icon: "🌮", time: "30 min", color: "#f0d8a4", ingredients: [["Carnicería", "Carne picada", "400 g"], ["Despensa", "Tortillas de maíz", "8 ud"], ["Verdura", "Tomates", "2 ud"], ["Verdura", "Aguacate", "2 ud"]] },
  { id: "rice", name: "Arroz con verduras", icon: "🍚", time: "30 min", color: "#e8e1c8", ingredients: [["Despensa", "Arroz", "300 g"], ["Verdura", "Pimiento rojo", "1 ud"], ["Verdura", "Guisantes", "200 g"], ["Verdura", "Champiñones", "200 g"]] }
];

const state = {
  weekOffset: 0,
  plans: JSON.parse(localStorage.getItem("mesa-plans") || "{}"),
  notes: JSON.parse(localStorage.getItem("mesa-notes") || "{}"),
  checked: JSON.parse(localStorage.getItem("mesa-checked") || "{}"),
  activeSlot: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function mondayOf(date) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  result.setHours(12, 0, 0, 0);
  return result;
}

function currentMonday() {
  const date = mondayOf(new Date());
  date.setDate(date.getDate() + state.weekOffset * 7);
  return date;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function weekKey() { return dateKey(currentMonday()); }
function planKey(dayIndex, type) { return `${weekKey()}-${dayIndex}-${type}`; }

function save() {
  localStorage.setItem("mesa-plans", JSON.stringify(state.plans));
  localStorage.setItem("mesa-notes", JSON.stringify(state.notes));
  localStorage.setItem("mesa-checked", JSON.stringify(state.checked));
}

function recipeFor(value) {
  if (!value) return null;
  return RECIPES.find((recipe) => recipe.id === value) || { id: value, name: value.replace("custom:", ""), icon: "🍽️", time: "Plato propio", color: "#e4e4dc", ingredients: [] };
}

function renderWeek() {
  const monday = currentMonday();
  const sunday = new Date(monday); sunday.setDate(sunday.getDate() + 6);
  const range = monday.getMonth() === sunday.getMonth()
    ? `${monday.getDate()} – ${sunday.getDate()} ${MONTHS[sunday.getMonth()]}`
    : `${monday.getDate()} ${MONTHS[monday.getMonth()]} – ${sunday.getDate()} ${MONTHS[sunday.getMonth()]}`;
  $("#week-range").textContent = range;
  $("#week-year").textContent = sunday.getFullYear();
  $("#week-note").value = state.notes[weekKey()] || "";

  const today = dateKey(new Date());
  $("#week-grid").innerHTML = DAYS.map((day, index) => {
    const date = new Date(monday); date.setDate(date.getDate() + index);
    const isToday = dateKey(date) === today;
    return `<article class="day-card ${isToday ? "today" : ""}">
      <header class="day-header">
        <div class="day-name"><span>${day}</span>${isToday ? '<span class="today-pill">Hoy</span>' : ""}</div>
        <span class="day-number">${date.getDate()}</span>
      </header>
      ${renderSlot(index, "lunch", "Comida")}
      ${renderSlot(index, "dinner", "Cena")}
    </article>`;
  }).join("");
  renderShopping();
}

function renderSlot(dayIndex, type, label) {
  const key = planKey(dayIndex, type);
  const recipe = recipeFor(state.plans[key]);
  if (!recipe) return `<div class="meal-slot">
    <span class="slot-label">${label}</span>
    <button class="meal-empty" data-day="${dayIndex}" data-type="${type}"><span>＋</span>Añadir plato</button>
  </div>`;
  return `<div class="meal-slot">
    <span class="slot-label">${label}</span>
    <button class="remove-meal" data-remove="${key}" aria-label="Quitar ${recipe.name}">×</button>
    <button class="meal-filled" data-day="${dayIndex}" data-type="${type}">
      <span class="meal-visual" style="--meal-color:${recipe.color}">${recipe.icon}</span>
      <strong>${recipe.name}</strong><small>${recipe.time}</small>
    </button>
  </div>`;
}

function openMealModal(day, type) {
  state.activeSlot = { day: Number(day), type };
  $("#modal-slot").textContent = `${type === "lunch" ? "Comida" : "Cena"} · ${DAYS[day]}`;
  $("#meal-search").value = "";
  renderMealOptions();
  $("#meal-modal").classList.add("open");
  $("#meal-modal").setAttribute("aria-hidden", "false");
  setTimeout(() => $("#meal-search").focus(), 50);
}

function closeMealModal() {
  $("#meal-modal").classList.remove("open");
  $("#meal-modal").setAttribute("aria-hidden", "true");
  state.activeSlot = null;
}

function renderMealOptions(filter = "") {
  const query = filter.trim().toLowerCase();
  const matches = RECIPES.filter((recipe) => recipe.name.toLowerCase().includes(query));
  $("#meal-options").innerHTML = matches.map((recipe) => `<button class="meal-option" data-recipe="${recipe.id}">
    <span>${recipe.icon}</span><strong>${recipe.name}</strong><small>${recipe.time}</small>
  </button>`).join("") || `<p>No hay platos que coincidan.</p>`;
}

function selectMeal(recipeId) {
  if (!state.activeSlot) return;
  state.plans[planKey(state.activeSlot.day, state.activeSlot.type)] = recipeId;
  save(); closeMealModal(); renderWeek(); showToast("Plato añadido al menú");
}

function selectedRecipes() {
  const prefix = `${weekKey()}-`;
  return Object.entries(state.plans)
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, value]) => ({ key, recipe: recipeFor(value) }));
}

function shoppingItems() {
  const items = new Map();
  selectedRecipes().forEach(({ recipe }) => recipe.ingredients.forEach(([group, name, quantity]) => {
    const key = `${group}-${name}`;
    if (!items.has(key)) items.set(key, { key, group, name, quantities: [] });
    items.get(key).quantities.push(quantity);
  }));
  return [...items.values()].map((item) => ({ ...item, quantity: item.quantities.join(" + ") }));
}

function renderShopping() {
  const items = shoppingItems();
  const grouped = Object.groupBy ? Object.groupBy(items, (item) => item.group) : items.reduce((acc, item) => ((acc[item.group] ||= []).push(item), acc), {});
  const icons = { "Verdura": "🥬", "Carnicería": "🥩", "Pescadería": "🐟", "Huevos y lácteos": "🥛", "Despensa": "🫙", "Legumbres": "🫘" };
  $("#shopping-count").textContent = items.length;
  $("#shopping-groups").innerHTML = items.length ? Object.entries(grouped).map(([group, groupItems]) => `<section class="shopping-group">
    <h3><span>${icons[group] || "🛒"}</span>${group}</h3>
    ${groupItems.map((item) => {
      const checked = !!state.checked[`${weekKey()}-${item.key}`];
      return `<div class="shopping-item ${checked ? "checked" : ""}">
        <input type="checkbox" id="item-${item.key}" data-item="${item.key}" ${checked ? "checked" : ""} />
        <label for="item-${item.key}">${item.name}</label><small>${item.quantity}</small>
      </div>`;
    }).join("")}
  </section>`).join("") : `<div class="empty-shopping"><span>🧺</span><h2>Tu cesta está esperando</h2><p>Añade platos al menú y aquí aparecerán sus ingredientes.</p></div>`;

  const recipes = selectedRecipes();
  $("#menu-summary-list").innerHTML = recipes.length ? recipes.map(({ key, recipe }) => {
    const [, , , day, type] = key.split("-");
    return `<div class="summary-meal"><span>${recipe.icon}</span><div><strong>${recipe.name}</strong><small>${DAYS[Number(day)]} · ${type === "lunch" ? "Comida" : "Cena"}</small></div></div>`;
  }).join("") : `<p class="hero-copy">Todavía no hay platos elegidos.</p>`;
  updateProgress(items);
}

function updateProgress(items = shoppingItems()) {
  const bought = items.filter((item) => state.checked[`${weekKey()}-${item.key}`]).length;
  const percentage = items.length ? Math.round((bought / items.length) * 100) : 0;
  $("#progress-label").textContent = `${bought} de ${items.length} comprados`;
  $("#progress-percentage").textContent = `${percentage}%`;
  $("#progress-bar").style.width = `${percentage}%`;
}

function switchView(view) {
  $$(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(".view").forEach((element) => element.classList.toggle("active", element.id === `${view}-view`));
  if (view === "shopping") renderShopping();
}

function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("click", (event) => {
  const slot = event.target.closest("[data-day][data-type]");
  if (slot) openMealModal(slot.dataset.day, slot.dataset.type);
  const option = event.target.closest("[data-recipe]");
  if (option) selectMeal(option.dataset.recipe);
  const remove = event.target.closest("[data-remove]");
  if (remove) { delete state.plans[remove.dataset.remove]; save(); renderWeek(); }
  const nav = event.target.closest("[data-view]");
  if (nav) switchView(nav.dataset.view);
});

$("#previous-week").addEventListener("click", () => { state.weekOffset--; renderWeek(); });
$("#next-week").addEventListener("click", () => { state.weekOffset++; renderWeek(); });
$("#close-modal").addEventListener("click", closeMealModal);
$("#meal-modal").addEventListener("click", (event) => { if (event.target === event.currentTarget) closeMealModal(); });
$("#meal-search").addEventListener("input", (event) => renderMealOptions(event.target.value));
$("#week-note").addEventListener("input", (event) => { state.notes[weekKey()] = event.target.value; save(); });
$("#custom-meal-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#custom-meal-name");
  selectMeal(`custom:${input.value.trim()}`); input.value = "";
});
$("#shopping-groups").addEventListener("change", (event) => {
  if (!event.target.dataset.item) return;
  state.checked[`${weekKey()}-${event.target.dataset.item}`] = event.target.checked;
  save(); renderShopping();
});
$("#copy-list").addEventListener("click", async () => {
  const text = shoppingItems().map((item) => `□ ${item.name} — ${item.quantity}`).join("\n");
  if (!text) return showToast("Primero añade algún plato");
  await navigator.clipboard.writeText(text); showToast("Lista copiada");
});
$("#reset-menu").addEventListener("click", () => {
  if (!confirm("¿Quieres vaciar el menú de esta semana?")) return;
  const prefix = `${weekKey()}-`;
  Object.keys(state.plans).filter((key) => key.startsWith(prefix)).forEach((key) => delete state.plans[key]);
  save(); renderWeek(); showToast("Menú semanal vaciado");
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMealModal(); });

renderWeek();
