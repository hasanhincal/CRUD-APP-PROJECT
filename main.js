// ! gerekli HTML elementlerini sec;
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//! Düzenleme secenekleri;
let editElement;
let editFlag = false; //Düzenleme modunda olup olmadıgını belirtir.
let editId = ""; //Düzenleme yapılan ögenin benzersiz kimligi.

// ! Fonksiyonlar;
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "Ekle";
};
const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

//*Tıkladıgımız "article" etiketini ortadan kaldıracak fonksiyondur.
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; //* "article" etiketine eriştik.
  const id = element.dataset.id;
  list.removeChild(element); //List etiketi icerisinden "article" etiketini kaldırdık.
  displayAlert("Öğe Kaldırıldı!", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
};

const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; // "article" etiketine parent element sayesinde eriştik.
  editElement = e.currentTarget.parentElement.previousElementSibling; // butonun kapsayıcısına eriştikten sonra kapsayıcısının kardes etiketine eriştik.
  // tıkladıgım "article" etiketi içerisindeki p etiketinin textini inputun içerisine göndermeyi sağladık.
  grocery.value = editElement.innerText; // düzenleme işleminde submitBtn 'in içerik kısmını düzenledik.

  editFlag = true;
  editId = element.dataset.id; //düzenlenen ögenin id'sine erişme,
  submitBtn.textContent = "Düzenle"; // düzenleme işleminde submitBtn 'in içeriğini düzenledik,
};

const addItem = (e) => {
  e.preventDefault(); //* formun otom. olarak gönderilmesini engeller.
  const value = grocery.value; //* form icerisinde bulunan inputun degerini aldık.
  const id = new Date().getTime().toString(); //* bezersiz bir id oluşturduk.

  // eğer input bos degilse ve düzenleme modunda değilse çalisacak bloc yapısı,
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); // Yeni bir article etiketi oluşturduk.
    let attr = document.createAttribute("data-id"); //Yeni bir veri kimliği oluşturur.
    attr.value = id;
    element.setAttributeNode(attr); //Oluşturduğumuz id'yi article etiketine ekledik.
    element.classList.add("grocery-item"); //Olusturdugumuz "article" etiketine class ekledik.

    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="delete-btn">
              <i class="fa-solid fa-trash"></i>
            </button>
        </div>`;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    //* Kapsayıcıya olusturdugumuz "article" etiketini ekledik.

    list.appendChild(element);
    displayAlert("Başarı ile eklenildi.", "success");
    container.classList.add("show-container");
    //local storage 'a ekleme.
    addToLocalStorage(id, value);
    // değerleri varsayılana çevirir.
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    // değiştireceğimiz p etiketinin içerik kısmına kullanıcının inputa girdiği değeri gönderdik.
    editElement.innerText = value;
    //ekrana alert yapısını bastırdık.
    displayAlert("Değer Değiştirildi...", "success");
    editLocalStorage(editId,value);
    setBackToDefault();
  }
};

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  //listede öge varsa çalısır.
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  // container yapısını gizle
  container.classList.remove("show-container");
  displayAlert("Liste Boş", "danger");
  setBackToDefault();
};
const createListItem = (id, value) => {
  const element = document.createElement("article"); // Yeni bir article etiketi oluşturduk.
  let attr = document.createAttribute("data-id"); //Yeni bir veri kimliği oluşturur.
  attr.value = id;
  element.setAttributeNode(attr); //Oluşturduğumuz id'yi article etiketine ekledik.
  element.classList.add("grocery-item"); //Olusturdugumuz "article" etiketine class ekledik.

  element.innerHTML = `
      <p class="title">${value}</p>
      <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
      </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  //* Kapsayıcıya olusturdugumuz "article" etiketini ekledik.

  list.appendChild(element);
  container.classList.add("show-container");
};
const setupItems = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
  }
};

// ! Local storage;
// yerel depoya öge ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
};
// yerel depodan öğeleri alma işlemi,
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
// local storage 'dan veriyi silme
const removeFromLocalStorage = (id) => {
  // local storage 'da bulunan veriyi getirir.
  let items = getLocalStorage();
  // tıkladığım etketin ıd'si ile localstoragedaki id eşit değilse bunu diziden çıkar ve yeni bir elemana aktar.
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};
// yerel depoda update işlemi
const editLocalStorage = (id,value) => {
  let items = getLocalStorage()
  //yerel depodaki verilerin id'si ile güncellenecek olan verinin id'si birbirine eşit ise inputa girilen value değişkenini al.
  // local storage'da bulunan verinin valuesun aktar.
  items.map((item)=> {
    if (item.id == id) {
      item.value == value
    }
    return item;
  })
localStorage.setItem("list", JSON.stringify(items))
};

//! Olay izleyicileri;
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);


