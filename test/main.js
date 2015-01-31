require.config({
  baseUrl: '',
  paths: {
  },
  shim: {
  }
});

define(function(require) {

  require([
    'spec/test'],
    function(require) {
      window.mochaRunCallback();
    });
});