document.addEventListener('click', (e) => {
  if (e.target.className === 'create') {
    return window.location.assign('message/create');
  }

  if (e.target.className === 'delete') {
    window.location.assign(`message/${e.target.id}/delete`);
  }
});
