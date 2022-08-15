"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodesList");



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */


async function getShowsByTerm(term) {
  const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  const showData = response.data[0].show;
  return [
    {
      id: showData.id,
      name: showData.name,
      summary: showData.summary,
      image: showData.image.original
    }
  ]
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}"
              alt="${show.name}" 
              class="card-img-top">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <div><button class="btn btn-outline-light btn-sm Show-getEpisodes>
               Episodes
             </button></div>
           </div>
         </div>  
       </div>
      `);
    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
 
  // $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {

  const response2 = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  const episodeData = response2.data;
  return [
    {
      id: episodeData.id,
      name: episodeData.name,
      season: episodeData.season,
      number: episodeData.number
    }
  ]

 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $episodesList.empty();

  for (let episode of episodes) {
    const $item = $(
        `<li>${episode.name} :(season ${episode.season}, number ${episode.number}) </li>
        `);
    $episodesList.append($item);  
  }
  $episodesArea.show();
}

async function getEpisodesAndDisplay(evt) {
  const showId= $(evt.target).closest(".Show").data("show-id");
  const episode = await getEpisodesOfShow(showId);
  populateEpisodes(episode);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);