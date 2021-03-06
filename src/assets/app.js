/**
 * @typedef Image
 * @type {object}
 * @property {string} large
 * @property {string} medium
 * @property {string} thumbnail
 */

/**
 * @typedef User
 * @type {object}
 * @property {Image} image
 * @property {string} name
 * @property {string} email
 */

const log = console.log;

const reqOptions = {
  method: 'GET',
  redirect: 'follow'
};

/**
 * Takes some values and returns them through a template literal
 * @param {User} user
 * @returns {string}
 */
const templateUser = ({image, name, email}) => {
  // TODO: use source set with large, medium, thumbnail images
  // TODO: implement better text sanitization :|
  return `
  <li class="users__user">
    <img src="${image.large}" alt="Image of ${name}" class="user__image">
    <h2 class="user__name">${name}</h2>
    <a class="user__email" href="mailto:${email}">${email}</a>
  </li>
  `;
}

/**
 * Fetches users randomly and returns results, if no results an empty array is
 * returned.
 * @param {string} gender
 * @returns {Promise<User[]>}
 */
const fetchUsers = async (gender = 'female') => {
  try {
    const res = await fetch(
      `https://randomuser.me/api?results=9&gender=${gender}`, 
      reqOptions
    );
    const data = await res.text();
    const { results } = JSON.parse(data);
    // transform users into a format we want.
    return results.map( user => {
      return {
        image: user.picture,
        name: `${user.name.first} ${user.name.last}`,
        email: user.email
      }
    });
  } catch(e) {
    log(e);
  }

  return [];
}

/**
 * Handle function for buttons. 
 * @returns 
 */
const handleGetUsers = async (event) => {
  const button = event.currentTarget;
  // bail if the button is already disabled
  if(button.hasAttribute('aria-disabled')) {
    return;
  }

  // Disable the button during server actions
  button.setAttribute('aria-disabled', true);
  button.classList.add('disabled');

  // Get the users and add them into the list container
  const users = await fetchUsers(button.dataset.gender);
  const listContainer = document.querySelector('[data-users-list]');
  listContainer.innerHTML = users.map( user => templateUser(user)).join('');

  // Enable the button
  button.removeAttribute('aria-disabled');
  button.classList.remove('disabled');

  // If we have results and selection note still appears, remove it
  const selectionNote = document.querySelector('[data-clear-on-results]');
  if(users.length > 0 && selectionNote) {
    selectionNote.remove();
  }

  return;
};

// Listen for events on all the buttons
const buttons = document.querySelectorAll('[data-get-users]');

Array.from(buttons).forEach((genButton) => {
  genButton.addEventListener('click', handleGetUsers)
});
