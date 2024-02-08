if (document.querySelector('#hint')) {
  hint.parentElement.focus();
} else if (document.querySelector('#alert')) {
  document.querySelector('input').focus();
}
