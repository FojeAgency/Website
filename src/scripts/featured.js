function getImageMargin(image) {
    const style = window.getComputedStyle(image);
    return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
}

document.addEventListener("DOMContentLoaded", function () {
    function createFeaturedImages(results) {
        const gallery = document.querySelector('#featuredResults');
        if (!gallery) {
            console.error("Gallery container not found!");
            return;
        }
        gallery.innerHTML = '';
        let totalWidth = 0;

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

                    image.addEventListener('click', () => window.location.href = `project.html?id=${result._id}`);

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

                    video.addEventListener('click', () => window.location.href = `project.html?id=${result._id}`);

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

    async function updateResults() {
        const isLoading = document.querySelector('#loader-container').style.display === 'flex';
        if (isLoading) return;
        try {
            document.querySelector('#loader-container').style.display = 'flex';

            const response = await fetch('/submit2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (!response.ok) throw new Error(`An error occurred: ${response.statusText}`);

            const results = await response.json();
            createFeaturedImages(results);
        } catch (error) {
            alert('Error fetching results:', error.message);
        } finally {
            document.querySelector('#loader-container').style.display = 'none';
        }
    }

    let debounceTimer;
    function debounceUpdateResults() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateResults, 300);
    }

    window.onload = () => {
        debounceUpdateResults();
    };
});
