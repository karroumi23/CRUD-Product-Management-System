let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let mood = "create";
// create variable globale (visible to all function )
let tmp;

// get total-------------------------------------------------------
function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.background = "green";
  } else {
    total.innerHTML = "";
    total.style.background = "red";
  }
}

// create pdoduct---------------------------------------------------
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
  // don't create new product , just when the input title is not empty
  if (title.value != "" && price.value != "" && category.value != "") {
    //don't create new product , just when the mood ==> create
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
      // after that change the mood and button
      mood = "create";
      submit.innerHTML = "create";
      count.style.display = "block";
    }
      clearData();
  }

  // save localstrorage----------------------------------------------------
  localStorage.setItem("product", JSON.stringify(datapro));
  console.log(datapro);
  
  showData();
};

// clear inputs-------------------------------------------------------
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

// read--------------------------------------------------------------
function showData() {
  let table = "";
  for (let i = 0; i < datapro.length; i++) {
    table += `
      <tr>
      <td>${i}</td>
      <td>${datapro[i].title}</td>
      <td>${datapro[i].price}</td>
      <td>${datapro[i].taxes}</td>
      <td>${datapro[i].ads}</td>
      <td>${datapro[i].discount}</td>
      <td>${datapro[i].total}</td>
      <td>${datapro[i].category}</td>
      <td><button onclick="updateData(${i})" id="update"> update </button></td>
      <td><button onclick="deleteData(${i})" id="delete"> delete </button></td>
     </tr>    `;
  }
  document.getElementById("tbody").innerHTML = table;

  let btnDelete = document.getElementById("deleteAll");
  if (datapro.length > 0) {
    btnDelete.innerHTML = `
     <button onclick="deleteAll()">deleteAll (${datapro.length})</button>
     `;
  } else {
    btnDelete.innerHTML = "";
  }
}
showData();

// delete---------------------------------------------------------
function deleteData(i) {
  datapro.splice(i, 1);
  localStorage.product = JSON.stringify(datapro);
  showData();
}
// deleteAll------------------------------------------------------
function deleteAll() {
  datapro.splice(0);
  showData();
}

// update--------------------------------------------------------
function updateData(i) {
  title.value = datapro[i].title;
  price.value = datapro[i].price;
  taxes.value = datapro[i].taxes;
  ads.value = datapro[i].ads;
  discount.value = datapro[i].discount;
  // ( active function gettotal() for affichage the total when i update  )
  getTotal();
  // ( for hiding input (count) when i update data)
  count.style.display = "none";
  category.value = datapro[i].category;
  submit.innerHTML = "update";
  mood = "update";
  // that's mike the i visible to all function
  tmp = i;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// search-------------------------------------------------------
let searchMood = "title";
// create two mood search by title or category.
function getsearchMood(id) {
  // call search input by id.
  let search = document.getElementById("search");
  if (id == "searchTitle") {
    search.placeholder = "search by title";
  } else {
    searchMood = "Category";
    search.placeholder = "search by Category";
  }

  search.focus();
  search.value = "";
  showData();
}
// create second function for search in Data.
function searchData(value) {
  let table = "";
  if (searchMood == "title") {
    for (i = 0; i < datapro.length; i++) {
      if (datapro[i].title.includes(value.toLowerCase())) {
        table += `
        <tr>
        <td>${i}</td>
        <td>${datapro[i].title}</td>
        <td>${datapro[i].price}</td>
        <td>${datapro[i].taxes}</td>
        <td>${datapro[i].ads}</td>
        <td>${datapro[i].discount}</td>
        <td>${datapro[i].total}</td>
        <td>${datapro[i].category}</td>
        <td><button onclick="updateData(${i})" id="update"> update </button></td>
        <td><button onclick="deleteData(${i})" id="delete"> delete </button></td>
       </tr> `;
      }
    }
  } else {
    for (i = 0; i < datapro.length; i++) {
      if (datapro[i].category.includes(value.toLowerCase())) {
        table += `
        <tr>
        <td>${i}</td>
        <td>${datapro[i].title}</td>
        <td>${datapro[i].price}</td>
        <td>${datapro[i].taxes}</td>
        <td>${datapro[i].ads}</td>
        <td>${datapro[i].discount}</td>
        <td>${datapro[i].total}</td>
        <td>${datapro[i].category}</td>
        <td><button onclick="updateData(${i})" id="update"> update </button></td>
        <td><button onclick="deleteData(${i})" id="delete"> delete </button></td>
       </tr> `;
      }
    }
  }
  document.getElementById("tbody").innerHTML = table;
}

// clean data-------------------------------------------------------
