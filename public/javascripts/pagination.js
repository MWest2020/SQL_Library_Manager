const queryParamsString = parseInt(window.location.search.substr(1).slice(5, 6));
const pageLinks = document.querySelectorAll('.page-links');

// Sets the active page styling on page links
for(let i = 0; i < pageLinks.length; i++) {
  if(i === queryParamsString) {
    pageLinks[i].classList.add('active');
  }
}
