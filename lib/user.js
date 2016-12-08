'use strict';

const MemoryStore = require('fh-wfm-user/lib/user/store');
const data = require('./data.json');

/**
 * Mediator listener for the user module, manipulates 'wfm:user:*' mediator topics
 * @param  {Mediator} mediator a mediator instance to publish/subscribe to
 * @param  {Store} store    Compatible store implemetation, defaults to {@link ./fh-wfm-user/lib/user/store}
 */
module.exports = function(mediator, store) {
  const StoreClass = store || MemoryStore;
  store = new StoreClass('user', data);
  store.listen('', mediator);
};
