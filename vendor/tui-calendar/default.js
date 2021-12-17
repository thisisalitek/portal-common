function renderScheduler(ScheduleList) {
  
  cal.setCalendars(CalendarList);

  setRenderRangeText();
  cal.clear();
  
  
  cal.createSchedules(ScheduleList);
  refreshScheduleVisibility();
  setEventListener();
}

function getDataAction(target) {
  return target.dataset ? target.dataset.action : target.getAttribute('data-action');
}

function setDropdownCalendarType() {
  var calendarTypeName = document.getElementById('calendarTypeName');
  var calendarTypeIcon = document.getElementById('calendarTypeIcon');
  var options = cal.getOptions();
  var type = cal.getViewName();
  var iconClassName;

  if (type === 'day') {
    type = 'Daily';
    iconClassName = 'calendar-icon ic_view_day';
  } else if (type === 'week') {
    type = 'Weekly';
    iconClassName = 'calendar-icon ic_view_week';
  } else if (options.month.visibleWeeksCount === 2) {
    type = '2 weeks';
    iconClassName = 'calendar-icon ic_view_week';
  } else if (options.month.visibleWeeksCount === 3) {
    type = '3 weeks';
    iconClassName = 'calendar-icon ic_view_week';
  } else {
    type = 'Monthly';
    iconClassName = 'calendar-icon ic_view_month';
  }

  calendarTypeName.innerHTML = type;
  calendarTypeIcon.className = iconClassName;
}

function onClickMenu(e) {
  var target = $(e.target).closest('a[role="menuitem"]')[0];
  var action = getDataAction(target);
  var options = cal.getOptions();
  var viewName = '';

  switch (action) {
    case 'toggle-daily':
      viewName = 'day';
      break;
    case 'toggle-weekly':
      viewName = 'week';
      break;
    case 'toggle-monthly':
      options.month.visibleWeeksCount = 0;
      viewName = 'month';
      break;
    case 'toggle-weeks2':
      options.month.visibleWeeksCount = 2;
      viewName = 'month';
      break;
    case 'toggle-weeks3':
      options.month.visibleWeeksCount = 3;
      viewName = 'month';
      break;
    case 'toggle-narrow-weekend':
      options.month.narrowWeekend = !options.month.narrowWeekend;
      options.week.narrowWeekend = !options.week.narrowWeekend;
      viewName = cal.getViewName();

      target.querySelector('input').checked = options.month.narrowWeekend;
      break;
    case 'toggle-start-day-1':
      options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
      options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
      viewName = cal.getViewName();

      target.querySelector('input').checked = options.month.startDayOfWeek;
      break;
    case 'toggle-workweek':
      options.month.workweek = !options.month.workweek;
      options.week.workweek = !options.week.workweek;
      viewName = cal.getViewName();

      target.querySelector('input').checked = !options.month.workweek;
      break;
    default:
      break;
  }

  cal.setOptions(options, true);
  cal.changeView(viewName, true);

  setDropdownCalendarType();
  setRenderRangeText();
  setSchedules();
}

function onClickNavi(e) {
  var action = getDataAction(e.target);

  switch (action) {
    case 'move-prev':
      cal.prev();
      break;
    case 'move-next':
      cal.next();
      break;
    case 'move-today':
      cal.today();
      break;
    default:
      return;
  }

  setRenderRangeText();
  setSchedules();
}

function setRenderRangeText() {
  var renderRange = document.getElementById('renderRange');
  var options = cal.getOptions();
  var viewName = cal.getViewName();
  var html = [];
  if (viewName === 'day') {
    html.push(moment(cal.getDate().getTime()).format('YYYY.MM.DD'));
  } else if (viewName === 'month' &&
    (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
    html.push(moment(cal.getDate().getTime()).format('YYYY.MM'));
  } else {
    html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
    html.push(' ~ ');
    html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
  }
  renderRange.innerHTML = html.join('');
}

function setSchedules() {
  cal.clear();
  
  cal.createSchedules(ScheduleList);
  refreshScheduleVisibility();
}


function refreshScheduleVisibility() {
  var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

  CalendarList.forEach(function(calendar) {
    cal.toggleSchedules(calendar.id, !calendar.checked, false);
  });

  cal.render(true);

  calendarElements.forEach(function(input) {
    var span = input.nextElementSibling;
    span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
  });
}

resizeThrottled = tui.util.throttle(function() {
  cal.render();
}, 50);

function setEventListener() {
  $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
  $('#menu-navi').on('click', onClickNavi);
  window.addEventListener('resize', resizeThrottled);
}


const schedulerTemplates = {
    popupIsAllDay: function() {
      return 'Tüm gün';
    },
    popupStateFree: function() {
      return 'Free';
    },
    popupStateBusy: function() {
      return 'Busy';
    },
    titlePlaceholder: function() {
      return 'Konu';
    },
    locationPlaceholder: function() {
      return 'Lokasyon';
    },
    startDatePlaceholder: function() {
      return 'Başlangıç';
    },
    endDatePlaceholder: function() {
      return 'Bitiş';
    },
    popupSave: function() {
      return 'Kaydet';
    },
    popupUpdate: function() {
      return 'Güncelle';
    },
    popupDetailDate: function(isAllDay, start, end) {
      // var isSameDate = moment(start).isSame(end);
      // var endFormat = (isSameDate ? '' : 'YYYY.MM.DD ') + 'hh:mm a';

      // if (isAllDay) {
      //   return moment(start).format('YYYY.MM.DD') + (isSameDate ? '' : ' - ' + moment(end).format('YYYY.MM.DD'));
      // }

      return (moment(start).format('YYYY-MM-DD hh:mm') + ' - ' + moment(end).format('YYYY-MM-DD hh:mm'));
    },
    // popupDetailDate: function(isAllDay, start, end) {
    //   var isSameDate = moment(start).isSame(end);
    //   var endFormat = (isSameDate ? '' : 'YYYY.MM.DD ') + 'hh:mm a';

    //   if (isAllDay) {
    //     return moment(start).format('YYYY.MM.DD') + (isSameDate ? '' : ' - ' + moment(end).format('YYYY.MM.DD'));
    //   }

    //   return (moment(start).format('YYYY.MM.DD hh:mm a') + ' - ' + moment(end).format(endFormat));
    // },
    popupDetailLocation: function(schedule) {
      return 'Lokasyon : ' + schedule.location;
    },
    popupDetailUser: function(schedule) {
      return 'Kullanıcı : ' + (schedule.attendees || []).join(', ');
    },
    popupDetailState: function(schedule) {
      return 'Durum : ' + schedule.state || 'Busy';
    },
    popupDetailRepeat: function(schedule) {
      return 'Makine : ' + schedule.recurrenceRule;
    },
    popupDetailBody: function(schedule) {
      return 'Detay : ' + schedule.body;
    },
    popupEdit: function() {
      return 'Düzenle';
    },
    popupDelete: function() {
      return 'Sil';
    }
}


// function hazirla(){
//   var schedule = new ScheduleInfo();

//   schedule.id = chance.guid();
//   schedule.calendarId = 1;

//   schedule.title = 'uretim emri 0001';
//   schedule.body ='body bolumu';
//   schedule.isReadOnly = false;
//   schedule.start=new Date();
//   schedule.end=new Date();
//   schedule.end.setHours(schedule.end.getHours()+3); 
//   schedule.isAllday=false;
//   schedule.category = 'time';
//   //generateTime(schedule, renderStart, renderEnd);

//   schedule.isPrivate = false;
//   schedule.location = 'lokasyon';
//   schedule.attendees = ['ali','chris','babek'];
//   schedule.recurrenceRule = '--recurrenceRule--';
//   schedule.state = 'Bekliyor';
//   schedule.color = '#ffffff';
//   schedule.bgColor ='#03bd9e';
//   schedule.dragBgColor = '#03bd9e';
//   schedule.borderColor = '#03bd9e';

//   schedule.raw.memo = 'memo bolumuuu';
//   schedule.raw.creator.name = 'creatorname';
//   schedule.raw.creator.avatar = 'avatari';
//   schedule.raw.creator.company = 'creator company';
//   schedule.raw.creator.email = 'creator@email';
//   schedule.raw.creator.phone = '0553 352 10 42';

//   // if (chance.bool({ likelihood: 20 })) {
//   //     var travelTime = chance.minute();
//   //     schedule.goingDuration = travelTime;
//   //     schedule.comingDuration = travelTime;
//   // }

//   ScheduleList.push(schedule);
// }

//init();
