var last_values = [],
  refresh_interval = 30000,
  set_interval_id = 0,
  pairs = ["btcusd", "btceur", "eurusd", "xrpusd", "xrpeur", "xrpbtc", "ltcusd", "ltceur", "ltcbtc", "ethusd", "etheur", "ethbtc", "bchusd", "bcheur", "bchbtc"];



var get_multiplier = function() {
    var value = store.get('multiplier');
    if (value === undefined) {
      return 1;
    }
    return value;
  },
  get_last_value = function() {
    return store.get('last-value');
  },
  get_precision = function() {
    var value = store.get('precision');
    if (value === undefined) {
      return 1;
    }
    return value;
  },
  get_within = function() {
    return store.get('within') || 10;
  },
  get_currency_pair = function() {
    var value = store.get('currency-pair');
    if (value === undefined) {
      return "BTCUSD";
    }
    return value;
  },
  get_last_pair = function(){
    var value = store.get('last-pair');
    if (value === undefined) {
      return "BTCUSD";
    }
    return value;
  },
  store_string = function(name, value) {
    store.set(name, value);
  },
  store_float = function(name, value, default_value) {
    value = parseFloat(value);
    if (isNaN(value)) {
      value = default_value;
    }
    store.set(name, value);
  },
  store_int = function(name, value) {
    value = parseInt(value, 10);
    if (isNaN(value)) {
      value = 1;
    }
    store.set(name, value);
  },
  get_stored_string = function(name){
    return store.get(name);
  },
  _formatter = function(num) {
    return num > 1999 ? (num / 1000).toFixed(1) + 'k' : num.toFixed(get_precision());
  },
  insert_at = function(base, character, position) {
    return base.slice(0, position) + character + base.slice(position);
  },
  get_channel_name = function(pair){
    return pair.toLowerCase() === 'btcusd'? 'live_trades':'live_trades_' + pair.toLowerCase();
  };
