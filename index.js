let dimension;
let tracerResponseAnswer;

const inputReference = document.querySelector('.dimension-input');
const errorRefrence = document.querySelector('.info-area');
const enterButton = document.querySelector('.enter-button');

enterButton.addEventListener('click', dimensionInput);

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
  if (!(dimensionTentative)){
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
    gridCreation();
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
        <div class = "etch-a-sketch-block">
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
  outerContainerReference.style['width'] = `700px`

  const outerGridReference = document.querySelectorAll('.etch-a-sketch-inner-container');
  outerGridReference.forEach(item => {
    item.style['grid-template-columns'] = `repeat(${dimension}, 1fr)`;
    item.style['grid-gap'] = '0px';
  })

  const blockReference = document.querySelectorAll('.etch-a-sketch-block');
  blockReference.forEach(item => {
    // so that the outercontainer actually contains the the rows (before, due to the border, it would overflow)
    item.style['box-sizing'] = 'border-box';
    item.style['width'] = `${700 / dimension}px`;
    item.style['height'] = `${700 / dimension}px`;;
    item.style['border'] = 'solid';
    item.style['border-color'] = 'lightgrey';
    item.style['border-width'] = '1px';
    item.style['margin'] = '0px';

    let timer;

    item.addEventListener('mouseover', () => {
      item.style['background-color'] = 'black';
    });

    item.addEventListener('mouseout', () => {
      // If we go back onto it, it will refresh the timer.
      if (timer){
        clearTimeout(timer);
      }
      // waits 2 seconds before fading away
      timer = setTimeout(() => {
        item.style['background-color'] = 'white';
      }, 2000);
    });
  });
}

/*
function tracerResponse(){
  response = 
  <div class = "modal-background">
    <div class = "modal-content">
      <p class = "modal-content-header">Disappearance Option</p>
      <p>After some set amount of time, would you like your path to disappear?</p>
      <div>
        <button class = "modal-yes">Yes</button>
        <button class = "modal-no">No</button>
        <button class = "modal-cancel">Cancel</button>
      </div>
    </div>
  </div>
  ;

  document.body.innerHTML += response;
  const modalBackgroundRef = document.querySelector('.modal-background');

  const modalYesRef = document.querySelector('.modal-yes');
  modalYesRef.addEventListener('click', () => {
    tracerResponseAnswer = true;
    modalBackgroundRef.remove();
    gridCreation();
  });

  const modalNoRef = document.querySelector('.modal-no');
  modalNoRef.addEventListener('click', () => {
    tracerResponseAnswer = false;
    modalBackgroundRef.remove();
    gridCreation();
  });

  const modalCancelRef = document.querySelector('.modal-cancel');
  modalCancelRef.addEventListener('click', () => {
    modalBackgroundRef.remove()
})};
*/