let dropdown = document.querySelector('.dropdown');
let dropdownContent = dropdown.querySelector('.dropdown-content');
let dropdownArrow = dropdown.querySelector('.dropdown-arrow');

dropdown.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
    dropdownArrow.classList.toggle('open');
});

const inputs = document.querySelectorAll('.form-container input');
inputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let label = e.target.previousElementSibling;
        if (!label || label.tagName !== 'LABEL') {
            label = document.createElement('label');
            label.textContent = e.target.placeholder;
            e.target.parentNode.insertBefore(label, e.target);
        }
    });
});

const uploadLink = document.querySelector('#upload-link');
const photoupload = document.querySelector('#photoupload');
const preview = document.querySelector('#preview');
const previewContainer = document.querySelector('#preview-container');
const previewText = document.querySelector('#preview-text');

uploadLink.addEventListener('click', (e) => {
    e.preventDefault();
    photoupload.click();
});

photoupload.addEventListener('change', handleFileSelect);
photoupload.addEventListener('change', (e) => {
    if (e.target.value) {
        uploadLink.textContent = 'Editar imagem';
        previewText.style.display = 'none';
    } else {
        uploadLink.textContent = 'Carregar imagem';
        previewText.style.display = 'block';
    }
});
previewContainer.addEventListener('dragover', handleDragOver);
previewContainer.addEventListener('drop', handleFileDrop);

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
    }
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleFileDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        previewText.style.display = 'none';
        photoupload.files = e.dataTransfer.files;
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        previewText.style.display = 'block';
        preview.src = '';
    }
}

previewContainer.addEventListener('click', (e) => {
    photoupload.click();
});

//ATIVAR NO FORM.HTML ---------------------------------------------------------------------------------- ATIVAR NO FORM.HTML

function validateForm() {
    let form = document.forms["myForm"];
    let requiredFields = form.querySelectorAll("[required]");
    let previewContainer = document.getElementById("preview-container");
    let preview = document.getElementById("preview");
    let isValid = true;
    let inputs = document.querySelectorAll("input[required]");
    for (let input of inputs) {
        input.oninput = function () {
            input.style.color = "";
        }
    }


    for (let field of requiredFields) {
        if (field.value == "") {
            field.style.borderColor = "red";
            field.style.color = "red";
            field.classList.add("red-placeholder");
            isValid = false;
        } else {
            field.style.borderColor = "";
            field.style.color = "";
            field.classList.remove("red-placeholder");
        }
        field.oninput = function () {
            field.style.borderColor = "";
            field.style.color = "";
            field.placeholder.style.color = "";
        }
    }
    if (preview.src == "") {
        previewContainer.style.border = "2px solid red";
        isValid = false;
    } else {
        previewContainer.style.border = "";
    }

    let formTab = document.querySelector('.form-tab');
    let errorContainer = formTab.querySelector('.error-container');
    if (!isValid) {
        errorContainer.innerHTML = '<hr><p class="error-title">Formulário Incompleto!</p> <p class="error-message">Por favor preencha os campos em falta.</p><hr>'
    }

    return isValid;
}



const selects = document.querySelectorAll('.form-input-subsection select');

selects.forEach(select => {
    const label = select.previousElementSibling;
    if (!select.value) {
        label.style.display = 'none';
        select.style.color = '#808080';
    }
    select.addEventListener('change', () => {
        if (select.value) {
            label.style.display = 'block';
            select.style.color = '';
        } else {
            label.style.display = 'none';
            select.style.color = '#808080';
        }
    });
});


let form = document.querySelector("form");
form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
        event.preventDefault();
    }
});

window.onload = function () {
    initAutocomplete();
};
