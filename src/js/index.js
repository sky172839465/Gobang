import * as app from './main';
import '../sass/main.scss';

import '../img/favicon.png';
import '../img/gobang.png';
import '../img/Octocat.png';

window.start = (event) => {
    app.start(event);
}

window.back = () => {
    app.back();
}