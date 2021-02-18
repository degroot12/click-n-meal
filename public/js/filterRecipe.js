function handleCheckbox() {
  let veganOn
  let priceFilter
  let timeFilter
  console.log('handle check works')
  if (document.getElementById("veganFilter").checked){
    veganOn = "veganOn"
  }
  else {
    veganOn = "veganOff"    
  }

  if (document.getElementById("priceFilter").checked){
    priceFilter = "lowPrice"
  }
  else {
    priceFilter = "notLowPrice"    
  }

  if (document.getElementById("timeFilter").checked){
    timeFilter = "shortTime"
  }
  else {
    timeFilter = "noTime"    
  }

  //axios.get(`http://localhost:3000/search?isVegan=${veganOn}&maxTime=${timeFilter}&maxPrice=${priceFilter}`)
  //axios.get(`https://click-n-meal.herokuapp.com/selector?isVegan=${veganOn}&maxTime=${timeFilter}&maxPrice=${priceFilter}`)
  axios.post('https://click-n-meal.herokuapp.com/create', {isVegan: veganOn, maxPrice: priceFilter, maxTime: timeFilter})
  
};
// function setCheckboxInitialState(){
//   handleCheckbox()
//   console.log('hallo dit werkt')
//   if(veganOn === 'veganOn'){
//     document.getElementById('veganFilter').checked = true
//   }
//   else if(veganOn === 'veganOff'){
//     document.getElementById('veganFilter').checked = false
//   }
//   else if(priceFilter === 'lowPrice'){
//     document.getElementById('veganFilter').checked = true
//   }
//   else if(priceFilter === 'notlowPrice'){
//     document.getElementById('veganFilter').checked = false
//   }
//   else if(timeFilter === 'veganOff'){
//     document.getElementById('shortTime').checked = true
//   }
//   else if(timeFilter === 'veganOff'){
//     document.getElementById('noTime').checked = false
//   }
// }