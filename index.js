let dimension;
let tracerResponseAnswer;
let gridGenerated;
let blockColor = '#000000';
let randomClicked = false;

const inputReference = document.querySelector('.dimension-input');
const errorRefrence = document.querySelector('.info-area');
const enterButton = document.querySelector('.enter-button');
const colorButton = document.querySelector('.choose-a-color');
const resetButton = document.querySelector('.reset-color');
const resetGridButton = document.querySelector('.reset-grid');
const randomButton =  document.querySelector('.random-color');

enterButton.addEventListener('click', dimensionInput);
colorButton.addEventListener('click', colorModal);
resetButton.addEventListener('click', revertBack);
resetGridButton.addEventListener('click', resetGrid);
randomButton.addEventListener('click', randomColors);

function randomColors(){
  let allRows = document.querySelectorAll('.etch-a-sketch-block');
  if (allRows.length === 0){
    alert('No grid available. Please create grid.');
    return;
  }
  if (!(randomClicked)){
    allRows.forEach(item => {
      item.addEventListener('mouseover', () => {
        let randomNumber = Math.floor(Math.random() * 16777215);
        item.style['background-color'] = `#${randomNumber.toString(16).padStart(6, '0')}`;
      });
    })
  }
  else{
    allRows.forEach(item => {
      item.addEventListener('mouseover', () => {
        item.style['background-color'] = blockColor;
      });
    });
  }
  randomButton.classList.toggle('random-color-active');
  randomClicked = !(randomClicked);
}

function resetGrid(){
  let allRows = document.querySelectorAll('.etch-a-sketch-block');
  if (allRows.length > 0){
    allRows.forEach(item => {
      item.style['background-color'] = `#ffffff`;
    }
  )
  }
  else{
    alert('No grid available. Pleasae create grid.');
  }
}

function revertBack(){
  if (randomClicked){
    randomButton.classList.toggle('random-color-active');
    randomClicked = !(randomClicked);
  }
  blockColor = '#000000';
  let allRows = document.querySelectorAll('.etch-a-sketch-block');
  if (allRows.length > 0){
    allRows.forEach(item => {
    item.addEventListener('mouseover', () => {
      item.style['background-color'] = blockColor;
      });
    })
  }
  else{
    alert('No grid available. Pleasae create grid.');
  }
}

function errorMessage(message){
  const paraErrorReference = document.createElement('p');
  paraErrorReference.innerText = message;
  paraErrorReference.style.color = 'red';
  errorRefrence.appendChild(paraErrorReference);
  setTimeout(() => {
    paraErrorReference.remove()
  }, 1000);
}

function dimensionInput(){
  let dimensionTentative = Number(inputReference.value);
  inputReference.value = '';
  if (!(dimensionTentative) || dimensionTentative === 0){
    errorMessage('Invalid number: Please enter a valid number.');
  }
  // prevents floats
  else if (dimensionTentative % 1 !== 0){
    errorMessage('Invalid number: Please enter a valid integer (not a decimal).');
  }
  else if (dimensionTentative > 100){
    errorMessage('Upper limit reached. Please enter a lower number.')
  }
  else{
    dimension = dimensionTentative;
    tracerResponse();
  }
}

function gridCreation(){
  // For the creation fo the columsnrows

  let rowsHTML =
  `
  `;
  for (let i = 0; i < dimension; i++){
    let columnHTML = ``;
      for (let j = 0; j < dimension; j++){
        columnHTML += 
        `
        <div class = "etch-a-sketch-block-outer">
          <div class = "etch-a-sketch-block">
          </div>
        </div>
        `
      }
    rowsHTML += 
    `
    <div class = "etch-a-sketch-inner-container">
      ${columnHTML}
    </div>
    `;
  }
  // adding to html
  const outerContainerReference = document.querySelector('.etch-a-sketch-outer-container');
  outerContainerReference.innerHTML = rowsHTML;
  outerContainerReference.style['width'] = `900px`

  const outerGridReference = document.querySelectorAll('.etch-a-sketch-inner-container');
  outerGridReference.forEach(item => {
    item.style['grid-template-columns'] = `repeat(${dimension}, 1fr)`;
    item.style['grid-gap'] = '0px';
  })

  const outerBlockBorderReference = document.querySelectorAll('.etch-a-sketch-block-outer');
  outerBlockBorderReference.forEach(item => {
    // use some overflow but eventually used chatgpt -> the outer continaer is not effected by the opacity of the inner container
    item.style['border'] = '1px solid lightgrey';
  });

  const blockReference = document.querySelectorAll('.etch-a-sketch-block');
  blockReference.forEach(item => {
    // so that the outercontainer actually contains the the rows (before, due to the border, it would overflow)
    item.style['box-sizing'] = 'border-box';
    item.style['width'] = `${900 / dimension}px`;
    item.style['height'] = `${900 / dimension}px`;;
    item.style['margin'] = '0px';
    item.style['opacity'] = '0';
    const compStyle = window.getComputedStyle(item);

    let timer;

    item.addEventListener('mouseover', () => {
      item.style['background-color'] = blockColor;
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle -> how to get a CSS value
      console.log(compStyle.getPropertyValue('opacity'));
      // you need to parse opacity to a number
      item.style['opacity'] = `${Number(compStyle.getPropertyValue('opacity')) + 0.1}`;
    });

    if (tracerResponseAnswer){
      item.addEventListener('mouseout', () => {
        // If we go back onto it, it will refresh the timer.
        if (timer){
          clearTimeout(timer);
        }
        // waits 2 seconds before fading away
        timer = setTimeout(() => {
          item.style['background-color'] = 'white';
          item.addEventListener('mouseover', () => {
            item.style['background-color'] = blockColor;
            item.style['opacity'] = `0`;
          });
        }, 2000);
      });
    }
  });

  gridGenerated = true;
}

function tracerResponse(){
  // Used chatGPT (i had a similar answer -> but once again, see comment below which took me 2-5 hours to fix)
  const modal = document.createElement('div');
  modal.className = 'modal-background';
  modal.innerHTML = `
  <div class = "modal-content">
    <p class = "modal-content-header">Disappearance Option</p>
    <p>After some set amount of time, would you like your path to disappear?</p>
    <div>
      <button class = "modal-yes">Yes</button>
      <button class = "modal-no">No</button>
      <button class = "modal-cancel">Cancel</button>
    </div>
  </div>
  `;
  document.body.appendChild(modal);

  const modalBackgroundRef = document.querySelector('.modal-background');

  const modalYesRef = document.querySelector('.modal-yes');
  modalYesRef.addEventListener('click', () => {
    modalBackgroundRef.remove();
    tracerResponseAnswer = true;
    gridCreation();
  });

  const modalNoRef = document.querySelector('.modal-no');
  modalNoRef.addEventListener('click', () => {
    modalBackgroundRef.remove();
    tracerResponseAnswer = false;
    gridCreation();
  });

    const modalCancelRef = document.querySelector('.modal-cancel');
    modalCancelRef.addEventListener('click', () => {
    modalBackgroundRef.remove()
  })
}

function colorModal(){
  if (gridGenerated){
    let backgroundColor;
     // https://www.freecodecamp.org/news/create-color-picker-using-html-css-and-javascript/
    const colorModal = document.createElement('div');
    colorModal.className = 'modal-background';
    colorModal.innerHTML = 
    `
    <div class = "modal-content">
      <p class = "modal-content-header">Color Options</p>
      <div class = "modal-color-options">
        <div>
          <ul>
            <li>
              All hex values must be six characters long
            </li>
            <li>
              Inputting the buttons on the right does not cause the save to be automatic.
              <br> Only pressing done does.
            </li>
            <li>
              Once you have chosen a color, click the button on the right (whichever one maps to what you are editing).
              <br>
              Press Done.
            </li>
            <li>
              To discard changes, press the Cancel button.
            </li>
          </ul>
        </div>
        <div class = "modal-input-container">
          <input class = "slider-color-input" type = "color" value="${blockColor}">
          <button class = "modal-color-slider">Enter Slider</button>
        </div>
        <div class = "modal-input-container">
          <p>Hex Color: #<input value="${blockColor.slice(1)}" class = "color-input-hex"></p>
          <button class = "modal-color-hex">Enter Hex</button>
        </div>
        <div class = "modal-input-container">
          <p>RGB Color: rgb( <input class = "color-rgb-first-part" value = "${parseInt(blockColor.slice(1, 3), 16)}">, <input class = "color-rgb-second-part" value = "${parseInt(blockColor.slice(3, 5), 16)}">, <input class = "color-rgb-third-part" value = "${parseInt(blockColor.slice(5), 16)}"> )</p>
          <button class = "modal-color-rgb">Enter RGB</button>
        </div>
      </div>
      <p class = "modal-valid-colour-warning"></p>
      <div>
        <button class = "modal-color-done">Done</button>
        <button class = "modal-color-cancel">Cancel</button>
      </div>
    </div>
    `;

    document.body.appendChild(colorModal);
    const colorInputSelectorRef = document.querySelector('.slider-color-input');

    const hexInputRef = document.querySelector('.color-input-hex');

    const firstRGBRef = document.querySelector('.color-rgb-first-part');
    const secondRGBRef = document.querySelector('.color-rgb-second-part');
    const thirdRGBRef = document.querySelector('.color-rgb-third-part');

    const modalCancelColorRef = document.querySelector('.modal-color-cancel');
    modalCancelColorRef.addEventListener('click', () => colorModal.remove());

    const rgbInputRef = document.querySelector('.modal-color-rgb');
    rgbInputRef.addEventListener('click', () => {
      backgroundColor = RGBtoHex(firstRGBRef, secondRGBRef, thirdRGBRef, colorInputSelectorRef, hexInputRef);
    });

    const modalColorHexRef = document.querySelector('.modal-color-hex');
    modalColorHexRef.addEventListener('click', () => {
      backgroundColor = hexToRGB(hexInputRef, colorInputSelectorRef, firstRGBRef, secondRGBRef, thirdRGBRef);
    });

    const modalColorSliderRef = document.querySelector('.modal-color-slider');
    modalColorSliderRef.addEventListener('click', () => {
      backgroundColor = sliderInput(colorInputSelectorRef.value, hexInputRef, firstRGBRef, secondRGBRef, thirdRGBRef);
    });

    const doneRef = document.querySelector('.modal-color-done');
    doneRef.addEventListener('click', () => {
      if (backgroundColor){
        changeHoverColor(backgroundColor);
      }
      else{
        alert('Color not selected: Please select a color.');
      }
    });

  }
  else{
    alert('Grid has not been generated.');
  }
}

function RGBtoHex(firstRGBRef, secondRGBRef, thirdRGBRef, colorInputSelectorRef, hexInputRef){
  let firstNumber = Number(firstRGBRef.value);
  let secondNumber = Number(secondRGBRef.value);
  let thirdNumber = Number(thirdRGBRef.value);
  console.log(firstNumber, secondNumber, thirdNumber);
  if ((firstNumber === NaN || secondNumber === NaN) || thirdNumber === NaN){
    alert('Invalid RGB: One of your numbers is non-numeric.');
    return;
  }
  if (((firstNumber < 0 || firstNumber > 255) || (secondNumber < 0 || secondNumber > 255)) || (thirdNumber < 0 || thirdNumber > 255)){
    alert('Invalid RGB: One of your numbers is out of range. Must be between 0-255.');
    return;
  }
  let firstNumberHex = firstNumber.toString(16).padStart(2, '0');
  let secondNumberHex = secondNumber.toString(16).padStart(2, '0');
  let thirdNumberHex = thirdNumber.toString(16).padStart(2, '0');
  let hexNumber = `#${firstNumberHex}${secondNumberHex}${thirdNumberHex}`;
  colorInputSelectorRef.value = hexNumber;
  hexInputRef.value = hexNumber.slice(1);
  return hexNumber;
}

function hexToRGB(hexStringer, colorInputSelectorRef, firstRGBRef, secondRGBRef, thirdRGBRef){
  hexValue = hexStringer.value;
  if (hexValue.length !== 6){
    alert('Invalid hex: Must be 6 characters long (application only supports 6 characters long');
    return;
  }
  const numberTest = parseInt("0x" + hexValue);
  console.log(numberTest);
  if (numberTest === NaN){
    alert('Invalid hex: Please find a valid hex.');
    return;
  }
  if (numberTest < 0 || numberTest > 16777215){
    alert('Invalid hex: Please find a valid hex.');
    return;
  }
  colorInputSelectorRef.value = `#${hexValue}`;
  firstRGBRef.value = parseInt(hexValue.slice(0, 2), 16);
  secondRGBRef.value = parseInt(hexValue.slice(2, 4), 16);
  thirdRGBRef.value = parseInt(hexValue.slice(4), 16);
  return `#${hexValue}`;
}

function sliderInput(colorInputSelectorRef, hexInputRef, firstRGBRef, secondRGBRef, thirdRGBRef){
  let hexStringer = colorInputSelectorRef.slice(1);
  if (hexStringer.length !== 6){
    alert('Invalid hex: Must be 6 characters long (application only supports 6 characters long');
    return;
  }
  const numberTest = parseInt(hexStringer, 16);
  if (numberTest === NaN){
    alert('Invalid hex: Please find a valid hex.');
    return;
  }
  if (numberTest < 0 || numberTest > 16777215){
    alert('Invalid hex: Please find a valid hex.');
    return;
  }
  hexInputRef.value = colorInputSelectorRef.slice(1);
  firstRGBRef.value = parseInt(hexStringer.slice(0, 2), 16);
  secondRGBRef.value = parseInt(hexStringer.slice(2, 4), 16);
  thirdRGBRef.value = parseInt(hexStringer.slice(4), 16);
  return colorInputSelectorRef;
}

function changeHoverColor(hexColor){
  if (randomClicked){
    randomButton.classList.toggle('random-color-active');
    randomClicked = !(randomClicked);
  }
  blockColor = hexColor;
  const allBlocks = document.querySelectorAll('.etch-a-sketch-block');
  allBlocks.forEach(item => {
    item.addEventListener('mouseover', () => {
      item.style['background-color'] = blockColor;
    });
  });
  const colorModal = document.querySelector('.modal-background');
  colorModal.remove();
} 