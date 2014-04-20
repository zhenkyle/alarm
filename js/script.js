
/* -------------------------------------
 * Stay-focused App
 * Version: 1.0.2
 *
 * Copyright (c) 2013 Peiwen Lu
 * Released under the MIT Licence
 * https://github.com/P233/stay-focused-app
 * ------------------------------------- */

$(function(){

/* -------------------------------------
 * Initialise
 * ------------------------------------- */

function initialise(){
  var projectName = localStorage.getItem("project"),
      displayDate = localStorage.getItem("display_date"),
      dateFormat  = localStorage.getItem("date_format"),
      timeFormat  = localStorage.getItem("time_format"),
      clockTick   = localStorage.getItem("clock_tick"),
      voiceNotice = localStorage.getItem("voice_notice"),
      metronome   = localStorage.getItem("metronome");

  if (projectName == null) {
    $('#show_project_name').text('Haven\'t set project name.');
    $('#set_project_name').val("").attr('placeholder', 'Haven\'t set project name.');
  } else {
    $('#show_project_name').text(projectName);
    $('#set_project_name').attr('placeholder', projectName);
  }

  if (displayDate == null) {
    $('#show_deadline').text('Haven\'t set deadline.');
    $('#set_deadline').val("").attr('placeholder', 'Haven\'t set deadline.');
  } else {
    $('#set_deadline').attr('placeholder', displayDate);
  }

  if (dateFormat == null) {
    localStorage.setItem('date_format', 'us');
    $('#us').prop('checked', true);
  } else {
    $('#' + dateFormat).prop('checked', true);
  }

  if (timeFormat == null) {
    localStorage.setItem('time_format', 'hrs_12');
    $('#hrs_12').prop('checked', true);
  } else {
    $('#' + timeFormat).prop('checked', true);
  }

  if (clockTick == null) {
    localStorage.setItem('clock_tick', 'clock_tick_on');
    $('#clock_tick_on').prop('checked', true);
  } else {
    $('#' + clockTick).prop('checked', true);
  }

  if (voiceNotice == null) {
    localStorage.setItem('voice_notice', 'voice_on');
    $('#voice_on').prop('checked', true);
  } else {
    $('#' + voiceNotice).prop('checked', true);
  }

  if (metronome == null) {
    localStorage.setItem('metronome', '0');
    $('#metronome_0').prop('checked', true);
  } else {
    $('#metronome_' + metronome).prop('checked', true);
  }
}initialise();

/* -------------------------------------
 * Preferences
 * ------------------------------------- */

$('#project').on('click', function(){
  $('#preferences').slideToggle('medium', function(){

    // Save project name
    $('#set_project_name').on({
      focus: function(){
        $(window).off();
      },
      blur: function(){
        var projectName = $(this).val();
        if (projectName.length != 0){
          localStorage.setItem('project', projectName);
          $('#show_project_name').text(projectName);
          $(this).val("").attr('placeholder', projectName);
        }
        $(window).on('keypress', listenKeypress);
      }
    });

    // Check format
    var dateFormat  = localStorage.getItem("date_format"),
        timeFormat  = localStorage.getItem("time_format"),
        setDateFormat, setDateOrder, setTimeFormat, setTimeWheels;

    if (dateFormat == 'us') {
      if (timeFormat == 'hrs_12') {
        setDateFormat = 'mm/dd/y',
        setDateOrder  = 'mmddy',
        setTimeFormat = 'hh:ii A',
        setTimeWheels = 'hhiiA';
      } else {
        setDateFormat = 'mm/dd/y',
        setDateOrder  = 'mmddy',
        setTimeFormat = 'HH:ii',
        setTimeWheels = 'HHii';
      }
    } else {
      if (timeFormat == 'hrs_12') {
        setDateFormat = 'dd/mm/y',
        setDateOrder  = 'ddmmy',
        setTimeFormat = 'hh:ii A',
        setTimeWheels = 'hhiiA';
      } else {
        setDateFormat = 'dd/mm/y',
        setDateOrder  = 'ddmmy',
        setTimeFormat = 'HH:ii',
        setTimeWheels = 'HHii';
      }
    }

    // Mobiscroll
    var now = new Date();
    $('#set_deadline').mobiscroll().datetime({
      minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      theme: 'android-ics',
      display: 'modal',
      animate: 'flip',
      mode: 'scroller',
      dateFormat: setDateFormat,
      dateOrder: setDateOrder,
      timeFormat: setTimeFormat,
      timeWheels: setTimeWheels
    }).on('focus', function(){
      $(this).mobiscroll('show');
      $('#set_button').on('click', function(){
        var startDate   = new Date(),
            finishDate  = $('#set_deadline').mobiscroll('getDate'),
            displayDate = $('#set_deadline').val();
        localStorage.setItem('start_date', startDate);
        localStorage.setItem('finsih_date', finishDate);
        localStorage.setItem('display_date', displayDate);
        clearTimeout(projectTimer);
        percentageCalculator();
      });
      return false;
    });

    $('input[name="date_format"]').on('click', function(){
      var dateFormat = $(this).attr('id');
      localStorage.setItem('date_format', dateFormat);
    });

    $('input[name="time_format"]').on('click', function(){
      var timeFormat = $(this).attr('id');
      localStorage.setItem('time_format', timeFormat);
    });

    $('input[name="clock_tick"]').on('click', function(){
      var clockTick = $(this).attr('id');
      localStorage.setItem('clock_tick', clockTick);
    });

    $('input[name="voice_notice"]').on('click', function(){
      var voiceNotice = $(this).attr('id');
      localStorage.setItem('voice_notice', voiceNotice);
    });

    $('input[name="metronome"]').on('click', function(){
      var metronome = $(this).attr('id').slice(-1);
      localStorage.setItem('metronome', metronome);
    });
  });
});

/* -------------------------------------
 * Percentage Calculator
 * ------------------------------------- `*/

var projectTimer;

function percentageCalculator(){
  var currentDate = Date.parse(new Date()),
      finishDate  = Date.parse(localStorage.getItem("finsih_date")),
      timeLeft    = finishDate - currentDate;

  if (isNaN(timeLeft)) {
    return false;
  } else if (timeLeft > 0) {
    var startDate  = Date.parse(localStorage.getItem("start_date")),
        oneDay     = 1000 * 60 * 60 * 24,
        oneHour    = 1000 * 60 * 60,
        dayLeft    = Math.floor(timeLeft / oneDay),
        hourLeft   = Math.floor((timeLeft % oneDay) / oneHour),
        percentage = parseInt((currentDate - startDate )/(finishDate - startDate) * 100, 10);

    if (dayLeft == 1) {
      dayLeft = "1 day ";
    } else if (dayLeft == 0) {
      dayLeft = "";
    } else {
      dayLeft = dayLeft + " days ";
    }

    if (hourLeft == 1) {
      hourLeft = "1 hour left";
    } else if (hourLeft == 0 && dayLeft != 0) {
      hourLeft = "left";
    } else if (hourLeft == 0 && dayLeft == 0) {
      hourLeft = "Less than 1 hour left";
    } else {
      hourLeft = hourLeft + " hours left";
    }

    $("#show_deadline").text(dayLeft + hourLeft);
    $("#progress_bar").progressbar({value: percentage});
    // console.log(percentage);

    projectTimer = setTimeout(percentageCalculator,1000*60*10);
  } else {
    $("#show_deadline").text("Project time up!");
    $("#progress_bar").progressbar({value: 100});
    var projectName = localStorage.getItem("project");
    Stz.notifyMe_({title:projectName, subtitle:'', content:'Project time up!'});
    // console.log('Project time up!');
  }
}percentageCalculator();

/* -------------------------------------
 * Countdown Timer
 * ------------------------------------- */

$('#start').on('click', function(){
  var cdTime         = parseInt($('#set_time').val(), 10),
      clockTick      = localStorage.getItem("clock_tick"),
      tickSound      = document.getElementById('clock_tick'),
      metronomeSound = document.getElementById('metronome'),
      timeUpSound    = document.getElementById('time_up');


  if (cdTime >= 1 && cdTime <= 60) {
    if (clockTick == 'clock_tick_on') {
      tickSound.play();
    }

    $(this).hide();
    $('#pause').show();

    cdTime = (cdTime < 10) ? "0" + cdTime : cdTime;
    $('#screen').text(cdTime + ":00");

    var localTime = new Date();
    localTime.setMinutes(cdTime - 1, 59, 0);

    var timer, resume;

    function countdown(){
      var m = localTime.getMinutes();
      var s = localTime.getSeconds();
      m = (m < 10) ? "0" + m : m;
      s = (s < 10) ? "0" + s : s;

      $('#screen').text(m + ":" + s);
      localTime.setSeconds(localTime.getSeconds() - 1);

      var voiceNotice = localStorage.getItem("voice_notice"),
          metronome   = localStorage.getItem("metronome");

      if (voiceNotice == 'voice_on') {
        if ((s == 0 && m % 5 == 0 && m > 0) || (s == 0 && m % 5 == 0 && m % metronome == 0 && m > 0)) {
          m = (m < 10) ? "Only five" : m;
          Stz.executeShellCmd_({path:'/usr/bin/say', command: m + 'minutes left'});
          // console.log('Say ' + m + ' minutes left.');
        } else if (s == 0 && m % 5 != 0 && m % metronome == 0 && m > 0) {
          metronomeSound.play();
        } else if (s == 0 && m == 0) {
          clearInterval(timer);
          clearInterval(resume);
          $('#pause, #resume').hide();
          $('#start').show();
          tickSound.pause();
          Stz.executeShellCmd_({path:'/usr/bin/say', command:'time up'});
          // console.log('Say time up.');
        }
      } else {
        if (s == 0 && m % metronome == 0 && m > 0) {
          metronomeSound.play();
        } else if (s == 0 && m == 0) {
          clearInterval(timer);
          clearInterval(resume);
          $('#pause, #resume').hide();
          $('#start').show();
          tickSound.pause();
          timeUpSound.play();
        }
      }
    }
    timer = setInterval(countdown,1000);

    $('#pause').on('click', function(){
      clearInterval(timer);
      clearInterval(resume);
      $(this).hide();
      $('#resume').show();
      tickSound.pause();
    });
    $('#resume').on('click', function(){
      resume = setInterval(countdown,1000);
      $(this).hide();
      $('#pause').show();

      if (clockTick == 'clock_tick_on') {
        tickSound.play();
      }
    });
    $('#reset').on('click', function(){
      clearInterval(timer);
      clearInterval(resume);
      $('#screen').text('00:00');
      $('#pause, #resume').hide();
      $('#start').show();
      tickSound.pause();
    });
  } else {
    alert('Please input countdown time between 1 and 60 minutes.');
  }
});

/* -------------------------------------
 * Sortable and Editable To-do List
 * http://web.koesbong.com/2011/01/24/sortable-and-editable-to-do-list-using-html5s-localstorage/
 *
 * Author: Koes Bong
 * ------------------------------------- */

var i = Number(localStorage.getItem('todo-counter')) + 1,
  j = 0,
  k,
  $form = $('#add_entry_form'),
  $itemList = $('#task_list'),
  $editable = $('.editable'),
  $clearAll = $('#clear'),
  $newTodo = $('#set_task'),
  order = [],
  orderList;

// Load todo list
orderList = localStorage.getItem('todo-orders');
orderList = orderList ? orderList.split(',') : [];

for( j = 0, k = orderList.length; j < k; j++) {
  $itemList.append("<p id='" + orderList[j] + "' class='task'><span class='circle'></span><span class='editable'>" + localStorage.getItem(orderList[j]) + "</span></p>");
}

// Add todo
$form.submit(function(e) {
  e.preventDefault();
  $.publish('/add/', []);

  // scroll tasks list to bottom
  var itemListHeight = $itemList[0].scrollHeight;
  $itemList.scrollTop(itemListHeight);
});

$('#set_task').on({
  focus: function(){
    $(window).off();
  },
  blur: function(){
    $itemList.animate({scrollTop: 0}, 'fast');
    $(window).on('keypress', listenKeypress);
  },
  keypress: function(e){
    var pressedKey = e.keyCode;
    if (pressedKey == 9) {
      $('#set_task').focus();
    } else if (pressedKey == 27) {
      $('#reset').click();
    }
  }
});

// Sort todo
var removeIntent = false;
$itemList.sortable({
  // revert: true,
  placeholder: "drop_here",
  over: function() {
    removeIntent = false;
  },
  out: function(event, ui) {
    var thisItem   = ui.item,
        offsetLeft = ui.offset.left;

    if (offsetLeft > 100) {
      removeIntent = true;
      thisItem.css('opacity', '0.3');
    } else {
      thisItem.css('opacity', '1');
    }
  },
  beforeStop: function(event, ui) {
    if (removeIntent == true) {
      var $this = ui.item;
      $.publish('/remove/', [$this]);
    }
  },
  stop: function() {
    $.publish('/regenerate-list/', []);
  }
});

// Edit and save todo
$editable.inlineEdit({
  buttons: '<button class="save">Save</button>',
  save: function(event, data) {
    var $this = $(this);
    localStorage.setItem(
      $this.parent().attr("id"), data.value
    );
    $(window).on('keypress', listenKeypress);
  },
  cancel: function(){
    $(window).on('keypress', listenKeypress);
  }
});

// Clear all
$clearAll.on('click', function() {
  $.publish('/clear-all/', []);
});

// Subscribes
$.subscribe('/add/', function() {
  if ($newTodo.val() !== "") {
    // Take the value of the input field and save it to localStorage
    localStorage.setItem("todo-" + i, $newTodo.val());

    // Set the to_do max counter so on page refresh it keeps going up instead of reset
    localStorage.setItem('todo-counter', i);

    // Append a new list item with the value of the new todo list
    $itemList.append("<p id='todo-" + i + "' class='task'><span class='circle'></span><span class='editable'>" + localStorage.getItem("todo-" + i) + "</span></p>");

    $.publish('/regenerate-list/', []);

    // Hide the new list, then fade it in for effects
    $("#todo-" + i).css('display', 'none').fadeIn();

    // Empty the input field
    $newTodo.val("");
    i++;
  }
});

$.subscribe('/remove/', function($this) {
  var thisId = $this.attr('id');

  // Remove todo list from localStorage based on the id of the clicked element
  localStorage.removeItem("'" + thisId + "'");

  // Remove the list item from DOM
  $this.remove();
  $.publish('/regenerate-list/', []);
});

$.subscribe('/regenerate-list/', function() {
  // Empty the order array
  order.length = 0;

  // Go through the list item, grab the ID then push into the array
  $('.task').each(function() {
    var id = $(this).attr('id');
    order.push(id);
  });

  // Convert the array into string and save to localStorage
  localStorage.setItem('todo-orders', order.join(','));
});

$.subscribe('/clear-all/', function(){
  var confirmClear = confirm('Clear all saved data including preferences. Are you sure?');
  if (confirmClear) {
    order.length = 0;
    localStorage.clear();
    $('.task').remove();
    clearTimeout(projectTimer);
    $("#progress_bar").progressbar({value: 0});
    initialise();
  }
});

/* -------------------------------------
 * Hotkey
 * ------------------------------------- */

function listenKeypress(e){
  var pressedKey = e.keyCode;
  if (pressedKey >= 97 && pressedKey <= 122) {
    $('#set_task').focus();
  } else if (pressedKey == 32) {
    e.preventDefault();
    $('#set_task').focus();
  } else if (pressedKey >= 48 && pressedKey <= 57) {
    $('#set_time').focus();
  } else if (pressedKey == 27) {
    $('#reset').click();
  }
}

$(window).on('keypress', listenKeypress);

$('#task_list').on('focus', 'input', function(){
  $(window).off();
});

$('#set_time').on({
  click: function(){
    $(this).select();
  },
  focus: function(){
    $(window).off();
  },
  blur: function(){
    $(window).on('keypress', listenKeypress);
  },
  keypress: function(e){
    var pressedKey = e.keyCode;
    if (pressedKey == 9) {
      $('#set_task').focus();
    } else if (pressedKey == 27) {
      $('#reset').click();
    }
  }
});

// #set_task in line 338

/* -------------------------------------
 * Check for Updates
 * ------------------------------------- */

$.get('http://peters-playground.com/Stay-focused-App/version.xml', function(date){
  var oldVersion = $('#version').text(),
      newVersion = $(date).find('version').text();
  if (oldVersion != newVersion) {
    var confirmDownload = confirm('There is a new version of Stay-focused App available, would you like to download now?');
    if (confirmDownload) {
      Stz.openURL_('http://peters-playground.com/Stay-focused-App/index.html#latest');
    }
  }
});

});