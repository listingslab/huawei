import { createHistory, createHashHistory } from 'history';
let history = window.location.protocol.match(/http/) ? createHistory() : createHashHistory();
export default history;
