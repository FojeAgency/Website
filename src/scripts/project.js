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

const fieldsIds = ["projectTitle", "projectContext", "projectDomainDate", "projectFields", "projectKeywords", "projectAdvisedWith", "projectTools", "projectDescription", "projectMedia", "projectCover"];

function appendMedia(object, containerId, className) {
    if (!object) return;

    const mediaType = object.cover[0].type;
    const mediaUrl = object.cover[0].url;
    const $element = $('<' + (mediaType === 'image' ? 'img' : 'video') + '>', {
        src: mediaUrl,
        class: className,
    });
    $element.on('click', () => window.location.href = `project.html?id=${object._id}`);

    $(containerId).append($element);
}

$(window).on('load', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) window.location.href = "work.html";

    const project = resultsTemp.find(({ _id }) => _id == id);

    if (!project) window.location.href = "work.html";

    fieldsIds.forEach((fieldId) => {
        const $element = $('#' + fieldId);
        if (!$element.length) return;

        const getContent = (key) => project[key] ?? null;

        switch (fieldId) {
            case "projectKeywords":
            case "projectFields":
            case "projectTools":
            case "projectDescription":
                const content = getContent(fieldId.replace("project", "").toLowerCase());
                if (!content) return $element.remove();
                $element.children().eq(1).text(Array.isArray(content) ? content.join(", ") : content);
                break;

            case "projectAdvisedWith":
                const advisedWithContent = getContent("advised_with");
                if (!advisedWithContent) return $element.remove();
                $element.children().eq(1).text(advisedWithContent);
                break;

            case "projectDomainDate":
                $element.text(`${getContent("domain") ?? "-"} | ${getContent("date") ?? "-"}`);
                break;

            case "projectMedia":
            case "projectCover":
                const mediaContent = getContent(fieldId.replace("project", "").toLowerCase());
                $element.html(mediaContent.map(({ type, url }) =>
                    type === "image" ? `<img src="${url}" alt="${project.title}">` :
                        `<video controls><source src="${url}" type="video/mp4"></video>`
                ).join(""));
                break;

            default:
                $element.text(getContent(fieldId.replace("project", "").toLowerCase()) ?? "-");
        }
    });

    const projectIndex = resultsTemp.findIndex(({ _id }) => _id == id);
    const previousObject = projectIndex > 0 ? resultsTemp[projectIndex - 1] : null;
    const nextObject = projectIndex < resultsTemp.length - 1 ? resultsTemp[projectIndex + 1] : null;

    appendMedia(previousObject, '#previous-container', 'previous-image');
    appendMedia(nextObject, '#next-container', 'next-image');
});
