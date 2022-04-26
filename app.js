const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`

const fetchData = async url => {
    const response = await fetch(url)
    return await response.json()
}

const getMoreSongs = async url => {
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`)
    insertSongsIntoPage(data)
}

const insertNextAndPrevButtons = ({ prev, next }) => {
        prevAndNextContainer.innerHTML = `
    ${prev ? `<button class='btn' onclick='getMoreSongs("${prev}")'>Anteriores</button>` : '' }
    ${next ? `<button class='btn' onclick='getMoreSongs("${next}")'>Próxima</button>` : '' }
        `
}

const insertSongsIntoPage = ({data, prev, next}) => {
    songsContainer.innerHTML = (data.map(({artist:{name}, title}) => `
    <li class='song'>
    <span class='song-artist'><b>${name}</b> - ${title}</span>
    <button class='btn' data-artist='${name}' data-song-title='${title}'>Ver letra</button>
    </li>
    `).join(''))

        if (prev || next) {
            insertNextAndPrevButtons({prev, next})
             return
    }
    prevAndNextContainer.innerHTML= ''
}

async function fetchSongs(term) {
    const data = await fetchData(`${apiURL}/suggest/${term}`)
    insertSongsIntoPage(data)
}

const handleFormSubmit = event => {
    event.preventDefault()
    const searchTerm = searchInput.value.trim()
    searchInput.value=''
    searchInput.focus()

    if (!searchTerm) {
        songsContainer.innerHTML = `<li class='warning-message'>Por favor, digite um termo válido</li>`
        return
    }
    fetchSongs(searchTerm)
}

form.addEventListener('submit', handleFormSubmit)

function insertLyricsIntoPage({ lyrics, artist, songsTitle }) {
    songsContainer.innerHTML = `
    <li class='lyrics-container'>
        <h2>
            <strong>${songsTitle}</strong> - ${artist}
        </h2>
        <p class='lyrics'>${lyrics}</p>
    </li>`
}

const fetchLyrics = async (artist, songsTitle) =>{
    const data = await fetchData(`${apiURL}/v1/${artist}/${songsTitle}`)
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '</br>')
    insertLyricsIntoPage({lyrics, artist, songsTitle})
}

const handleSongsContainerClick =  event => {
    const clickedElement = event.target

    if(clickedElement.tagName ==='BUTTON'){
        const artist = clickedElement.getAttribute('data-artist')
        const songsTitle = clickedElement.getAttribute('data-song-title')

        prevAndNextContainer.innerHTML ='';
        fetchLyrics(artist, songsTitle)
    }
}

songsContainer.addEventListener('click', handleSongsContainerClick)