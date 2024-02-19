mapboxgl.accessToken = env.mapbox_key;
const map = new mapboxgl.Map({
    container: env.mapbox_container_2, // container ID
    style: env.mapbox_style, // style URL
    center: [-8.413273215072923, 40.208713952284626], // starting position [lng, lat]
    zoom: 14.5, // starting zoom
    attributionControl: false
});
console.log("JavaScript code loaded");
const mapa = new mapboxgl.Map({
    container: env.mapbox_container, // container ID
    style: env.mapbox_style, // style URL
    center: [-8.413273215072923, 40.208713952284626], // starting position [lng, lat]
    zoom: 14.5, // starting zoom
    attributionControl: false
});

let dropdown = document.querySelector('.dropdown');
let dropdownContent = dropdown.querySelector('.dropdown-content');
let dropdownArrow = dropdown.querySelector('.dropdown-arrow');

dropdown.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
    dropdownArrow.classList.toggle('open');
});

const layerList = document.getElementById('menu-layers');
const inputs2 = layerList.querySelectorAll('img');

for (const input of inputs2) {
    input.onclick = () => {
        console.log('Image clicked:', input.id);

        // Update the style of the map
        const currentLayerId = input.id;
        map.setStyle('mapbox://styles/jgsantos/' + currentLayerId);
        console.log('Map style updated:', currentLayerId);

        // Update the src attribute of the images
        if (currentLayerId === 'clgm52kiw00bk01qzar176mja') {
            input.src = 'data/icon-layer-2.png';
            input.id = 'cllb4bmyh00rw01ph0c7oc87u';
        } else {
            input.src = 'data/icon-layer-1.png';
            input.id = 'clgm52kiw00bk01qzar176mja';
        }

        // Update the selected class on the images
        for (const input of inputs) {
            if (input.id === currentLayerId) {
                input.classList.add('selected');
            } else {
                input.classList.remove('selected');
            }
        }
    };
}


var latInput = document.getElementById('latitude');
var lngInput = document.getElementById('longitude');

latInput.addEventListener('input', updateAddress);
lngInput.addEventListener('input', updateAddress);

function updateAddress() {
    var lat = parseFloat(latInput.value);
    var lng = parseFloat(lngInput.value);

    var requestUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                document.getElementById('address').value = data.features[0].place_name;
            } else {
                window.alert('No results found');
            }
        })
        .catch(error => {
            window.alert('Geocoding failed: ' + error);
        });
}


function initAutocomplete() {
    const input = document.querySelector('#address');
    const options = {
        componentRestrictions: { country: 'pt' },
        bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(40.1579, -8.5161),
            new google.maps.LatLng(40.2767, -8.3691)
        ),
        strictBounds: true,
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            document.querySelector('#latitude').value = place.geometry.location.lat();
            document.querySelector('#longitude').value = place.geometry.location.lng();
            updateMarker();
        }
    });
}

var currentMarker;

map.on('click', function (e) {
    var coords = e.lngLat;
    var lng = coords.lng;
    var lat = coords.lat;

    // Create an img element for the marker
    const markerElement = document.createElement('img');
    markerElement.src = './data/icon-location.png';
    markerElement.style.height = '20px';

    if (currentMarker) {
        currentMarker.setLngLat([lng, lat]);
    } else {
        currentMarker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .addTo(map);
    }

    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;

    updateMarker();
    updateAddress();
});

var latInput = document.getElementById('latitude');
var lngInput = document.getElementById('longitude');


latInput.addEventListener('input', updateMarker);
lngInput.addEventListener('input', updateMarker); 0

function updateMarker() {
    console.log('updateMarker called');
    var lat = parseFloat(latInput.value);
    var lng = parseFloat(lngInput.value);

    console.log('lat:', lat, 'lng:', lng);

    // Create an img element for the marker
    const markerElement = document.createElement('img');
    markerElement.src = './data/icon-location.png';
    markerElement.style.height = '20px';

    if (currentMarker) {
        currentMarker.setLngLat([lng, lat]);
    } else {
        currentMarker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .addTo(map);
    }
    var markerCoords = currentMarker.getLngLat();

    map.flyTo({
        center: markerCoords,
        speed: 0.8,
        curve: 1
    });
}

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


const tabs = document.querySelectorAll('.tabs > div');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});


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

window.onload = function() {
    initAutocomplete();
  };
  