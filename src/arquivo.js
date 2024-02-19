// HERE
mapboxgl.accessToken = 'pk.eyJ1IjoiamdzYW50b3MiLCJhIjoiY2xrMjYyNjR1MGFraDNmbHMyOWRtd3M1ZSJ9.1Re9KG_r_9Gw4gblPjdBMA';


const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', debounceUpdateResults);



const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jgsantos/clgm52kiw00bk01qzar176mja', 
    center: [-8.413273215072923, 40.208713952284626],
    zoom: 14.5, 
    attributionControl: false,
});




const drawLink = document.getElementById('draw-link');
drawLink.addEventListener('click', (e) => {
    e.preventDefault();
    draw.changeMode('draw_polygon');
});
let polygonCoordinates;
map.on('draw.create', (e) => {
    const data = draw.getAll();
    const coordinates = data.features[0].geometry.coordinates[0];
    polygonCoordinates = coordinates;
    const coordinatesInput = document.createElement('input');
    coordinatesInput.type = 'hidden';
    coordinatesInput.name = 'coordinates';
    coordinatesInput.value = JSON.stringify(coordinates);
    form.appendChild(coordinatesInput);
    console.log('Coordinates:', coordinates);
    console.log('CoordinatesInputValue:', coordinatesInput.value);
    updateResults();
});

map.on('draw.delete', (e) => {
    polygonCoordinates = null;
    updateResults();
});

const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    }, styles: [
        {
            'id': 'gl-draw-polygon-fill-inactive',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'fill-color': '#000000',
                'fill-outline-color': '#000000',
                'fill-opacity': 0.2
            }
        },
        {
            'id': 'gl-draw-polygon-fill-active',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'true'],
                ['==', '$type', 'Polygon']
            ],
            'paint': {
                'fill-color': '#000000',
                'fill-outline-color': '#000000',
                'fill-opacity': 0.2
            }
        },
        {
            'id': 'gl-draw-polygon-midpoint',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'],
                ['==', 'meta', 'midpoint']
            ],
            'paint': {
                'circle-radius': 3,
                'circle-color': '#000000'
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-inactive',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#000000',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-active',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'true'],
                ['==', '$type', 'Polygon']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#000000',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-inactive',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'static']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#000000',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-active',
            'type': 'line',
            'filter': ['all', ['==', '$type', 'LineString'],
                ['==', 'active', 'true']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#000000',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
            'type': 'circle',
            'filter': ['all', ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-inactive',
            'type': 'circle',
            'filter': ['all', ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 3,
                'circle-color': '#000000'
            }
        },
        {
            'id': 'gl-draw-point-point-stroke-inactive',
            'type': 'circle',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-opacity': 1,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-point-inactive',
            'type': 'circle',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 3,
                'circle-color': '#000000'
            }
        },
        {
            'id': 'gl-draw-point-stroke-active',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'],
                ['==', 'active', 'true'],
                ['!=', 'meta', 'midpoint']
            ],
            'paint': {
                'circle-radius': 7,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-point-active',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'],
                ['!=', 'meta', 'midpoint'],
                ['==', 'active', 'true']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': '#000000'
            }
        },
        {
            'id': 'gl-draw-polygon-fill-static',
            'type': 'fill',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'Polygon']
            ],
            'paint': {
                'fill-color': '#404040',
                'fill-outline-color': '#404040',
                'fill-opacity': 0.1
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-static',
            'type': 'line',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'Polygon']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#404040',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-static',
            'type': 'line',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'LineString']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#404040',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-point-static',
            'type': 'circle',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'Point']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': '#404040'
            }
        }

    ]
})

if (typeof window.ontouchstart === 'undefined') {
    map.addControl(draw);
}


const layerList = document.getElementById('menu-layers');
const inputs = layerList.querySelectorAll('img');

for (const input of inputs) {

    input.onclick = (layer) => {
        currentLayerId = layer.target.id;
        console.log(map);
        map.setStyle('mapbox://styles/jgsantos/' + currentLayerId);
        console.log('Image clicked:', layer.target.id); // Log the ID of the clicked image
        console.log('mapbox://styles/jgsantos/' + currentLayerId);
        createMarkers(results, currentLayerId);
        updateMarkerStyles(currentLayerId);

        for (const input of inputs) {
            if (input.id === currentLayerId) {
                input.classList.add('selected');
            } else {
                input.classList.remove('selected');
            }
        }
    };
}


const form = document.getElementById('selection');
console.log('Form element:', form);

let markers = [];

function createMarkers(results, currentLayerId) {
    markers.forEach(marker => marker.remove());
    markers = [];

    results.forEach(result => {
        const markerElement = document.createElement('img');
        markerElement.src = `./data/icon-location-${currentLayerId}.png`;
        markerElement.style.height = '20px';

        const marker = new mapboxgl.Marker({ element: markerElement })
            .setLngLat([result.location.coordinates[0], result.location.coordinates[1]])
            .addTo(map);


        marker.objectId = result._id;
        marker.selected = false;

        markerElement.addEventListener('mouseenter', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        markerElement.addEventListener('mouseleave', () => {
            map.getCanvas().style.cursor = '';
        });

        markerElement.addEventListener('click', () => {
            showObject(marker.objectId);
            mapOpen=true;
            filtersOpen=false;
            galleryOpen=true;
            updateWidths();
            updateVisibility();
        });

        markers.push(marker);
    });
}



const ampliar = document.getElementById('ampliar');
const ampliarImg = document.getElementById('switch-button');
const ampliarImg2 = document.getElementById('switch-button-1');
ampliarImg2.style.display = 'none'; 
const switchButton = document.getElementById('ampliar');
switchButton.addEventListener('click', () => {
    console.log(switchButton.src)
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach(container => {
        container.classList.toggle('two-images-per-row');
    });


    if (ampliarImg2.style.display === 'none') {
        ampliarImg2.style.display = 'block';
        ampliarImg.style.display = 'none';
    } else {
        ampliarImg2.style.display = 'none'; 
        ampliarImg.style.display = 'block'; 
    }
    
});


function createGalleryImages(results) {
    const gallery = document.querySelector('#results');
    gallery.innerHTML = '';
    if (results.length === 0) {
        const textDiv = document.createElement('div');
        textDiv.innerHTML = '<p>Não foram encontrados resultados para os filtros utilizados.</p>';
        gallery.appendChild(textDiv);

    }
    results.forEach(result => {
        const container = document.createElement('div');
        container.classList.add('image-container');

        const image = document.createElement('img');
        image.src = result.imageUrl;
        image.classList.add('gallery-image');

        image.dataset.objectId = result._id;

        image.addEventListener('click', () => {
            showObject(image.dataset.objectId, results);
        });

        container.appendChild(image);

        gallery.appendChild(container);

    });
}

let results = [];
let shouldUpdateDateSlider = true;

let firstLoad = true;
async function updateResults() {
    // Show the loader
    document.querySelector('#loader').style.display = 'block';

    // Get the values of the form inputs
    const dateSlider = document.getElementById('date-slider');
    const tecnica = Array.from(form.querySelectorAll('input[name=tecnica]:checked')).map(checkbox => checkbox.value);
    const autor = Array.from(form.querySelectorAll('input[name=autor]:checked')).map(checkbox => checkbox.value);
    const suporte = Array.from(form.querySelectorAll('input[name=suporte]:checked')).map(checkbox => checkbox.value);
    const categoria = Array.from(form.querySelectorAll('input[name=categoria]:checked')).map(checkbox => checkbox.value);
    const geografia = Array.from(form.querySelectorAll('input[name=geografia]:checked')).map(checkbox => checkbox.value);
    const estado = Array.from(form.querySelectorAll('input[name=estado]:checked')).map(checkbox => checkbox.value);
    const estilo = Array.from(form.querySelectorAll('input[name=estilo]:checked')).map(checkbox => checkbox.value);
    const material = Array.from(form.querySelectorAll('input[name=material]:checked')).map(checkbox => checkbox.value);
    const searchValue = searchInput.value;
    const dateValues = dateSlider.noUiSlider.get();
    const minYear = parseInt(dateValues[0]);
    const maxYear = parseInt(dateValues[1]);

    // Create the data object to send to the server
    const data = {
        tecnica,
        autor,
        suporte,
        categoria,
        searchValue,
        geografia,
        estado,
        material,
        estilo,
        coordinates: polygonCoordinates,
        minYear,
        maxYear
    };
    console.log('Data being sent to server:', data);

    // Disable the checkboxes
    form.querySelectorAll('input[type=checkbox]').forEach(checkbox => checkbox.disabled = true);

    try {
        // Send the data to the server
        const response = await fetch('/submit2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }

        // Get the results from the server
        results = await response.json();
    } catch (error) {
        console.error(error);
    } finally {
        // Enable the checkboxes
        form.querySelectorAll('input[type=checkbox]').forEach(checkbox => checkbox.disabled = false);

        // Hide the loader
        document.querySelector('#loader').style.display = 'none';

        // Update the date slider if this is the first load
        if (firstLoad === true) {
            updateDateSlider(results);
            firstLoad = false;
        }
        
        // Update the display of the applied filters
        updateAppliedFilters();
    }

    console.log('Results from server:', results);

    // Update the map and gallery
    createMarkers(results, currentLayerId);
    updateMarkerStyles(currentLayerId);
    createGalleryImages(results);
}

function updateAppliedFilters() {
    const filters = ['tecnica', 'autor', 'suporte', 'categoria', 'geografia', 'estado', 'estilo', 'material'];
    
    // Get the selected filters
    const selectedFilters = filters
        .map(filter => {
            const values = Array.from(form.querySelectorAll(`input[name=${filter}]:checked`)).map(checkbox => checkbox.value);
            return values.length > 0 ? `${values.join(', ')}` : '';
        })
        .filter(filter => filter.length > 0)
        .join(' | ');
    
    // Update the display of the applied filters
    const appliedFiltersDiv = document.querySelector('#applied-filters');
    appliedFiltersDiv.innerHTML = '';
    
    if (selectedFilters.length > 0) {
        const pElement = document.createElement('p');
        pElement.innerHTML = `<span style="font-family: sulsanstest-bold-webfont;">Filtros aplicados:</span> ${selectedFilters}`;
        appliedFiltersDiv.appendChild(pElement);
    }
}







async function showObject(objectId) {
    const currentIndex = results.findIndex(result => result._id === objectId);
    const previousObject = currentIndex > 0 ? results[currentIndex - 1] : null;
    const nextObject = currentIndex < results.length - 1 ? results[currentIndex + 1] : null;

    const object = results.find(result => result._id === objectId);
    if (!object) {
        console.error(`Could not find object with ID ${objectId}`);
        return;
    }

    map.flyTo({
        center: [object.location.coordinates[0], object.location.coordinates[1]],
        zoom: 14,
        speed: 1.5,
        curve: 1,
        easing(t) {
            return t;
        }
    });



    const marker = markers.find(marker => marker.objectId === objectId);

    const gallery = document.querySelector('#results');

    gallery.innerHTML = `
    <div class="object">

    <div id="tool-bar">
        <div class="align-left"><a id="back" href="javascript:history.back()">Voltar</a></div>
        <div class="align-right">
            <a href="#" id="delete-link" data-object-id="${objectId}">Apagar Registo</a>
            <a href="/suggestion-form.html?objectId=${objectId}">Reportar Alterações</a>
        </div>
    </div>
    <div class="object-image-container">
        <img src="${object.imageUrl}">
    </div>
    <div id="slider-container"><div id="slider"></div></div>
    <!-- /* <p>Evolução Temporal</p> -->
    <h2>${object.titulo}</h2>
    <div id="object-info">

        <div class="info-section-1">
            <div class="info">
                <p class="info-title">CATEGORIA</p>
                <p class="info-content">${object.categoria}</p>
            </div>
            <div class="info">
                <p class="info-title">TECNICA</p>
                <p class="info-content">${object.tecnica}</p>
            </div>
            <div class="info">
                <p class="info-title">GEOGRAFIA</p>
                <p class="info-content">${object.geografia}</p>
            </div>
            <div class="info">
                <p class="info-title">AUTOR DO REGISTO</p>
                <p class="info-content">${object.autorRegisto}</p>
            </div>
        </div>
        <div class="info-section-2">
            <div class="info">
                <p class="info-title">SUPORTE</p>
                <p class="info-content">${object.suporte}</p>
            </div>
            <div class="info">
                <p class="info-title">ESTILO</p>
                <p class="info-content">${object.estilo}</p>
            </div>
            <div class="info">
                <p class="info-title">DATA</p>
                <p class="info-content">${object.data}</p>
            </div>
            <div class="info">
                <p class="info-title">DATA DO REGISTO</p>
                <p class="info-content">${object.dataRegisto}</p>
            </div>
        </div>
        <div class="info-section-3">
            <div class="info">
                <p class="info-title">MATERIAL</p>
                <p class="info-content">${object.material}</p>
            </div>
            <div class="info">
                <p class="info-title">AUTOR</p>
                <p class="info-content">${object.autor}</p>
            </div>
            <div class="info">
                <p class="info-title">ESTADO</p>
                <p class="info-content">${object.estado}</p>
            </div>
        </div>
    </div>
    <div id="navigation">
        <div id="previous-container"></div>
        <div id="next-container"></div>
    </div>
</div>
    `;
    const date = new Date(object.data);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

    const infoTitles = Array.from(document.querySelectorAll('.info-title'));
    const dataTitle = infoTitles.find(title => title.textContent.includes('DATA'));
    const dateElement = dataTitle.nextElementSibling;
    dateElement.textContent = formattedDate;

    const backButton = document.querySelector('#back');
    backButton.addEventListener('click', (event) => {
        event.preventDefault();
        showGallery();
    });

    if (previousObject) {
        const previousImage = document.createElement('img');
        previousImage.src = previousObject.imageUrl;
        previousImage.className = 'previous-image';
        previousImage.addEventListener('click', () => {
            showObject(previousObject._id);
        });
        document.querySelector("#previous-container").appendChild(previousImage);
    }
    if (nextObject) {
        const nextImage = document.createElement('img');
        nextImage.src = nextObject.imageUrl;
        nextImage.className = 'next-image';
        nextImage.addEventListener('click', () => {
            showObject(nextObject._id);
        });
        document.querySelector("#next-container").appendChild(nextImage);
    }

    markers.forEach(marker => {
        marker.selected = false;
    });

    if (marker) {
        marker.selected = true;
    }


    updateMarkerStyles(currentLayerId);
    createSlider(results);
    const slider = document.getElementById('slider');
    slider.noUiSlider.set(currentIndex);


    const deleteLink = document.querySelector('#delete-link');
    deleteLink.addEventListener('click', async (event) => {
        event.preventDefault();
        if (confirm('Are you sure you want to delete this object?')) {
            const objectId = event.currentTarget.dataset.objectId;
            const response = await fetch(`/object/${objectId}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Object deleted successfully');
                debounceUpdateResults();
            } else {
                alert('An error occurred while deleting the object');
            }
        }
    });
}
let hasDateSliderMoved = false;

function createSlider(results) {
    console.log('createSlider called with results:', results); // Log the results passed to the function
    const slider = document.getElementById('slider');
    const yearElement = document.getElementById('year');

    if (!slider.noUiSlider) {
        noUiSlider.create(slider, {
            start: 0,
            step: 1,
            range: {
                'min': 0,
                'max': results.length - 1
            },
            pips: {
                mode: 'steps',
                density: 100
            }
        });

        slider.noUiSlider.on('slide', (values, handle) => {
            const index = parseInt(values[handle]);
            const result = results[index];

            showObject(result._id);
            hasDateSliderMoved = true;
        });
    }
}





const dateSlider = document.getElementById('date-slider');
const dateElement = document.getElementById('date');

function createDateSlider(defaultMinYear, defaultMaxYear) {
    // Create the noUiSlider with the default range
    if (!dateSlider.noUiSlider) {
        noUiSlider.create(dateSlider, {
            start: [defaultMinYear, defaultMaxYear],
            connect: true,
            range: {
                'min': defaultMinYear,
                'max': defaultMaxYear
            }
        });

        // Update the displayed date when the slider is moved
        dateSlider.noUiSlider.on('update', (values, handle) => {
            const [minValue, maxValue] = values;
            const minYear = parseInt(minValue);
            const maxYear = parseInt(maxValue);
            dateElement.textContent = `${minYear} - ${maxYear}`;
        });
    }
}

createDateSlider(0, 2023);

dateSlider.noUiSlider.on('change', updateResults);




function updateDateSlider(results) {
    const dateSlider = document.getElementById('date-slider');

    // Check if there are any results
    if (results.length === 0) {
        return;
    }
    let minYear = Infinity;
    let maxYear = -Infinity;
    for (const result of results) {
        const year = new Date(result.data).getFullYear();
        if (year < minYear) {
            minYear = year;
        }
        if (year > maxYear) {
            maxYear = year;
        }
    }

    if (dateSlider.noUiSlider) {
        // Update the range of the date slider
        dateSlider.noUiSlider.updateOptions({
            range: {
                'min': minYear,
                'max': maxYear
            }
        });
    }
}


let debounceTimer;
function debounceUpdateResults() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateResults, 300);
}
let currentLayerId = inputs[0].id;
function updateMarkerStyles(currentLayerId) {
    markers.forEach(marker => {
        const markerElement = marker.getElement();
        const newSrc = marker.selected ? `./data/icon-selected-${currentLayerId}.png` : `./data/icon-location-${currentLayerId}.png`;
        if (markerElement.src !== newSrc) {
            markerElement.src = newSrc;
        }
    });
}

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const label = document.querySelector(`label[for="${this.id}"]`);
        if (this.checked) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    });
});

function showGallery() {
    const gallery = document.querySelector('#results');
    gallery.innerHTML = '<h1>Galeria</h1>';
    createGalleryImages(results);
}

form.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
    checkbox.addEventListener('change', debounceUpdateResults);
});


const mapSection = document.querySelector('#map-container');
const gallerySection = document.querySelector('#galeria');
const filtersSection = document.querySelector('#filtros');
const mapHeader = mapSection.querySelector('.tab-title');
const galleryHeader = gallerySection.querySelector('.tab-title');
const filtersHeader = filtersSection.querySelector('.tab-title');


let mapOpen = true;
let galleryOpen = false;
let filtersOpen = false;

function updateWidths() {
    if (window.innerWidth <= 480) {
        // Mobile layout


        mapSection.style.height = 'calc(100% - 40px)';
        gallerySection.style.height = '20px';
        filtersSection.style.height = '20px';
        if (mapOpen && galleryOpen && filtersOpen) {
            mapSection.style.height = 'calc(33.33% - 20px)';
            gallerySection.style.height = 'calc(33.33% - 20px)';
            filtersSection.style.height = 'calc(33.33% - 20px)';
            filtersSection.style.overflowY = 'scroll';
        } else if (mapOpen && galleryOpen) {
            mapSection.style.height = 'calc(50% - 20px)';
            gallerySection.style.height = 'calc(50% - 20px)';
            filtersSection.style.height = '20px';
            filtersSection.style.overflowY = 'scroll';
        } else if (mapOpen && filtersOpen) {
            filtersSection.style.overflowY = 'scroll';
            mapSection.style.height = 'calc(50% - 20px)';
            gallerySection.style.height = '20px';
            filtersSection.style.height = 'calc(50% - 20px)';
        } else if (galleryOpen && filtersOpen) {
            filtersSection.style.overflowY = 'scroll';
            mapSection.style.height = '20px';
            gallerySection.style.height = 'calc(50% - 20px)';
            filtersSection.style.height = 'calc(50% - 20px)';
        } else if (mapOpen) {
            mapSection.style.height = 'calc(100% - 40px)';
            gallerySection.style.height = '20px';
            filtersSection.style.height = '20px';
        } else if (galleryOpen) {
            mapSection.style.height = '20px';
            gallerySection.style.height = 'calc(100% - 40px)';
            filtersSection.style.height = '20px';
        } else if (filtersOpen) {
            filtersSection.style.overflowY = 'scroll';
            mapSection.style.height = '20px';
            gallerySection.style.height = '20px';
            filtersSection.style.height = 'calc(100% - 40px)';
        }
    } else {
        // Desktop layout
        mapSection.style.width = 'calc(100% - 40px)';
        gallerySection.style.width = '20px';
        filtersSection.style.width = '20px';
        if (mapOpen && galleryOpen && filtersOpen) {
            mapSection.style.width = 'calc(33.33% - 20px)';
            gallerySection.style.width = 'calc(33.33% - 20px)';
            filtersSection.style.width = 'calc(33.33% - 20px)';
        } else if (mapOpen && galleryOpen) {
            mapSection.style.width = 'calc(50% - 20px)';
            gallerySection.style.width = 'calc(50% - 20px)';
            filtersSection.style.width = '20px';
        } else if (mapOpen && filtersOpen) {
            mapSection.style.width = 'calc(66.66% - 20px)';
            gallerySection.style.width = '20px';
            filtersSection.style.width = 'calc(33.33% - 20px)';
        } else if (galleryOpen && filtersOpen) {
            mapSection.style.width = '20px';

            gallerySection.style.width = 'calc(50% - 20px)';
            filtersSection.style.width = 'calc(50% - 20px)';
        } else if (mapOpen) {
            mapSection.style.width = 'calc(100% - 40px)';
            gallerySection.style.width = '20px';
            filtersSection.style.width = '20px';
        } else if (galleryOpen) {
            mapSection.style.width = '20px';
            gallerySection.style.width = 'calc(100% - 40px)';
            filtersSection.style.width = '20px';
        } else if (filtersOpen) {
            mapSection.style.width = '20px';
            gallerySection.style.width = '20px';
            filtersSection.style.width = 'calc(100% - 40px)';
        }
    }
    setTimeout(() => {
        map.resize();
    }, 250);
}

function updateVisibility() {
    if (mapOpen) {
        mapSection.querySelectorAll(':not(.tab-title)').forEach(el => el.classList.remove('invisible'));
    } else {
        mapSection.querySelectorAll(':not(.tab-title)').forEach(el => el.classList.add('invisible'));
    }
    if (galleryOpen) {
        gallerySection.querySelectorAll(':not(.tab-title)').forEach(el => el.classList.remove('invisible'));
    } else {
        gallerySection.querySelectorAll(':not(.tab-title)').forEach(el => el.classList.add('invisible'));
    }
    if (filtersOpen) {
        filtersSection.querySelectorAll(':not(.tab-title)').forEach(el => el.classList.remove('invisible'));
    } else {
        filtersSection.querySelectorAll(':not(.tab-title)').forEach(el => el.classList.add('invisible'));
    }
}

galleryHeader.addEventListener('click', () => {
    galleryOpen = !galleryOpen;

    updateWidths();

    updateVisibility();
});

filtersHeader.addEventListener('click', () => {

    filtersOpen = !filtersOpen;

    updateWidths();

    updateVisibility();
});


window.onload = () => {
    debounceUpdateResults();
    updateVisibility();
    updateWidths();
};
