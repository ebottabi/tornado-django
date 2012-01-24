
if (typeof Gowalla === 'undefined')
  window.Gowalla = {};


if (!Function.prototype.bind) {

  Function.prototype.bind = function(obj) {
    if (typeof this !== 'function') // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');

    var slice = [].slice,
        args = slice.call(arguments, 1),
        self = this,
        nop = function () {},
        bound = function () {
          return self.apply( this instanceof nop ? this : ( obj || {} ),
                              args.concat( slice.call(arguments) ) );
        };

    bound.prototype = this.prototype;
    return bound;
  };
}

Views = {
  common: {
    init: function() {
      $('#logout').click(function(event) {
        event.preventDefault();
        $('#logout_form').submit();
      });

      Gowalla.Nav.setup();
      Gowalla.Ajax.setup();
      Gowalla.Like.setup();
      Gowalla.Modal.setup();
      Gowalla.Follow.setup();
      Gowalla.Stories.setup();
      Gowalla.Tooltips.setup();
      new Gowalla.LivePaginator($('.paginate-me'));

      if ($('div.filmstrip').length)
        Gowalla.Filmstrip.setup();

      if ($('.add-to-list-menu').length)
        Gowalla.Lists.setup();

      if ($('#map-overlay').length && $('#map-overlay-trigger').length)
        Gowalla.Map.setupModal();

      if ($('#photo-overlay').length)
        Gowalla.PhotoViewer.setup();

    }
  },

  spots: {
    init: function() {
      Gowalla.Map.setupModal();
      Gowalla.PhotoViewer.setup();
    },

    show: function() {
      Gowalla.Lists.setup();
      Gowalla.Comments.setup();
      Gowalla.Filmstrip.setup();
      Gowalla.Highlights.setup();
      Gowalla.PhotoViewer.setup(true);

      new Gowalla.LivePaginator($('.feed'));
    },

    edit: function() {
      (function() {
        return;
        function setupMap() {
          console.log('setupMap');
          var $form = $('form.edit_spot');
          var lat = $('#spot_lat').val(), lng = $('#spot_lng').val();

          Gowalla.Map.setup({ center: [lat, lng] });
          Gowalla.Map.addPoint(lat, lng, {
            draggable: true,
            ondragend: function(marker) {
              var position = marker.getPosition();
              var newLat = position.lat(), newLng = position.lng();
              $('#spot_lat').val(newLat);
              $('#spot_lng').val(newLng);
            }
          });
        }

        var _interval;

        function checkMap() {
          console.log('checkMap');
          if (!google.maps) return;
          window.clearInterval(_interval);
          setupMap();
        }

        console.log('setting interval');

        _interval = window.setInterval(checkMap, 50);
      })();



      $(window).bind('load', function() {
        var $form = $('form.edit_spot');
        var lat = $('#spot_lat').val(), lng = $('#spot_lng').val();

        Gowalla.Map.setup({ center: [lat, lng] });
        Gowalla.Map.addPoint(lat, lng, {
          draggable: true,
          ondragend: function(marker) {
            var position = marker.getPosition();
            var newLat = position.lat(), newLng = position.lng();
            $('#spot_lat').val(newLat);
            $('#spot_lng').val(newLng);
          }
        });
      });

      (function() {

        function buildHTML(html, cat, depth) {
          var css = depth ? "padding-left: 15px;" : "";
          html.push('<option style="' + css + '" value="' + cat.id + '">' + cat.name + '</option>');
        }

        function renderOption($option) {
          var json = $.parseJSON($option.attr('data-json')), html = [];
          var $categories = $('#spot_category');
          $categories.empty();

          $.each(json.spot_categories, function(i, cat) {
            buildHTML(html, cat, 0);
            if (cat.spot_categories) {
              $.each(cat.spot_categories, function(i, cat) {
                buildHTML(html, cat, 1);

                if (cat.spot_categories) {
                  $.each(cat.spot_categories, function(i, cat) {
                    buildHTML(html, cat, 2);
                  });
                }
              });
            }
          });

          $categories.html(html.join(''));
        }


        function onChange() {
          var id = $(this).val(), $options = $(this).find('option'), $option;

          for (var i = 0, opt; opt = $options[i]; i++) {
            if ($(opt).attr('value') === id) {
              $option = $(opt);
              break;
            }
          }

          if (!$option) return;
          renderOption($option);

          var $categories = $('#spot_category');
          window.setTimeout( function() {
            var initialValue = $categories.attr('data-initial-value');
            if (initialValue) {
              $categories.removeAttr('data-initial-value');
              $categories.val(initialValue);
            }
          }, 10);

        }

        $('#spot_top_category').change(onChange).change();
      })();

    }
  },

  'spots-lists': {
    index: function() {
      new Gowalla.LivePaginator($('#spot-list-collection'));
    }
  },

  notifications: {
    index: function() {
      new Gowalla.LivePaginator($('#notifications-list'));
    }
  },


  stories: {
    init: function() {
      Gowalla.Filmstrip.setup();

      $(document).bind('gowalla:page:loaded', function() {
        Gowalla.Filmstrip.setup();
      });

      Gowalla.Comments.setup();
    },

    index: function() {
      Gowalla.PhotoViewer.setup();
      Gowalla.Comments.setupCommentToggle();
    },

    show: function() {
      Gowalla.Map.setupModal();
      Gowalla.PhotoViewer.setup(true);
      Gowalla.Lists.setup();
    }
  },

  users: {
    show: function() {
      Gowalla.Comments.setup();
      Gowalla.Filmstrip.setup();
      Gowalla.PhotoViewer.setup(true);

      new Gowalla.LivePaginator($('.feed'));
    }
  },

  guides: {
    index: function() {
      new Gowalla.LivePaginator($('#guide-spots-list'));
    },

    show: function() {
      Gowalla.Filmstrip.setup();
      Gowalla.PhotoViewer.setup();
      Gowalla.Lists.setup();
    }
  },

  'guides-spots': {
    index: function() {
      new Gowalla.Menu($('.guide-spots-nav .highlight-type-button'), $('.guide-spots-nav .guide-highlight-menu'), {mode: 'click'});
      Gowalla.Lists.setup();
      Gowalla.Highlights.setup({ insertionPointSelector: '.highlights-collection' });
    }
  },

  lists: {
    show: function() {
      Gowalla.Lists.setup();
    },

    edit: function() {
      Gowalla.EditList.setup();
    }
  }

};

Views.spots.update = Views.spots.edit;


UTIL = {
  exec: function(controller, action) {
    var ns = Views;
    if (typeof action === 'undefined') action = 'init';

    if (controller !== "" && ns[controller] && typeof ns[controller][action] == "function") {
      ns[controller][action]();
    }
  },
  init: function() {
    var body = $(document.body), controller = body.data("controller"), action = body.data("action");
    UTIL.exec("common");
    UTIL.exec(controller);
    UTIL.exec(controller, action);
  }
};

$(document).ready(UTIL.init);


Gowalla.Ajax = (function() {

  var COLORS = [
    "#ffa220",
    "#fce26c",
    "#afe645",
    "#ddff9c",
    "#ff6700",
    "#ffb85a",
    "#95c9ff",
    "#b1ebdd"
  ];

  var NUMBER_OF_CELLS = 16;

  function randomDuration() {
    return 1000 * (0.25 + (Math.random() * 0.3));
  }

  function randomColor(notColor) {
    var length = COLORS.length;
    do {
      var index = Math.floor(Math.random() * length);
      var color = COLORS[index];
    } while (color === notColor);
    return color;
  }

  function tween(from, to, pos) {
    var diff = to - from;
    return from + (diff * pos);
  }

  function toColorPart(number) {
    var string = number.toString(16);
    return string.length < 2 ? ('0' + string) : string;
  }

  function normalizeColor(color) {
    return [
      parseInt(color.slice(1,3),16), parseInt(color.slice(3,5),16), parseInt(color.slice(5,7),16)
    ];
  }

  function interpolateColor(from, to, position) {
    return '#' + [0,1,2].map(function(index){
      var value = tween(from[index], to[index], position);
      return toColorPart(Math.max( Math.min( Math.round(value), 255 ), 0));
    }).join('');
  }

  function sinusoidal(pos) {
    return (-Math.cos(pos*Math.PI)/2) + 0.5;
  }

  function mirror(pos) {
    if (pos < 0.5) return sinusoidal(pos * 2);
    else           return sinusoidal(1 - (pos - 0.5) * 2);
  }



  function Cell($element) {
    this.$element = $element;

    this.period   = randomDuration() * 4;

    var color1 = randomColor(), color2 = randomColor(color1);

    this.colors   = [color1, color2].map(normalizeColor);
    this.$element.css('backgroundColor', color1);
  }

  $.extend(Cell.prototype, {
    getColor: function(elapsed) {
      var pos = (elapsed % this.period) / this.period;
      pos = mirror(pos);
      var color = interpolateColor(this.colors[0], this.colors[1], pos);
      return color;
    },

    update: function(elapsed) {
      var color = this.getColor(elapsed);
      this.$element[0].style.backgroundColor = this.getColor(elapsed);
    }
  });


  var Rainbow = {
    setup: function() {
      this.$element = $('#rainbow');
      if (!this.$element.length) return;

      this.cells = [];

      var percentage = (100 / NUMBER_OF_CELLS).toFixed(3) + '%';
      for (var i = 0, $cell; i < NUMBER_OF_CELLS; i++) {
        $cell = $('<div></div>');
        $cell.css('width', percentage);
        this.$element.append($cell);
        this.cells.push( new Cell($cell) );
      }

    },

    start: function() {
      this.$element.addClass('active');
      this._startTime = (new Date()).valueOf();

      this.$element.tween(this._tween.bind(this), { duration: 999999, easing: 'linear' });
    },

    stop: function() {
      this.$element.stop(true, true);
      this.$element.removeClass('active');
    },


    _tween: function() {
      var now = (new Date()).valueOf();
      var elapsed = now - this._startTime;
      for (var i = 0, cell; cell = this.cells[i]; i++) cell.update(elapsed);
    }
  };


  function start() {
    Rainbow.start();
  }

  function stop() {
    Rainbow.stop();
  }


  return {
    setup: function() {
      Rainbow.setup();
      $(document).ajaxStart(start).ajaxComplete(stop);
    },

    start: function() {
      start();
    },

    stop: function() {
      stop();
    }
  };

})();


Gowalla.API = (function() {

  function toArray(collection) {
    return Array.prototype.slice.call(collection, 0);
  }

  return {
    _ajax: function(verb, url, options) {
      options.type = verb;
      options.beforeSend = this._beforeSend.bind(this);
      $.ajax(url, options);
    },

    _beforeSend: function(xhr) {
      xhr.setRequestHeader('X-Gowalla-API-Version', '2');
      xhr.setRequestHeader('X-Gowalla-Bruce-Lee', 'l33tkuned0');
    },

    get: function() {
      var args = toArray(arguments);
      args.unshift('get');
      return this._ajax.apply(this, args);
    },

    post: function() {
      var args = toArray(arguments);
      args.unshift('post');
      return this._ajax.apply(this, args);
    },

    put: function() {
      var args = toArray(arguments);
      args.unshift('put');
      return this._ajax.apply(this, args);
    },

    del: function() {
      var args = toArray(arguments);
      args.unshift('delete');
      return this._ajax.apply(this, args);
    }
  };

})();

$.widget('ui.gMenu', {

  _create: function() {
    var that = this;

    this.element.addClass('ui-menu ui-widget ui-widget-content ui-corner-all');
    this.element.attr({
      role: 'listbox',
      'aria-activedescendant': 'ui-active-menuitem'
    });

    this.element.click( function(event) { that._click(event); });
    this.refresh();
  },

  _click: function(event) {
    var target = $(event.target);
    var menuItem = target.closest('.ui-menu-item');
    if (!menuItem.length) return;

    event.preventDefault();
    this.select(event);
  },

  refresh: function() {
    this._refreshItems();
  },

  _refreshItems: function() {
    var that = this;

    function mouseenter(event) {
      that.activate(event, $(this).closest('.ui-menu-item'));
    }
    function mouseleave() { that.deactivate(); }

    this.items = this.element.find('.ui-menu-item');
    this.items.attr('role', 'menuitem');

    this.items.unbind('.gMenu');
    this.items.bind('mouseenter.gMenu', mouseenter);
    this.items.bind('mouseleave.gMenu', mouseleave);
  },


  activate: function(event, item) {
    this.deactivate();

    if (this.hasScroll()) {
    }

    this.active = item.eq(0);
    this.active.addClass('ui-state-hover').attr('id', 'ui-active-menuitem');

    this._trigger('focus', event, { item: item });
  },

  deactivate: function() {
    if (!this.active) return;
    this.active.removeClass('ui-state-hover').removeAttr('id');
    this._trigger('blur');
    this.active = null;
  },

  _index: function(needle) {
    return $.inArray(needle, this.items);
  },

  next: function(event) {
    this.move(1, null, event);
  },

  previous: function(event) {
    this.move(-1, null, event);
  },

  first: function() {
    return this.active && this._index(this.active) === 0;
  },

  last: function() {
    return this.active && this._index(this.active) === (this.items.length - 1);
  },

  move: function(delta, edge, event) {
    if (!this.active) {
      this._refreshItems();
      this.activate(event, this.items);
      return;
    }

    var activeIndex = this._index(this.active[0]);
    var newIndex    = activeIndex + delta;
    var lastIndex   = this.items.length - 1;

    if (newIndex > lastIndex) newIndex = 0;
    else if (newIndex < 0)    newIndex = lastIndex;

    var next = this.items[newIndex];

    this.activate(event, $(next));
  },

  nextPage: function(event) {
  },

  previousPage: function(event) {
  },

  hasScroll: function() {
    return this.element.height() < this.element.attr('scrollHeight');
  },

  select: function(event) {
    this._trigger('selected', event, { item: this.active });
  }
});

(function($) {

  $.widget('ui.gAutocomplete', $.ui.autocomplete, {

    options: {
      menuType: 'menu'
    },

    _create: function() {
      $.ui.autocomplete.prototype._create.apply(this, arguments);

      var doc = this.element[0].ownerDocument;

      var menu = this._createMenu();
      if (!menu) return;

      this.menu.element.remove();
      var target = $(this.options.appendTo || 'body', doc)[0];

      menu
        .addClass('ui-autocomplete')
        .appendTo(target)
        .zIndex(this.element.zIndex() + 1)
        .hide();

      var self = this, menuType = this.options.menuType;
      if (!menu.data(menuType)) {
        menu[menuType]({
          focus: function( event, ui ) {
            var item = ui.item.data( "item.autocomplete" );
          },
          selected: function( event, ui ) {
            var item = ui.item.data( "item.autocomplete" );
            if ( false !== self._trigger( "select", event, { item: item } ) ) {
              self.element.val( item.value );
            }
            self.close( event );
            var previous = self.previous;
            if ( self.element[0] !== doc.activeElement ) {
              self.element.focus();
              self.previous = previous;
            }
            self.selectedItem = item;
          },
          blur: function( event, ui ) {
            if ( self.menu.element.is(":visible") ) {
              self.element.val( self.term );
            }
          }
        });
      }

      this.menu = menu.data(menuType);
    },

    _createMenu: function() {
      return false;
    }
  });

})(jQuery);

(function($) {

  Jaml.register('search_autocomplete_result_user', function(item) {
    with (this) {
      li({ cls: 'ui-menu-item' },
        a({ href: item.url },
          img({ src: item.image_url, width: '40', height: '40' }),
          span(item.first_name, ' ', item.last_name),
          small(item.hometown)
        )
      );
    }

  });

  Jaml.register('search_autocomplete_result_spot', function(item) {
    var meta = [], location = item.location || {};
    if (location.locality) meta.push(location.locality);
    if (location.region)   meta.push(location.region);

    meta = meta.join(', ');

    if (item.category_name && item.category_name !== '')
      meta = item.category_name + " in " + meta;

    with (this) {
      li({ cls: 'ui-menu-item' },
        a({ href: item.url },
          img({ src: item.image_urls.square_100, width: '40', height: '40' }),
          span(item.name),
          small(meta)
        )
      );
    }
  });

  $.widget('ui.gSearchAutocomplete', $.ui.gAutocomplete, {

    options: {
      url: '/search/autocomplete',
      menuType: 'gMenu',
      types: 'Spots Users',
      limit: 5,
      showMore: true,

      source: function(request, response) {
        var term = request.term;

        this._lastTerm = term;

        var that = this;
        var wrappedResponse = function(choices) {
          that._setChoicesForTerm(term, choices);

          if (term !== that._lastTerm) return;
          response.apply(this, arguments);
        };

        var choices = this._getChoicesForTerm(term);
        if (choices) {
          wrappedResponse(choices);
        } else {
          request.limit = this.options.limit;
          Gowalla.API.get(this.options.url, {
            data: request,
            success: wrappedResponse
          });
        }
      }
    },

    _createMenu: function() {
      return $('<div id="header-search-dropdown"></div>');
    },

    _response: function() {
      $.ui.gAutocomplete.prototype._response.apply(this, arguments);
    },

    _create: function() {
      this._termCache = {};
      $.ui.gAutocomplete.prototype._create.apply(this, arguments);

      var that = this;
      this.element.bind('gsearchautocompleteselect', function() {
        that.term = "";
      });
    },

    _resizeMenu: function() {
      var ul = this.menu.element;
      ul.outerWidth(this.element.outerWidth());
    },

    _position: function() {
      this.menu.element.show().position({
        my: "left top",
        at: "left bottom",
        of: this.element,
        collision: "none"
      });
    },

    _renderMenu: function(div, items) {
      var that = this;
      var types = this.options.types.split(' ');

      $.each(types, function(i, name) {
        var dl = $('<dl></dl>');
        var dt = $('<dt></dt>'), dd = $('<dd></dd>');

        var group = items[name.toLowerCase()];
        var total = items.totals[name.toLowerCase()];

        dt.html("<a href='#'>" + name + "</a><small>" + group.length + " of " + total + "</small>");

        var ul = $('<ul class="results"></ul>');

        $.each(group, function(i, item) {
          var heading = i === 0 ? name : false;
          that._renderItem(ul, item, heading);
        });

        if (group.length === 0) return;

        if (that.options.showMore) {
          var more = "More " + name + "...";
          var li = $('<li class="ui-menu-item"></li>');
          li.append($('<a href="#"></a>').text(more));
          li.data('item.autocomplete', {});
        }

        ul.append(li);

        ul.appendTo(dd);

        dl.append(dt);
        dl.append(dd);

        dl.appendTo(div);
      });

      div.hide().appendTo(document.body);
    },

    _renderItem: function(ul, item) {
      var html = Jaml.render('search_autocomplete_result_' + item.type, item);
      var $li = $(html).data('item.autocomplete', item);
      $li.appendTo(ul);
    },

    _empty: function(items) {
      if (!items.spots && !items.users) return true;
      if (items.spots.length === 0 && items.users.length === 0) return true;
      return false;
    },

    _response: function(items) {
      if (!this._empty(items)) {
        items = this._normalize(items);
        this._suggest(items);
        this._trigger('open');
      } else {
        this._trigger('close');
      }

      this.element.removeClass('ui-autocompleter-loading');
    },

    _getChoicesForTerm: function(term) {
      return this._termCache[term];
    },

    _setChoicesForTerm: function(term, choices) {
      if (this._getChoicesForTerm(term)) return;
      this._termCache[term] = choices;
    },


    _normalize: function(items) {
      if (items.spots && items.users) return items;
      throw "Unexpected format.";
    }
  });


  $.widget('ui.gowallaAdminCategoryAutocomplete', $.ui.gAutocomplete, {

  });

})(jQuery);

(function() {

  var MENU_TRIGGER_DEFAULT_OPTIONS = {
    mode: 'hover', // 'click' is the other option
    threshold:  400
  };

  function MenuTrigger($trigger, $menu, options) {
    var defaults = $.extend({}, MENU_TRIGGER_DEFAULT_OPTIONS);
    this.options = $.extend(defaults, options || {});

    this.mode = this.options.mode;

    this.$trigger = $trigger;
    this.$menu    = $menu;

    if (this.$trigger.length === 0 || this.$menu.length === 0) return;

    if (this.mode === 'hover') {
      this.$trigger.bind('mouseenter', this._enterTrigger.bind(this));
      this.$trigger.bind('mouseleave', this._leaveTrigger.bind(this));

      this.$menu.bind('mouseenter', this._enterMenu.bind(this));
      this.$menu.bind('mouseleave', this._leaveMenu.bind(this));
    } else {
      $(document).bind('click', this._clickTrigger.bind(this));
    }

  }

  $.extend(MenuTrigger.prototype, {
    _show: function() {
      this.$menu.css('visibility', 'visible');
      this.$menu.css('opacity', '1');

      this.$menu.trigger('gowalla:menu:opened');
    },

    _isOpen: function() {
      return this.$menu.css('visibility') === 'visible';
    },

    _hide: function() {
      this.$menu.css('visibility', 'hidden');
      this.$menu.css('opacity', '0');

      this.$menu.trigger('gowalla:menu:closed');
    },

    _scheduleHide: function() {
      if (this._hideTimeout) return;
      this._hideTimeout = window.setTimeout( function() {
        this._hide();
        this._hideTimeout = null;
      }.bind(this), this.options.threshold);
    },

    _cancelHide: function() {
      if (!this._hideTimeout) return;
      window.clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    },

    _insideTriggerOrMenu: function($target) {
      var target = $target[0], trigger = this.$trigger[0],
       menu = this.$menu[0];

      if (target === trigger || target === menu) return true;
      if ($.contains(trigger, target) || $.contains(menu, target)) return true;

      return false;
    },

    _insideTrigger: function($target) {
      var target = $target[0], trigger = this.$trigger[0];
      return (target === trigger || $.contains(trigger, target));
    },

    _clickTrigger: function(event) {
      var $target = $(event.target);

      var shouldOpen = this._insideTriggerOrMenu($target);
      var isOpen     = this._isOpen();

      if (this._insideTrigger($target)) {
        if (isOpen) shouldOpen = false;

        event.preventDefault();
      }

      if (shouldOpen === isOpen) return;

      if (shouldOpen) {
        this._cancelHide();
        this._show();
      } else {
        this._hide();
      }
    },

    _enterTrigger: function(event) {
      this._cancelHide();
      this._show();
    },

    _leaveTrigger: function(event) {
      var $destination = $(event.relatedTarget);
      if ($destination.is('#passport_menu')) return;
      this._scheduleHide();
    },

    _enterMenu: function(event) {
      this._cancelHide();
    },

    _leaveMenu: function(event) {
      this._scheduleHide();
    }
  });


  window.Gowalla.Menu = MenuTrigger;


  var DELEGATION_MENU_TRIGGER_DEFAULT_OPTIONS = {
    mode: 'hover', // 'click' is the other option
    threshold:  400
  };

  function DelegationMenuTrigger(containerSelector, triggerSelector, menuSelector, options) {
    var defaults = $.extend({}, DELEGATION_MENU_TRIGGER_DEFAULT_OPTIONS);
    this.options = $.extend(defaults, options || {});

    this.containerSelector = containerSelector;
    this.triggerSelector   = triggerSelector;
    this.menuSelector      = menuSelector;

    this.mode = this.options.mode;

    var observers = {};

    if (this.mode === 'hover') {

      observers[this.containerSelector + ' ' + this.triggerSelector] = {
        mouseenter: this._enterTrigger,
        mouseleave: this._leaveTrigger
      };

      observers[this.containerSelector + ' ' + this.triggerSelector] = {
        mouseenter: this._enterMenu,
        mouseleave: this._leaveMenu
      };

      attachObservers(observers, $(document.body), this);
    } else {
      $(document).bind('click', this._clickTrigger.bind(this));
    }

  }

  $.extend(DelegationMenuTrigger.prototype, {
    _show: function($container) {
      var $parts = this._getParts($container);

      $parts.menu.css('visibility', 'visible');
      $parts.menu.css('opacity', '1');
      $parts.menu.trigger('gowalla:menu:opened', [$parts.menu, $parts.trigger]);
    },

    _isOpen: function($container) {
      var $parts = this._getParts($container);
      return $parts.menu.css('visibility') === 'visible';
    },

    _hide: function($container) {
      var $parts = this._getParts($container);
      $parts.menu.css('visibility', 'hidden');
      $parts.menu.css('opacity', '0');
      $parts.menu.trigger('gowalla:menu:closed', [$parts.menu, $parts.trigger]);
    },

    _hideAll: function() {
      var that = this;
      $(this.containerSelector).each( function(i, container) {
        that._hide($(container));
      });
    },

    _scheduleHide: function($container) {
      if ($container.data('menu:hideTimeout')) return;
      var timeout = window.setTimeout( function() {
        this._hide($container);
        $container.data('menu:hideTimeout', null);
      }.bind(this), this.options.threshold);

      $container.data('menu:hideTimeout', timeout);
    },

    _cancelHide: function($container) {
      var timeout = $container.data('menu:hideTimeout');
      if (!timeout) return;
      window.clearTimeout(timeout);
      $container.data('menu:hideTimeout', null);
    },

    _insideTriggerOrMenu: function($target) {
      var $trigger = $target.closest(this.triggerSelector),
       $menu = $target.closest(this.menuSelector);

      if ($trigger.length || $menu.length) return true;
      return false;
    },

    _insideTrigger: function($target) {
      var $trigger = $target.closest(this.triggerSelector);
      return $trigger.length > 0;
    },

    _clickTrigger: function(event) {
      var $target = $(event.target);

      var shouldOpen = this._insideTriggerOrMenu($target);
      if (shouldOpen) {
        var $container = this._getContainer($target);
        var isOpen     = this._isOpen($container);

        if (this._insideTrigger($target)) {
          if (isOpen) shouldOpen = false;

          event.preventDefault();
        }

        if (shouldOpen === isOpen) return;

        if (shouldOpen) {
          this._cancelHide($container);
          this._show($container);
        } else {
          this._hide($container);
        }

      } else {
        this._hideAll();
      }
    },

    _getContainer: function($element) {
      return $element.closest(this.containerSelector);
    },

    _getParts: function($container) {
      return {
        trigger: $container.find(this.triggerSelector),
        menu:    $container.find(this.menuSelector)
      };
    },

    _enterTrigger: function(event, $element) {
      var $container = this._getContainer($element);
      this._cancelHide($container);
      this._show($container);
    },

    _leaveTrigger: function(event, $element) {
      var $destination = $(event.relatedTarget);
      if ($destination.is(this.menuSelector)) return;
      this._scheduleHide(this._getContainer($element));
    },

    _enterMenu: function(event, $target) {
      var $container = this._getContainer($element);
      this._cancelHide($container);
    },

    _leaveMenu: function(event, $target) {
      var $container = this._getContainer($element);
      this._scheduleHide($container);
    }
  });

  window.Gowalla.DelegationMenu = DelegationMenuTrigger;

})();
/*

  TODO
  - Remove need to add   <p class="error"></p> to the form
  - Get thtis to work on signup_flow/confirm

*/

Gowalla.Modal = (function() {

  var KEY = { ENTER: 13, SPACE: 32 };

  function interpret(modal) {
    if (typeof modal !== 'string') return modal;

    if (modal.charAt(0) !== '#') modal = '#' + modal;
    var $modal = $(modal);
    if ($modal.length) return $modal;

    return createModal(modal.substring(1));
  }

  function createModal(id) {
    var $modal = $('<div class="modal" id="' + id + '">');
    $modal.hide();
    $(document.body).append($modal);
    return $modal;
  }

  function makeHandler(handler, scope) {
    return function() {
      var $element = $(this);
      var args = Array.prototype.slice.call(arguments, 0);
      args.push($element);
      return handler.apply(scope, args);
    };
  }

  function attachObservers(observers, $tag, scope) {
    var events, selector, eventName;
    for (selector in observers) {
      events = observers[selector];
      for (eventName in events) {
        $tag.delegate(selector, eventName, makeHandler(events[eventName], scope));
      }
    }
  }

  function isEmpty(val) {
    return val.length === 0 || !(/\S/).test(val);
  }


  var SignIn = {
    setup: function() {
      this.$modal = $('#modal_sign_in');
      this.$form  = this.$modal.find('form');
      this.$aside = this.$modal.find('p.aside');
      this.$error = this.$modal.find('p.error');

      var observers = {
        'form': {
          submit: this._submit
        },

        '#user_session_submit': {
          click: this._submitClick
        }
      };

      attachObservers(observers, this.$modal, this);
    },

    validate: function() {
      var values = { username: $('#user_session_username').val(), password: $('#user_session_password').val() };

      if (isEmpty(values.username)) {
        this.error("Email can't be blank.");
        return false;
      }

      if (isEmpty(values.password)) {
        this.error("Password can't be blank.");
        return false;
      }

      return true;
    },

    submit: function() {
      this.$form.submit();
    },

    error: function(message) {
      this.$aside.hide();
      this.$error.text(message).show();
    },

    _submit: function(event) {
      if (!this.validate()) event.preventDefault();
    },

    _submitClick: function(event) {
      event.preventDefault();
      this.submit();
    }
  };

  var SignUp = {
    setup: function() {
      this.$modal = $('.signup-validation-wrapper');
      this.$form  = this.$modal.find('form');
      this.$aside = this.$modal.find('p.aside');
      this.$error = this.$modal.find('p.error');
      var observers = {
        'form': {
          submit: this._submit
        }
      };

      attachObservers(observers, this.$modal, this);
    },

    error: function(message) {
      this.$aside.hide();
      this.$error.text(message).show();
    },

    validate: function() {
      var fields = ['#user_first_name', '#user_last_name', '#user_email', '#user_username', '#user_password'];
      var invalidFields = [];
      $.each(fields, function(i, field) {
        var $element = $(field), value = $element.val();
        if (isEmpty(value)) {
          invalidFields.push($element.attr('placeholder'));
        }
      });

      if (invalidFields.length > 0) {
        this.error(invalidFields[0] + " can't be blank.");
        return false;
      }

      return true;
    },

    submit: function() {
      this.$form.submit();
    },

    _submit: function(event) {
      if (!this.validate()) event.preventDefault();
    }
  };

  return {
    setup: function() {

      var observers = {
        'div.modal a.remove': {
          click: this._close
        },

        '#link_sign_in': {
          click: function(event) {
            Gowalla.Modal.open('#modal_sign_in');
            event.preventDefault();
          }
        },

        '#link_sign_up': {
          click: function(event) {
            Gowalla.Modal.open('#modal_sign_up');
            event.preventDefault();
          }
        },

        'div.modal span.facebook-signin-button a': {
          click: function(event, $element) {
            event.preventDefault();
            var redirect = $element.attr('href');
            Gowalla.Facebook.login(redirect);
          }
        }
      };

      if ($('#modal_sign_in').length) SignIn.setup();
      if ($('.signup-validation-wrapper').length) SignUp.setup();

      attachObservers(observers, $(document.body), this);
    },

    open: function(modal) {
      $modal = interpret(modal);
      $('.modal').hide();
      $modal.show();
    },

    close: function(modal) {
      $modal = interpret(modal);
      $modal.hide();
    },

    _close: function(event, $element) {
      var $modal = $element.closest('div.modal');
      this.close($modal);
      event.preventDefault();
    }
  };

})();

Gowalla.Map = (function($) {

  function h(str) {
    if (!str) return "";
    return str.replace(/\&/gi, '&amp;').replace(/\"/gi, "\&quot;").replace(/\>/gi, "&gt;").replace(/\</gi, "&lt;");
  }

  function _letterForIndex(i) {
    return String.fromCharCode("A".charCodeAt(0) + i);
  }

  var CODE_A = "A".charCodeAt(0), CODE_Z = "Z".charCodeAt(0);

  function makeIcon(letter) {
    if (typeof letter === 'number') {
      letter = _letterForIndex(letter);
    }

    var code = letter.charCodeAt(0), url;
    if (code > CODE_Z || code < CODE_A) {
      url = "http://www.google.com/mapfiles/marker.png";
    } else {
      url = "http://www.google.com/mapfiles/marker" + letter + ".png";
    }

    return new M.MarkerImage(url, new M.Size(20, 34), null, new M.Point(9, 34), null);
  }

  function clone(object) {
    return $.extend({}, object);
  }

  function makeResponder(property, that) {
    var opt = that.options;
    return function() {
      if (opt.handlers[property] && !that._ignoreEvents) {
        return opt.handlers[property].apply(that.map, arguments);
      }
    };
  }

  var M;
  var DEFAULT_OPTIONS = {
    SETUP: {
      selector: '#map',
      handlers: {},
      styled: false
    },
    MAP: {
      zoom:      12
    },
    MARKER: {

    }
  };

  $(document).ready(function () {
    M = google.maps;
    $.extend(DEFAULT_OPTIONS, {
      MAP: {
        zoom:      12,
        mapTypeId: M.MapTypeId.ROADMAP
      }
    });
  });

  var EVENTS = ('bounds_changed center_changed click dblclick drag dragend ' +
   'dragstart idle maptypeid_changed mousemove mouseout mouseover ' +
   'projection_changed resize rightclick tilesloaded zoom_changed').split(' ');


  function interpretLatLng(latlng) {
    var GLL = google.maps.LatLng;
    if (latlng instanceof GLL) return latlng;
    return new GLL(latlng[0], latlng[1]);
  }

  return {
    setup: function(options) {
      if (this._initialized) return;
      options = $.extend(clone(DEFAULT_OPTIONS.SETUP), options || {});
      this.options = options;

      this.element = $(options.selector)[0];

      var mapOptions = clone(DEFAULT_OPTIONS.MAP);
      if (options.center)  mapOptions.center  = interpretLatLng(options.center);
      if (options.zoom)    mapOptions.zoom    = options.zoom;
      if (options.maxZoom) mapOptions.maxZoom = options.maxZoom;

      if (options["static"]) {
        $.extend(mapOptions, {
          disableDefaultUI: true,
          disableDoubleClickZoom: true,
          draggable: false,
          scrollwheel: false,
          keyboardShortcuts: false,
          streetViewControl: false
        });
      }

      this.map = new M.Map(this.element, mapOptions);

      if (options.styled) {
        this.styledMapType = new M.StyledMapType(Gowalla.Map.STYLE);
        this.map.mapTypes.set('gowalla', this.styledMapType);
        this.map.setMapTypeId('gowalla');
      }

      var handlers = options.handlers, that = this;

      $.each(EVENTS, function(i, eventName) {
        M.event.addListener(that.map, eventName, makeResponder(eventName, that));
      });

      this.spots = [];

      this._markerShadow = new M.MarkerImage(
        "http://www.google.com/mapfiles/shadow50.png",
        new M.Size(37, 34),
        null,
        new M.Point(9, 34),
        null
      );

      this._activeInfoWindow = null;
      this._initialized = true;
    },

    setOptions: function(options) {
      $.extend(this.options, options || {});
      return this.options;
    },

    clearSpots: function() {
      if (this._activeInfoWindow) this._activeInfoWindow.close();
      $.each(this.spots, function(i, spot) { if (spot.marker) spot.marker.setMap(null); });
      this.spots = [];
    },

    ignoreEvents: function(bool) {
      this._ignoreEvents = bool;
    },

    addPoint: function(lat, lng, options) {
      options = $.extend(clone(DEFAULT_OPTIONS.MARKER), options || {});
      var point  = new M.LatLng(lat, lng);
      options = $.extend({ position: point, map: this.map }, options);
      if ('letter' in options) {
        options.icon = makeIcon(options.letter);
        options.shadow = this._markerShadow;
        delete options.letter;
      }
      var marker = new M.Marker(options);

      if (options.onclick) {
        M.event.addListener(marker, 'click', function() {
          options.onclick.apply(this, [marker, this.map]);
        });
      }

      if (options.ondragend) {
        M.event.addListener(marker, 'dragend', function() {
          options.ondragend.apply(this, [marker, this.map]);
        });
      }

      marker.setMap(this.map);
      return marker;
    },

    addSpot: function(spot, options) {
      if (this._inSpotsList(spot)) return null;
      this.spots.push(spot);
      options = options || {};
      if (spot.name && !options.title) {
        options.title = h(spot.name);
      }

      if (options.infoWindow) {
        delete options.infoWindow;
        var oldOnClick = options.onclick;
        options.onclick = function(marker, map) {
          if (oldOnClick) oldOnClick.apply(this, arguments);
        };
      }

      var marker = this.addPoint(spot.lat, spot.lng, options);
      spot.marker = marker;
      return marker;
    },

    zoomAndCenter: function() {
      var spots = this.spots;
      if (spots.length === 0) return;

      var sortedSpots = spots.slice(0);
      var n = sortedSpots.sort(function(a, b){ return b.lat - a.lat; })[0].lat;
      var e = sortedSpots.sort(function(a, b){ return b.lng - a.lng; })[0].lng;
      var s = sortedSpots.sort(function(a, b){ return a.lat - b.lat; })[0].lat;
      var w = sortedSpots.sort(function(a, b){ return a.lng - b.lng; })[0].lng;

      var sw = new M.LatLng(s, w), ne = new M.LatLng(n, e);
      var bounds = new M.LatLngBounds(sw, ne);
      this.map.fitBounds(bounds);

      if (this.map.getZoom() > 16) this.map.setZoom(16);
    },

    setBounds: function(bounds) {
      this.map.fitBounds(bounds);
    },

    _inSpotsList: function(spot) {
      if (!spot.url) return false;
      var result = false;
      $.each(this.spots, function(i, s) {
        if (s.url === spot.url) result = true;
      });
      return result;
    },

    openModal: function(spot) {
      this.$modal.show();

      this.$modal.bind('click.modal', function(event) {
        var $target = $(event.target);
        if ($target.is('.modal')) this.closeModal();
      }.bind(this));

      if (!this._initialized) {
        Gowalla.Map.setup({
          center: [spot.lat, spot.lng],
          zoom: 16,
          maxZoom: 16,
          handlers: {
            tilesloaded: function() {
            }
          }
        });
        Gowalla.Map.addSpot(spot);
      }
    },

    closeModal: function() {
      this.$modal.hide();
      $(document).unbind('.modal');
      this.$modal.unbind('.modal');
      event.preventDefault();
    },

    setupModal: function() {
      if (this._modalInitialized) return;
      this.$modal = $('#map-overlay');
      $('#map-overlay-trigger').click( function(event) {
        var json = $(this).attr('data-spot');
        var spot = $.parseJSON(json);
        Gowalla.Map.openModal(spot);
        event.preventDefault();
        $(document).bind('keydown.modal', function(event) {
          if (event.keyCode !== 27) return;
          close.call(Gowalla.Map, event);
        });
      });

      var KEY = { LEFT: 37, RIGHT: 39, ESC: 27 };

      this.$modal.delegate('a.close', 'click', this.closeModal.bind(this));
      this._modalInitialized = true;
    }

  };

})(jQuery);























Gowalla.Tooltips = (function($) {

  return {
    _initialized: false,

    setup: function() {
      if (this._initialized) return;
      var that = this;
      $(document.body).
        delegate(
          '*[data-tooltip]', 'mouseenter',
          function(event) { that._mouseenter.call(this, event); }
        ).
        delegate(
          '*[data-tooltip]', 'mouseleave',
          function(event) { that._mouseleave.call(this, event); }
        ).
        delegate(
          '*[data-tooltip]', 'mousedown',
          function(event) { that._mouseleave.call(this, event); }
        );

      this._initialized = true;
    },

    _mouseenter: function(event) {
      var $target = $(this);
      var tooltipId = $target.attr('data-tooltip');
      var $tooltip = $('#' + tooltipId);
      Gowalla.Tooltips._showTooltip($tooltip, $target);
    },

    _showTooltip: function($tooltip, $target) {
      if (!$tooltip.length) return;

      if ($tooltip[0].parentNode.tagName.toUpperCase() !== 'BODY')
        this._relocateTooltip($tooltip);

      var pos = $tooltip.attr('data-position');
      pos = pos || "center top";

      $tooltip.show();

      var innerWidth = $tooltip.find('span').outerWidth();
      if (innerWidth > 0) $tooltip.css('width', innerWidth);

      $tooltip.position({
        my: "center bottom",
        at: pos,
        of: $target
      });
    },

    _relocateTooltip: function($tooltip) {
      $(document.body).append($tooltip);
    },

    _hideTooltip: function($tooltip) {
      $tooltip.hide();
    },

    _mouseleave: function(event) {
      var $target = $(this);
      var tooltipId = $target.attr('data-tooltip');
      var $tooltip = $('#' + tooltipId);
      Gowalla.Tooltips._hideTooltip($tooltip);
    }
  };

})(jQuery);
Gowalla.Nav = (function() {

  var MENU_TRIGGER_DEFAULT_OPTIONS = {
    mode: 'hover', // 'click' is the other option
    threshold:  400
  };

  function MenuTrigger($trigger, $menu, options) {
    var defaults = $.extend({}, MENU_TRIGGER_DEFAULT_OPTIONS);
    this.options = $.extend(defaults, options || {});

    this.mode = this.options.mode;

    this.$trigger = $trigger;
    this.$menu    = $menu;

    if (this.$trigger.length === 0 || this.$menu.length === 0) return;

    if (this.mode === 'hover') {
      this.$trigger.bind('mouseenter', this._enterTrigger.bind(this));
      this.$trigger.bind('mouseleave', this._leaveTrigger.bind(this));

      this.$menu.bind('mouseenter', this._enterMenu.bind(this));
      this.$menu.bind('mouseleave', this._leaveMenu.bind(this));
    } else {
      $(document).bind('click', this._clickTrigger.bind(this));
    }

  }

  $.extend(MenuTrigger.prototype, {
    _show: function() {
      this.$menu.css('visibility', 'visible');
      this.$menu.css('opacity', '1');

      this.$menu.trigger('gowalla:menu:opened');
    },

    _isOpen: function() {
      return this.$menu.css('visibility') === 'visible';
    },

    _hide: function() {
      this.$menu.css('visibility', 'hidden');
      this.$menu.css('opacity', '0');

      this.$menu.trigger('gowalla:menu:closed');
    },

    _scheduleHide: function() {
      if (this._hideTimeout) return;
      this._hideTimeout = window.setTimeout( function() {
        this._hide();
        this._hideTimeout = null;
      }.bind(this), this.options.threshold);
    },

    _cancelHide: function() {
      if (!this._hideTimeout) return;
      window.clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    },

    _insideTriggerOrMenu: function($target) {
      var target = $target[0], trigger = this.$trigger[0],
       menu = this.$menu[0];

      if (target === trigger || target === menu) return true;
      if ($.contains(trigger, target) || $.contains(menu, target)) return true;

      return false;
    },

    _insideTrigger: function($target) {
      var target = $target[0], trigger = this.$trigger[0];
      return (target === trigger || $.contains(trigger, target));
    },

    _clickTrigger: function(event) {
      var $target = $(event.target);

      var shouldOpen = this._insideTriggerOrMenu($target);
      var isOpen     = this._isOpen();

      if (this._insideTrigger($target)) {
        if (isOpen) shouldOpen = false;

        event.preventDefault();
      }

      if (shouldOpen === isOpen) return;

      if (shouldOpen) {
        this._cancelHide();
        this._show();
      } else {
        this._hide();
      }
    },

    _enterTrigger: function(event) {
      this._cancelHide();
      this._show();
    },

    _leaveTrigger: function(event) {
      var $destination = $(event.relatedTarget);
      if ($destination.is('#passport_menu')) return;
      this._scheduleHide();
    },

    _enterMenu: function(event) {
      this._cancelHide();
    },

    _leaveMenu: function(event) {
      this._scheduleHide();
    }
  });


  var THRESHOLD = 400;

  return {
    setup: function() {

      var $badge = $('.header-notifications a.notifications-badge'),
       $menu = $('.header-notifications dd');

      this._notificationsMenu = new MenuTrigger($badge, $menu, { mode: 'click' });

      this._passportMenu = new MenuTrigger(
        $('.header-user > dt > a'),
        $('.header-user dd'),
        { mode: 'click' }
      );

      $menu.bind('gowalla:menu:opened', function() {
        if (!$badge.hasClass('selected')) return;

        $badge.removeClass('selected').text('');
        var url = $(this).attr('data-url');
        var lastModified = $(this).attr('data-last-modified');
        Gowalla.API.put(url, {
          global: false,

          dataType: 'json',
          headers: { 'If-Modified-Since': lastModified },
          success: function() {
            $('#user_menu .passport .badge').removeClass('selected').text('');
          }
        });
      });
    }

  };

})();

(function() {
  var DEFAULT_OPTIONS = {};

  var observers = {
    click: function(event) {
      event.preventDefault();
    },

    mouseenter: function(event, $element) {
      var dir = $element.hasClass('arrow-r') ? 1 : -1;
      this._slideWaitTimeout = window.setTimeout(function() {
        this._slide(dir);
      }.bind(this), 200);
    },

    mouseleave: function(event, $element) {
      if (this._slideWaitTimeout) {
        window.clearTimeout(this._slideWaitTimeout);
        this._slideWaitTimeout = null;
      }

      if (this._sliding) {
        this._slide(false);
        this._checkArrows();
      }
    },

    mousedown: function(event, $element) {
      this._slide(false);

      var dir = $element.hasClass('arrow-r') ? 2 : -2;

      this._slideWaitTimeout = window.setTimeout(function() {
        this._slide(dir);
      }.bind(this), 50);
    },

    mouseup: function(event, $element) {
      this._slide(false);

      var dir = $element.hasClass('arrow-r') ? 1 : -1;
      this._slideWaitTimeout = window.setTimeout(function() {
        this._slide(dir);
      }.bind(this), 50);
    }
  };

  function makeHandler(handler, that) {
    return function(event) {
      var $element = $(this);
      return handler.call(that, event, $element);
    };
  }


  function Filmstrip($element, options) {
    var defaults = $.extend({}, DEFAULT_OPTIONS);
    this.options = $.extend(defaults, options);

    this.$element = $element;
    this.$list = this.$element.find('ul');

    var $left  = $('<a class="arrow-l"></a>');
    var $right = $('<a class="arrow-r"></a>');

    this.arrows = { $left:  $left, $right: $right };

    this.$element.append($left);
    this.$element.append($right);

    this._listWidth    = this.$list.outerWidth();
    this._elementWidth = this.$element.innerWidth();

    this._maxLeft = 0;
    this._minLeft = this._elementWidth - this._listWidth;

    this._left = 0;
    this._checkArrows();

    this.addObservers();
  }


  $.extend(Filmstrip.prototype, {
    addObservers: function() {

      for (var name in observers) {
        this.$element.delegate('a.arrow-r, a.arrow-l', name + '.filmstrip', makeHandler(observers[name], this));
      }
    },

    removeObservers: function() {
      this.$element.unbind('.filmstrip');
    },

    move: function(delta) {
      var pixelDelta = -delta * this._elementWidth;
      var newLeft = this._left + pixelDelta;

      if (newLeft > this._maxLeft) newLeft = this._maxLeft;
      if (newLeft < this._minLeft) newLeft = this._minLeft;

      this._left = newLeft;

      this.$list.animate({ left: newLeft }, 200);
      this._checkArrows();
    },

    _slide: function(direction) {
      this._sliding = true;

      function tick(newLeft) {
        this._left = newLeft;
        this.$list.css('left', newLeft);
      }

      if (typeof direction === 'number') {
        var increment = 5 * -direction;
        this._slideInterval = window.setInterval(function() {
          var left = this._left;
          if (increment > 0 && left >= this._maxLeft) {
            this._slide(false);
            return;
          }

          if (increment < 0 && left <= this._minLeft) {
            this._slide(false);
            return;
          }

          var newLeft = left + increment;
          if (newLeft > this._maxLeft) newLeft = this._maxLeft;
          if (newLeft < this._minLeft) newLeft = this._minLeft;

          tick.call(this, newLeft);
          if (this._checkArrows()) this._sliding = false;
        }.bind(this), 10);
      } else {
        window.clearInterval(this._slideInterval);
        this._slideInterval = null;
      }
    },

    _checkArrows: function() {
      var a = this.arrows;
      if (this._listWidth <= this._elementWidth) {
        a.$left.hide();
        a.$right.hide();
        return;
      }

      var shouldHideLeft  = this._left === this._maxLeft;
      var shouldHideRight = this._left === this._minLeft;

      shouldHideLeft  ? a.$left.hide()  : a.$left.show();

      shouldHideRight ? a.$right.hide() : a.$right.show();

      return (shouldHideLeft || shouldHideRight);
    }
  });


  $.extend(Filmstrip, {
    setup: function() {
      $('.filmstrip').each( function(i, filmstrip) {
        if ($(filmstrip).data('gowalla_filmstrip')) return;
        var instance = new Filmstrip($(filmstrip));
        $(filmstrip).data('gowalla_filmstrip', instance);
      });
    }
  });


  window.Gowalla.Filmstrip = Filmstrip;
})();

Gowalla.Comments = (function() {


  function makeHandler(handler, scope) {
    return function() {
      var $element = $(this);
      var args = Array.prototype.slice.call(arguments, 0);
      args.push($element);
      return handler.apply(scope, args);
    };
  }

  var COMMENT_SELECTOR = '.comment-item';

  return {
    setup: function() {
      var observers = {
        'form.story-comment-form': {
          'keydown': this._submit,

          'ajax:beforeSend': this._before,
          'ajax:complete':   this._complete,
          'ajax:error':      this._error
        },

        '.comment-item a.delete-button': {
          'ajax:beforeSend': this._deleteComment,
          'ajax:success':    this._deleteCommentSuccess,
          'ajax:error':      this._deleteCommentError
        },

        '.comment-tear': {
          'click': this._unfoldComments
        }
      };

      var $body = $(document.body);
      var events, selector, eventName;
      for (selector in observers) {
        events = observers[selector];
        for (eventName in events) {
          $body.delegate(selector, eventName, makeHandler(events[eventName], this));
        }
      }
    },

    _unfoldComments: function(event, $element) {
      event.preventDefault();
      $element.siblings('li').removeClass('removed');
      $element.remove();
    },

    _deleteComment: function(event, xhr, settings, $anchor) {
      if (this._$comment) return;
      var $comment = $anchor.closest(COMMENT_SELECTOR);
      $comment.css('opacity', '0.5');
      this._$comment = $comment;
    },

    _deleteCommentSuccess: function(event) {
      this._$comment.remove();
      this._$comment = null;
    },

    _deleteCommentError: function(event) {
      this._$comment.css('opacity', '1');
      this._$comment = null;
    },

    _submit: function(event, $form) {
      if (event.type === 'keydown' && event.keyCode !== 13)
        return;

      event.preventDefault();

      if (this._submitting) return;

      var parts = this._getParts($form);


      var val = parts.text.val();
      if (!(/\S/).test(val)) return;

      $form.submit();
    },

    _before: function(event, xhr, settings, $element) {
      if (this._submitting) {
        event.preventDefault();
        return false;
      }

      this._submitting = true;
      this._setEnabled($element, false);
      return true;
    },

    _complete: function(event, xhr, status, $element) {
      this._setEnabled($element, true);
      var parts = this._getParts($element);

      parts.text.val('');

      var $insertionPoint = parts.form.closest('.comment-insertion-point');
      $insertionPoint.before(xhr.responseText);

      parts.text.removeClass('active');

      this._submitting = false;
    },

    _error: function(event, xhr, status, error, $element) {
      this._setEnabled(true, $element);
      this._submitting = false;
    },

    _getParts: function($element) {
      return {
        form: $element,
        text: $element.find('input[name=message], textarea[name=message]')
      };
    },

    _setEnabled: function($form, bool) {
      var parts = this._getParts($form);
      if (bool) {
        parts.text.removeAttr('disabled');
      } else {
        parts.text.attr('disabled', 'disabled');
      }
    },

    setupCommentToggle: function() {
      $(document.body).delegate('.story .meta a.comment', 'click', makeHandler(this._toggleComments, this));

      $('.story ul.comments').each( function(index, ul) {
      });
    },

    _toggleComments: function(event, $element) {
      event.preventDefault();
      var $story = $element.closest('.story');
      var $list  = $story.find('ul.story-comments');

      $list.toggle();
    }
  };

})();
Gowalla.Like = (function() {

  function makeHandler(handler, scope) {
    return function() {
      var $element = $(this);
      var args = Array.prototype.slice.call(arguments, 0);
      args.push($element);
      return handler.apply(scope, args);
    };
  }

  var SELECTED_CLASS_NAME = 'selected';

  return {
    setup: function() {
      this.SELECTOR = "a.like-button";
      this.FACEPILE_SELECTOR = ".facepile";

      var observers = {
        'a.show_like_overlay': {
          'ajax:beforeSend': function(event, xhr, settings, $element) {
          },

          'ajax:complete': function(event, xhr, status, $element) {
            $(document.body).append(xhr.responseText);
          },

          'ajax:error': function() {
          }
        }
      };

      observers[this.SELECTOR] = {
        'click':           this._click,
        'ajax:beforeSend': this._before,
        'ajax:complete':   this._complete,
        'ajax:error':      this._error,
        'gowalla:like:stateChanged': this._stateChange
      };

      observers['.show-sign-up-love-modal'] = {
        click: function(event) {
          event.preventDefault();
          $('#modal_sign_up_love').show();
        }
      };

      var eventName, selector, handlers;
      for (selector in observers) {
        handlers = observers[selector];
        for (eventName in handlers) {
          $(document.body).delegate(selector, eventName,
           makeHandler(handlers[eventName], this));
        }
      }
    },

    _click: function(event, $element) {
      if ($element.hasClass('disabled')) {
        event.stopPropagation();
        event.preventDefault();
      }
    },

    _before: function(event, xhr, settings, $element) {
      this._setActive($element, !this._isActive($element));
    },

    _complete: function(event, xhr, status, $element) {
    },

    _error: function(event, xhr, status, error, $element) {
      this._setEnabled($element, true);
    },

    _setEnabled: function($element, bool) {
      bool ? $element.removeClass('disabled') : $element.addClass('disabled');
    },

    _isActive: function($element) {
      return $element.hasClass(SELECTED_CLASS_NAME);
    },

    _setActive: function($element, bool) {
      if (bool) {
        $element.addClass(SELECTED_CLASS_NAME);
        $element.attr('data-method', 'delete');
      } else {
        $element.removeClass(SELECTED_CLASS_NAME);
        $element.attr('data-method', 'post');
      }

      $element.trigger('gowalla:like:stateChanged', [$element.attr('href'), bool]);

    },

    _setFacepileCount: function($element, delta) {
      var $facepile = $element.closest('ul').find('ul.like-button-facepile');
      var $num = $facepile.find('li.facepile-count a');
      var count = Number($num.text());

      count += delta;

      $facepile.toggleClass('n0',    count === 0);
      $facepile.toggleClass('liked', delta > 0);
      $num.text(count);
    },


    _stateChange: function(event, url, state, $element) {
      var $likes     = $(this.SELECTOR);

      $likes.each( function(i, like) {
        var $like = $(like);

        if ($like.attr('href') !== url) return;

        if (this._isActive($like) !== state) this._setActive($like, state);
        this._setFacepileCount($element, state ? 1 : -1);
      }.bind(this));
    },

    _getFacepile: function($like) {
      var url = $like.attr('href');
      return $(this.FACEPILE_SELECTOR).filter( function() {
        return $(this).attr('data-url') === url;
      });
    },

    _getCount: function($facepile) {
      var $likeCount = $facepile.find('.like_count a');
      var num = Number($likeCount.text());
      return isNaN(num) ? 0 : num;
    }
  };

})();
/*
  This Javascript is used to populate facebook auth token via popup.
  you can call Gowalla.Facebook.auth() to activate a popup

  to log a user in call Gowalla.Facebook.login()

  to create a user via their facebook credentials call Gowalla.Facebook.create_user()

  in the controller get the auth token by calling fb_graph_params["access_token"]

*/

Gowalla.Facebook = (function() {

  return {
    API_KEY: null,
    setup: function() {
      if (!window.FB) {
        alert("Facebook is not loaded!");
        return;
      }

      FB.init({
        appId:  this.API_KEY,
        status: true,
        cookie: true,
        xfbml:  true
      });
    },

    auth: function(callback) {
      FB.login(function(response) {
        if (!response.session) return;
        var perms = response.perms;
        if (!perms || perms.indexOf("publish_stream") === -1 ||
         perms.indexOf("offline_access") === -1) return;

        if (callback) callback();

      }, {
        perms: "user_birthday,user_hometown,publish_stream,offline_access,publish_checkins, email,user_checkins"
      });

    },

    create_user: function() {
      Gowalla.Facebook.auth(function() {
        window.location.href = '/facebook_callbacks/create';
      });
    },

    login: function() {
      Gowalla.Facebook.auth(function() {
        window.location.href = '/facebook_callbacks/login';
      });
    },

    update: function() {
      Gowalla.Facebook.auth(function() {
        window.location.href = '/facebook_callbacks/update';
      });
    },

    VisitorOnFacebook: function() {
      var fb_logged_in;
      FB.getLoginStatus(function(response) {
        fb_logged_in = response.status != "unknown";
      });
      return fb_logged_in;
    }
};
})();
Gowalla.PhotoViewer = (function() {

  var KEY = { LEFT: 37, RIGHT: 39, ESC: 27 };

  function makeHandler(handler, scope) {
    return function() {
      var $element = $(this);
      var args = Array.prototype.slice.call(arguments, 0);
      args.push($element);
      return handler.apply(scope, args);
    };
  }

  function attachObservers(observers, $tag, scope) {
    var events, selector, eventName;
    for (selector in observers) {
      events = observers[selector];
      for (eventName in events) {
        $tag.delegate(selector, eventName, makeHandler(events[eventName], scope));
      }
    }
  }

  function modifierKeysUsed(event) {
    return event.altKey || event.shiftKey || event.metaKey || event.ctrlKey;
  }


  return {
    setup: function(single) {
      if (this._initialized) return;
      this.PHOTO_SELECTOR   = 'a.photo-trigger';
      this.OVERLAY_SELECTOR = 'div#photo-overlay';
      this.$overlay = $(this.OVERLAY_SELECTOR);

      this._scan();

      var observers = {};
      observers[this.PHOTO_SELECTOR] = {
        'ajax:beforeSend': this._photoBefore,
        'ajax:complete':   this._photoComplete,
        'ajax:error':      this._photoError
      };

      var overlayObservers = {
        'a.close': { click: this._close },
        'a.arrow-left, a.arrow-right': {
          'ajax:beforeSend': this._navigate,
          'ajax:complete':   this._photoComplete,
          'ajax:error':      this._photoError
        }
      };

      attachObservers(observers,        $(document.body), this);
      attachObservers(overlayObservers, this.$overlay,    this);

      this._handleHash();

      $(document.body).bind('gowalla:page:loaded', makeHandler(this._scan, this));

      this._initialized = true;
    },

    _scan: function() {
      this.buckets = { global: [] };

      var $photos = $(this.PHOTO_SELECTOR);

      $photos.each(function(index, photo) {
        var bucket = $(photo).attr('data-bucket') || 'global';
        if (!(bucket in this.buckets)) this.buckets[bucket] = [];
        this.buckets[bucket].push(photo);
      }.bind(this));

      var bucket;
      for (var name in this.buckets) {
        bucket = this.buckets[name];
        $.each(bucket, function(index, photo) {
          $.data(photo, 'photo-viewer-bucket', name);
          $.data(photo, 'photo-viewer-index', index);
        });
      }
    },

    _handleHash: function() {
      var hash = window.location.hash.replace('#', '');
      if (hash.charAt(0) !== 'p') return;

      var $img = $('.' + hash);
      if (!$img.length) return;

      var $anchor = $img.closest('a.photo-trigger');
      if (!$anchor.length) return;
      $anchor.click();
    },

    _photoBefore: function(event, xhr, settings, $element) {
      settings.dataTypes.unshift('html');

      var index  = $element.data('photo-viewer-index');
      var bucket = $element.data('photo-viewer-bucket');
      if (typeof index !== 'number') event.preventDefault();
      this._openPhoto(index, bucket);
    },

    _photoComplete: function(event, xhr, status, $element) {
      this.$overlay.html(xhr.responseText);

      var index  = this._currentIndex, bucket = this._currentBucket;
      var photos = this._getAdjacentPhotos(index, bucket);

      window.setTimeout(function() {
        var $left  = this.$overlay.find('a.arrow-left');
        var $right = this.$overlay.find('a.arrow-right');

        if (!photos.prev && !photos.next) {
          $left.hide();
          $right.hide();
        } else {
          var $prev = $(photos.prev);
          var $next = $(photos.next);

          $left.data('photo-viewer-index', $prev.data('photo-viewer-index'));
          $left.data('photo-viewer-bucket', this._currentBucket);

          $right.data('photo-viewer-index', $next.data('photo-viewer-index'));
          $right.data('photo-viewer-bucket', this._currentBucket);

          $left.attr( 'href', $prev.attr('href')).show();
          $right.attr('href', $next.attr('href')).show();
        }


      }.bind(this), 0);
    },

    _getAdjacentPhotos: function(index, bucket) {
      var data = this.buckets[bucket];
      var lastIndex = data.length - 1;
      if (lastIndex === 0) return { next: null, prev: null };

      var nextIndex = index + 1, prevIndex = index - 1;

      if (prevIndex < 0) prevIndex = lastIndex;
      if (nextIndex > lastIndex) nextIndex = 0;

      return {
        next: data[nextIndex],
        prev: data[prevIndex]
      };
    },

    _photoError: function(event, xhr, status, error, $element) {
      this.$overlay.hide();
    },

    _openPhoto: function(index, bucket) {
      this._currentIndex  = index;
      this._currentBucket = bucket;
      this.open();
    },

    _close: function(event) {
      event.preventDefault();
      this.close();
    },

    open: function() {
      this.$overlay.show();

      $(document).unbind('.photo_viewer_keys');
      $(document).bind('keydown.photo_viewer_keys', makeHandler(this._keydown, this));
      $(this.$overlay).bind('click.overlay', makeHandler(this._handleClick, this));
    },

    _handleClick: function(event, $element) {
      var $target = $(event.target);
      if ($target.is('.overlay')) this.close();
    },

    close: function() {
      this.$overlay.html('').hide();
      $(document).unbind('.photo_viewer_keys');
      this.$overlay.unbind('click.overlay');
    },

    _keydown: function(event, $element) {
      if (modifierKeysUsed(event)) return;
      var consumed = true;
      switch (event.keyCode) {
        case KEY.LEFT:
          this.$overlay.find('a.arrow-left').click();
          break;
        case KEY.RIGHT:
          this.$overlay.find('a.arrow-right').click();
          break;
        case KEY.ESC:
          this.close();
          break;
        default:
          consumed = false;
      }

      if (consumed) event.preventDefault();
    },

    _navigate: function(event, xhr, settings, $element) {
      settings.dataTypes.unshift('html');
      var index  = $element.data('photo-viewer-index');
      var bucket = $element.data('photo-viewer-bucket');
      this._openPhoto(index, bucket);
    }
  };

})();

Gowalla.Lists = (function() {

  function makeHandler(handler, scope) {
    return function() {
      var $element = $(this);
      var args = Array.prototype.slice.call(arguments, 0);
      args.push($element);
      return handler.apply(scope, args);
    };
  }


  function attachObservers(observers, $tag, scope) {
    var events, selector, eventName;
    for (selector in observers) {
      events = observers[selector];
      for (eventName in events) {
        $tag.delegate(selector, eventName, makeHandler(events[eventName], scope));
      }
    }
  }

  return {
    setup: function() {
      if (this._initialized) return;
      this.containerSelector = '.add-to-list-menu';
      this.triggerSelector   = '.new-list-button';
      this.formSelector      = '.new-list-form';

      this._menu = new Gowalla.DelegationMenu(
        '.add-to-list-menu',
        'dt > .list-button',
        'dd',
        { mode: 'click' }
      );

      var observers = {
        '.show-sign-up-list-modal': {
          click: function(event) {
            event.preventDefault();
            $('#modal_sign_up_list').show();
          }
        }
      };

      observers[this.containerSelector + ' li a.toggle'] = {
        'ajax:beforeSend': this._addSpotBefore,
        'ajax:complete':   this._addSpotComplete,
        'ajax:error':      this._addSpotError
      };

      observers[this.containerSelector + ' ' + this.formSelector] = {
        'ajax:beforeSend': this._createBefore,
        'ajax:complete':   this._createComplete,
        'ajax:error':      this._createError
      };

      observers[this.containerSelector + ' ' + this.triggerSelector] = {
        click: this._clickNewList
      };

      observers[this.containerSelector] = {
        'gowalla:menu:opened': function(event, $menu, $trigger) {
          $menu.position({
            my: 'center top',
            at: 'center bottom',
            of: $trigger,
            collision: 'none',
            offset: "0 10"
          });
        }
      };

      attachObservers(observers, $(document.body), this);
      this._initialized = true;
    },

    _getForm: function($element) {
      return $element.closest(this.containerSelector).find(this.formSelector);
    },

    _getContainer: function($element) {
      return $element.closest(this.containerSelector);
    },

    _getParts: function($container) {
      return {
        form:    $container.find(this.formSelector),
        trigger: $container.find(this.triggerSelector)
      };
    },

    _toggleForm: function(bool, $element) {
      var $container = this._getContainer($element),
       $parts = this._getParts($container);

      $parts.form.toggle(bool);
      $parts.trigger.toggle(!bool);
    },

    _addSpotBefore: function(event, xhr, settings, $element) {
      if ($element.data('addPending')) {
        event.preventDefault();
        return false;
      }

      $element.data('addPending', true);

      $element.toggleClass('selected');
      $element.addClass('working');

      settings.dataTypes.unshift('html');
    },

    _addSpotComplete: function(event, xhr, status, $element) {
      var html = xhr.responseText;
      $element.replaceWith(html);
    },

    _addSpotError: function(event, xhr, status, error, $element) {
      $element.data('addPending', false);
    },

    _clickNewList: function(event, $element) {
      event.preventDefault();
      this._toggleForm(true, $element);

      var $container = this._getContainer($element),
       $parts = this._getParts($container);

      window.setTimeout( function() {
        $parts.form.find('input[type=text]:first').focus();
      }.bind(this), 10);
    },

    _createBefore: function(event, xhr, settings, $element) {
      if (this._creationPending) {
        event.preventDefault();
        return false;
      }
      this._creationPending = true;
      $element.addClass('selected');

      var $container = this._getContainer($element),
       $parts = this._getParts($container);

      $parts.form.find('input').attr('disabled', 'disabled').addClass('working');
      return true;
    },

    _createComplete: function(event, xhr, status, $element) {
      var html = xhr.responseText;

      var $container = this._getContainer($element),
       $parts = this._getParts($container);

      var $form = $parts.form;

      $form.closest('li').before(html);

      $form.find('input[type=text]').val('');
      this._toggleForm(false, $element);
      this._creationPending = false;
      $form.find('input').removeAttr('disabled').removeClass('working');
    },

    _createError: function(event, xhr, status, error, $element) {
      this._creationPending = false;
    }
  };

})();


Gowalla.EditList = (function() {

  function makeHandler(handler, scope) {
    return function() {
      var $element = $(this);
      var args = Array.prototype.slice.call(arguments, 0);
      args.push($element);
      return handler.apply(scope, args);
    };
  }


  function attachObservers(observers, $tag, scope) {
    var events, selector, eventName;
    for (selector in observers) {
      events = observers[selector];
      for (eventName in events) {
        $tag.delegate(selector, eventName, makeHandler(events[eventName], scope));
      }
    }
  }


  return {
    setup: function() {
      this.$container = $('#list_waypoints');
      this.$form = $('#list_form');

      this.ITEM_SELECTOR = 'div.collection-item';
      this.UPDATE_LIST_PATH = this.$container.attr('data-url');
      this.ADD_WAYPOINT_PATH = $('#waypoint_search').attr('data-url');

      this.$container.sortable({
        axis: 'y',
        items:  this.ITEM_SELECTOR,
        handle: '.drag-button',
        change: function(event, ui) {
          var $placeholder = this.$container.find('.ui-sortable-placeholder');
          var $helper      = this.$container.find('.ui-sortable-helper');
        }.bind(this),

        update: function(event, ui) {
          this._renumberWaypoints();
          this._reorderWaypoints();
        }.bind(this)

      });

      var observers = {
        'a.delete-button': {
          click: this._removeWaypoint
        },

        '#list_form': {
          submit: this._submit
        }
      };

      var $button = $('#list_submit_button');

      var that = this;
      $button.click( function(event) {
        event.preventDefault();
        that._addWaypointDescriptions();
        $('#list_form').submit();
      });

      attachObservers(observers, $('#list_waypoints'), this);

      $('#waypoint_search').gSearchAutocomplete({
        types: 'Spots',
        limit: 10,
        showMore: false,
        select: function(event, ui) {
          var item = ui.item;
          var data = { spot_id: ui.item.id, edit: '1' };

          $.ajax({
            url: this.ADD_WAYPOINT_PATH,
            type: 'post',
            data: data,
            dataType: 'html',

            success: function(data, status, xhr) {
              this.$container.append(data);
            }.bind(this),

            error: function() {
            }
          });

        }.bind(this)
      });
    },

    _removeWaypoint: function(event, $element) {
      event.preventDefault();
      var $item = $element.closest(this.ITEM_SELECTOR),
       id = $item.attr('data-waypoint-id'),
       url = $element.attr('href');

      $item.addClass('working').css('opacity', '0.5');

      $.ajax({
        url: url,
        type: 'delete',
        success: function(data, status, xhr) {
          $item.remove();
          this._renumberWaypoints();
        }.bind(this)
      });

    },

    _renumberWaypoints: function() {
      function setNumber($element, number) {
        $element.find('.header-title a.number').text(number + '.');
      }

      this.$container.find(this.ITEM_SELECTOR).each( function(i, element) {
        setNumber($(element), i + 1);
      });
    },

    _collectWaypoints: function() {
      var waypoints = this.$container.find(this.ITEM_SELECTOR).map( function(i, element) {
        return $(element).attr('data-waypoint-id');
      });
      return waypoints.toArray();
    },

    _reorderWaypoints: function() {
      var waypoints = this._collectWaypoints().join(',');

      $.ajax({
        url: this.UPDATE_LIST_PATH,
        type: 'put',
        data: { positions: waypoints },
        success: function(data, status, xhr) {
        },

        error: function() {
        }
      });
    },

    _collectWaypointDescriptions: function() {
      var $items = this.$container.find(this.ITEM_SELECTOR);
      var table = {};

      $items.each( function(i, item) {
        var waypointId = $(item).attr('data-waypoint-id');
        var description = $(item).find('input.waypoint-description-input').val();
        table[waypointId] = description;
      });
      return table;
    },

    _addWaypointDescriptions: function() {
      function makeHiddenInput(name, value) {
        var $input = $('<input type="hidden" name="' + name + '" value="">');
        $input.val(value);
        return $input;
      }

      var table = this._collectWaypointDescriptions();
      var $input;
      for (var key in table) {
        $input = makeHiddenInput("waypoints[" + key + "]", table[key]);
        this.$form.append($input);
      }
    }
  };

})();
Gowalla.Highlights = (function() {

  function makeHandler(handler, scope) {
    return function() {
      var $element = $(this);
      var args = Array.prototype.slice.call(arguments, 0);
      args.push($element);
      return handler.apply(scope, args);
    };
  }


  function attachObservers(observers, $tag, scope) {
    var events, selector, eventName;
    for (selector in observers) {
      events = observers[selector];
      for (eventName in events) {
        $tag.delegate(selector, eventName, makeHandler(events[eventName], scope));
      }
    }
  }

  var DEFAULT_OPTIONS = {
    addHTML: true
  };

  return {
    setup: function(options) {
      var defaults = $.extend({}, DEFAULT_OPTIONS);
      this.options = $.extend(defaults, options);

      this.CONTAINER_SELECTOR = 'div.add-highlight-form';
      this.FORM_SELECTOR      = "form.add-highlight";
      this.TRIGGER_SELECTOR   = ".highlights-menu > dt";
      this.MENU_SELECTOR      = ".highlights-menu dd";

      this._menu = new Gowalla.DelegationMenu(
        this.CONTAINER_SELECTOR,
        this.TRIGGER_SELECTOR,
        this.MENU_SELECTOR,
        { mode: 'click' }
      );


      var observers = {};
      observers[this.CONTAINER_SELECTOR + ' a.highlight-form-button'] = {
        click: this._submit
      };

      observers[this.CONTAINER_SELECTOR + ' ' + this.FORM_SELECTOR] = {
        'ajax:beforeSend': this._before,
        'ajax:success':    this._success,
        'ajax:error':      this._error
      };

      observers[this.CONTAINER_SELECTOR + ' .highlights-menu .highlight-type-trigger'] = {
        'click': this._chooseType
      };

      attachObservers(observers, $(document.body), this);
    },

    _submit: function(event, $button) {
      event.preventDefault();
      this._getForm($button).submit();
    },

    _getContainer: function($element) {
      return $element.closest(this.CONTAINER_SELECTOR);
    },

    _getForm: function($element) {
      return $element.closest(this.CONTAINER_SELECTOR).find(this.FORM_SELECTOR);
    },

    _getInsertionPoint: function($div) {
      if (this.options.insertionPointSelector)
        return $div.siblings(this.options.insertionPointSelector);

      return $div.closest('.section-content').find('.highlights-collection');
    },

    _before: function(event, xhr, settings, $element) {
      if (this._submitting) {
        event.preventDefault();
        return;
      }
      var $form = this._getForm($element);
      this._submitting = true;
      this._setEnabled(false, $form);
      settings.dataTypes.unshift('html');
    },

    _success: function(event, data, status, xhr, $element) {
      var $form = this._getForm($element), $div = this._getContainer($element);
      this._setEnabled(true, $form);

      $form.find('.highlight-comment').val('').blur();

      if (status === 'success' && this.options.addHTML) {
        var html = xhr.responseText;
        var $insertionPoint = this._getInsertionPoint($div);
        var $highlight = $(html);
        $insertionPoint.prepend($highlight);
        $insertionPoint.trigger('gowalla:highlight:added', [$highlight]);
      }
    },

    _error: function(event, xhr, status, error, $element) {
      var $form = this._getForm($element);
      this._setEnabled(true, $form);
    },

    _chooseType: function(event, $element) {
      var $container = this._getContainer($element),
       $form = this._getForm($element);

      event.preventDefault();

      window.setTimeout(function() { this._menu._hideAll(); }.bind(this), 0);

      var id = $element.attr('data-type-id');
      var $field = $form.find('.highlight-highlight-type');
      $field.val(id);

      var src = $element.find('img').attr('src');
      $container.find('.highlight-type-button').css('background-image', 'url("' + src + '")');
    },

    _setEnabled: function(bool, $form) {
      var $input = $form.find('.highlight-comment');
      if (bool) {
        $input.removeAttr('disabled').removeClass('working');
      } else {
        $input.attr('disabled', 'disabled').addClass('working');
      }
    }
  };


})();

(function() {

  var DEFAULT_OPTIONS = {
    buttonSelector: '.more-button',

    horizontalRule: false,

    smoothScroll:   false
  };

  var BUTTON_DISABLED_CLASS = 'working';

  function P(element, options) {
    var defaults = $.extend({}, DEFAULT_OPTIONS);
    this.options = $.extend(defaults, options || {});

    var opt = this.options;

    this.$element = $(element);
    this.$buttons = this.$element.find(opt.buttonSelector);

    if (!this.$buttons.length) this.$buttons = $(opt.buttonSelector);

    if (!this.$element.length) return;

    this.url = opt.url || this.$element.attr('data-url');

    this.currentPage = opt.currentPage || Number(this.$element.attr('data-page') || 1);
    this.totalPages  = opt.totalPages  || (Number(this.$element.attr('data-total-pages')) || null);

    if (opt.currentPage) this.$element.attr('data-page', opt.currentPage);
    if (opt.totalPages)  this.$element.attr('data-total-pages', opt.totalPages);

    this._determineButtonVisibility();

    if (!this.url || this.url === "") {
      this.$element.removeAttr('data-url');
      this.$buttons.remove();
    }

    var that = this;
    this.$element.delegate(opt.buttonSelector, 'click', function(event) {
      that.loadMoreItems(event);
      event.preventDefault();
    });
  }

  $.extend(P.prototype, {
    _setButtonEnabled: function(bool) {
      var $buttons = this.$buttons;
      if (bool) {
        $buttons.removeClass(BUTTON_DISABLED_CLASS);
      } else {
        $buttons.addClass(BUTTON_DISABLED_CLASS);
      }
    },

    loadMoreItems: function(event) {
      var $element = this.$element;
      var $button = $(event.target).closest(this.options.buttonSelector);

      if ($button.hasClass('disabled')) return;

      this._setButtonEnabled(false);

      this.url = $element.attr('data-url');
      if (!this.url || this.url === "") return;
      this.currentPage = Number($element.attr('data-page'));

      this.totalPages = $element.attr('data-total-pages');
      this.totalPages = (this.totalPages === "") ? null : Number(this.totalPages);

      var data = {};
      if (this.currentPage) data.page = this.currentPage + 1;

      var that = this;

      $.ajax({
        url: this.url,
        dataType: 'html',
        data: data,

        beforeSend: function(xhr) {
          xhr.setRequestHeader('X-Requested-With', 'XmlHttpRequest');
          xhr.setRequestHeader('Accept', 'text/html');
        },

        success: function(html, status, xhr) {
          if (that.options.horizontalRule) {
            $element.append('<hr />');
          }
          $element.append(html);

          that._setButtonEnabled(true);

          if (that.currentPage) {
            $element.attr('data-page', that.currentPage + 1);
          } else {
            var header = xhr.getResponseHeader('X-Next-URL');
            if (header) {
              $element.attr('data-url', header);
            } else {
              that._onLastPage = true;
            }
          }

          if (that._determineButtonVisibility()) {
            $element[0].appendChild(that.$buttons[0]);
          }

          if (that.options.smoothScroll) {
            $.scrollTo(that.$element.find('.page:last'), { duration: 600 });
          }

          $element.trigger('gowalla:page:loaded');
        },

        error: function(error) {
          that._setButtonEnabled(true);
        }
      });
    },

    _determineButtonVisibility: function() {
      var bool;
      if (this._onLastPage) {
        bool = true;
      } else {
        this.currentPage = Number(this.$element.attr('data-page') || 1);
        this.totalPages  = (Number(this.$element.attr('data-total-pages')) || null);

        bool = (this.totalPages && (this.currentPage >= this.totalPages));
      }

      if (bool) this.$buttons.remove();
      return !bool;
    }
  });


  Gowalla.LivePaginator = P;
})();

Gowalla.Follow = (function() {
  function makeHandler(handler, scope) {
    return function() {
      var $element = $(this);
      var args = Array.prototype.slice.call(arguments, 0);
      args.push($element);
      return handler.apply(scope, args);
    };
  }


  function attachObservers(observers, $tag, scope) {
    var events, selector, eventName;
    for (selector in observers) {
      events = observers[selector];
      for (eventName in events) {
        $tag.delegate(selector, eventName, makeHandler(events[eventName], scope));
      }
    }
  }

  return {
    setup: function() {
      var observers = {
        'a.follow-button': {
          'ajax:beforeSend': this._beforeSend,
          'ajax:success':    this._success,
          'ajax:error':      this._error
        }
      };

      attachObservers(observers, $(document), this);
    },

    _setPending: function($element, bool) {
      $element.data('working', bool);
      $element.toggleClass('disabled', bool);
      $element.toggleClass('working',  bool);

      if ($element.hasClass("selected") || $element.hasClass("pending")) {
        $element.text("Unfollowing...");
      } else {
        $element.text("Following...");
      }
    },

    _beforeSend: function(event, xhr, settings, $element) {
      if ($element.data('working')) {
        event.preventDefault();
        return false;
      }

      this._setPending($element, true);
      settings.dataTypes.unshift('html');
    },

    _success: function(event, data, status, xhr, $element) {
      $element.replaceWith(xhr.responseText);
    },

    _error: function(event, xhr, status, error, $element) {
      this._setPending($element, false);
    }
  };

})();
Gowalla.Stories = (function() {

  function makeHandler(handler, scope) {
    return function() {
      var $element = $(this);
      var args = Array.prototype.slice.call(arguments, 0);
      args.push($element);
      return handler.apply(scope, args);
    };
  }


  function attachObservers(observers, $tag, scope) {
    var events, selector, eventName;
    for (selector in observers) {
      events = observers[selector];
      for (eventName in events) {
        $tag.delegate(selector, eventName, makeHandler(events[eventName], scope));
      }
    }
  }


  return {
    setup: function() {
      this.OVERLAY_SELECTOR = '#users-overlay';
      var observers = {
        '.story-users-list': {
          'ajax:before':     this._before,
          'ajax:beforeSend': this._beforeSend,
          'ajax:success':    this._success,
          'ajax:error':      this._error
        }
      };

      attachObservers(observers, $(document.body), this);
    },

    _before: function(event, settings, $element) {
      settings.dataType = 'html';
      if (settings.dataTypes) settings.dataTypes.unshift('html');
    },

    _beforeSend: function(event, xhr, settings, $element) {

      $(this.OVERLAY_SELECTOR).html('');
      Gowalla.Modal.open(this.OVERLAY_SELECTOR);

    },

    _success: function(event, data, status, xhr, $element) {
      $(this.OVERLAY_SELECTOR).html(data);
    },

    _error: function(event, xhr, status, error, $element) {
      Gowalla.Modal.close(this.OVERLAY_SELECTOR);
    }

  };

})();
