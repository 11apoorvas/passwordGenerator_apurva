const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");

const lengthNumber= document.querySelector("[data-lengthNumber]");
const lengthSlider= document.querySelector("[ data-lengthSlider]");

const uppercase=document.querySelector("#uppercase");
const lowercase=document.querySelector("#lowercase");
const numbers=document.querySelector("#numbers");
const symbols=document.querySelector("#symbols");

const indicator=document.querySelector("[data-indicator]");

const generateBtn=document.querySelector(".generateButton");

const allCheckboxes=document.querySelectorAll("input[type=checkbox]");

let password= "";
let passwordLength = 10;
handleSlider();
let checkCount =   0;
setIndicator("#ccc");

let symbol='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//slider
function handleSlider(){
    lengthSlider.value = passwordLength;
    lengthNumber.innerHTML = passwordLength;

    const min = lengthSlider.min;
    const max = lengthSlider.max;
    lengthSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}

//copy button
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML= "copied";
    }
    catch(e){
        copyMsg.innerHTML="failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 3000);
}

//checkcount calculation
function handleCheckBoxChange() {
   checkCount = 0;
    allCheckboxes.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });



    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

function setIndicator(color){
    indicator.style.background = color;
    
}

//strength calculation
function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSymbols = false;
    let hasNumbers = false;

    if(uppercase.ariaChecked)
    hasUpper = true;
    if(lowercase.ariaChecked)
    hasLower = true;
    if(symbols.ariaChecked)
    hasSymbols = true;
    if(numbers.ariaChecked)
    hasNumbers = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }

}

//eventlishtners
//copy button
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})
//slider
lengthSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})
//checkboxes
allCheckboxes.forEach((box)=>
    box.addEventListener('click', handleCheckBoxChange)
)


//shuffle array
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


//generating raandom
function getRndInteger(min,max){
    return Math.floor(Math.random()* (max-min)) + min ;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123))
}
function generateSymbol(){
    const randNum = getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

//generate password
generateBtn.addEventListener('click',()=>{

    console.log("getting password");  
    if(checkCount<=0){
        console.log("returned?");
        return;
    }
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];
    if(uppercase.checked)
        funcArr.push(generateUpperCase);
    if(lowercase.checked)
        funcArr.push(generateLowerCase);
    if(symbols.checked)
        funcArr.push(generateSymbol);
    if(numbers.checked)
        funcArr.push(generateRandomNumber);
    //compulsary addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
        console.log(password+ 'here');
    }
   

    //remaining
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randliteral = getRndInteger(0, funcArr.length);
        console.log(randliteral + 'is random ');
        password += funcArr[randliteral]();
    }
    console.log('remaining add');

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calculateStrength();
})