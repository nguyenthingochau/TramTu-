/* =====================================
   TRẠM TỪ - JAVASCRIPT HOÀN CHỈNH
===================================== */

const defaultWords = [
    {
        id: 1,
        word: "Achievement",
        meaning: "Thành tựu",
        type: "Noun",
        category: "Work",
        ipa: "/əˈtʃiːvmənt/",
        example: "This is a great achievement.",
        note: "Một kết quả tốt đẹp đạt được sau nỗ lực.",
        favorite: true
    },
    {
        id: 2,
        word: "Advantage",
        meaning: "Lợi thế, ưu điểm",
        type: "Noun",
        category: "Work",
        ipa: "/ədˈvɑːntɪdʒ/",
        example: "English is a great advantage in this job.",
        note: "Trái nghĩa với disadvantage.",
        favorite: true
    },
    {
        id: 3,
        word: "Agreement",
        meaning: "Sự đồng ý, thỏa thuận",
        type: "Noun",
        category: "Work",
        ipa: "/əˈɡriːmənt/",
        example: "They signed an agreement yesterday.",
        note: "Thường dùng trong môi trường công việc.",
        favorite: false
    },
    {
        id: 4,
        word: "Improve",
        meaning: "Cải thiện, nâng cao",
        type: "Verb",
        category: "Education",
        ipa: "/ɪmˈpruːv/",
        example: "I want to improve my English.",
        note: "Improve + something.",
        favorite: true
    },
    {
        id: 5,
        word: "Knowledge",
        meaning: "Kiến thức",
        type: "Noun",
        category: "Education",
        ipa: "/ˈnɒlɪdʒ/",
        example: "Knowledge is power.",
        note: "Gain knowledge: tiếp thu kiến thức.",
        favorite: false
    },
    {
        id: 6,
        word: "Journey",
        meaning: "Hành trình, chuyến đi",
        type: "Noun",
        category: "Travel",
        ipa: "/ˈdʒɜːni/",
        example: "Life is a beautiful journey.",
        note: "Có thể dùng theo nghĩa đen và nghĩa bóng.",
        favorite: false
    },
    {
        id: 7,
        word: "Destination",
        meaning: "Điểm đến",
        type: "Noun",
        category: "Travel",
        ipa: "/ˌdestɪˈneɪʃn/",
        example: "Paris is a popular destination.",
        note: "Travel destination: điểm đến du lịch.",
        favorite: false
    },
    {
        id: 8,
        word: "Healthy",
        meaning: "Khỏe mạnh, lành mạnh",
        type: "Adjective",
        category: "Health",
        ipa: "/ˈhelθi/",
        example: "Eating vegetables is healthy.",
        note: "Health là danh từ.",
        favorite: false
    },
    {
        id: 9,
        word: "Technology",
        meaning: "Công nghệ",
        type: "Noun",
        category: "Technology",
        ipa: "/tekˈnɒlədʒi/",
        example: "Technology changes our lives.",
        note: "Information technology: công nghệ thông tin.",
        favorite: false
    },
    {
        id: 10,
        word: "Convenient",
        meaning: "Thuận tiện",
        type: "Adjective",
        category: "Daily Life",
        ipa: "/kənˈviːniənt/",
        example: "Online shopping is very convenient.",
        note: "Convenience là danh từ.",
        favorite: false
    },
    {
        id: 11,
        word: "Purchase",
        meaning: "Mua, sự mua hàng",
        type: "Verb",
        category: "Daily Life",
        ipa: "/ˈpɜːtʃəs/",
        example: "You can purchase this product online.",
        note: "Có thể là động từ hoặc danh từ.",
        favorite: false
    },
    {
        id: 12,
        word: "Opportunity",
        meaning: "Cơ hội",
        type: "Noun",
        category: "Education",
        ipa: "/ˌɒpəˈtjuːnəti/",
        example: "This is a good opportunity to learn.",
        note: "Opportunity to do something.",
        favorite: false
    }
];

let words = loadWords();
let selectedFilter = "All";
let currentModalId = null;
let currentFlashIndex = 0;
let currentFlashWords = [];
let quizQuestions = [];
let quizIndex = 0;
let quizPoints = 0;
let quizAnswered = false;
let fillIndex = 0;
let currentFillWord = null;
let quizStartTime = null;

function loadWords() {
    try {
        const saved = localStorage.getItem("Trạm Từ");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (error) {
        console.warn(error);
    }
    return defaultWords.map(word => ({ ...word }));
}

function saveWords() {
    try {
        localStorage.setItem("Trạm Từ", JSON.stringify(words));
    } catch (error) {
        showToast("Không thể lưu dữ liệu trên trình duyệt!");
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
}

function getWordById(id) {
    return words.find(word => word.id === Number(id));
}

const pageTitles = {
    home: "Trang chủ", about: "Giới thiệu", categories: "Danh mục từ vựng",
    "add-word": "Thêm từ mới", practice: "Luyện tập", favorites: "Từ yêu thích",
    statistics: "Thống kê", account: "Tài khoản"
};

function showPage(pageId) {
    const target = document.getElementById(pageId);
    if (!target) return;

    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    target.classList.add("active");

    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.toggle("active", item.dataset.page === pageId);
    });

    const title = pageTitles[pageId] || "Trạm Từ";
    document.getElementById("pageName").textContent = title;
    document.getElementById("topTitle").textContent = pageId === "home" ? "Chào mừng bạn trở lại! 🌿" : title;
    document.getElementById("sidebar").classList.remove("open");

    if (pageId === "home") renderHomeWords();
    if (pageId === "categories") renderVocabulary();
    if (pageId === "favorites") renderFavorites();
    if (pageId === "statistics") {
        updateStatistics();
        renderDetailedHistory();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", event => {
        event.preventDefault();
        showPage(item.dataset.page);
    });
});

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.go));
});

document.getElementById("mobileMenu").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
});

function displayDate() {
    const today = new Date();
    document.getElementById("todayDate").textContent = today.toLocaleDateString("vi-VN", {
        weekday: "short", day: "2-digit", month: "2-digit", year: "numeric"
    });
}
displayDate();

const themeToggle = document.getElementById("themeToggle");
function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}
let savedTheme = localStorage.getItem("TrạmTheme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("TrạmTheme", newTheme);
    applyTheme(newTheme);
    showToast(newTheme === "dark" ? "Đã bật chế độ tối 🌙" : "Đã bật chế độ sáng ☀️");
});

function showToast(message) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i>${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 2600);
}

function createWordCard(word) {
    const card = document.createElement("div");
    card.className = "vocab-card";
    card.dataset.id = word.id;

    card.innerHTML = `
        <div class="vocab-top">
            <span class="word-tag">${escapeHTML(word.category)}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
                <button class="heart-button ${word.favorite ? "active" : ""}" data-favorite="${word.id}" title="Yêu thích">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <!-- NÚT XÓA TỪ VỰNG -->
                <button class="heart-button" data-delete="${word.id}" title="Xóa từ này" style="color: #d86c6c;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>

        <h3>${escapeHTML(word.word)}</h3>
        <p class="vocab-ipa">${escapeHTML(word.ipa || "Chưa có phiên âm")}</p>
        <p class="vocab-meaning">${escapeHTML(word.meaning)}</p>

        <div class="vocab-bottom">
            <span>${escapeHTML(word.type)}</span>
            <span class="vocab-detail-button">Chi tiết <i class="fa-solid fa-arrow-right"></i></span>
        </div>
    `;

    // Sự kiện khi bấm vào thẻ để xem chi tiết (nhưng không bấm nhầm nút tim hay nút xóa)
    card.addEventListener("click", event => {
        if (event.target.closest("[data-favorite]") || event.target.closest("[data-delete]")) return;
        openWordModal(word.id);
    });

    // Sự kiện bấm nút thả tim
    card.querySelector("[data-favorite]").addEventListener("click", event => {
        event.stopPropagation();
        toggleFavorite(word.id);
    });

    // SỰ KIỆN BẤM NÚT THÙNG RÁC ĐỂ XÓA TỪ
    card.querySelector("[data-delete]").addEventListener("click", event => {
        event.stopPropagation();
        deleteWord(word.id);
    });

    return card;
}

function renderVocabulary() {
    const grid = document.getElementById("vocabularyGrid");
    const search = document.getElementById("wordSearch").value.trim().toLowerCase();
    const filtered = words.filter(word => {
        const matchCategory = selectedFilter === "All" || word.category === selectedFilter;
        const matchSearch = word.word.toLowerCase().includes(search) || word.meaning.toLowerCase().includes(search);
        return matchCategory && matchSearch;
    });

    grid.innerHTML = "";
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-seedling"></i><h3>Chưa tìm thấy từ vựng</h3><p>Hãy thử từ khóa khác hoặc thêm từ mới nhé!</p></div>`;
    } else {
        filtered.forEach(word => grid.appendChild(createWordCard(word)));
    }
    document.getElementById("categoryResultCount").textContent = `Tìm thấy ${filtered.length} từ vựng`;
}

document.getElementById("wordSearch").addEventListener("input", renderVocabulary);

document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        selectedFilter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        renderVocabulary();
    });
});

document.querySelectorAll("[data-category]").forEach(card => {
    card.addEventListener("click", () => {
        selectedFilter = card.dataset.category;
        document.querySelectorAll("[data-filter]").forEach(item => {
            item.classList.toggle("active", item.dataset.filter === selectedFilter);
        });
        document.getElementById("wordSearch").value = "";
        showPage("categories");
        renderVocabulary();
    });
});

document.getElementById("addWordForm").addEventListener("submit", event => {
    event.preventDefault();
    const wordText = document.getElementById("newWord").value.trim();
    const meaning = document.getElementById("newMeaning").value.trim();
    const category = document.getElementById("newCategory").value.trim();

    if (!wordText || !meaning || !category) {
        showToast("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
    }

    const duplicate = words.some(word => word.word.toLowerCase() === wordText.toLowerCase());
    if (duplicate) {
        showToast("Từ này đã tồn tại trong thư viện!");
        return;
    }

    const newWord = {
        id: Date.now(),
        word: wordText,
        meaning: meaning,
        type: document.getElementById("newType").value,
        category: category,
        ipa: document.getElementById("newIPA").value.trim(),
        example: document.getElementById("newExample").value.trim(),
        note: document.getElementById("newNote").value.trim(),
        favorite: false
    };

    words.unshift(newWord);
    saveWords();
    markStudyToday();
    updateAll();
    event.target.reset();
    showToast("Đã thêm từ vựng thành công! 🌱");
    showPage("categories");
});

function toggleFavorite(id) {
    const word = getWordById(id);
    if (!word) return;
    word.favorite = !word.favorite;
    saveWords();
    updateAll();
    showToast(word.favorite ? "Đã thêm vào từ yêu thích ❤️" : "Đã bỏ khỏi từ yêu thích");
}

function renderFavorites() {
    const grid = document.getElementById("favoriteGrid");
    const favorites = words.filter(word => word.favorite);
    grid.innerHTML = "";
    if (favorites.length === 0) {
        grid.innerHTML = `<div class="empty-state"><i class="fa-regular fa-heart"></i><h3>Chưa có từ yêu thích</h3><p>Nhấn biểu tượng trái tim để lưu lại nhé!</p></div>`;
    } else {
        favorites.forEach(word => grid.appendChild(createWordCard(word)));
    }
    document.getElementById("favoriteTotal").textContent = `${favorites.length} từ`;
    document.getElementById("favoriteDescription").textContent = `Bạn đang lưu ${favorites.length} từ vựng yêu thích.`;
}

function openWordModal(id) {
    const word = getWordById(id);
    if (!word) return;
    currentModalId = id;
    document.getElementById("modalWord").textContent = word.word;
    document.getElementById("modalIPA").textContent = word.ipa || "Chưa có phiên âm";
    document.getElementById("modalType").textContent = word.type;
    document.getElementById("modalMeaning").textContent = word.meaning;
    document.getElementById("modalExample").textContent = word.example || "Chưa có ví dụ.";
    document.getElementById("modalNote").textContent = word.note ? "Ghi chú: " + word.note : "";
    document.getElementById("modalFavorite").innerHTML = word.favorite ? '<i class="fa-solid fa-heart"></i> Bỏ yêu thích' : '<i class="fa-solid fa-heart"></i> Yêu thích';
    document.getElementById("wordModal").classList.add("show");
}

function closeWordModal() {
    document.getElementById("wordModal").classList.remove("show");
}
document.getElementById("closeModal").addEventListener("click", closeWordModal);
document.getElementById("wordModal").addEventListener("click", e => { if (e.target.id === "wordModal") closeWordModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeWordModal(); });

document.getElementById("modalFavorite").addEventListener("click", () => {
    if (currentModalId === null) return;
    toggleFavorite(currentModalId);
    openWordModal(currentModalId);
});

function renderHomeWords() {
    const container = document.getElementById("homeWordList");
    const recentWords = words.slice(0, 5);
    container.innerHTML = "";
    recentWords.forEach(word => {
        const row = document.createElement("div");
        row.className = "word-row";
        row.innerHTML = `
            <div class="word-main"><strong>${escapeHTML(word.word)}</strong><small>${escapeHTML(word.ipa || "")}</small></div>
            <div class="word-meaning">${escapeHTML(word.meaning)}</div>
            <span class="word-tag">${escapeHTML(word.category)}</span>
            <button class="heart-button ${word.favorite ? "active" : ""}" data-favorite="${word.id}"><i class="fa-solid fa-heart"></i></button>
        `;
        row.querySelector("[data-favorite]").addEventListener("click", () => toggleFavorite(word.id));
        row.querySelector(".word-main").addEventListener("click", () => openWordModal(word.id));
        container.appendChild(row);
    });
}

function prepareFlashcards() {
    currentFlashWords = [...words];
    currentFlashIndex = 0;
    displayFlashcard();
}

function displayFlashcard() {
    if (currentFlashWords.length === 0) {
        document.getElementById("flashWord").textContent = "Chưa có từ";
        document.getElementById("flashMeaning").textContent = "Hãy thêm từ vựng trước nhé!";
        document.getElementById("flashIPA").textContent = "";
        document.getElementById("flashExample").textContent = "";
        document.getElementById("flashCounter").textContent = "0 / 0";
        return;
    }
    const word = currentFlashWords[currentFlashIndex];
    document.getElementById("flashcard").classList.remove("flipped");
    document.getElementById("flashWord").textContent = word.word;
    document.getElementById("flashIPA").textContent = word.ipa || "Chưa có phiên âm";
    document.getElementById("flashMeaning").textContent = word.meaning;
    document.getElementById("flashExample").textContent = word.example || "Hãy tự đặt một câu với từ này nhé!";
    document.getElementById("flashCounter").textContent = `${currentFlashIndex + 1} / ${currentFlashWords.length}`;
}

document.getElementById("flashcard").addEventListener("click", () => document.getElementById("flashcard").classList.toggle("flipped"));
document.getElementById("prevFlash").addEventListener("click", () => {
    if (!currentFlashWords.length) return;
    currentFlashIndex = (currentFlashIndex - 1 + currentFlashWords.length) % currentFlashWords.length;
    displayFlashcard();
});
document.getElementById("nextFlash").addEventListener("click", () => {
    if (!currentFlashWords.length) return;
    currentFlashIndex = (currentFlashIndex + 1) % currentFlashWords.length;
    displayFlashcard();
});
document.getElementById("shuffleFlash").addEventListener("click", () => {
    currentFlashWords.sort(() => Math.random() - 0.5);
    currentFlashIndex = 0;
    displayFlashcard();
    showToast("Đã xáo trộn thẻ từ vựng!");
});
document.getElementById("knowFlash").addEventListener("click", () => {
    if (!currentFlashWords.length) return;
    markStudyToday();
    showToast("Tốt lắm! Tiếp tục phát huy nhé 🌱");
    currentFlashIndex = (currentFlashIndex + 1) % currentFlashWords.length;
    displayFlashcard();
});

document.querySelectorAll("[data-practice]").forEach(button => {
    button.addEventListener("click", () => {
        const mode = button.dataset.practice;
        document.querySelectorAll(".practice-tab").forEach(tab => tab.classList.toggle("active", tab === button));
        document.querySelectorAll(".practice-panel").forEach(panel => panel.classList.remove("active"));
        document.getElementById(mode + "Panel").classList.add("active");
        if (mode === "flashcard") prepareFlashcards();
        if (mode === "quiz") {
            updateQuizPackageDropdown();
            startQuiz();
        }
        if (mode === "fill") prepareFill();
    });
});

// CẬP NHẬT DANH SÁCH GÓI CHO TRẮC NGHIỆM
function updateQuizPackageDropdown() {
    const selectElement = document.getElementById("quizPackageSelect");
    if (!selectElement) return;
    selectElement.innerHTML = `<option value="All">Tất cả các từ vựng</option>`;
    const categories = [...new Set(words.map(w => w.category))];
    categories.forEach(cat => {
        if (cat) {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            selectElement.appendChild(option);
        }
    });
}

function startQuiz() {
    const selectElement = document.getElementById("quizPackageSelect");
    const selectedCategory = selectElement ? selectElement.value : "All";

    const packageWords = selectedCategory === "All" ? words : words.filter(w => w.category === selectedCategory);

    if (packageWords.length < 4) {
        showToast("Gói này cần ít nhất 4 từ để tạo bài trắc nghiệm!");
        return;
    }

    quizQuestions = [...packageWords].sort(() => Math.random() - 0.5).slice(0, 10);
    quizIndex = 0;
    quizPoints = 0;
    quizAnswered = false;
    quizStartTime = Date.now();

    document.getElementById("quizScore").textContent = "0";
    displayQuiz();
}

const startPackageBtn = document.getElementById("startPackageQuizBtn");
if (startPackageBtn) {
    startPackageBtn.addEventListener("click", startQuiz);
}

function displayQuiz() {
    if (quizIndex >= quizQuestions.length) {
        finishQuiz();
        return;
    }

    quizAnswered = false;
    const question = quizQuestions[quizIndex];

    document.getElementById("quizNumber").textContent = `CÂU HỎI ${String(quizIndex + 1).padStart(2, "0")}`;
    document.getElementById("quizCount").textContent = `${quizIndex + 1} / ${quizQuestions.length}`;
    document.getElementById("quizProgress").style.width = `${(quizIndex / quizQuestions.length) * 100}%`;
    document.getElementById("quizWord").textContent = question.word;
    document.getElementById("quizFeedback").textContent = "";
    document.getElementById("quizFeedback").className = "quiz-feedback";
    document.getElementById("nextQuiz").disabled = true;

    const wrongAnswers = words.filter(word => word.id !== question.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [question, ...wrongAnswers].sort(() => Math.random() - 0.5);

    const optionContainer = document.getElementById("quizOptions");
    optionContainer.innerHTML = "";

    options.forEach(option => {
        const button = document.createElement("button");
        button.className = "quiz-option";
        button.textContent = option.meaning;
        button.addEventListener("click", () => checkQuizAnswer(button, option.id === question.id, question));
        optionContainer.appendChild(button);
    });
}

function checkQuizAnswer(selectedButton, isCorrect, question) {
    if (quizAnswered) return;
    quizAnswered = true;
    const feedback = document.getElementById("quizFeedback");

    document.querySelectorAll(".quiz-option").forEach(button => {
        button.disabled = true;
        if (button.textContent === question.meaning) {
            button.classList.add("correct");
        }
    });

    if (isCorrect) {
        quizPoints += 10;
        feedback.innerHTML = `<i class="fa-solid fa-circle-check" style="margin-right: 6px;"></i> Chính xác! Bạn làm rất tốt 🎉`;
        feedback.classList.add("success");
    } else {
        selectedButton.classList.add("wrong");
        feedback.innerHTML = `<i class="fa-solid fa-circle-xmark" style="margin-right: 6px;"></i> Chưa chính xác! Đáp án đúng là: <strong>${question.meaning}</strong>`;
        feedback.classList.add("error");
    }

    document.getElementById("quizScore").textContent = quizPoints;
    document.getElementById("nextQuiz").disabled = false;

    markStudyToday();
    const currentScorePercent = Math.round((quizPoints / (quizQuestions.length * 10)) * 100);
    try {
        localStorage.setItem("TrạmLastScore", currentScorePercent);
    } catch (e) {
        console.warn(e);
    }

    if (typeof updateStatistics === "function") {
        updateStatistics();
    }
}

function finishQuiz() {
    const timeSpentSec = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 0;
    const mins = Math.floor(timeSpentSec / 60);
    const secs = timeSpentSec % 60;
    const timeFormatted = `${mins > 0 ? mins + ' phút ' : ''}${secs} giây`;

    const totalQ = quizQuestions.length;
    const correctQ = quizPoints / 10;
    const selectElement = document.getElementById("quizPackageSelect");
    const packageName = selectElement ? selectElement.options[selectElement.selectedIndex].text : "Tất cả";

    document.getElementById("quizNumber").textContent = "HOÀN THÀNH";
    document.getElementById("quizWord").textContent = `Bạn đạt ${quizPoints}/100 điểm!`;
    document.getElementById("quizOptions").innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-trophy"></i>
            <h3>${quizPoints >= 70 ? "Tuyệt vời!" : "Cố gắng thêm nhé!"}</h3>
            <p>Đúng: ${correctQ}/${totalQ} câu | Thời gian: ${timeFormatted}</p>
        </div>
    `;
    document.getElementById("quizFeedback").innerHTML = "";
    document.getElementById("quizProgress").style.width = "100%";
    document.getElementById("quizCount").textContent = "Hoàn thành";

    const nextBtn = document.getElementById("nextQuiz");
    nextBtn.disabled = false;
    nextBtn.textContent = "Làm lại";
    nextBtn.onclick = () => {
        nextBtn.textContent = "Câu tiếp theo →";
        nextBtn.onclick = null;
        startQuiz();
    };

    try {
        const record = {
            date: new Date().toLocaleString("vi-VN"),
            package: packageName,
            correctCount: correctQ,
            totalCount: totalQ,
            score: Math.round((quizPoints / (totalQ * 10)) * 100),
            timeSpent: timeFormatted
        };
        let history = JSON.parse(localStorage.getItem("TrạmDetailedHistory") || "[]");
        history.unshift(record);
        localStorage.setItem("TrạmDetailedHistory", JSON.stringify(history));
    } catch (e) {
        console.warn(e);
    }

    updateStatistics();
    renderDetailedHistory();
}

const nextQuizButton = document.getElementById("nextQuiz");
if (nextQuizButton) {
    nextQuizButton.addEventListener("click", () => {
        if (quizAnswered) {
            quizIndex++;
            displayQuiz();
        }
    });
}

function prepareFill() {
    fillIndex = 0;
    displayFill();
}

function displayFill() {
    if (words.length === 0) return;
    currentFillWord = words[fillIndex % words.length];
    document.getElementById("fillMeaning").textContent = currentFillWord.meaning;
    let sentence = currentFillWord.example || "I want to learn this word.";
    const regex = new RegExp(currentFillWord.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    sentence = sentence.replace(regex, "________");
    document.getElementById("fillSentence").textContent = sentence;
    document.getElementById("fillAnswer").value = "";
    const feedback = document.getElementById("fillFeedback");
    feedback.textContent = "";
    feedback.className = "quiz-feedback";
}

document.getElementById("fillForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!currentFillWord) return;
    const answer = document.getElementById("fillAnswer").value.trim();
    const feedback = document.getElementById("fillFeedback");
    if (answer.toLowerCase() === currentFillWord.word.toLowerCase()) {
        markStudyToday();
        feedback.textContent = "Chính xác! Bạn đã điền đúng 🎉";
        feedback.className = "quiz-feedback success";
    } else {
        feedback.textContent = `Chưa đúng. Đáp án là: ${currentFillWord.word}`;
        feedback.className = "quiz-feedback error";
    }
});

document.getElementById("nextFill").addEventListener("click", () => {
    fillIndex++;
    displayFill();
});

function updateStatistics() {
    const total = words.length;
    const favorites = words.filter(word => word.favorite).length;
    let score = 0;
    try {
        const savedScore = localStorage.getItem("TrạmLastScore");
        if (savedScore !== null) score = Number(savedScore);
    } catch (error) {
        console.warn(error);
    }

    document.getElementById("totalWords").textContent = total;
    document.getElementById("favoriteCount").textContent = favorites;
    document.getElementById("averageScore").innerHTML = `${score}<span>%</span>`;
    document.getElementById("statTotalWords").textContent = total;
    document.getElementById("statFavorites").textContent = favorites;
    document.getElementById("statScore").textContent = `${score}%`;
    document.getElementById("favoriteTotal").textContent = `${favorites} từ`;

    updateStreakCount();
    updateDailyGoalDisplay();
}

function renderStatistics() {
    updateStatistics();
    const container = document.getElementById("categoryStats");
    const categories = [...new Set(words.map(w => w.category))];

    container.innerHTML = "";
    categories.forEach(category => {
        const count = words.filter(word => word.category === category).length;
        const percent = totalCategoryPercent(count);
        const item = document.createElement("div");
        item.className = "category-stat-item";
        item.innerHTML = `
            <div class="category-stat-top"><strong>${escapeHTML(category)}</strong><span>${count} từ</span></div>
            <div class="category-stat-bar"><span style="width:${percent}%"></span></div>
        `;
        container.appendChild(item);
    });
}

function totalCategoryPercent(count) {
    if (words.length === 0) return 0;
    return Math.max(3, Math.round(count / words.length * 100));
}

function renderDetailedHistory() {
    const tbody = document.getElementById("detailedHistoryBody");
    if (!tbody) return;
    const history = JSON.parse(localStorage.getItem("TrạmDetailedHistory") || "[]");
    tbody.innerHTML = "";
    if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 15px; color: var(--muted);">Chưa có lịch sử luyện tập nào.</td></tr>`;
        return;
    }
    history.forEach(item => {
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid var(--border)";
        tr.innerHTML = `
            <td style="padding: 10px; color: var(--muted);">${item.date}</td>
            <td style="padding: 10px; font-weight: bold;">${item.package}</td>
            <td style="padding: 10px;">${item.correctCount} / ${item.totalCount} câu</td>
            <td style="padding: 10px; color: var(--primary); font-weight: bold;">${item.score}%</td>
            <td style="padding: 10px;">${item.timeSpent}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateAll() {
    updateStatistics();
    renderHomeWords();
    renderVocabulary();
    renderFavorites();
    renderStatistics();
    prepareFlashcards();
    updateStreakCount();
    updateDailyGoalDisplay();
    updateQuizPackageDropdown();
}

// XỬ LÝ STREAK VÀ MỤC TIÊU NGÀY
const WEEKLY_GOAL = 5;

function getStudyDays() {
    return JSON.parse(localStorage.getItem("leafyStudyDays") || "[]");
}

function markStudyToday() {
    const today = new Date().toLocaleDateString("en-CA");
    let days = getStudyDays();
    if (!days.includes(today)) {
        days.push(today);
        localStorage.setItem("leafyStudyDays", JSON.stringify(days));
    }
    updateWeeklyProgress();
    updateStreakCount();
}

function updateWeeklyProgress() {
    const days = getStudyDays();
    const today = new Date();
    const monday = new Date(today);
    const day = today.getDay();
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date.toLocaleDateString("en-CA"));
    }

    const completed = weekDates.filter(date => days.includes(date)).length;
    const progress = Math.min(100, Math.round(completed / WEEKLY_GOAL * 100));

    const progressText = document.getElementById("weeklyProgressText");
    const progressBar = document.getElementById("weeklyProgressBar");
    if (progressText) progressText.textContent = progress + "%";
    if (progressBar) progressBar.style.width = progress + "%";

    const weekDays = document.querySelectorAll("#weekDays .day-dot");
    weekDays.forEach((dot, index) => {
        dot.classList.remove("done", "current");
        if (days.includes(weekDates[index])) dot.classList.add("done");
        if (weekDates[index] === today.toLocaleDateString("en-CA")) dot.classList.add("current");
    });
}

function updateStreakCount() {
    const days = getStudyDays();
    let streak = 0;
    if (days.length > 0) {
        days.sort((a, b) => new Date(b) - new Date(a));
        let currentDate = new Date();
        let todayStr = currentDate.toLocaleDateString("en-CA");
        if (!days.includes(todayStr)) {
            currentDate.setDate(currentDate.getDate() - 1);
        }
        while (true) {
            const dateString = currentDate.toLocaleDateString("en-CA");
            if (days.includes(dateString)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
    }
    const statStreak = document.getElementById("statStreak");
    if (statStreak) statStreak.textContent = streak;
    const streakCount = document.getElementById("streakCount");
    if (streakCount) streakCount.innerHTML = `${streak} <span>ngày</span>`;
    const achStreakText = document.getElementById("achievementStreakText");
    if (achStreakText) achStreakText.textContent = streak;
}

function updateDailyGoalDisplay() {
    const totalWords = words.length;
    const dailyTarget = Math.max(10, totalWords);
    const learnedToday = Math.min(totalWords, dailyTarget);

    const goalElement = document.getElementById("dailyGoalCount");
    if (goalElement) {
        goalElement.textContent = `${learnedToday}/${dailyTarget}`;
    }

    const goalCircle = document.querySelector(".goal-circle");
    if (goalCircle) {
        const percent = Math.min(100, Math.round((learnedToday / dailyTarget) * 100));
        goalCircle.style.background = `conic-gradient(#58a76e 0% ${percent}%, var(--border) ${percent}% 100%)`;
    }

    const bar = document.getElementById("sidebarProgressBar");
    const text = document.getElementById("sidebarProgressText");
    if (bar) bar.style.width = Math.round((learnedToday/dailyTarget)*100) + "%";
    if (text) text.textContent = Math.round((learnedToday/dailyTarget)*100) + "% mục tiêu hôm nay";
}

document.addEventListener("DOMContentLoaded", () => {
    updateWeeklyProgress();
    updateStreakCount();
    updateDailyGoalDisplay();
    updateQuizPackageDropdown();
    renderDetailedHistory();
});

updateAll();
showPage("home");


// =====================================
// XÓA TỪ VỰNG HOÀN TOÀN
// =====================================
function deleteWord(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa từ vựng này không?")) return;
    words = words.filter(word => word.id !== Number(id));
    saveWords();
    updateAll();
    showToast("Đã xóa từ vựng thành công! 🗑️");
}

function deletePackage(categoryName) {
    if (!confirm(`Bạn có chắc muốn xóa toàn bộ từ vựng thuộc gói "${categoryName}" không?`)) return;
    words = words.filter(word => word.category !== categoryName);
    saveWords();
    updateAll();
    showToast(`Đã xóa toàn bộ gói "${categoryName}"! 🗑️`);
}


const deletePkgBtn = document.getElementById("deletePackageBtn");
if (deletePkgBtn) {
    deletePkgBtn.addEventListener("click", () => {
        const selectElement = document.getElementById("quizPackageSelect");
        const selectedCategory = selectElement ? selectElement.value : "All";

        if (selectedCategory === "All") {
            showToast("Không thể xóa tùy chọn 'Tất cả các từ vựng'!");
            return;
        }

        deletePackage(selectedCategory);
    });
}
