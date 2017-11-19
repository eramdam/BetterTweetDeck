const myRequest = new XMLHttpRequest();
myRequest.open('GET', 'https://media0.giphy.com/media/ff0dv4KMGxjna/giphy.gif');
myRequest.responseType = 'blob';

myRequest.onload = (event) => {
  const blob = event;
  // console.log(blob);

  // const myFile = new File([blob], 'awesome-gif.gif');
  // $(document).trigger('uiFilesAdded', {
  //   files: [myFile],
  // });
};

myRequest.onprogress = (event) => {
  console.log('progress', event);
};

myRequest.send();
