var formContainerDiv = document.getElementById("formContainer");
var addContactBtn = document.getElementById("addContact");
var fullNameInput = document.getElementById("fullName");
var telephoneNumberInput = document.getElementById("telephoneNumber");
var emailPartInput = document.getElementById("emailPart");
var theAddressInput = document.getElementById("theAddress");
var SelectGroupInput = document.getElementById("SelectGroup");
var imageInput = document.getElementById("avatar-photo");
var notePartInput = document.getElementById("notePart");
var favoriteBoxInput = document.getElementById("favoriteBox");
var emergencyBoxInput = document.getElementById("emergencyBox");
var cancelBtn = document.getElementById("cancelButton");
var submitBtn = document.getElementById("submitButton");
var updateBtn = document.getElementById("updateButton");
var searchInput = document.getElementById("search");

var contactList = [];

if (localStorage.getItem("contactContainer") !== null) {
  contactList = JSON.parse(localStorage.getItem("contactContainer"));
  displaySearch();
  displayFavorites();
  displayEmergencies();
  updateCounters();
} else {
  displaySearch();
  displayFavorites();
  displayEmergencies();
}

function validation(input, msg) {
  var massage = document.getElementById(msg);
  var regex = {
    fullName: /^[A-Za-z\s]{2,50}$/,
    telephoneNumber: /^(01[0125][0-9]{8}|\+201[0125][0-9]{8})$/,
    emailPart: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  };

  if (input.id === "emailPart") {
    if (input.value.trim() === "") {
      massage.classList.add("d-none");
      input.classList.remove("is-invalid");
      return true;
    }
  }

  if (
    input.value.trim() === "" ||
    regex[input.id].test(input.value.trim()) == false
  ) {
    massage.classList.remove("d-none");
    input.classList.add("is-invalid");
    return false;
  } else {
    massage.classList.add("d-none");
    input.classList.remove("is-invalid");
    return true;
  }
}

// _______________________________________________________________________

function getInitials(name) {
  if (!name) return "??";
  var words = name.trim().split(/\s+/);
  if (words.length >= 2 && words[1][0]) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0] ? words[0].slice(0, 2).toUpperCase() : "??";
}

// _______________________________________________________________________

function updateCounters() {
  var totalCards = contactList.length;

  var totalTextElem = document.getElementById("totalContactsText");
  if (totalTextElem) {
    totalTextElem.innerText = totalCards;
  }

  var favorites = contactList.filter(function (contact) {
    return contact.favoriteBox === true;
  }).length;

  var emergencies = contactList.filter(function (contact) {
    return contact.emergencyBox === true;
  }).length;

  if (document.getElementById("totalCount")) {
    document.getElementById("totalCount").innerText = totalCards;
  }
  if (document.getElementById("favoritesCount")) {
    document.getElementById("favoritesCount").innerText = favorites;
  }
  if (document.getElementById("emergencyCount")) {
    document.getElementById("emergencyCount").innerText = emergencies;
  }
}

// _______________________________________________________________________________

function addContact() {
  var contact = {
    fullName: fullNameInput.value,
    telephoneNumber: telephoneNumberInput.value,
    email: emailPartInput.value,
    address: theAddressInput.value,
    image: imageInput.files[0]?.name,
    SelectGroup: SelectGroupInput.value,
    notePart: notePartInput.value,
    favoriteBox: favoriteBoxInput.checked ? true : false,
    emergencyBox: emergencyBoxInput.checked ? true : false,
  };

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].telephoneNumber == contact.telephoneNumber) {
      Swal.fire({
        icon: "error",
        title: "duplicate Phone",
        text: "Please enter a phone for the contact!",
      });
      return;
    }
  }

  if (!validation(fullNameInput, "msgName")) {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact!",
    });
    return;
  }
  if (telephoneNumberInput.value.trim() === "") {
    Swal.fire({
      title: "Missing Phone",
      text: "Please enter a phone for the contact!",
      icon: "error",
    });
    return;
  }
  if (!validation(telephoneNumberInput, "msgPhone")) {
    Swal.fire({
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
      icon: "error",
    });
    return;
  }
  if (!validation(emailPartInput, "msgEmail")) {
    Swal.fire({
      icon: "error",
      title: "Missing Email",
      text: "Please enter a email for the contact!",
    });
    return;
  }

  contactList.push(contact);
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  clearInputs();
  disapperingContactForm();
  Swal.fire({
    icon: "success",
    title: "Added",
    text: "Contact has been added successfully",
    showConfirmButton: false,
    timer: 1500,
  });
  displaySearch();
  displayFavorites();
  displayEmergencies();
  updateCounters();
}

// _______________________________________________________________________

function deleteContact(index) {
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contactList[index].fullName}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      contactList.splice(index, 1);
      localStorage.setItem("contactContainer", JSON.stringify(contactList));
      displaySearch();
      displayFavorites();
      displayEmergencies();
      updateCounters();
      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted",
        icon: "success",
        showConfirmButton: false,
        timer: 1700,
      });
    }
  });
}

// _______________________________________________________________________

function displayingContactorm() {
  formContainerDiv.classList.remove("d-none");
}

// _______________________________________________________________________

function disapperingContactForm() {
  formContainerDiv.classList.add("d-none");
  clearInputs();
}

// _______________________________________________________________________

function addFavorite(index) {
  contactList[index].favoriteBox = true;
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displaySearch();
  displayFavorites();
  updateCounters();
}

function removeFavorite(index) {
  contactList[index].favoriteBox = false;
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displaySearch();
  displayFavorites();
  updateCounters();
}

// _______________________________________________________________________

function addEmmergency(index) {
  contactList[index].emergencyBox = true;
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displaySearch();
  displayEmergencies();
  updateCounters();
}

function removeEmmergency(index) {
  contactList[index].emergencyBox = false;
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displaySearch();
  displayEmergencies();
  updateCounters();
}

// ________________________________________________________________________
var currentIndex;
function setUpdate(index) {
  currentIndex = index;
  var initials = getInitials(contactList[index].fullName);
  fullNameInput.value = contactList[index].fullName;
  telephoneNumberInput.value = contactList[index].telephoneNumber;
  emailPartInput.value = contactList[index].email;
  if (contactList[index].image) {
    document.getElementById("profile-icon").innerHTML = `
        <img src="images/${contactList[index].image}" class="w-100 h-100" alt="Profile Image" />
        `;
  } else {
    document.getElementById("profile-icon").innerHTML = `
        ${initials}
        `;
  }
  theAddressInput.value = contactList[index].address;
  SelectGroupInput.value = contactList[index].SelectGroup;
  notePartInput.value = contactList[index].notePart;
  favoriteBoxInput.checked = contactList[index].favoriteBox;
  emergencyBoxInput.checked = contactList[index].emergencyBox;

  displayingContactorm();

  updateBtn.classList.remove("d-none");
  submitBtn.classList.add("d-none");
}

// _______________________________________________________________________

function updateContact() {
  var contact = {
    fullName: fullNameInput.value,
    telephoneNumber: telephoneNumberInput.value,
    email: emailPartInput.value,
    image: imageInput.files[0]?.name || contactList[currentIndex].image,
    address: theAddressInput.value,
    SelectGroup: SelectGroupInput.value,
    notePart: notePartInput.value,
    favoriteBox: favoriteBoxInput.checked ? true : false,
    emergencyBox: emergencyBoxInput.checked ? true : false,
  };

  var changeBackground

  for (var i = 0; i < contactList.length; i++) {
    changeBackground = changeBg(i);
    if (
      contactList[i].telephoneNumber == contact.telephoneNumber &&
      i !== currentIndex
    ) {
      Swal.fire({
        icon: "error",
        title: "duplicate Phone",
        text: "Please enter a phone for the contact!",
      });
      return;
    }
  }

  if (!validation(fullNameInput, "msgName")) {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact!",
    });
    return;
  }
  if (!validation(telephoneNumberInput, "msgPhone")) {
    Swal.fire({
      icon: "error",
      title: "Missing Phone",
      text: "Please enter a phone for the contact!",
    });
    return;
  }
  if (!validation(emailPartInput, "msgEmail")) {
    Swal.fire({
      icon: "error",
      title: "Missing Email",
      text: "Please enter a email for the contact!",
    });
    return;
  }
  contactList.splice(currentIndex, 1, contact);
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displaySearch();
  displayFavorites();
  displayEmergencies();
  updateCounters();
  clearInputs();
  Swal.fire({
    icon: "success",
    title: "Updated",
    text: "Contact has been updated successfully",
    showConfirmButton: false,
    timer: 1700,
  });
  updateBtn.classList.add("d-none");
  submitBtn.classList.remove("d-none");
  disapperingContactForm();
}

// _______________________________________________________________________

function displaySearch() {
  var text = searchInput.value;
  var container = "";
  var changeBackground
  for (var i = 0; i < contactList.length; i++) {
    changeBackground = changeBg(i);
    var initials = getInitials(contactList[i].fullName);
    var selectGroupClass;
    if (contactList[i].SelectGroup == "work") {
      selectGroupClass = "Work";
    } else if (contactList[i].SelectGroup == "family") {
      selectGroupClass = "Family";
    } else if (contactList[i].SelectGroup == "friends") {
      selectGroupClass = "Friends";
    } else if (contactList[i].SelectGroup == "school") {
      selectGroupClass = "School";
    } else if (contactList[i].SelectGroup == "other") {
      selectGroupClass = "Other";
    }

    if (contactList[i].fullName.toUpperCase().includes(text.toUpperCase())) {
      container += `<div class="col-6">
                                <div class="card h-100 justify-content-between rounded-4 overflow-hidden">
                                    <div class="card-header-content">
                                        <div class="card-heading d-flex">
                                            <div class="person-icon position-relative">
                                                <div
                                                    class="icon fw-semibold d-flex justify-content-center align-items-center text-white overflow-hidden ${changeBackground}">
                                                    ${contactList[i].image ? `<img src="images/${contactList[i].image}" alt="Contact Image" class=" w-100 h-100 object-fit-cover">` : `${initials}`}
                                                    </div>
                                                    ${contactList[i].favoriteBox
          ? `<div
                                                    class="star-icon d-flex justify-content-center rounded-circle align-items-center text-white position-absolute">
                                                    <i class="fa-solid fa-star"></i>
                                                </div>`
          : ""
        }
                                                    ${contactList[i]
          .emergencyBox
          ? `<div
                                                    class="heart-pulse-icon d-flex justify-content-center rounded-circle align-items-center text-white position-absolute">
                                                    <i class="fa-solid fa-heart-pulse"></i>
                                                </div>`
          : ""
        }

                                            </div>
                                            <div class="person-info pt-1">
                                                <h3 class="fw-semibold m-0 fs-6">${contactList[i].fullName}</h3>
                                                <div class="person-number gap-2 mt-1 d-flex align-items-center"><i
                                                        class="fa-solid fa-phone d-flex align-items-center justify-content-center rounded-2"></i>
                                                    <span>${contactList[i].telephoneNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        ${contactList[i].email
          ? `<div class="person-email d-flex align-items-center mb-2"><i
                                                class="fa-solid fa-envelope d-flex justify-content-center align-items-center rounded-3"></i>
                                            <span>${contactList[i].email}</span>
                                        </div>`
          : ""
        }
                                        ${contactList[i].address
          ? `<div class="person-location d-flex align-items-center"><i
                                                class="fa-solid fa-location-dot d-flex justify-content-center align-items-center rounded-3"></i>
                                            <span>${contactList[i].address}</span>
                                        </div>`
          : ""
        }
                                        <div class="badges d-flex flex-wrap">
                                            ${contactList[i].SelectGroup &&
          contactList[i].SelectGroup !==
          "" &&
          contactList[i].SelectGroup !==
          "select-a-group"
          ? `<span class="py-1 px-2 rounded-2 fw-medium text-capitalize ${selectGroupClass}">${contactList[i].SelectGroup}</span>`
          : ""
        }
                                            ${contactList[i].emergencyBox
          ? `<span class="emergency-badge py-1 d-flex align-items-center gap-1 px-2 rounded-2 fw-medium color-rose-600"><i class="fa-solid fa-heart-pulse"></i> Emergency</span>`
          : ""
        }
                                        </div>
                                    </div>
                                    <div class="card-footer-content d-flex justify-content-between align-items-center">
                                        <div class="footer-left-part d-flex align-items-center">
                                            <a href="tel:${contactList[i].telephoneNumber}" title="Call"
                                                class="rounded-3 d-flex justify-content-center align-items-center text-decoration-none phone-icon"><i
                                                    class="fa-solid fa-phone"></i></a>

                                            ${contactList[i].email
          ? `<button onclick="emailContact('${contactList[i].email}')"title="Email"
                                            class="border-0 d-flex justify-content-center align-items-center rounded-3 envelope-icon"><i
                                                class="fa-solid fa-envelope"></i></button>`
          : ""
        }
                                        </div>
                                        <div class="footer-right-part d-flex align-items-center">
                                            ${contactList[i].favoriteBox
          ? `<button onclick="removeFavorite(${i})"
                                                class="star solid-star rounded-3 border-0 d-flex justify-content-center align-items-center bg-color-amber-50"><i
                                                    class="fa-solid fa-star color-amber-400"></i></button>`
          : `<button onclick="addFavorite(${i})"
                                                class="star rounded-3 border-0 d-flex justify-content-center align-items-center star-icon"><i
                                                    class="fa-regular fa-star"></i></button>`
        }

                                            ${contactList[i].emergencyBox
          ? `<button onclick="removeEmmergency(${i})"
                                                class="solid-heart gray-button rounded-3 border-0 d-flex justify-content-center align-items-center bg-color-rose-50"><i
                                                    class="fa-solid fa-heart-pulse color-rose-500"></i></button>`
          : `<button onclick="addEmmergency(${i})"
                                                class="gray-button rounded-3 border-0 d-flex justify-content-center align-items-center heart-icon"><i
                                                    class="fa-regular fa-heart"></i></button>`
        }

                                            <button onclick="setUpdate(${i})"
                                                class="gray-bold-button rounded-3 border-0 d-flex justify-content-center align-items-center pen-icon"><i
                                                    class="fa-solid fa-pen"></i></button>
                                            <button onclick="deleteContact(${i})"
                                                class="gray-bold-button rounded-3 border-0 d-flex justify-content-center align-items-center trash-icon"><i
                                                    class="fa-solid fa-trash"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
    }
  }
  if(container === "") {
    container =`<div class="col-12" style="padding-block: 5rem;">
                    <div class=" d-flex justify-content-center align-items-center flex-column empty-all-contact">
                        <div class="empty-all-contact-icon rounded-4 d-flex justify-content-center align-items-center mb-3">
                            <i class="fa-solid fa-address-book"></i>
                        </div>
                        <h3 class="fs-6 fw-medium m-0">No contacts found</h3>
                        <p class="mt-1 m-0">Click "Add Contact" to get started</p>
                    </div>
                </div>`
  }
  document.getElementById("rowCards").innerHTML = container;
}

// _______________________________________________________________________

function changeBg(index) {
  var bgColors = {
    bg1: "background-one",
    bg2: "background-two",
    bg3: "background-three",
  };
  var lengthName = contactList[index].fullName.length;
  var x = lengthName % 3;
  if (x == 0) {
    return bgColors.bg1;
  } else if (x == 1) {
    return bgColors.bg2;
  } else {
    return bgColors.bg3;
  }
}

// _______________________________________________________________________

function displayFavorites() {
  var container = "";
  var changeBackground
  for (var i = 0; i < contactList.length; i++) {
    changeBackground = changeBg(i);
    var initials = getInitials(contactList[i].fullName);
    if (contactList[i].favoriteBox) {
      container += `<div class="div d-flex justify-content-between align-items-center">
                                <div class="person d-flex align-items-center">
                                    <div
                                        class="person-icon d-flex justify-content-center align-items-center text-white fw-semibold overflow-hidden ${changeBackground}">
                                        ${contactList[i].image ? `<img src="images/${contactList[i].image}" alt="Contact Image" class=" w-100 h-100 object-fit-cover">` : `${initials}`}
                                        </div>
                                    <div class="person-info">
                                        <h3 class="m-0 fw-medium">${contactList[i].fullName}</h3>
                                        <p class="m-0">${contactList[i].telephoneNumber}</p>
                                    </div>
                                </div>
                                <div class="call-icon d-flex justify-content-center align-items-center rounded-3"><a
                                        href="tel:${contactList[i].telephoneNumber}"><i class="fa-solid fa-phone"></i></a></div>
                                </div>`;
    }
  }
  if (container === "") {
    container = `<div class="text-center w-100 p-32 f-14 color-gray-400"> <p class="m-0"> No favorites yet </p> </div>`;
  }

  document.getElementById("favoritesContent").innerHTML = container;
}

// _______________________________________________________________________

function displayEmergencies() {
  var container = "";
  var changeBackground
  for (var i = 0; i < contactList.length; i++) {
    changeBackground = changeBg(i);
    var initials = getInitials(contactList[i].fullName);
    if (contactList[i].emergencyBox) {
      container += `<div class="div d-flex justify-content-between align-items-center">
                                <div class="person d-flex align-items-center">
                                    <div
                                        class="person-icon d-flex justify-content-center align-items-center text-white fw-semibold overflow-hidden ${changeBackground}">
                                        ${contactList[i].image ? `<img src="images/${contactList[i].image}" alt="Contact Image" class=" w-100 h-100 object-fit-cover">` : `${initials}`}
                                    </div>
                                    <div class="person-info">
                                        <h3 class="m-0 fw-medium">${contactList[i].fullName}</h3>
                                        <p class="m-0">${contactList[i].telephoneNumber}</p>
                                    </div>
                                </div>
                                <div class="call-icon d-flex justify-content-center align-items-center rounded-3"><a
                                        href="tel:${contactList[i].telephoneNumber}"><i class="fa-solid fa-phone"></i></a></div>
                                </div>`;
    }
  }
  if (container == "") {
    container = `<div class="text-center w-100 p-32 f-14 color-gray-400"> <p class="m-0"> No emergency contacts </p> </div>`;
  }
  document.getElementById("emergencyContent").innerHTML = container;
}

// _______________________________________________________________________

function clearInputs() {
  fullNameInput.value = "";
  telephoneNumberInput.value = "";
  emailPartInput.value = "";
  theAddressInput.value = "";
  SelectGroupInput.value = "";
  notePartInput.value = "";
  favoriteBoxInput.checked = false;
  emergencyBoxInput.checked = false;
  document.getElementById("profile-icon").innerHTML =
    `<i class="fa-solid fa-user"></i>`;
}

// _______________________________________________________________________

function emailContact(email) {
  if (email) {
    window.location.href = `mailto:${email}`;
  }
}

// _______________________________________________________________________

function displayImage() {
  if (imageInput.files && imageInput.files[0]) {
    document.getElementById("profile-icon").innerHTML = `
    <img src="images/${imageInput.files[0].name}" class="w-100 h-100" alt="Profile Image" />
    `;
  }
}
