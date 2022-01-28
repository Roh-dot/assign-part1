import { currentUser } from "../controller/firebase_auth.js";
import * as ProtectedMessage from './protected_message.js'
import * as Elements from './elements.js'
import * as Util from './util.js'
import * as FireStoreController from '../controller/firestore_controller.js';
import * as Constants from '../model/constants.js'
import { Reply } from "../model/reply.js";

export function addViewFormEvents() {
    const viewForms = document.getElementsByClassName('thread-view-form');
    for (let i = 0; i < viewForms.length; i++) {
        attachViewFormEventListener(viewForms[i]);
    }
}

export function attachViewFormEventListener(form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const threadId = e.target.threadId.value;
        thread_page(threadId);
    });
}

async function thread_page(threadId) {
    if (!currentUser) {
        Elements.root.innerHTML = ProtectedMessage.html;
        return;
    }
    if (!threadId) {
        Util.info('Error', 'Thread is null; invalid access');
        return;
    }

    // TO-DO list
    // 1.get thread from firestore by ThreadID
    // 2.get all replies to this thtred
    // 3.display the thread
    // 4.display all replies
    // 5.add a form to post a new reply

    let thread;
    try {
        thread = await FireStoreController.getOneThread(threadId);
        if (!thread) throw `Thread does not exist by id: ${threadId}`;
    } catch (e) {
        if (Constants.DEV) console.log(e);
        Util.info('Error',JSON.stringify(e));
        return;
    }

    let html = `
        <h4 class="bg-info text-white">${thread.title}</h4>
        <div>${thread.email} (At ${new Date(thread.timestamp).toString()})</div>
        <div class="bg-secondary text-white">${thread.content}</div>
        <hr>
    `;

    html += '<div>'
        // display replies
    html += '<div>'

    html += `
        <div>
            <form id="form-add-reply" method="post">
                <textarea name="content" required minlength="3" placeholder="Reply to this thread"></textarea>
                <br>
                <button type="submit" class="btn btn-outline-primary">Post reply</button>
            </form>
        </div>
    `;

    Elements.root.innerHTML = html;

    document.getElementById('form-add-reply').addEventListener('submit', async e => {
        e.preventDefault();
        const content = e.target.content.value;
        const uid = currentUser.uid;
        const email = currentUser.email;
        const timestamp = Date.now();
        const reply = new Reply({
            uid, email, timestamp, content, threadId,
        })

        try {
            const id = await FireStoreController.addReply(reply);
            reply.set_docId(id);
        } catch (e) {
            if (Constants.DEV) console.log(e);
            Util.info('Error', JSON.stringify(e));

        }
    })
}