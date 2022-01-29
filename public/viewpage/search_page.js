import * as Elements from './elements.js'
import * as Util from './Util.js'
import { routePath } from '../controller/route.js';
import { currentUser } from '../controller/firebase_auth.js';
import * as ProtectedMessage from "./protected_message.js"
import { thread_page } from './thread_page.js';
import * as FirestoreController from '../controller/firestore_controller.js'
import * as Constants from '../model/constants.js'
import { buildHomeScreen } from './home_page.js';

export function addEventListeners() {

    Elements.formSearch.addEventListener('submit', async e => {
        e.preventDefault();
        const searchKeys = e.target.searchKeys.value.trim();
        if (searchKeys.length == 0) {
            Util.info('Error', 'Nosearch keys');
            return;
        }

        const button = e.target.getElementsByTagName('button')[0];
        const label = Util.disbaleButton(button);

        const searchKeysArray = searchKeys.toLowerCase().match(/\S+/g);
        const joinedSearchKeys = searchKeysArray.join(',');

        history.pushState(null, null, routePath.SEARCH + '#' + joinedSearchKeys);
        await search_page(joinedSearchKeys)

        Util.enableButton(button, label);
    });

}

export async function search_page(joinedSearchKeys) {

    if (!joinedSearchKeys) {
        Util.info('Error', 'No Search Keys');
        return;
    }

    const searchKeysArray = joinedSearchKeys.split(',');
    if (searchKeysArray.length == 0) {
        Util.info('Error', 'No Search Keys');
        return;
    }
    if (searchKeysArray.length > 10) {
        Util.info('Error', 'The Number of Search Keys cannot exceed 10');
        return;
    }

    if (!currentUser) {
        Elements.root.innerHTML = ProtectedMessage.html;
        return;
    }

    let threadList;
    try {
        threadList = await FirestoreController.searchThreads(searchKeysArray);
    } catch (e) {
        if (Constants.DEV) console.log(e);
        Util.info('Search Error', JSON.stringify(e));
        return;

    }

    buildHomeScreen(threadList);

}