import looks from "./looks.js";

const searchInput = document.getElementById("search-bar")
const contentBox = document.querySelector(".content-box")

// Need to be able to search and show the search result
//Need access to the search value || DONE
//Display search value only

const liveRegion = document.createElement("div")
liveRegion.setAttribute("aria-live", "polite")
liveRegion.style.position = "absolute"
liveRegion.style.left = "-9999px"
document.body.appendChild(liveRegion)

// Debounce causes a delay of the action and then proceed after set time
function debounce(fn, wait = 200) {
    let t
    return (...args) => {
        clearTimeout(t)
        t = setTimeout(() => fn(...args), wait)
    }
}

// Standardise the string
function normalise(s) {
    return String(s).trim().toLowerCase()
}

function matches(item, query) {
    if (!query) return true
    query = normalise(query)

    //search operation
    const combined = [
        item.season,
        item.year,
        item.collection,
        item.image,
        String(item.id)
    ].map(normalise).join(" ")
    return combined.includes(query)
}

function createFigure(item) {
    const fig = document.createElement("figure")
    fig.className = "look"

    const img = document.createElement("img")
    img.className = "stance-pic"
    img.src = item.image
    img.alt = `${item.season} ${item.collection} ${item.year}`
    img.loading = "lazy"
    //Error handling
    img.addEventListener("error", () => {
        img.src = ""
        img.alt = "Image not found"
    })

    const cap = document.createElement("figcaption")
    cap.textContent = `${item.season} ${item.year} ${item.collection}`

    fig.appendChild(img)
    fig.appendChild(cap)
    return fig
}

//Results into contentBox
function renderResults(results, query) {
    contentBox.innerHTML = ""

    if (!query) {
        liveRegion.textContent = "Search cleared."
        return
    }

    if (results.length === 0) {
        const p = document.createElement("p")
        p.className = "no-results"
        p.textContent = `Could not find ${query}`
        contentBox.appendChild(p)
        liveRegion.textContent = `Could not find ${query}`
        return
    }

    const fragment = document.createDocumentFragment()
    results.forEach(item => fragment.appendChild(createFigure(item)))
    contentBox.appendChild(fragment)

    liveRegion.textContent = `${results.length} results${results.length === 1 ? "" : "s"} for ${query} `
}

function handleSearchRaw(value) {
    const query = normalise(value)
    if (!query) {
        renderResults([], "")
        return
    }

    const matchesList = looks.filter(item => matches(item, query))
    renderResults(matchesList, value) 
}

const handleSearch = debounce(handleSearchRaw, 160)

searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value)
})

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleSearchRaw(e.target.value)
    }
})