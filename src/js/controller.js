import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";
// if (module.hot) {
//   module.hot.accept();
// } // this is for parcel to accept hot module replacement which is a feature that allows you to update the browser without refreshing the page.

// NEW API URL https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0 update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //1. updatring bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2. Loading recipe
    await model.loadRecipe(id); // this is an await because it is an async function in the model.js file.

    //3. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load Search results
    await model.loadSearchresults(query);

    // 3. Render Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe serving (in state)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. update recipe view
  recipeView.update(model.state.recipe);

  //3. render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`); // the pushState method is used to add a new state to the history of the browser. The first argument is the state object, the second argument is the title of the page, and the third argument is the URL of the page.

    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log("💥", err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

// window.addEventListener("hashchange", controlRecipes);
// window.addEventListener("load", controlRecipes);
