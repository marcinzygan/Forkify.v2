import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { updateServings } from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////

//API call and Error handling
const controlRecipes = async function () {
  try {
    // find the id from url
    const id = window.location.hash.slice(1);
    if (!id) return;

    //render spinner before fetching data
    recipeView.renderSpinner();

    //Update results to mark the currently selected one
    resultsView.update(model.getSearchResultsPage());

    //Load the recepies (its an async function so we need to await the promise) (pass the id)
    await model.loadRecipe(id);

    //Get state from model.js
    const recipe = model.state.recipe;

    //RENDER THE RECIPE
    recipeView.render(recipe);

    //Update bookmarks
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    //add loading spinner
    resultsView.renderSpinner();

    // Get query from SearchView
    const query = searchView.getQuery();

    //Check if there is no query
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    //Get state from model.js
    const search = model.state.search.results;

    //Render search results
    resultsView.render(model.getSearchResultsPage());
    //Render pagination buttons

    paginationView.render(model.state.search);
    console.log(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //Render NEW search results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //Render NEW pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //Update the recipe servings in state
  model.updateServings(newServings);

  //Update the recipe view
  //Get state from model.js
  const recipe = model.state.recipe;
  //Render new servings
  recipeView.update(recipe);
  //RENDER THE RECIPE
  // recipeView.render(recipe);
};
const controlerAddBookmark = function () {
  // Add and remove bookmark
  if (model.state.recipe.bookmarked === false)
    model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);
    //Sucess Message
    addRecipeView.renderMessage();

    //Add recipe to bookmarks
    bookmarksView.render(model.state.bookmarks);

    //Change URL ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHanlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlerAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
