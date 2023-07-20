// Пример списка доступных беседок (можно получать данные с сервера)
const besedki = [
    {
        id: 1,
        name: "Беседка 1",
        description: "Красивая беседка в парке",
        image: "img/image1.jpg"
    },
    {
        id: 2,
        name: "Беседка 2",
        description: "Просторная беседка у озера",
        image: "img/image2.jpg"
    },
    {
        id: 3,
        name: "Беседка 3",
        description: "Уютная беседка с видом на горы",
        image: "img/image3.jpg"
    }
];

// Заполнение списка беседок в форме и на странице
function populateBesedkiList() {
    const besedkiList = document.getElementById("besedkiList");
    const besedkaSelect = document.getElementById("besedka");

    besedki.forEach((besedka) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-id", besedka.id);

        const cardImage = document.createElement("img");
        cardImage.classList.add("card-img-top");
        cardImage.setAttribute("src", besedka.image);
        cardImage.setAttribute("alt", besedka.name);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = besedka.name;

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = besedka.description;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(cardImage);
        card.appendChild(cardBody);

        card.addEventListener("click", () => {
            handleBesedkaSelection(besedka.id);
        });

        besedkiList.appendChild(card);

        // Добавляем беседку в выпадающий список
        const option = document.createElement("option");
        option.value = besedka.id;
        option.textContent = besedka.name;
        besedkaSelect.appendChild(option);
    });
}

let selectedBesedkaId = null;

// Обработка выбора беседки
function handleBesedkaSelection(besedkaId) {
    const selectedCard = document.querySelector(".card.selected");
    if (selectedCard) {
        selectedCard.classList.remove("selected");
    }

    const cardToSelect = document.querySelector(`.card[data-id="${besedkaId}"]`);
    cardToSelect.classList.add("selected");

    selectedBesedkaId = besedkaId;
}

// Обработка формы бронирования
function handleReservationForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;

    // Получаем выбранную беседку из выпадающего списка
    const besedkaSelect = document.getElementById("besedka");
    const selectedOption = besedkaSelect.options[besedkaSelect.selectedIndex];

    // Проверяем, выбрана ли беседка
    if (!selectedOption.value) {
        alert("Пожалуйста, выберите беседку.");
    } else {
        // Присваиваем выбранное значение переменной selectedBesedkaId
        selectedBesedkaId = parseInt(selectedOption.value, 10);

        // Дополнительная логика для обработки бронирования (можно отправлять данные на сервер)
        console.log("Имя:", name);
        console.log("Email:", email);
        console.log("ID беседки:", selectedBesedkaId);
        console.log("Дата бронирования:", date);

        // Очистка формы после бронирования
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("date").value = "";

        // Убираем выделение с выбранной беседки
        const selectedCard = document.querySelector(".card.selected");
        if (selectedCard) {
            selectedCard.classList.remove("selected");
        }

        // Сбрасываем выбранный ID беседки
        selectedBesedkaId = null;

        // Отображение страницы благодарности
        showThankYouPage();
    }
}

// Отображение страницы благодарности
function showThankYouPage() {
    window.location.href = "thankyou.html";
}

// Обработка события отправки формы
document.getElementById("reservationForm").addEventListener("submit", handleReservationForm);

// Заполнение списка беседок при загрузке страницы
populateBesedkiList();
