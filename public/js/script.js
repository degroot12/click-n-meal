document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("click-n-meal JS imported successfully!");

    let filterQuery = []

    if(document.getElementById("veganFilter").value == 'on'){
      filterQuery.push({mealType:"vegan"})  }

    console.log(filterQuery)

  },
  false
);


// module.exports = {filterQuery}
