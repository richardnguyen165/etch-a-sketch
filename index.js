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
    // gridCreation()
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

    if (tracerResponseAnswer){
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
    }
  });
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
})};

/* 
DO NOT DO:
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
THIS WILL WIPE OUT ALL OF THE EVENT LISTENERS IN THE CODE. (INCLUDING PREVIOUS ONES)

INSTEAD DO .appendChild()

Why not? (per ChatGPT)

1. Reparsing and Replacing All Child Nodes
When you do:

element.innerHTML += newContent;

It’s basically:

Reading the current HTML string inside element

Appending your new HTML string to it

Replacing the entire inner content with the new combined string

This means all existing DOM nodes inside that element get destroyed and recreated from scratch, losing all references and event listeners attached to them.

2. Event Listeners Are Lost
Event listeners attached with addEventListener are stored in memory linked to the specific DOM nodes.

Destroy those nodes (by replacing innerHTML), and the listeners no longer exist.

This can break user interaction unexpectedly and silently.

3. Potential Performance Issues
Repeatedly rewriting large chunks of HTML:

Forces the browser to re-parse and re-render all the children of that element.

This can be costly if the element is large or contains complex structures.

Using DOM methods (appendChild, insertAdjacentHTML, etc.) lets the browser add only what’s needed without wiping everything.

4. State and Focus Can Be Lost
If users had focus inside an input or any interactive element inside that container, rewriting innerHTML will remove focus.

Any JavaScript state you kept attached to DOM elements (like custom properties or data) will be lost.

5. Unexpected Side Effects With Complex DOM
If you have other scripts or third-party code relying on the existing DOM elements, wiping and recreating them can break assumptions and cause bugs.

For example, if a plugin initialized on those elements, you’d have to re-initialize after the replace.

6. Difficult to Maintain
Using innerHTML += is a quick shortcut but makes code harder to reason about.

Explicitly creating nodes and appending them is clearer, easier to debug, and safer long term.
*/
