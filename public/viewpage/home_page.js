import * as Elements from './elements.js'
import { routePath } from '../controller/route.js';
import { currentUser } from '../controller/firebase_auth.js';
import * as ProtectedMessage from './protected_message.js'

export function addEventListeners() {

    Elements.menuHome.addEventListener('click', () => {
        history.pushState(null, null, routePath.HOME);
        home_page();
    });
}

export function home_page() {
    if (!currentUser) {
        Elements.root.innerHTML = ProtectedMessage.html;
        return;
    }
    Elements.root.innerHTML = `
        <h1>Home Page</h1>
    `;
}