import events from './events.js';
let TD2BTD = {};
events.forEach((event) => {
  TD2BTD[event.eventName] = `BTD_${event.eventName}`;
});


let eventsListened = events.filter((ev) => TD2BTD[ev.eventName]);

eventsListened.forEach((event) => {
  if (event.selector.length > 0){
    event.selector.forEach((selector) => $(selector).on(event.eventName, proxyEvent));
  } else {
    $(document).on(event.eventName, proxyEvent);
  }
});

function proxyEvent(ev, data) {
  // console.log(ev.type, data);
  let event = new CustomEvent(TD2BTD[ev.type], { detail: JSON.stringify(data) });
  document.dispatchEvent(event);
}

let tasks = TD.controller.scheduler._tasks;

console.log('AAAAAAAAAA4');
console.log(tasks);
console.log(Object.keys(tasks));

// Object.keys(tasks).forEach((key) => {
//   if (tasks[key].period === 30000)
//     tasks[key].callback = () => console.log('timestamp deleted');
// });