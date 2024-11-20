const resultsTemp = [
    {
        _id: 1,
        title: "Project 1",
        context: "Context 1",
        domain: "Domain 1",
        date: "2021-01-01",
        fields: ["Field 1", "Field 2"],
        keywords: ["Keyword 1", "Keyword 2"],
        advised_with: "Advised with 1",
        tools: ["Tool 1", "Tool 2"],
        description: "Description 1",
        media: [{
            type: 'image',
            url: "https://cdn.pixabay.com/photo/2024/05/27/07/46/bee-8790316_640.jpg",
        }],
        cover: [{
            type: 'image',
            url: "https://cdn.pixabay.com/photo/2024/05/27/07/46/bee-8790316_640.jpg",

        }]
    },
    {
        _id: 2,
        title: "Project 2",
        context: "Context 2",
        domain: "Domain 2",
        date: "2021-01-02",
        fields: ["Field 1", "Field 2"],
        keywords: ["Keyword 1", "Keyword 2"],
        advised_with: "Advised with 2",
        tools: ["Tool 1", "Tool 2"],
        description: "Description 2",
        media: [{
            type: 'video',
            url: "",
        }],
        cover: [{
            type: 'video',
            url: "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
        }]
    },
    {
        _id: 3,
        title: "Project 3",
        context: "Context 3",
        domain: "Domain 3",
        date: "2021-01-03",
        fields: ["Field 1", "Field 2"],
        keywords: ["Keyword 1", "Keyword 2"],
        advised_with: "Advised with 3",
        tools: ["Tool 1", "Tool 2"],
        description: "Description 3",
        media: [{
            type: 'image',
            url: "https://cdn.pixabay.com/photo/2024/05/27/07/46/bee-8790316_640.jpg",
        }],
        cover: [{
            type: 'image',
            url: "https://cdn.pixabay.com/photo/2024/05/27/07/46/bee-8790316_640.jpg",
        }]
    },
]

function createGalleryImages(results) {
    const projects = $('.gallery-projects');
    projects.empty();

    if (results.length === 0) {
        const message = $('<p>').text('Não foram encontrados resultados para os filtros utilizados.');
        projects.append(message);
        return;
    }

    results.forEach(({ cover, title, _id }) => {
        if (!cover || cover.length === 0) return;

        cover.forEach(({ type, url }) => {
            const container = $('<div>').addClass('gallery-project');

            if (url) {
                if (type === 'image') {
                    const image = $('<img>')
                        .addClass('gallery-image')
                        .attr('src', url)
                        .on('click', () => window.location.href = `project.html?id=${_id}`);
                    container.append(image);
                } else if (type === 'video') {
                    const video = $('<video>')
                        .addClass('gallery-video')
                        .attr({ loop: true, muted: true })
                        .on('click', () => window.location.href = `project.html?id=${_id}`)
                        .on('mouseenter', function () { $(this).get(0).play(); })
                        .on('mouseleave', function () { $(this).get(0).pause(); });

                    const source = $('<source>').attr({ src: url, type: 'video/mp4' });
                    video.append(source);

                    container.append(video);
                }
            }

            const titleElement = $('<span class="bold">').text(title);
            container.append(titleElement);
            projects.append(container);
        });
    });
}

async function updateResults() {
    const loader = $('#loader-container');

    // If already fetching data, return
    if (loader.is(":visible")) return;

    const fields = $('input[name=fields]:checked').map(({ value }) => value).get();
    const tools = $('input[name=tools]:checked').map(({ value }) => value).get();
    const searchValue = $('#search').val();


    try {
        // Show the loader
        loader.css('display', 'flex');

        // Send a request to the server to get all results
        const response = await fetch('/submit2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields, tools, searchValue }), // Send the selected checkboxes' values as the body
        });

        console.log({ response })

        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }

        // Get the results from the server and create the gallery images
        const results = await response.json();
        createGalleryImages(results);
    } catch (error) {
        alert('Error fetching results: ' + error.message);
    } finally {
        loader.css('display', 'none');
    }
}


// Debounce function to limit the number of requests sent to the server
function debouncedUpdateResults() {
    let debounceTimer;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateResults, 300);
}


// On page load, fetch the results
$(window).on('load', function () {
    debouncedUpdateResults();
    //createGalleryImages(resultsTemp);
});

// Toggle the filters
$("#toggleFilters").on('click', function () {
    const filters = $('#filters');
    if (filters.is(":visible")) {
        filters.fadeOut("slow", "linear");
    } else {
        filters.css("display", "flex").hide().fadeIn("slow", "linear");
    }
});

// Toggle the selected class when a checkbox is checked and update the results
$('input[type="checkbox"]').on('change', function () {
    $(`label[for="${this.id}"]`).toggleClass("selected", this.checked)
    console.log(11)
    debouncedUpdateResults();
});

// Update results everytime the search input is changed
$('#search-icon').on('input', debouncedUpdateResults);
