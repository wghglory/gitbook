function ClassName() {
  this.doms = {
    lastOnline: document.querySelector('.lastOnline'),
    indicator: document.querySelector('.indicator'),
    indicatorModal: document.querySelector('.indicator-modal')
  };
  this.doms.indicatorTable = this.doms.indicatorModal.querySelector('table');
  this.doms.thead = this.doms.indicatorTable.tHead;
  this.doms.tbody = this.doms.indicatorTable.tBodies[0];

  this.init();
}

ClassName.prototype = {
  constructor: ClassName,
  init: function() {
    this.loadData();
    this.bindEvents();
  },
  setModalPosition: function(dom) {
    var indicatorPosition = getPosition(dom.indicator);
    dom.indicatorModal.style.left =
      indicatorPosition.left - dom.indicatorModal.offsetWidth + dom.indicator.offsetWidth + 'px';
    dom.indicatorModal.style.top = indicatorPosition.top + dom.indicator.offsetHeight + 10 + 'px';
  },
  setIndicatorColor: function(date) {},
  loadData: function() {
    var instance = this;
    var href = location.href;

    // load modal window detail
    ajax('get', href.slice(0, href.lastIndexOf('/')) + '/data/indicator.json', '', function(data) {
      instance.bindIndicatorModalDOM(data);
    });
  },
  bindIndicatorModalDOM: function(data) {
    var instance = this;

    var strHead = '';
    var strBody = '';
    strHead += '<tr><th>' + data.head[0] + '</th><th>' + data.head[1] + '</th><th>' + data.head[2] + '</th></tr>';

    for (var i = 0; i < data.body.length; i++) {
      var activity = instance.setIndicatorColor(new Date(data.body[i].lastActiveDate));
      strBody +=
        '<tr><td>' +
        data.body[i].product +
        '</td><td><span class="activity ' +
        activity.className +
        '" data-diff="' +
        activity.diff +
        '"></span></td><td>' +
        data.body[i].lastActiveDate +
        '</td></tr>';
    }

    instance.doms.thead.innerHTML = strHead;
    instance.doms.tbody.innerHTML = strBody;

    this.bindToolip();
  },
  bindEvents: function() {
    var indicatorTimer = null;
    var indicatorModalTimer = null;
    var instance = this;
    var dom = this.doms;
    dom.indicator.onmouseenter = function() {
      //hold on .5s to display
      indicatorTimer = setTimeout(function() {
        dom.indicatorModal.style.display = 'block';
        instance.setModalPosition(dom);
      }, 500);
    };
    dom.indicator.onmouseleave = function() {
      clearTimeout(indicatorTimer);

      indicatorModalTimer = setTimeout(function() {
        dom.indicatorModal.style.display = 'none';
      }, 500);
    };
    dom.indicatorModal.onmouseenter = function() {
      //fast move from icon to modal window, keep modal open
      clearTimeout(indicatorModalTimer);
      dom.indicatorModal.style.display = 'block';
    };
    dom.indicatorModal.onmouseleave = function() {
      clearTimeout(indicatorModalTimer);
      dom.indicatorModal.style.display = 'none';
    };
  },
  bindToolip: function() {
    var activityTR = this.doms.indicatorModal.querySelectorAll('.activity');
    for (var i = 0; i < activityTR.length; i++) {
      activityTR[i].onmouseover = function() {
        this.innerHTML = this.dataset.diff + ' days';
        this.classList.remove('activity');
        this.classList.add('diffTip');
      };
      activityTR[i].onmouseout = function() {
        this.innerHTML = '';
        this.classList.remove('diffTip');
        this.classList.add('activity');
      };
    }
  }
};

new ClassName();
