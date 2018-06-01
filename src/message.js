;(function(exports) {
  function message(type, data) {
    return im.Map({ type, data });
  };

  function isType(type) {
    return (message) => {
      return message.get("type") === type;
    };
  };

  message.isType = isType;
  exports.message = message;
})(this);
