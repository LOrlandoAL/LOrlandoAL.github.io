const lengthInput = document.getElementById("lengthInput");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const passwordOutput = document.getElementById("passwordOutput");

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

generateBtn.addEventListener("click", () => {
  const length = parseInt(lengthInput.value);
  const upper = document.getElementById("includeUpper").checked;
  const numbers = document.getElementById("includeNumbers").checked;
  const symbols = document.getElementById("includeSymbols").checked;

  const password = generatePassword(length, upper, numbers, symbols);
  passwordOutput.value = password;
});


const generatePassword = (length, hasUpper, hasNumbers, hasSymbols) => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+=[]{}|;:,.<>?";
  
    let characters = lower;
    if (hasUpper) characters += upper;
    if (hasNumbers) characters += numbers;
    if (hasSymbols) characters += symbols;
  
    let password = "";
    for (let i = 0; i < length; i++) {
      const rand = Math.floor(Math.random() * characters.length);
      password += characters[rand];
    }
  
    return password;
  };
  