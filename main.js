// theme (light / dark)---------------------------------------------
let themeToggle = document.getElementById("themeToggle");
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.innerHTML = "☀️";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.innerHTML = "🌙";
  }
}
applyTheme(localStorage.getItem("theme") || "light");
themeToggle.onclick = function () {
  let isDark = document.documentElement.getAttribute("data-theme") === "dark";
  let next = isDark ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
};

let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let countField = document.getElementById("countField");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let receipt = document.getElementById("receipt");
let stat = document.getElementById("stat");
let mood = "create";
// global variable (visible to all functions), holds index being edited
let tmp;

// get total-------------------------------------------------------
function getTotal() {
  document.getElementById("rPrice").innerHTML = (+price.value || 0).toFixed(2);
  document.getElementById("rTaxes").innerHTML = (+taxes.value || 0).toFixed(2);
  document.getElementById("rAds").innerHTML = (+ads.value || 0).toFixed(2);
  document.getElementById("rDiscount").innerHTML = (+discount.value || 0).toFixed(2);

  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result.toFixed(2);
    receipt.classList.add("valid");
  } else {
    total.innerHTML = "0.00";
    receipt.classList.remove("valid");
  }
}

// create product---------------------------------------------------
let datapro;
if (localStorage.product != null) {
  datapro = JSON.parse(localStorage.product);
} else {
  datapro = [];
}

submit.onclick = function () {
  let newpro = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value,
  };

  // don't create new product, just when title/price/category aren't empty
  if (title.value != "" && price.value != "" && category.value != "") {
    // don't apply count duplication, just when mood ==> create
    if (mood === "create") {
      if (newpro.count > 1) {
        // count function--------------------------------------------------
        for (let i = 0; i < newpro.count; i++) {
          datapro.push(newpro);
        }
      } else {
        datapro.push(newpro);
      }
    } else {
      datapro[tmp] = newpro;
      // after that change the mood and button back to create
      mood = "create";
      submit.innerHTML = "Add entry";
      countField.style.display = "block";
    }
    clearData();
  }

  // save to localstorage----------------------------------------------------
  localStorage.setItem("product", JSON.stringify(datapro));

  showData();
};

// clear inputs-------------------------------------------------------
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  count.value = "";
  category.value = "";
  getTotal();
}

// read--------------------------------------------------------------
function showData() {
  let table = "";
  for (let i = 0; i < datapro.length; i++) {
    table += `
      <tr>
      <td>${i}</td>
      <td>${datapro[i].title}</td>
      <td>${(+datapro[i].price).toFixed(2)}</td>
      <td>${(+datapro[i].taxes || 0).toFixed(2)}</td>
      <td>${(+datapro[i].ads || 0).toFixed(2)}</td>
      <td>${(+datapro[i].discount || 0).toFixed(2)}</td>
      <td>${datapro[i].total}</td>
      <td>${datapro[i].category}</td>
      <td><button class="btn-update" onclick="updateData(${i})">update</button></td>
      <td><button class="btn-delete" onclick="deleteData(${i})">delete</button></td>
     </tr>    `;
  }
  document.getElementById("tbody").innerHTML = table;

  let tableWrap = document.querySelector(".table-wrap");
  tableWrap.classList.toggle("empty", datapro.length === 0);

  stat.innerHTML = `${datapro.length} product${datapro.length === 1 ? "" : "s"}`;

  let btnDelete = document.getElementById("deleteAll");
  if (datapro.length > 0) {
    btnDelete.innerHTML = `
     <button onclick="deleteAll()">Delete all (${datapro.length})</button>
     `;
  } else {
    btnDelete.innerHTML = "";
  }
}
showData();
getTotal();

// delete---------------------------------------------------------
function deleteData(i) {
  datapro.splice(i, 1);
  localStorage.setItem("product", JSON.stringify(datapro));
  showData();
}

// deleteAll------------------------------------------------------
function deleteAll() {
  datapro.splice(0);
  localStorage.setItem("product", JSON.stringify(datapro));
  showData();
}

// update--------------------------------------------------------
function updateData(i) {
  title.value = datapro[i].title;
  price.value = datapro[i].price;
  taxes.value = datapro[i].taxes;
  ads.value = datapro[i].ads;
  discount.value = datapro[i].discount;
  // trigger getTotal() to refresh the receipt display
  getTotal();
  // hide the quantity field while updating (an update always edits a single row)
  countField.style.display = "none";
  category.value = datapro[i].category;
  submit.innerHTML = "Save changes";
  mood = "update";
  // makes the index visible to submit's onclick handler
  tmp = i;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// search-------------------------------------------------------
let searchMood = "title";
// toggle between searching by title or by category
function getsearchMood(id) {
  let search = document.getElementById("search");
  document.getElementById("searchTitle").classList.remove("active");
  document.getElementById("searchCategory").classList.remove("active");
  document.getElementById(id).classList.add("active");

  if (id == "searchTitle") {
    searchMood = "title";
    search.placeholder = "Search by title…";
  } else {
    searchMood = "Category";
    search.placeholder = "Search by category…";
  }

  search.focus();
  search.value = "";
  showData();
}

// filter the table by the current search mode
function searchData(value) {
  let table = "";
  let key = searchMood === "title" ? "title" : "category";

  for (let i = 0; i < datapro.length; i++) {
    if (datapro[i][key].toLowerCase().includes(value.toLowerCase())) {
      table += `
      <tr>
      <td>${i}</td>
      <td>${datapro[i].title}</td>
      <td>${(+datapro[i].price).toFixed(2)}</td>
      <td>${(+datapro[i].taxes || 0).toFixed(2)}</td>
      <td>${(+datapro[i].ads || 0).toFixed(2)}</td>
      <td>${(+datapro[i].discount || 0).toFixed(2)}</td>
      <td>${datapro[i].total}</td>
      <td>${datapro[i].category}</td>
      <td><button class="btn-update" onclick="updateData(${i})">update</button></td>
      <td><button class="btn-delete" onclick="deleteData(${i})">delete</button></td>
     </tr>    `;
    }
  }
  document.getElementById("tbody").innerHTML = table;

  let tableWrap = document.querySelector(".table-wrap");
  tableWrap.classList.toggle("empty", table === "");
}