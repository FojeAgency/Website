document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector('#search');

    function createFeaturedImages(results) {
        const gallery = document.querySelector('#featuredResults');
        if (!gallery) {
            console.error("Gallery container not found!");
            return;
        }
        gallery.innerHTML = ''; 
        let totalWidth = 0; 
        let minWidth = Infinity; 

        if (results.length === 0) {
            const textDiv = document.createElement('div');
            textDiv.innerHTML = '<p>Não foram encontrados resultados para os filtros utilizados.</p>';
            gallery.appendChild(textDiv);
            console.log("No results found for the filters."); 
            return;
        }

        results.forEach(result => {
            if (!result.featured) {
                return;
            }

            const featuredPost = document.createElement('div');
            featuredPost.classList.add('featuredPost');

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            if (!result.cover || result.cover.length === 0) {
                console.error("Media not found for result:", result);
                return; 
            }

            result.cover.forEach(mediaItem => {
                if (mediaItem.type === 'image') {
                    const image = new Image(); 
                    image.classList.add('imagem');
                    image.dataset.objectId = result._id;

                    image.onload = () => {
                        const imageWidth = image.clientWidth + getImageMargin(image);
                        totalWidth += imageWidth; 
                        console.log("Image loaded. Total width:", totalWidth);
                        gallery.style.width = totalWidth + 'px';
                        console.log("Gallery media and info created successfully. Min width:", totalWidth); 
                    };

                    image.addEventListener('click', () => {
                        showObject(image.dataset.objectId, results);
                    });

                    if (mediaItem.url) {
                        image.src = mediaItem.url;
                    } else {
                        console.error("Image URL not found for result:", result);
                        return; 
                    }

                    imageContainer.appendChild(image);
                } else if (mediaItem.type === 'video') {
                    const video = document.createElement('video');
                    video.classList.add('gallery-video');
                    video.dataset.objectId = result._id;
                    video.autoplay = true;
                    video.loop = true;
                    video.muted = true; 

                    const source = document.createElement('source');
                    source.src = mediaItem.url;
                    source.type = 'video/mp4';
                    video.appendChild(source);

                    video.addEventListener('click', () => {
                        showObject(video.dataset.objectId, results);
                    });

                    imageContainer.appendChild(video);
                }
            });

            featuredPost.appendChild(imageContainer);

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('post-info');
            infoDiv.innerHTML = `
                <h3 id="small-bold">${result.title}</h3>
                <p id="small-regular">${result.context} | ${result.date}</p>
                <p id="small-regular"></p>
            `;
            featuredPost.appendChild(infoDiv);

            gallery.appendChild(featuredPost);
        });

    }

    function getImageMargin(image) {
        const style = window.getComputedStyle(image);
        return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }






    async function updateResults() {
        try {
            // Show the loader
            document.querySelector('#loader').style.display = 'block';

            // Send a request to the server to get all results
            const response = await fetch('/submit2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({}) // Empty body to indicate no filters
            });

            if (!response.ok) {
                throw new Error(`An error occurred: ${response.statusText}`);
            }

            // Get the results from the server
            results = await response.json();

            // Update the gallery with all results
            createFeaturedImages(results);
        } catch (error) {
            console.error('Error fetching results:', error);
            alert('An error occurred while fetching results');
        } finally {
            // Hide the loader
            document.querySelector('#loader').style.display = 'none';
            document.querySelector('#loader-container').style.display = 'none';
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

        const gallery = document.querySelector('#results') || document.querySelector('#featuredResults');
        gallery.innerHTML = `
            <div class="object">
                <div class="object-image-container">
                    ${object.cover[0].type === 'image' ? 
                        `<img src="${object.cover[0].url}" alt="Cover Image" style="max-width: 100%; height: auto;">` :
                        `<video controls style="max-width: 100%; height: auto;"><source src="${object.cover[0].url}" type="video/mp4">Your browser does not support the video tag.</video>`
                    }
                </div>
                <h2 id="bold">${object.title}</h2>
                <p id="regular">${object.description}</p>
                <div class="info-section">
                    <div class="info">
                        <p id="bold">${object.domain + ' | ' + object.date}</p>
                    </div>
                    <div class="info">
                        <p id="regular">${Array.isArray(object.fields) ? object.fields.join(' | ') : 'N/A'}</p>
                    </div>
                    <div class="info">
                        <p id="regular">${Array.isArray(object.keywords) ? object.keywords.join(' | ') : 'N/A'}</p>
                    </div>
                    <div class="info">
                        <p id="small-caps">${object.context}</p>
                    </div>
                    <div class="info">
                        <p id="regular">${object.advised_with}</p>
                    </div>
                    <div class="info">
                        <p id="regular">${Array.isArray(object.tools) ? object.tools.join(', ') : 'N/A'}</p>
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
    }

    function createSlider(results) {
        const slider = document.getElementById('slider');

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
            });
        }
    }

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
        createFeaturedImages(results); // Assuming `results` is the data source
    }

    window.onload = () => {
        debounceUpdateResults();
    };
});
