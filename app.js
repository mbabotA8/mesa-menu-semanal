const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MEAL_SLOTS = [
  { type: "breakfast", label: "Desayuno", minimum: 3 },
  { type: "morning", label: "Media mañana", minimum: 5 },
  { type: "lunch", label: "Comida", minimum: 2 },
  { type: "afternoon", label: "Merienda", minimum: 4 },
  { type: "dinner", label: "Cena", minimum: 2 }
];
const MAX_SAVED_WEEKS = 5;

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

const RECIPE_ICON_GROUPS = {
  "Pastas y arroces": [
    ["🍝", "Espaguetis"], ["🍝🍅", "Pasta con tomate"], ["🍝🌿", "Pasta al pesto"],
    ["🧀🍝", "Pasta con queso"], ["🍜", "Fideos o noodles"], ["🥟", "Ravioli o pasta rellena"],
    ["🍚", "Arroz"], ["🥘", "Paella o arroz guisado"], ["🍛", "Curry con arroz"]
  ],
  "Verduras y platos ligeros": [
    ["🥗", "Ensalada"], ["🥦", "Brócoli"], ["🥕", "Zanahoria"], ["🍅", "Tomate"],
    ["🥬", "Verdura de hoja"], ["🫑", "Pimiento"], ["🍆", "Berenjena"], ["🥒", "Calabacín o pepino"],
    ["🥔", "Patata"], ["🍄", "Setas"], ["🧅", "Cebolla"], ["🥑", "Aguacate"], ["🌽", "Maíz"]
  ],
  "Carnes": [
    ["🥩", "Ternera"], ["🍗", "Pollo"], ["🍖", "Carne asada"], ["🥓", "Cerdo o bacon"],
    ["🐑", "Cordero"], ["🍔", "Hamburguesa"], ["🌭", "Salchichas"], ["🧆", "Albóndigas"]
  ],
  "Pescados y mariscos": [
    ["🐟", "Pescado"], ["🐠", "Pescado tropical"], ["🐡", "Pescado especial"], ["🦐", "Gambas"],
    ["🦑", "Calamar"], ["🐙", "Pulpo"], ["🦀", "Cangrejo"], ["🦪", "Marisco"]
  ],
  "Legumbres, sopas y huevos": [
    ["🫘", "Legumbres"], ["🥘🫘", "Guiso de legumbres"], ["🍲", "Guiso"], ["🥣", "Sopa o crema"],
    ["🍳", "Huevos"], ["🥚", "Huevo cocido"], ["🧀", "Plato con queso"]
  ],
  "Otros favoritos": [
    ["🍕", "Pizza"], ["🌮", "Tacos"], ["🥙", "Kebab o pita"], ["🥪", "Bocadillo"],
    ["🫓", "Torta o focaccia"], ["🍱", "Plato combinado"], ["🍽️", "Plato general"], ["🔥", "Barbacoa"]
  ]
};

const state = {
  weekOffset: 0,
  plans: JSON.parse(localStorage.getItem("mesa-plans") || "{}"),
  notes: JSON.parse(localStorage.getItem("mesa-notes") || "{}"),
  checked: JSON.parse(localStorage.getItem("mesa-checked") || "{}"),
  customRecipes: JSON.parse(localStorage.getItem("mesa-recipes") || "[]"),
  childMenuEnabled: JSON.parse(localStorage.getItem("mesa-child-menu") || "false"),
  mealCount: Number(localStorage.getItem("mesa-meal-count") || 2),
  savedWeeks: JSON.parse(localStorage.getItem("mesa-saved-weeks") || "[]"),
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

function normalizeMealCount(value) {
  return Math.min(5, Math.max(2, Number(value) || 2));
}

state.mealCount = normalizeMealCount(state.mealCount);
state.savedWeeks = Array.isArray(state.savedWeeks) ? state.savedWeeks.slice(0, MAX_SAVED_WEEKS) : [];

function activeMealSlots(count = state.mealCount) {
  const normalized = normalizeMealCount(count);
  return MEAL_SLOTS.filter((slot) => slot.minimum <= normalized);
}

function baseMealType(type) {
  return String(type || "").replace(/-child$/, "");
}

function mealLabel(type) {
  return MEAL_SLOTS.find((slot) => slot.type === baseMealType(type))?.label || "Comida";
}

function isActiveMealType(type, count = state.mealCount) {
  return activeMealSlots(count).some((slot) => slot.type === baseMealType(type));
}

function parsePlanEntry(key, targetWeek = weekKey()) {
  const prefix = `${targetWeek}-`;
  if (!key.startsWith(prefix)) return null;
  const match = key.slice(prefix.length).match(/^(\d+)-(.+)$/);
  return match ? { day: Number(match[1]), type: match[2] } : null;
}

function save() {
  localStorage.setItem("mesa-plans", JSON.stringify(state.plans));
  localStorage.setItem("mesa-notes", JSON.stringify(state.notes));
  localStorage.setItem("mesa-checked", JSON.stringify(state.checked));
  localStorage.setItem("mesa-recipes", JSON.stringify(state.customRecipes));
  localStorage.setItem("mesa-child-menu", JSON.stringify(state.childMenuEnabled));
  localStorage.setItem("mesa-meal-count", String(state.mealCount));
  localStorage.setItem("mesa-saved-weeks", JSON.stringify(state.savedWeeks));
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
  $("#child-menu-enabled").checked = state.childMenuEnabled;
  $("#meal-count").value = String(state.mealCount);
  $("#week-grid").dataset.mealCount = String(state.mealCount);

  const today = dateKey(new Date());
  $("#week-grid").innerHTML = DAYS.map((day, index) => {
    const date = new Date(monday); date.setDate(date.getDate() + index);
    const isToday = dateKey(date) === today;
    return `<article class="day-card ${isToday ? "today" : ""}">
      <header class="day-header">
        <div class="day-name"><span>${day}</span>${isToday ? '<span class="today-pill">Hoy</span>' : ""}</div>
        <span class="day-number">${date.getDate()}</span>
      </header>
      <div class="day-meals">
        ${activeMealSlots().map((slot) => renderSlot(index, slot.type, slot.label)).join("")}
      </div>
    </article>`;
  }).join("");
  renderShopping();
}

function renderSlot(dayIndex, type, label) {
  const key = planKey(dayIndex, type);
  const recipe = recipeFor(state.plans[key]);
  const mainMeal = recipe ? `
    <button class="remove-meal" data-remove="${key}" aria-label="Quitar ${escapeHtml(recipe.name)}">×</button>
    <button class="meal-filled" data-day="${dayIndex}" data-type="${type}">
      <span class="meal-visual" style="--meal-color:${recipe.color}">${escapeHtml(recipe.icon)}</span>
      <strong>${escapeHtml(recipe.name)}</strong><small>${escapeHtml(recipe.time)}</small>
    </button>` : `
    <button class="meal-empty" data-day="${dayIndex}" data-type="${type}"><span>＋</span>Añadir plato</button>`;

  const childType = `${type}-child`;
  const childKey = planKey(dayIndex, childType);
  const childRecipe = recipeFor(state.plans[childKey]);
  const childMeal = !state.childMenuEnabled ? "" : childRecipe ? `
    <div class="child-meal child-meal-filled">
      <span class="child-label">🧒 Infantil</span>
      <button class="child-remove" data-remove="${childKey}" aria-label="Quitar ${escapeHtml(childRecipe.name)}">×</button>
      <button class="child-filled" data-day="${dayIndex}" data-type="${childType}">
        <span style="--meal-color:${childRecipe.color}">${escapeHtml(childRecipe.icon)}</span>
        <strong>${escapeHtml(childRecipe.name)}</strong>
      </button>
    </div>` : `
    <div class="child-meal">
      <span class="child-label">🧒 Infantil</span>
      <button class="child-empty" data-day="${dayIndex}" data-type="${childType}"><span>＋</span> Añadir plato infantil</button>
    </div>`;

  return `<div class="meal-slot">
    <span class="slot-label">${label}</span>
    ${mainMeal}
    ${childMeal}
  </div>`;
}

function openMealModal(day, type) {
  state.activeSlot = { day: Number(day), type };
  const child = type.endsWith("-child");
  const mealName = mealLabel(type);
  $("#modal-slot").textContent = `${mealName}${child ? " infantil" : ""} · ${DAYS[day]}`;
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
    .map(([key, value]) => ({ key, value, parsed: parsePlanEntry(key) }))
    .filter(({ key, parsed }) => key.startsWith(prefix) && parsed && isActiveMealType(parsed.type) && (state.childMenuEnabled || !parsed.type.endsWith("-child")))
    .map(({ key, value, parsed }) => ({ key, day: parsed.day, type: parsed.type, recipe: recipeFor(value) }));
}

function parseQuantity(value) {
  const match = String(value || "").trim().replace(",", ".").match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  return match ? { amount: Number(match[1]), unit: match[2].trim() } : null;
}

function formatAmount(amount) {
  return Number.isInteger(amount) ? String(amount) : String(Math.round(amount * 100) / 100).replace(".", ",");
}

function combineQuantities(quantities) {
  const parsed = quantities.map(parseQuantity);
  const sameUnit = parsed.every(Boolean) && parsed.every((item) => item.unit.toLowerCase() === parsed[0].unit.toLowerCase());
  if (!sameUnit) return quantities.join(" + ");
  const total = parsed.reduce((sum, item) => sum + item.amount, 0);
  return `${formatAmount(total)} ${parsed[0].unit}`.trim();
}

function shoppingItems() {
  const items = new Map();
  selectedRecipes().forEach(({ recipe }) => recipe.ingredients.forEach(([group, name, quantity]) => {
    const key = encodeURIComponent(`${group}-${name}`);
    if (!items.has(key)) items.set(key, { key, group, name, quantities: [] });
    items.get(key).quantities.push(quantity);
  }));
  return [...items.values()].map((item) => ({ ...item, quantity: combineQuantities(item.quantities) }));
}

function shoppingRecord(item) {
  const stored = state.checked[`${weekKey()}-${item.key}`];
  const required = typeof stored === "object" && stored?.required ? stored.required : item.quantity;
  const parsed = parseQuantity(required);
  if (typeof stored === "boolean") return { done: stored, bought: stored && parsed ? parsed.amount : 0, required };
  return { done: false, bought: 0, required, ...(stored || {}) };
}

function itemCompletion(item) {
  const record = shoppingRecord(item);
  if (record.done) return 1;
  const required = parseQuantity(record.required);
  if (!required || required.amount <= 0) return 0;
  return Math.min(Math.max(Number(record.bought) || 0, 0) / required.amount, 1);
}

function renderShopping() {
  const items = shoppingItems();
  const grouped = Object.groupBy ? Object.groupBy(items, (item) => item.group) : items.reduce((acc, item) => ((acc[item.group] ||= []).push(item), acc), {});
  const icons = { "Verdura": "🥬", "Carnicería": "🥩", "Pescadería": "🐟", "Huevos y lácteos": "🥛", "Despensa": "🫙", "Legumbres": "🫘", "Panadería": "🥖", "Otros": "🛒" };
  $("#shopping-count").textContent = items.length;
  $("#shopping-groups").innerHTML = items.length ? Object.entries(grouped).map(([group, groupItems]) => `<section class="shopping-group">
    <h3><span>${icons[group] || "🛒"}</span>${group}</h3>
    ${groupItems.map((item) => {
      const record = shoppingRecord(item);
      const completion = itemCompletion(item);
      const complete = completion >= 1;
      const partial = completion > 0 && !complete;
      return `<div class="shopping-item ${complete ? "checked" : partial ? "partial" : ""}">
        <input class="item-complete" type="checkbox" id="item-${item.key}" data-item="${item.key}" data-action="complete" ${complete ? "checked" : ""} />
        <label for="item-${item.key}">${escapeHtml(item.name)}</label>
        <div class="quantity-control" title="Cantidad comprada de cantidad necesaria">
          <input class="bought-quantity" type="number" min="0" step="0.1" inputmode="decimal" data-item="${item.key}" data-action="bought" value="${record.bought || ""}" aria-label="Cantidad comprada de ${escapeHtml(item.name)}" placeholder="0" />
          <span>de</span>
          <input class="required-quantity" type="text" data-item="${item.key}" data-action="required" value="${escapeHtml(record.required)}" aria-label="Cantidad necesaria de ${escapeHtml(item.name)}" />
        </div>
      </div>`;
    }).join("")}
  </section>`).join("") : `<div class="empty-shopping"><span>🧺</span><h2>Tu cesta está esperando</h2><p>Añade platos al menú y aquí aparecerán sus ingredientes.</p></div>`;

  const recipes = selectedRecipes();
  $("#menu-summary-list").innerHTML = recipes.length ? recipes.map(({ day, type, recipe }) => {
    const childLabel = type.endsWith("-child") ? " infantil" : "";
    return `<div class="summary-meal"><span>${escapeHtml(recipe.icon)}</span><div><strong>${escapeHtml(recipe.name)}</strong><small>${DAYS[day]} · ${mealLabel(type)}${childLabel}</small></div></div>`;
  }).join("") : `<p class="hero-copy">Todavía no hay platos elegidos.</p>`;
  updateProgress(items);
}

function updateProgress(items = shoppingItems()) {
  const completions = items.map(itemCompletion);
  const complete = completions.filter((value) => value >= 1).length;
  const partial = completions.filter((value) => value > 0 && value < 1).length;
  const percentage = items.length ? Math.round((completions.reduce((sum, value) => sum + value, 0) / items.length) * 100) : 0;
  $("#progress-label").textContent = partial ? `${complete} completos · ${partial} parciales` : `${complete} de ${items.length} comprados`;
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
function populateRecipeIcons() {
  $("#recipe-icon").innerHTML = Object.entries(RECIPE_ICON_GROUPS).map(([group, icons]) =>
    `<optgroup label="${escapeHtml(group)}">${icons.map(([icon, label]) =>
      `<option value="${escapeHtml(icon)}">${escapeHtml(icon)} · ${escapeHtml(label)}</option>`
    ).join("")}</optgroup>`
  ).join("");
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

function cloneRecipe(recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    icon: recipe.icon,
    time: recipe.time,
    color: recipe.color,
    ingredients: (recipe.ingredients || []).map((ingredient) => [...ingredient])
  };
}

function currentWeekSlots() {
  return Object.entries(state.plans).flatMap(([key, recipeId]) => {
    const parsed = parsePlanEntry(key);
    if (!parsed || !isActiveMealType(parsed.type)) return [];
    const recipe = recipeFor(recipeId);
    return recipe ? [{ day: parsed.day, type: parsed.type, recipe: cloneRecipe(recipe) }] : [];
  });
}

function weekHasContent() {
  const prefix = `${weekKey()}-`;
  return Boolean(state.notes[weekKey()]?.trim()) || Object.keys(state.plans).some((key) => key.startsWith(prefix));
}

function buildWeekTemplate(title, id = `week-${crypto.randomUUID()}`) {
  return {
    id,
    title,
    savedAt: new Date().toISOString(),
    mealCount: state.mealCount,
    childMenuEnabled: state.childMenuEnabled,
    note: state.notes[weekKey()] || "",
    slots: currentWeekSlots()
  };
}

function renderSavedWeeks() {
  const capacity = $("#saved-weeks-capacity");
  const full = state.savedWeeks.length >= MAX_SAVED_WEEKS;
  capacity.textContent = full
    ? "Has alcanzado el máximo de 5 semanas. Elimina o reemplaza una para guardar otra."
    : `${state.savedWeeks.length} de ${MAX_SAVED_WEEKS} semanas guardadas.`;
  capacity.classList.toggle("limit-reached", full);

  $("#saved-weeks-list").innerHTML = state.savedWeeks.length ? state.savedWeeks.map((template) => {
    const mainMeals = (template.slots || []).filter((slot) => !slot.type.endsWith("-child")).length;
    const savedDate = new Date(template.savedAt);
    const dateLabel = Number.isNaN(savedDate.getTime()) ? "Fecha desconocida" : savedDate.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    return `<article class="saved-week-card">
      <div><h3>${escapeHtml(template.title)}</h3><p>${mainMeals} platos · ${normalizeMealCount(template.mealCount)} comidas/día · ${escapeHtml(dateLabel)}</p></div>
      <div class="saved-week-actions">
        <button class="primary-button" type="button" data-load-template="${escapeHtml(template.id)}">Cargar</button>
        <button class="secondary-button" type="button" data-replace-template="${escapeHtml(template.id)}">Reemplazar</button>
        <button class="text-button danger-button" type="button" data-delete-template="${escapeHtml(template.id)}">Eliminar</button>
      </div>
    </article>`;
  }).join("") : `<div class="empty-saved-weeks"><span>🗓️</span><p>Todavía no has guardado ninguna semana.</p></div>`;
}

function openSavedWeeksModal(focusTitle = false) {
  renderSavedWeeks();
  openModal("#saved-weeks-modal");
  if (focusTitle) setTimeout(() => $("#saved-week-name").focus(), 50);
}

function saveWeekTemplate(event) {
  event.preventDefault();
  const title = $("#saved-week-name").value.trim();
  if (!title) return showToast("Escribe un título para la semana");
  if (!currentWeekSlots().length && !state.notes[weekKey()]?.trim()) return showToast("Añade algún plato antes de guardar");

  const existingIndex = state.savedWeeks.findIndex((template) => template.title.localeCompare(title, "es", { sensitivity: "base" }) === 0);
  if (existingIndex >= 0) {
    if (!confirm(`Ya existe “${state.savedWeeks[existingIndex].title}”. ¿Quieres reemplazarla?`)) return;
    state.savedWeeks[existingIndex] = buildWeekTemplate(title, state.savedWeeks[existingIndex].id);
  } else {
    if (state.savedWeeks.length >= MAX_SAVED_WEEKS) return showToast("Elimina o reemplaza una semana guardada");
    state.savedWeeks.unshift(buildWeekTemplate(title));
  }
  $("#saved-week-name").value = "";
  save(); renderSavedWeeks(); showToast("Semana guardada");
}

function sameRecipeContent(left, right) {
  return left.name === right.name && left.icon === right.icon && left.time === right.time
    && left.color === right.color && JSON.stringify(left.ingredients || []) === JSON.stringify(right.ingredients || []);
}

function restoreTemplateRecipe(snapshot) {
  const builtIn = RECIPES.find((recipe) => recipe.id === snapshot.id);
  if (builtIn) return builtIn.id;
  const exact = state.customRecipes.find((recipe) => recipe.id === snapshot.id);
  if (exact && sameRecipeContent(exact, snapshot)) return exact.id;
  const equivalent = state.customRecipes.find((recipe) => sameRecipeContent(recipe, snapshot));
  if (equivalent) return equivalent.id;

  const restored = cloneRecipe(snapshot);
  if (exact || !restored.id?.startsWith("recipe-")) restored.id = `recipe-${crypto.randomUUID()}`;
  state.customRecipes.push(restored);
  return restored.id;
}

function clearCurrentWeek() {
  const prefix = `${weekKey()}-`;
  Object.keys(state.plans).filter((key) => key.startsWith(prefix)).forEach((key) => delete state.plans[key]);
  Object.keys(state.checked).filter((key) => key.startsWith(prefix)).forEach((key) => delete state.checked[key]);
  delete state.notes[weekKey()];
}

function loadWeekTemplate(template) {
  if (!template) return;
  if (weekHasContent() && !confirm("La semana actual ya tiene contenido. ¿Quieres reemplazarla por esta plantilla?")) return;
  clearCurrentWeek();
  state.mealCount = normalizeMealCount(template.mealCount);
  state.childMenuEnabled = template.childMenuEnabled ?? state.childMenuEnabled;
  state.notes[weekKey()] = template.note || "";
  (template.slots || []).forEach((slot) => {
    if (!Number.isInteger(slot.day) || slot.day < 0 || slot.day > 6 || !isActiveMealType(slot.type, state.mealCount) || !slot.recipe) return;
    state.plans[planKey(slot.day, slot.type)] = restoreTemplateRecipe(slot.recipe);
  });
  save(); closeModal("#saved-weeks-modal"); renderWeek(); renderRecipeLibrary(); showToast("Semana cargada");
}

function replaceWeekTemplate(template) {
  if (!template) return;
  if (!currentWeekSlots().length && !state.notes[weekKey()]?.trim()) return showToast("Añade algún plato antes de reemplazar");
  if (!confirm(`¿Reemplazar “${template.title}” con la semana actual?`)) return;
  const index = state.savedWeeks.findIndex((item) => item.id === template.id);
  if (index < 0) return;
  state.savedWeeks[index] = buildWeekTemplate(template.title, template.id);
  save(); renderSavedWeeks(); showToast("Semana guardada actualizada");
}

function deleteWeekTemplate(template) {
  if (!template || !confirm(`¿Eliminar la semana guardada “${template.title}”?`)) return;
  state.savedWeeks = state.savedWeeks.filter((item) => item.id !== template.id);
  save(); renderSavedWeeks(); showToast("Semana guardada eliminada");
}

function buildWeekEmail() {
  const slots = activeMealSlots();
  if (!selectedRecipes().length) return null;

  const lines = ["MENÚ SEMANAL", `${$("#week-range").textContent} · ${$("#week-year").textContent}`];
  const note = state.notes[weekKey()]?.trim();
  if (note) lines.push("", `Nota: ${note}`);
  lines.push("", "MENÚ");
  DAYS.forEach((day, dayIndex) => {
    lines.push("", day);
    slots.forEach((slot) => {
      const main = recipeFor(state.plans[planKey(dayIndex, slot.type)]);
      let row = `- ${slot.label}: ${main?.name || "—"}`;
      if (state.childMenuEnabled) {
        const child = recipeFor(state.plans[planKey(dayIndex, `${slot.type}-child`)]);
        row += ` · Infantil: ${child?.name || "—"}`;
      }
      lines.push(row);
    });
  });

  const items = shoppingItems();
  lines.push("", "LISTA DE LA COMPRA");
  if (!items.length) lines.push("Sin ingredientes.");
  const groups = new Map();
  items.forEach((item) => {
    if (!groups.has(item.group)) groups.set(item.group, []);
    groups.get(item.group).push(item);
  });
  groups.forEach((groupItems, group) => {
    lines.push("", group);
    groupItems.forEach((item) => {
      const record = shoppingRecord(item);
      const mark = itemCompletion(item) >= 1 ? "[x]" : "[ ]";
      const partial = Number(record.bought) > 0 && itemCompletion(item) < 1 ? ` (${formatAmount(Number(record.bought))} comprado)` : "";
      lines.push(`${mark} ${item.name} — ${record.required}${partial}`);
    });
  });

  const subject = `Menú semanal · ${$("#week-range").textContent}`;
  return { subject, body: lines.join("\n") };
}

function emailWeek() {
  const email = buildWeekEmail();
  if (!email) return showToast("Primero añade algún plato al menú");
  window.location.href = `mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
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
  return {
    plans: state.plans,
    notes: state.notes,
    checked: state.checked,
    customRecipes: state.customRecipes,
    childMenuEnabled: state.childMenuEnabled,
    mealCount: state.mealCount,
    savedWeeks: state.savedWeeks
  };
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
  state.childMenuEnabled = data.childMenuEnabled ?? state.childMenuEnabled;
  state.mealCount = normalizeMealCount(data.mealCount ?? state.mealCount);
  state.savedWeeks = Array.isArray(data.savedWeeks) ? data.savedWeeks.slice(0, MAX_SAVED_WEEKS) : state.savedWeeks;
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
  $("#create-recipe-from-meal").addEventListener("click", () => { closeMealModal(); openRecipeEditor(); });
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
  $("#options-button").addEventListener("click", () => {
    $("#child-menu-enabled").checked = state.childMenuEnabled;
    $("#meal-count").value = String(state.mealCount);
    openModal("#options-modal");
  });
  $("#close-options-modal").addEventListener("click", () => closeModal("#options-modal"));
  $("#options-modal").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeModal("#options-modal");
  });
  $("#save-week").addEventListener("click", () => openSavedWeeksModal(true));
  $("#load-week").addEventListener("click", () => openSavedWeeksModal(false));
  $("#close-saved-weeks-modal").addEventListener("click", () => closeModal("#saved-weeks-modal"));
  $("#saved-weeks-modal").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeModal("#saved-weeks-modal");
  });
  $("#save-week-form").addEventListener("submit", saveWeekTemplate);
  $("#saved-weeks-list").addEventListener("click", (event) => {
    const action = event.target.closest("[data-load-template], [data-replace-template], [data-delete-template]");
    if (!action) return;
    const id = action.dataset.loadTemplate || action.dataset.replaceTemplate || action.dataset.deleteTemplate;
    const template = state.savedWeeks.find((item) => item.id === id);
    if (action.dataset.loadTemplate) loadWeekTemplate(template);
    else if (action.dataset.replaceTemplate) replaceWeekTemplate(template);
    else deleteWeekTemplate(template);
  });
  $("#email-week").addEventListener("click", emailWeek);
  $("#email-week-shopping").addEventListener("click", emailWeek);
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
  populateRecipeIcons();
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
$("#meal-count").addEventListener("change", (event) => {
  state.mealCount = normalizeMealCount(event.target.value);
  save(); renderWeek();
  showToast(`${state.mealCount} comidas al día`);
});
$("#child-menu-enabled").addEventListener("change", (event) => {
  state.childMenuEnabled = event.target.checked;
  save();
  renderWeek();
  showToast(state.childMenuEnabled ? "Menú infantil activado" : "Menú infantil oculto");
});
$("#shopping-groups").addEventListener("change", (event) => {
  const itemKey = event.target.dataset.item;
  const action = event.target.dataset.action;
  if (!itemKey || !action) return;
  const item = shoppingItems().find((candidate) => candidate.key === itemKey);
  if (!item) return;
  const record = shoppingRecord(item);
  if (action === "complete") {
    record.done = event.target.checked;
    const required = parseQuantity(record.required);
    record.bought = event.target.checked && required ? required.amount : 0;
  }
  if (action === "bought") {
    record.bought = Math.max(Number(event.target.value) || 0, 0);
    const required = parseQuantity(record.required);
    record.done = !!required && record.bought >= required.amount;
  }
  if (action === "required") {
    record.required = event.target.value.trim() || item.quantity;
    const required = parseQuantity(record.required);
    record.done = !!required && Number(record.bought) >= required.amount;
  }
  state.checked[`${weekKey()}-${item.key}`] = record;
  save(); renderShopping();
});
$("#copy-list").addEventListener("click", async () => {
  const text = shoppingItems().map((item) => {
    const record = shoppingRecord(item);
    const mark = itemCompletion(item) >= 1 ? "☑" : "□";
    const partial = Number(record.bought) > 0 ? ` · ${formatAmount(Number(record.bought))} comprado` : "";
    return `${mark} ${item.name} — ${record.required}${partial}`;
  }).join("\n");
  if (!text) return showToast("Primero añade algún plato");
  try {
    await navigator.clipboard.writeText(text);
    showToast("Lista copiada");
  } catch (error) {
    console.error("Mesa clipboard:", error);
    showToast("No se pudo copiar la lista");
  }
});
$("#reset-menu")?.addEventListener("click", () => {
  if (!confirm("¿Quieres vaciar el menú de esta semana?")) return;
  const prefix = `${weekKey()}-`;
  Object.keys(state.plans).filter((key) => key.startsWith(prefix)).forEach((key) => delete state.plans[key]);
  save(); renderWeek(); showToast("Menú semanal vaciado");
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMealModal();
  $$(".modal-backdrop.open").forEach((modal) => closeModal(`#${modal.id}`));
});

initializeApp();
