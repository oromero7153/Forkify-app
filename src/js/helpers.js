import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}( ${res.status})`);
    return data;
  } catch (err) {
    throw err; // this will be caught by the catch block in the loadRecipe function in the model.js file.
  }
};
/*
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}( ${res.status})`);
    return data;
  } catch (err) {
    throw err; // this will be caught by the catch block in the loadRecipe function in the model.js file.
  }
};



export const sendJSON = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}( ${res.status})`);
    return data;
  } catch (err) {
    throw err; // this will be caught by the catch block in the loadRecipe function in the model.js file.
  }
};
*/

//the helpers.js file is a file that contains helper functions that are used in multiple files. This is a good practice to keep the code DRY.
