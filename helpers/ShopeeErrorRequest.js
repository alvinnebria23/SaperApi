const identifyErrorMessage = (errorObject) => {
  const errorCode = errorObject.extensions.code;
  if(errorCode === 11001){
    return { error: true, message: "Please do filtering dates every 30 seconds only."};
  }
  if(errorCode === 10020){
    return { error: true, message: "Your secret key is already expired. Please regenerate your secret key and update your information on the app."};
  }
  return { error: true, message: errorObject.extensions.message};
}

export { identifyErrorMessage };