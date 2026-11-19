/* =========================================================
   MISHRA SAREE CENTER
   Product Images + Shopping Bag + Admin + Hindi Support
========================================================= */

const FALLBACK_IMAGE =
"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85";

const DEMO_PRODUCTS = [

    {
        id:"1",
        name:"Royal Banarasi Silk",
        price:5499,
        category:"Banarasi",
        desc:"Traditional zari work with rich silk finish.",
        image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85"
    },

    {
        id:"2",
        name:"Wedding Red Elegance",
        price:7999,
        category:"Wedding",
        desc:"A beautiful choice for weddings and celebrations.",
        image:"https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85"
    },

    {
        id:"3",
        name:"Pastel Party Saree",
        price:3299,
        category:"Party Wear",
        desc:"Soft tones and contemporary elegance.",
        image:"https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85"
    },

    {
        id:"4",
        name:"Classic Cotton Grace",
        price:1299,
        category:"Cotton",
        desc:"Lightweight and comfortable for everyday wear.",
        image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85"
    },

    {
        id:"5",
        name:"Golden Silk Heritage",
        price:4599,
        category:"Silk",
        desc:"Elegant golden accents with a classic drape.",
        image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85"
    },

    {
        id:"6",
        name:"Festive Floral",
        price:2499,
        category:"Party Wear",
        desc:"A colourful festive look for special days.",
        image:"https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85"
    },

    {
        id:"7",
        name:"Everyday Soft Saree",
        price:899,
        category:"Daily Wear",
        desc:"Easy drape and soft fabric for daily use.",
        image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85"
    },

    {
        id:"8",
        name:"Bridal Zari Collection",
        price:9999,
        category:"Wedding",
        desc:"Statement zari details for your special day.",
        image:"https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85"
    }

];


/* ================= STORAGE ================= */

const API_URL = "";

let products =
    JSON.parse(localStorage.getItem("msc_products") || "null")
    || DEMO_PRODUCTS;

let cart =
    JSON.parse(localStorage.getItem("msc_cart") || "[]");

let filter = "All";
let search = "";

const $ = selector => document.querySelector(selector);

const money = number =>
    "₹" + Number(number).toLocaleString("en-IN");


function save() {

    localStorage.setItem(
        "msc_products",
        JSON.stringify(products)
    );

}


/* ================= IMAGE FALLBACK ================= */

function fixImage(img) {

    img.onerror = function() {

        this.onerror = null;

        this.src = FALLBACK_IMAGE;

    };

}


/* ================= PRODUCTS ================= */

function renderProducts() {

    let list = products.filter(p =>

        (filter === "All" || p.category === filter)

        &&

        (p.name + " " + p.category + " " + p.desc)
            .toLowerCase()
            .includes(search.toLowerCase())

    );


    $("#productGrid").innerHTML = list.map(p => `

        <article class="product-card">

            <div class="product-image">

                <img
                    src="${p.image || FALLBACK_IMAGE}"
                    alt="${p.name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                >

                <span class="product-tag">
                    ${tr(p.category)}
                </span>

                <button
                    class="add-btn"
                    onclick="addCart('${p.id}')"
                >

                    🛍️ ${tr("Add to Bag")}

                </button>

            </div>


            <div class="product-info">

                <small>
                    ${tr(p.category)}
                </small>

                <h3>
                    ${p.name}
                </h3>

                <div class="price">
                    ${money(p.price)}
                </div>

            </div>

        </article>

    `).join("") || (

        currentLang === "hi"

            ? "<p>कोई साड़ी नहीं मिली। दूसरी खोज करें।</p>"

            : "<p>No sarees found. Try another search.</p>"

    );

}


/* ================= CART ================= */

function renderCart() {

    $("#cartCount").textContent =
        cart.reduce((a, x) => a + x.qty, 0);


    $("#cartItems").innerHTML = cart.map(x => {

        let p = products.find(p => p.id === x.id);

        if (!p) return "";


        return `

            <div class="cart-item">

                <img
                    src="${p.image || FALLBACK_IMAGE}"
                    alt="${p.name}"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                >

                <div>

                    <h4>${p.name}</h4>

                    <p>
                        ${money(p.price)} × ${x.qty}
                    </p>

                    <button
                        onclick="changeQty('${x.id}',-1)"
                    >
                        −
                    </button>

                    <button
                        onclick="changeQty('${x.id}',1)"
                    >
                        +
                    </button>

                </div>

            </div>

        `;

    }).join("");


    $("#cartTotal").textContent = money(

        cart.reduce((sum, x) => {

            let product = products.find(p => p.id === x.id);

            return sum + (product?.price || 0) * x.qty;

        }, 0)

    );


    localStorage.setItem(
        "msc_cart",
        JSON.stringify(cart)
    );

}


function addCart(id) {

    let item = cart.find(x => x.id === id);


    if (item) {

        item.qty++;

    } else {

        cart.push({
            id,
            qty:1
        });

    }


    renderCart();

    toast(tr("Added to your bag"));

}


function changeQty(id, amount) {

    let item = cart.find(x => x.id === id);


    if (item) {

        item.qty += amount;

    }


    cart = cart.filter(x => x.qty > 0);

    renderCart();

}


/* ================= TOAST ================= */

function toast(message) {

    $("#toast").textContent = message;

    $("#toast").classList.add("show");


    setTimeout(() => {

        $("#toast").classList.remove("show");

    }, 2200);

}


/* ================= OVERLAYS ================= */

function openOverlay(id) {

    $("#" + id).classList.add("show");

}


function closeOverlay(id) {

    $("#" + id).classList.remove("show");

}


$("#cartBtn").onclick = () => {

    openOverlay("cartOverlay");

};


$("#adminOpen").onclick = event => {

    event.preventDefault();

    openOverlay("adminOverlay");

    renderAdmin();

};


document.querySelectorAll("[data-close]").forEach(button => {

    button.onclick = () => {

        closeOverlay(button.dataset.close);

    };

});


document.querySelectorAll(".overlay").forEach(overlay => {

    overlay.addEventListener("click", event => {

        if (event.target === overlay) {

            closeOverlay(overlay.id);

        }

    });

});


/* ================= FILTERS ================= */

$("#filters").onclick = event => {

    if (event.target.classList.contains("filter")) {


        document.querySelectorAll(".filter").forEach(button => {

            button.classList.remove("active");

        });


        event.target.classList.add("active");


        filter = event.target.dataset.filter;


        renderProducts();

    }

};


/* ================= SEARCH ================= */

$("#searchInput").oninput = event => {

    search = event.target.value;

    renderProducts();

};


$("#searchBtn").onclick = () => {

    $("#searchInput").focus();


    document.querySelector("#products").scrollIntoView({

        behavior: "smooth"

    });

};


/* ================= MOBILE MENU ================= */

$("#menuBtn").onclick = () => {

    document.querySelector("nav").classList.toggle("open");

};


/* ================= COLLECTION CLICK ================= */

document.querySelectorAll(".collection-card").forEach(card => {

    card.onclick = () => {


        filter = card.dataset.cat;


        document.querySelectorAll(".filter").forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === filter
            );

        });


        renderProducts();


        document.querySelector("#products").scrollIntoView({

            behavior: "smooth"

        });

    };

});


/* ================= WHATSAPP CHECKOUT ================= */

$("#checkoutBtn").onclick = () => {


    if (!cart.length) {

        return toast(tr("Your bag is empty"));

    }


    let lines = cart.map(item => {

        let p = products.find(p => p.id === item.id);

        return `${p.name} (${item.qty}) - ${money(p.price * item.qty)}`;

    }).join("\n");


    let total = cart.reduce((sum, item) => {

        let product = products.find(p => p.id === item.id);

        return sum + (product?.price || 0) * item.qty;

    }, 0);


    let url =

        "https://wa.me/919999999999?text="

        +

        encodeURIComponent(

            "Hello Mishra Saree Center! I want to order:\n"

            +

            lines

            +

            "\nTotal: "

            +

            money(total)

        );


    window.open(url, "_blank");

};


/* ================= ADMIN ================= */

function renderAdmin() {

    $("#adminList").innerHTML = products.map(p => `

        <div class="admin-row">

            <img
                src="${p.image || FALLBACK_IMAGE}"
                onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
            >

            <div>

                <b>${p.name}</b>

                <br>

                ${money(p.price)} · ${tr(p.category)}

            </div>


            <button onclick="editProduct('${p.id}')">

                ${currentLang === "hi" ? "संपादित" : "Edit"}

            </button>


            <button onclick="deleteProduct('${p.id}')">

                ${currentLang === "hi" ? "हटाएँ" : "Delete"}

            </button>

        </div>

    `).join("");

}


window.editProduct = id => {

    let product = products.find(p => p.id === id);


    $("#editId").value = product.id;

    $("#pName").value = product.name;

    $("#pPrice").value = product.price;

    $("#pCategory").value = product.category;

    $("#pDesc").value = product.desc;


    toast(tr("Edit product details and save"));

};


window.deleteProduct = id => {

    if (confirm("Delete this product?")) {


        products = products.filter(p => p.id !== id);


        save();

        renderProducts();

        renderAdmin();

    }

};


/* ================= SAVE PRODUCT ================= */

$("#productForm").onsubmit = async event => {

    event.preventDefault();


    let id = $("#editId").value || Date.now().toString();


    let oldProduct = products.find(p => p.id === id);


    let file = $("#pImage").files[0];


    let image = oldProduct?.image || FALLBACK_IMAGE;


    if (file) {

        image = await new Promise(resolve => {

            let reader = new FileReader();


            reader.onload = () => resolve(reader.result);


            reader.readAsDataURL(file);

        });

    }


    let product = {

        id,

        name: $("#pName").value,

        price: Number($("#pPrice").value),

        category: $("#pCategory").value,

        desc: $("#pDesc").value,

        image

    };


    if (oldProduct) {

        products = products.map(p =>

            p.id === id ? product : p

        );

    } else {

        products.unshift(product);

    }


    save();


    renderProducts();

    renderAdmin();


    event.target.reset();


    $("#editId").value = "";


    toast(tr("Saree saved"));

};


/* ================= EXPORT PRODUCTS ================= */

$("#exportBtn").onclick = () => {


    let blob = new Blob(

        [JSON.stringify(products, null, 2)],

        {type: "application/json"}

    );


    let link = document.createElement("a");


    link.href = URL.createObjectURL(blob);


    link.download = "mishra-saree-products.json";


    link.click();

};


/* ================= BILINGUAL SUPPORT ================= */

let currentLang =

    localStorage.getItem("msc_lang")

    || "en";


const translations = {


    "✨ Elegance for every occasion · Visit us in Siwan, Bihar":

        "✨ हर अवसर के लिए सुंदरता · सिवान, बिहार में पधारें",


    "Collections":"संग्रह",

    "Shop Sarees":"साड़ियाँ खरीदें",

    "About Us":"हमारे बारे में",

    "Contact":"संपर्क",

    "Bag":"बैग",


    "THE ART OF INDIAN ELEGANCE":

        "भारतीय सुंदरता की कला",


    "Wear a story.":

        "एक कहानी पहनें।",


    "Make it yours.":

        "इसे अपना बनाएं।",


    "Discover timeless sarees, beautiful craftsmanship and styles made for your most memorable moments.":

        "हर खास पल के लिए खूबसूरत साड़ियाँ, शानदार कारीगरी और सदाबहार स्टाइल खोजें।",


    "Explore Collection":

        "संग्रह देखें",


    "Tradition · Grace · Celebration":

        "परंपरा · गरिमा · उत्सव",


    "✦ Handpicked collections":

        "✦ चुनिंदा संग्रह",


    "✦ Styles for every occasion":

        "✦ हर अवसर के लिए स्टाइल",


    "✦ Personal shopping assistance":

        "✦ व्यक्तिगत खरीदारी सहायता",


    "FIND YOUR STYLE":

        "अपना स्टाइल चुनें",


    "Shop by collection":

        "संग्रह के अनुसार खरीदें",


    "View all →":

        "सभी देखें →",


    "Wedding & Bridal":

        "शादी एवं दुल्हन",


    "For your unforgettable moments":

        "आपके यादगार पलों के लिए",


    "Silk Classics":

        "सिल्क की क्लासिक साड़ियाँ",


    "Rich textures & timeless grace":

        "समृद्ध बनावट और सदाबहार सुंदरता",


    "Party Wear":

        "पार्टी वियर",


    "Make every entrance special":

        "हर आगमन को खास बनाएं",


    "Everyday Elegance":

        "रोज़मर्रा की सुंदरता",


    "Comfort meets beautiful style":

        "आराम और खूबसूरत स्टाइल",


    "OUR FAVOURITES":

        "हमारी पसंद",


    "Featured sarees":

        "विशेष साड़ियाँ",


    "Find the saree that feels like you.":

        "ऐसी साड़ी चुनें जो आपकी पहचान बने।",


    "All Sarees":

        "सभी साड़ियाँ",


    "Wedding":

        "शादी",


    "Silk":

        "सिल्क",


    "Banarasi":

        "बनारसी",


    "Cotton":

        "कॉटन",


    "Daily Wear":

        "दैनिक पहनावा",


    "Search sarees...":

        "साड़ी खोजें...",


    "A LITTLE ABOUT US":

        "हमारे बारे में",


    "Tradition, woven":

        "परंपरा की बुनावट",


    "with love.":

        "प्यार के साथ।",


    "At Mishra Saree Center, we believe every saree carries a story. From festive celebrations to everyday elegance, we bring you beautiful styles, colours and craftsmanship for every woman and every occasion.":

        "मिश्रा साड़ी सेंटर में हमारा विश्वास है कि हर साड़ी एक कहानी कहती है। त्योहारों से लेकर रोज़मर्रा की सुंदरता तक, हम हर महिला और हर अवसर के लिए खूबसूरत स्टाइल, रंग और कारीगरी लेकर आते हैं।",


    "Visit our store in Siwan, Bihar, and let us help you find your perfect drape.":

        "सिवान, बिहार में हमारे स्टोर पर आएँ और अपनी पसंद की साड़ी चुनने में हमारी मदद लें।",


    "Visit our store →":

        "हमारे स्टोर पर आएँ →",


    "NEED HELP CHOOSING?":

        "चुनने में मदद चाहिए?",


    "Your perfect saree is waiting.":

        "आपकी पसंद की साड़ी आपका इंतज़ार कर रही है।",


    "Talk to us for availability, prices and personal recommendations.":

        "उपलब्धता, कीमत और व्यक्तिगत सुझाव के लिए हमसे बात करें।",


    "Chat on WhatsApp ↗":

        "व्हाट्सऐप पर बात करें ↗",


    "Elegance, tradition and beauty — all in one drape.":

        "सुंदरता, परंपरा और आकर्षण — एक ही साड़ी में।",


    "Explore":

        "देखें",


    "Our Story":

        "हमारी कहानी",


    "Visit Us":

        "हमसे मिलें",


    "Siwan, Bihar, India":

        "सिवान, बिहार, भारत",


    "Open daily · Contact for timings":

        "प्रतिदिन खुला · समय के लिए संपर्क करें",


    "Get directions ↗":

        "रास्ता देखें ↗",


    "Phone: Add shop number":

        "फोन: दुकान का नंबर जोड़ें",


    "WhatsApp: Add WhatsApp number":

        "व्हाट्सऐप: नंबर जोड़ें",


    "Owner Admin":

        "मालिक एडमिन",


    "Your Shopping Bag":

        "आपकी खरीदारी",


    "Total":

        "कुल",


    "Order on WhatsApp":

        "व्हाट्सऐप पर ऑर्डर करें",


    "Owner Product Manager":

        "दुकान उत्पाद प्रबंधन",


    "Add products, prices and images. Demo products are editable on this device. Connect Apps Script to sync online.":

        "उत्पाद, कीमत और फोटो जोड़ें। डेमो उत्पाद इस डिवाइस पर संपादित किए जा सकते हैं। ऑनलाइन सिंक के लिए Apps Script जोड़ें।",


    "Saree name":

        "साड़ी का नाम",


    "Price (₹)":

        "कीमत (₹)",


    "Description":

        "विवरण",


    "Product photo":

        "साड़ी की फोटो",


    "Save Saree":

        "साड़ी सेव करें",


    "Export products JSON":

        "उत्पाद JSON डाउनलोड करें",


    "Add to Bag":

        "बैग में डालें",


    "Added to your bag":

        "बैग में जोड़ा गया",


    "Your bag is empty":

        "आपका बैग खाली है",


    "Saree saved":

        "साड़ी सेव हो गई",


    "Edit product details and save":

        "उत्पाद विवरण बदलकर सेव करें",


    "No sarees found. Try another search.":

        "कोई साड़ी नहीं मिली। दूसरी खोज करें।"

};


const categoryHindi = {

    "Wedding":"शादी",

    "Silk":"सिल्क",

    "Banarasi":"बनारसी",

    "Party Wear":"पार्टी वियर",

    "Cotton":"कॉटन",

    "Daily Wear":"दैनिक पहनावा"

};


function tr(text) {

    return currentLang === "hi"

        ? (translations[text] || categoryHindi[text] || text)

        : text;

}


/* ================= APPLY LANGUAGE ================= */

function applyLanguage() {


    document.documentElement.lang =

        currentLang === "hi" ? "hi" : "en";


    document.querySelectorAll("body *").forEach(element => {


        if (

            element.children.length === 0

            &&

            element.textContent.trim()

        ) {


            if (!element.dataset.originalText) {

                element.dataset.originalText = element.textContent;

            }


            element.textContent = tr(element.dataset.originalText);

        }


        ["placeholder", "title", "alt"].forEach(attribute => {


            if (element.hasAttribute(attribute)) {


                let key = "original" + attribute;


                if (!element.dataset[key]) {

                    element.dataset[key] = element.getAttribute(attribute);

                }


                element.setAttribute(

                    attribute,

                    tr(element.dataset[key])

                );

            }

        });

    });


    $("#langBtn").textContent =

        currentLang === "en" ? "हिंदी" : "English";

}


/* ================= LANGUAGE BUTTON ================= */

$("#langBtn").onclick = () => {


    currentLang =

        currentLang === "en" ? "hi" : "en";


    localStorage.setItem(

        "msc_lang",

        currentLang

    );


    applyLanguage();

    renderProducts();

    renderCart();


    if ($("#adminOverlay").classList.contains("show")) {

        renderAdmin();

    }

};


/* ================= INITIALIZATION ================= */

applyLanguage();

renderProducts();

renderCart();
