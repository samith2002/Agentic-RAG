// main.js
let isWebSearchActivated = false;

document.getElementById("webSearchButton").addEventListener("click", () => {
    isWebSearchActivated = !isWebSearchActivated;
    const webSearchButton = document.getElementById("webSearchButton");
    const searchStatus = document.getElementById("searchStatus");

    if (isWebSearchActivated) {
        webSearchButton.innerHTML = '<i class="fa-solid fa-globe"></i> Web Search Activated 🟢';
        searchStatus.textContent = 'Web Search On';
        searchStatus.classList.remove("text-muted");
        searchStatus.classList.add("text-success");
    } else {
        webSearchButton.innerHTML = '<i class="fa-solid fa-globe"></i> Web Search';
        searchStatus.textContent = 'Web Search Off 🔴';
        searchStatus.classList.remove("text-success");
        searchStatus.classList.add("text-muted");
    }
});

document.getElementById("queryButton").addEventListener("click", async () => {
    const queryInput = document.getElementById("queryInput").value;
    const responseText = document.getElementById("responseText");

    responseText.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch("/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: queryInput, isWebSearchActivated })
        });

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            responseText.innerHTML = data.results.map(result => `
                <div class="search-result mb-4">
                    ${result.link ? `
                        <h4><a href="${result.link}" target="_blank" class="text-primary">${result.title}</a></h4>
                        ${result.link ? `<small class="text-muted">${result.link}</small>` : ''}
                    ` : `
                        <h4>${result.title}</h4>
                    `}
                    <p class="mt-2">${result.snippet}</p>
                </div>
            `).join('');
        } else {
            responseText.innerHTML = "<p>No results found.</p>";
        }
    } catch (error) {
        responseText.innerHTML = "<p class='text-danger'>An error occurred. Please try again.</p>";
    }
});
