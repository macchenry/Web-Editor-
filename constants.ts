
import { Project } from './types';

export const DEFAULT_PROJECT: Omit<Project, 'id' | 'name'> = {
  html: `
<div class="container">
  <h1>Welcome to the Live Web IDE!</h1>
  <p>Edit the HTML, CSS, and JavaScript to see your changes live.</p>
  <button id="myButton">Click Me</button>
</div>
`,
  css: `
body {
  font-family: sans-serif;
  background-color: #f0f0f0;
  color: #333;
  margin: 20px;
}
.container {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
h1 {
  color: #007BFF;
}
button {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #0056b3;
}
`,
  js: `
const button = document.getElementById('myButton');

button.addEventListener('click', () => {
  console.log('Button clicked!');
  alert('Hello from your JavaScript code!');
});

console.log('JavaScript loaded and executed.');
console.warn('This is a sample warning.');
console.error('This is a sample error.');
`,
  externalResources: []
};
