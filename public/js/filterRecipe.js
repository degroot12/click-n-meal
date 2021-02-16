function handleCheckbox() {
  let veganOn

  if (document.getElementById("veganFilter").checked){
    veganOn = "veganOn"
  }
  else {
    veganOn = "veganOff"    
  }

  axios.get(`http://localhost:3000/selector?isVegan=${veganOn}`)

};