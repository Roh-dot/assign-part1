import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js"

import * as Elements from '../viewpage/elements.js'

const auth = getAuth();

export function addEventListeners() {

    Elements.formSignIn.addEventListener('submit', async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;
            console.log(`sign in success:${JSON.stringify(user)}`);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`sign in error:${errorCode} | ${errorMessage}`);
        }
    });

}