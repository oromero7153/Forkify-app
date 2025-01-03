import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //1. Loading recipe
    await model.loadRecipe(id); // this is an await because it is an async function in the model.js file.

    //2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
};
controlRecipes();

["hashchange", "load"].forEach((ev) =>
  window.addEventListener(ev, controlRecipes)
); // we put the events into an array and ran the forEach method on it to add the event listeners to the window object.

// window.addEventListener("hashchange", controlRecipes);
// window.addEventListener("load", controlRecipes);
