import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(10)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}( ${res.status})`);
    return data;
  } catch (err) {
    throw err; // this will be caught by the catch block in the loadRecipe function in the model.js file.
  }
};

//the helpers.js file is a file that contains helper functions that are used in multiple files. This is a good practice to keep the code DRY.
