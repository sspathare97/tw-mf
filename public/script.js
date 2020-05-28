'use strict'

const ipUser1 = document.getElementById('ip-user1');
const ipUser2 = document.getElementById('ip-user2');
const btnSubmit = document.getElementById('btn-submit');
const usersPar = document.getElementById('users-par');

const api = async (url) => {
  return fetch(url)
  .then(response => response.json().then(responseBody => [response.status, responseBody]));
};

const showLoadingBtn = (btn) => {
  btn.innerHTML += `<span aria-hidden="true" role="status" class="ml-2 spinner-border spinner-border-sm"></span>`;
  btn.setAttribute('disabled',true);
};

const hideLoadingBtn = (btn) => {
  btn.lastElementChild && btn.lastElementChild.remove();
  btn.removeAttribute('disabled');
};

const getMutual = async (user1, user2) => {
  try {
    const [responseStatus, responseBody] = await api('/api?user1=' + user1 + '&user2=' + user2);
    // request status is not 200
    if (responseStatus !== 200) {
      alert('Something went wrong!');
      console.log({responseStatus, responseBody});
      usersPar.innerHTML = `<h5 class="w-100 text-center text-primary">Something went wrong!</h5>`;
      return;
    }
    // check result of request
    const result = responseBody.result;
    if (!result) {
      // API returned some error
      const error = responseBody.error;
      alert(error);
      console.log({error});
      usersPar.innerHTML = `<h5 class="w-100 text-center text-primary">${error.replace(/\n/g,'<br>')}</h5>`;
      return;
    } 
    const users = responseBody.users;
    // display mutual friends
    const userStr = [];
    for (const username in users) {
      const {name, image} = users[username];
      userStr.push(`
      <div class="col-md-6">
        <a href="https://twitter.com/${username}" target="_blank">
          <div class="d-flex border border-primary align-items-center rounded-pill mb-3 shadow-md p-3">
            <img src="${image}" class="rounded-circle">
            <div class="px-3">
              <h5 class="text-dark">${name}</h5>
              <p class="m-0">@${username}</p>
            </div>
          </div>
        </a>
      </div>
      `);
    }
    usersPar.innerHTML = userStr.join('');
  }
  catch (error) { 
    alert('Something went wrong!');
    console.log(error); 
    usersPar.innerHTML = `<h5 class="w-100 text-center text-primary">Something went wrong!</h5>`;
  }
};

const validate = async () => {
  const btn = event.target;
  const user1 = ipUser1.value;
  const user2 = ipUser2.value;
  document.activeElement.blur();
  // client side validation
  if (!user1 || !user2) {
    alert("Please enter both usernames!");
  } 
  else if (user1 == user2) {
    alert("Both usernames can't be the same!");
  }
  else {
    showLoadingBtn(btn);
    await getMutual(user1, user2);
    hideLoadingBtn(btn);
  }
};

const initPage = async () => {
  btnSubmit.addEventListener('click', validate);
};

if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
  initPage();
}
else {
  document.addEventListener('DOMContentLoaded', initPage);
}