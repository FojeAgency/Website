// HERE


const searchInput = document.querySelector('#search');
 searchInput.addEventListener('input', debounceUpdateResults); 

const form = document.getElementById('selection');
console.log('Form element:', form);

function createGalleryImages(results) {
    const gallery = document.querySelector('#results');
    if (!gallery) {
        console.error("Gallery container not found!");
        return;
    }

    gallery.innerHTML = ''; // Clear the gallery container

    if (results.length === 0) {
        const textDiv = document.createElement('div');
        textDiv.innerHTML = '<p>Não foram encontrados resultados para os filtros utilizados.</p>';
        gallery.appendChild(textDiv);
        console.log("No results found for the filters."); // Log that no results were found
        return;
    }

    results.forEach(result => {
        const container = document.createElement('div');
        container.classList.add('image-container');

        if (!result.cover || result.cover.length === 0) {
            console.error("Media not found for result:", result);
            return; // Skip this result if media is missing
        }

        result.cover.forEach(mediaItem => {
            if (mediaItem.type === 'image') {
                const image = document.createElement('img');
                image.classList.add('gallery-image');
                image.dataset.objectId = result._id;
                image.addEventListener('click', () => {
                    showObject(image.dataset.objectId, results);
                });

                if (mediaItem.url) {
                    image.src = mediaItem.url;
                } else {
                    console.error("Image URL not found for result:", result);
                    return; // Skip this result if imageUrl is missing
                }

                container.appendChild(image);
            } else if (mediaItem.type === 'video') {
                const video = document.createElement('video');
                video.classList.add('gallery-video');
                video.dataset.objectId = result._id;
                video.autoplay = true;
                video.loop = true;
                video.muted = true; // Mute the video to ensure autoplay works in most browsers

                const source = document.createElement('source');
                source.src = mediaItem.url;
                source.type = 'video/mp4';
                video.appendChild(source);

                // Set video dimensions to fit parent container
                video.style.maxWidth = '100%';
                video.style.height = 'auto';

                video.addEventListener('click', () => {
                    showObject(video.dataset.objectId, results);
                });

                container.appendChild(video);
            }
        });

        gallery.appendChild(container);
    });

    console.log("Gallery media created successfully."); // Log success message
}







let results = [];
let shouldUpdateDateSlider = true;

let firstLoad = true;

let isFetchingData = false;

async function updateResults() {
    // If already fetching data, return
    if (isFetchingData) return;

    isFetchingData = true; // Set fetching data flag to true

    const fields = Array.from(document.querySelectorAll('input[name=fields]:checked')).map(checkbox => checkbox.value);
    const tools = Array.from(document.querySelectorAll('input[name=tools]:checked')).map(checkbox => checkbox.value);
    const searchValue = searchInput.value;
    const data = {
        fields,
        tools,
        searchValue,
    };
    console.log('Data being sent to server:', data);

    try {
        // Show the loader
        document.querySelector('#loader').style.display = 'block';

        // Send a request to the server to get all results
        const response = await fetch('/submit2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Send the selected checkboxes' values as the body
        });

        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }

        // Get the results from the server
        results = await response.json();

        // Update the gallery with all results
        createGalleryImages(results);

    } catch (error) {
        console.error('Error fetching results:', error);
        alert('An error occurred while fetching results');
    } finally {
        // Hide the loader
        document.querySelector('#loader').style.display = 'none';
        document.querySelector('#loader-container').style.display = 'none';
        isFetchingData = false; // Reset fetching data flag
    }
}





async function showObject(objectId) {
    const currentIndex = results.findIndex(result => result._id === objectId);
    const previousObject = currentIndex > 0 ? results[currentIndex - 1] : null;
    const nextObject = currentIndex < results.length - 1 ? results[currentIndex + 1] : null;
    const currentPage = window.location.pathname;
    
    const object = results.find(result => result._id === objectId);
    if (!object) {
        console.error(`Could not find object with ID ${objectId}`);
        return;
    }
    const gallery = document.querySelector('#results') || document.querySelector('#featuredResults');

    gallery.innerHTML = `
    <div class="object">
        <div id="tool-bar">
            <div class="align-left"><a id="back" href="${currentPage}">Voltar</a></div>
        </div>
        <div class="object-image-container">
            <img src="${object.cover[0].url}">
        </div>
        <div id="slider-container"><div id="slider"></div></div>
        <h2>${object.title}</h2>
        <p>${object.description}</p>
        <div class="info-section">
            <div class="info">
                <p class="info-title">Date:</p>
                <p class="info-content">${object.date}</p>
            </div>
            <div class="info">
                <p class="info-title">Fields:</p>
                <p class="info-content">${Array.isArray(object.fields) ? object.fields.join(', ') : 'N/A'}</p>
            </div>
            <div class="info">
                <p class="info-title">Keywords:</p>
                <p class="info-content">${Array.isArray(object.keywords) ? object.keywords.join(', ') : 'N/A'}</p>
            </div>
            <div class="info">
                <p class="info-title">Context:</p>
                <p class="info-content">${object.context}</p>
            </div>
            <div class="info">
                <p class="info-title">Advised with:</p>
                <p class="info-content">${object.advised_with}</p>
            </div>
            <div class="info">
                <p class="info-title">Tools:</p>
                <p class="info-content">${Array.isArray(object.tools) ? object.tools.join(', ') : 'N/A'}</p>
            </div>
            <div class="info">
                <p class="info-title">Featured:</p>
                <p class="info-content">${object.featured ? 'Yes' : 'No'}</p>
            </div>
            
        </div>
        <div class="media-container" style="max-width: 100%; overflow: hidden;">
            ${object.media.map(mediaItem => {
                if (mediaItem.type === 'image') {
                    return `<img src="${mediaItem.url}" alt="Image" style="max-width: 100%; height: auto;">`;
                } else if (mediaItem.type === 'video') {
                    return `<video controls style="max-width: 100%; height: auto;"><source src="${mediaItem.url}" type="video/mp4">Your browser does not support the video tag.</video>`;
                }
            }).join('')}
        </div>
        <div id="navigation">
            <div id="previous-container"></div>
            <div id="next-container"></div>
        </div>
    </div>`;





    const date = new Date(object.date);
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
        previousImage.src = previousObject.media[0].url;
        previousImage.className = 'previous-image';
        previousImage.addEventListener('click', () => {
            showObject(previousObject._id);
        });
        document.querySelector("#previous-container").appendChild(previousImage);
    }
    if (nextObject) {
        const nextImage = document.createElement('img');
        nextImage.src = nextObject.media[0].url;
        nextImage.className = 'next-image';
        nextImage.addEventListener('click', () => {
            showObject(nextObject._id);
        });
        document.querySelector("#next-container").appendChild(nextImage);
    }

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

document.getElementById("toggleFilters").addEventListener("click", function() {
    var filtrosDiv = document.getElementById("filtros");
    if (filtrosDiv.style.display === "none") {
      filtrosDiv.style.display = "block";
    } else {
      filtrosDiv.style.display = "none";
    }
  });


let debounceTimer;
function debounceUpdateResults() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateResults, 300);
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
const galleryHeader = gallerySection.querySelector('.tab-title');

window.onload = () => {
    debounceUpdateResults();
};
