;(function(exports) {
  function update(state, audio) {
    if (state.get("isJustClicked")) {
      audio.snare();
    }
  };

  exports.sound = {
    update
  };
})(this);
