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
  customRecipes: JSON.parse(localStorage.getItem("mesa-recipes") || "[]"),
  activeSlot: null,
  pendingRecipe: null,
  isApplyingCloud: false
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
  localStorage.setItem("mesa-recipes", JSON.stringify(state.customRecipes));
  if (!state.isApplyingCloud) scheduleCloudSave();
}

function recipeFor(value) {
  if (!value) return null;
  return allRecipes().find((recipe) => recipe.id === value) || { id: value, name: value.replace("custom:", ""), icon: "🍽️", time: "Plato propio", color: "#e4e4dc", ingredients: [] };
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
    <button class="remove-meal" data-remove="${key}" aria-label="Quitar ${escapeHtml(recipe.name)}">×</button>
    <button class="meal-filled" data-day="${dayIndex}" data-type="${type}">
      <span class="meal-visual" style="--meal-color:${recipe.color}">${recipe.icon}</span>
      <strong>${escapeHtml(recipe.name)}</strong><small>${escapeHtml(recipe.time)}</small>
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
  const matches = allRecipes().filter((recipe) => recipe.name.toLowerCase().includes(query));
  $("#meal-options").innerHTML = matches.map((recipe) => `<button class="meal-option" data-recipe="${recipe.id}">
    <span>${escapeHtml(recipe.icon)}</span><strong>${escapeHtml(recipe.name)}</strong><small>${escapeHtml(recipe.time)}</small>
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
    const key = encodeURIComponent(`${group}-${name}`);
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
        <label for="item-${item.key}">${escapeHtml(item.name)}</label><small>${escapeHtml(item.quantity)}</small>
      </div>`;
    }).join("")}
  </section>`).join("") : `<div class="empty-shopping"><span>🧺</span><h2>Tu cesta está esperando</h2><p>Añade platos al menú y aquí aparecerán sus ingredientes.</p></div>`;

  const recipes = selectedRecipes();
  $("#menu-summary-list").innerHTML = recipes.length ? recipes.map(({ key, recipe }) => {
    const [, , , day, type] = key.split("-");
    return `<div class="summary-meal"><span>${escapeHtml(recipe.icon)}</span><div><strong>${escapeHtml(recipe.name)}</strong><small>${DAYS[Number(day)]} · ${type === "lunch" ? "Comida" : "Cena"}</small></div></div>`;
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
  if (view === "recipes") renderRecipeLibrary();
}

function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}


function allRecipes() {
  return [...RECIPES, ...state.customRecipes];
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function renderRecipeLibrary(filter = "") {
  const query = filter.trim().toLowerCase();
  const recipes = allRecipes().filter((recipe) => recipe.name.toLowerCase().includes(query));
  $("#recipe-count").textContent = `${recipes.length} platos`;
  $("#recipe-library").innerHTML = recipes.map((recipe) => {
    const personal = recipe.id.startsWith("recipe-");
    return `<article class="recipe-card">
      <span class="recipe-tag">${personal ? "Personal" : "De inicio"}</span>
      <div class="recipe-card-visual" style="--recipe-color:${recipe.color}">${escapeHtml(recipe.icon)}</div>
      <div class="recipe-card-body">
        <h3>${escapeHtml(recipe.name)}</h3>
        <div class="recipe-meta"><span>◷ ${escapeHtml(recipe.time || "Sin tiempo")}</span><span>${recipe.ingredients.length} ingredientes</span></div>
      </div>
      <div class="recipe-card-actions">
        ${personal ? `<button data-edit-recipe="${recipe.id}">Editar</button>` : ""}
        <button class="use-recipe" data-use-recipe="${recipe.id}">Usar en menú</button>
      </div>
    </article>`;
  }).join("") || `<div class="empty-shopping"><span>🍽️</span><h2>No encontramos ese plato</h2><p>Prueba otra búsqueda o añade una receta nueva.</p></div>`;
}

function ingredientRow([group = "Verdura", name = "", quantity = ""] = []) {
  const groups = ["Verdura", "Carnicería", "Pescadería", "Huevos y lácteos", "Despensa", "Legumbres", "Panadería", "Otros"];
  return `<div class="ingredient-row">
    <select class="ingredient-group">${groups.map((item) => `<option ${item === group ? "selected" : ""}>${item}</option>`).join("")}</select>
    <input class="ingredient-name" value="${escapeHtml(name)}" placeholder="Ingrediente" />
    <input class="ingredient-quantity" value="${escapeHtml(quantity)}" placeholder="Cantidad" />
    <button class="remove-ingredient" type="button" data-remove-ingredient aria-label="Quitar">×</button>
  </div>`;
}

function openRecipeEditor(recipeId = "") {
  const recipe = recipeId ? recipeFor(recipeId) : null;
  $("#recipe-modal-title").textContent = recipe ? "Editar plato" : "Nuevo plato";
  $("#recipe-edit-id").value = recipe?.id || "";
  $("#recipe-name").value = recipe?.name || "";
  $("#recipe-icon").value = recipe?.icon || "🍲";
  $("#recipe-time").value = recipe?.time || "";
  $("#delete-recipe").disabled = !recipe;
  $("#ingredient-rows").innerHTML = (recipe?.ingredients?.length ? recipe.ingredients : [["Verdura", "", ""]]).map(ingredientRow).join("");
  openModal("#recipe-modal");
  setTimeout(() => $("#recipe-name").focus(), 50);
}

function closeRecipeEditor() {
  closeModal("#recipe-modal");
  $("#recipe-form").reset();
}

function openModal(selector) {
  $(selector).classList.add("open");
  $(selector).setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(selector) {
  $(selector).classList.remove("open");
  $(selector).setAttribute("aria-hidden", "true");
  if (!$$(".modal-backdrop.open").length) document.body.classList.remove("modal-open");
}

function saveRecipeFromForm(event) {
  event.preventDefault();
  const id = $("#recipe-edit-id").value || `recipe-${crypto.randomUUID()}`;
  const ingredients = $$("#ingredient-rows .ingredient-row").map((row) => [
    row.querySelector(".ingredient-group").value,
    row.querySelector(".ingredient-name").value.trim(),
    row.querySelector(".ingredient-quantity").value.trim()
  ]).filter(([, name]) => name);
  const recipe = {
    id,
    name: $("#recipe-name").value.trim(),
    icon: $("#recipe-icon").value,
    time: $("#recipe-time").value.trim() || "Sin tiempo",
    color: ["#d9e8c6", "#f3cda7", "#d9e7df", "#f0d8a4"][state.customRecipes.findIndex((item) => item.id === id) % 4] || "#e5ebdd",
    ingredients
  };
  const existing = state.customRecipes.findIndex((item) => item.id === id);
  if (existing >= 0) state.customRecipes[existing] = recipe;
  else state.customRecipes.push(recipe);
  save(); closeRecipeEditor(); renderRecipeLibrary(); showToast("Plato guardado en tu recetario");
}

function deleteCurrentRecipe() {
  const id = $("#recipe-edit-id").value;
  if (!id || !confirm("¿Eliminar este plato de tu recetario?")) return;
  state.customRecipes = state.customRecipes.filter((recipe) => recipe.id !== id);
  Object.keys(state.plans).forEach((key) => { if (state.plans[key] === id) delete state.plans[key]; });
  save(); closeRecipeEditor(); renderRecipeLibrary(); renderWeek(); showToast("Plato eliminado");
}

const cloudConfig = window.MESA_CONFIG || {};
let cloudClient = null;
let cloudSession = null;
let realtimeChannel = null;
let cloudSaveTimer = null;

function localSnapshot() {
  return { plans: state.plans, notes: state.notes, checked: state.checked, customRecipes: state.customRecipes };
}

function scheduleCloudSave() {
  if (!cloudClient || !cloudSession) return;
  clearTimeout(cloudSaveTimer);
  setSyncStatus("Guardando…", "Enviando tus cambios");
  cloudSaveTimer = setTimeout(pushCloudState, 650);
}

async function pushCloudState() {
  if (!cloudClient || !cloudSession) return;
  const { error } = await cloudClient.from("mesa_user_data").upsert({
    user_id: cloudSession.user.id,
    data: localSnapshot(),
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id" });
  if (error) {
    setSyncStatus("Sin conexión", "Los cambios siguen guardados en este dispositivo");
    console.error("Mesa sync:", error.message);
  } else {
    setSyncStatus("Sincronizado", "Todos tus dispositivos están al día");
  }
}

function applyCloudState(data) {
  if (!data) return;
  state.isApplyingCloud = true;
  state.plans = data.plans || {};
  state.notes = data.notes || {};
  state.checked = data.checked || {};
  state.customRecipes = data.customRecipes || [];
  save();
  state.isApplyingCloud = false;
  renderWeek(); renderRecipeLibrary();
}

async function loadCloudState() {
  const { data, error } = await cloudClient.from("mesa_user_data").select("data").eq("user_id", cloudSession.user.id).maybeSingle();
  if (error) {
    setSyncStatus("No se pudo sincronizar", error.message);
    return;
  }
  if (data?.data) applyCloudState(data.data);
  else await pushCloudState();
}

function subscribeToCloud() {
  if (realtimeChannel) cloudClient.removeChannel(realtimeChannel);
  realtimeChannel = cloudClient.channel(`mesa-${cloudSession.user.id}`)
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "mesa_user_data", filter: `user_id=eq.${cloudSession.user.id}` }, (payload) => {
      if (payload.new?.data) applyCloudState(payload.new.data);
    }).subscribe();
}

function setSyncStatus(title, detail) {
  if ($("#sync-status-title")) $("#sync-status-title").textContent = title;
  if ($("#sync-status-detail")) $("#sync-status-detail").textContent = detail;
}

function updateAccountUI() {
  const signedIn = !!cloudSession;
  $("#signed-out-panel").hidden = signedIn;
  $("#signed-in-panel").hidden = !signedIn;
  $("#account-button").classList.toggle("connected", signedIn);
  $("#account-label").textContent = signedIn ? "Sincronizado" : "Sincronizar";
  if (signedIn) $("#user-email").textContent = cloudSession.user.email;
}

async function initializeCloud() {
  if (!cloudConfig.supabaseUrl || !cloudConfig.supabasePublishableKey || !window.supabase?.createClient) {
    $("#account-label").textContent = "Solo local";
    return;
  }
  cloudClient = window.supabase.createClient(cloudConfig.supabaseUrl, cloudConfig.supabasePublishableKey);
  const { data: { session } } = await cloudClient.auth.getSession();
  cloudSession = session;
  updateAccountUI();
  if (session) { await loadCloudState(); subscribeToCloud(); }
  cloudClient.auth.onAuthStateChange(async (event, sessionValue) => {
    cloudSession = sessionValue;
    updateAccountUI();
    if (sessionValue && event === "SIGNED_IN") { await loadCloudState(); subscribeToCloud(); }
  });
}

function bindExtendedEvents() {
  $("#new-recipe").addEventListener("click", () => openRecipeEditor());
  $("#close-recipe-modal").addEventListener("click", closeRecipeEditor);
  $("#recipe-form").addEventListener("submit", saveRecipeFromForm);
  $("#add-ingredient").addEventListener("click", () => $("#ingredient-rows").insertAdjacentHTML("beforeend", ingredientRow()));
  $("#delete-recipe").addEventListener("click", deleteCurrentRecipe);
  $("#recipe-search").addEventListener("input", (event) => renderRecipeLibrary(event.target.value));
  $("#recipe-library").addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-recipe]");
    if (edit) openRecipeEditor(edit.dataset.editRecipe);
    const use = event.target.closest("[data-use-recipe]");
    if (use) {
      state.pendingRecipe = use.dataset.useRecipe;
      switchView("menu");
      showToast("Ahora elige una comida o cena");
    }
  });
  $("#ingredient-rows").addEventListener("click", (event) => {
    if (event.target.closest("[data-remove-ingredient]")) event.target.closest(".ingredient-row").remove();
  });
  $("#recipe-modal").addEventListener("click", (event) => { if (event.target === event.currentTarget) closeRecipeEditor(); });

  $("#account-button").addEventListener("click", () => { updateAccountUI(); openModal("#account-modal"); });
  $("#close-account-modal").addEventListener("click", () => closeModal("#account-modal"));
  $("#account-modal").addEventListener("click", (event) => { if (event.target === event.currentTarget) closeModal("#account-modal"); });
  $("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!cloudClient) return showToast("La nube aún no está configurada");
    const email = $("#login-email").value.trim();
    const { error } = await cloudClient.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href.split("#")[0] } });
    if (error) showToast(error.message);
    else showToast("Revisa tu correo para entrar");
  });
  $("#logout-button").addEventListener("click", async () => {
    await cloudClient?.auth.signOut();
    cloudSession = null; updateAccountUI(); closeModal("#account-modal"); showToast("Sesión cerrada");
  });
}

async function initializeApp() {
  renderWeek();
  renderRecipeLibrary();
  bindExtendedEvents();
  await initializeCloud();
}
document.addEventListener("click", (event) => {
  const slot = event.target.closest("[data-day][data-type]");
  if (slot && state.pendingRecipe) {
    state.plans[planKey(Number(slot.dataset.day), slot.dataset.type)] = state.pendingRecipe;
    state.pendingRecipe = null; save(); renderWeek(); showToast("Plato añadido al menú");
  } else if (slot) {
    openMealModal(slot.dataset.day, slot.dataset.type);
  }
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
$("#reset-menu")?.addEventListener("click", () => {
  if (!confirm("¿Quieres vaciar el menú de esta semana?")) return;
  const prefix = `${weekKey()}-`;
  Object.keys(state.plans).filter((key) => key.startsWith(prefix)).forEach((key) => delete state.plans[key]);
  save(); renderWeek(); showToast("Menú semanal vaciado");
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMealModal(); });

initializeApp();
