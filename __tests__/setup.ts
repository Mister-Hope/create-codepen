export {};

// jsdom does not implement HTMLFormElement#submit; stub it so prefill tests do
// not spam the test output. Tests that assert the call still spy on it.
HTMLFormElement.prototype.submit = function submit(): void {
  // intentionally empty: form submission is asserted through spies
};
