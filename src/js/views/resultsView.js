import View from "./View.js"; // importing the parent class.
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg"; // url:... for parcel v2.

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found for your query! Please try again.";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
