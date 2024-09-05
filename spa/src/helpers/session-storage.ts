function isSessionStorageEnabled() {
  try {
    window.sessionStorage.setItem("test", "test");
    window.sessionStorage.removeItem("test");
    return true;
  } catch (e) {
    return false;
  }
}

export {isSessionStorageEnabled};
