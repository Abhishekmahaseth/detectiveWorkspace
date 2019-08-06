//global vars
var FILE_NAMES = [];
var FILE_CONTENT = [];

var w = window.innerWidth,
    h = window.innerHeight;

/* this svgCanvas will encompass the whole screen (to draw the lines later) */
const body = d3.select('body');
var svg = body.append('svg')
          .attr('width', w)
          .attr('height', h)
          .attr('id', 'svgCanvas');


//open the fileNav when the button is clicked
$('#openMenuBtn').on('click', function(){
  $('.fileNav').css('width', '230px');
  $('#content').css('margin-left', '250px');
});

//close the fileNav when close btn is clicked
$('#closeMenuBtn').on('click', function(){
  $('.fileNav').css('width', '0');
  $('#content').css('margin-left', '0');
});

//read the file
$.getJSON("preProcess/data.json",function(data){


  //data.json has file names and conrtents of that file
  //file content starts with the name of that file
  for(var i = 0; i < data.length; i++)
  {
    var filename = data[i].fileName;
    var id = filename;
    FILE_NAMES.push(filename);
    FILE_CONTENT.push(filename + ' ' + data[i].fileContent);
  }
  populateList(FILE_NAMES);



  /*******************************************************************
  * We cannot display the list of files until we have read data.json *
  *******************************************************************/

  //match the searched file with all of the files then fill the list with result
  $('#searchForm').on('submit', function(e){
    e.preventDefault();

    var file = $('#searchForm input');
    var formData = file.val();
    var srchWordLen = formData.length;
    var srchFileNames = [];

    for(var i = 0; i < FILE_NAMES.length; i++)
    {
      var filename = FILE_NAMES[i];
      var filename_substr = filename.substring(0, srchWordLen);

      if(formData == filename_substr)
      {
        srchFileNames.push(filename);
      }
    }
    $('#list').empty();    //clear the existing <ul>
    populateList(srchFileNames);
  });

  $('#wordSearch').on('submit', function(e){
    e.preventDefault();

    var searchedWord_inFile = [];
    var srcWord = $('#wordSearch input');
    var formData = srcWord.val();

    //highlight the file list when the searched word is within it
    for(i = 0; i < FILE_CONTENT.length; i++)
    {
      filecontent = FILE_CONTENT[i];
      filename = filecontent.substring(0,filecontent.indexOf(' '));
      if(filecontent.indexOf(formData) > -1)
      {
        file_li = document.getElementById(filename);
        file_li.style.backgroundColor = "#4BFFD0";
      }
      else {
        file_li = document.getElementById(filename);
        file_li.style.backgroundColor = "#6912CC";
      }
    }
    
    //regular js code. select the divClass -> returns list of element
    var openTextCont = document.getElementsByClassName('textContainer');
    //read the csv file -> get the list of locations
    //loop thru the elememts -> get the innerHTML -> see if there is any locations
    for(var i = 0; i < openTextCont.length; i++)
    {
      var textContId = $(openTextCont[i]).attr('id');
      var nodes = openTextCont[i].childNodes;
      var text = nodes[1].innerHTML;
      //loops thru each text and puts each city inside a span

      var replace = '<mark>';
      var re = new RegExp(replace,"g");
      text = text.replace(re, '');

      var replace = '</mark>';
      var re = new RegExp(replace,"g");
      text = text.replace(re, '');

      var replace = formData;
      var re = new RegExp(replace,"g");
      text = text.replace(re, '<mark> ' + formData + ' </mark>');
      nodes[1].innerHTML = text;
    }


  });


});


// given a list of files names, dynamically fills the <ul id='list'>
function populateList(fileNames)
{
  //loops thru the list and adds another <li>
  for(var i = 0; i < fileNames.length; i++)
  {
    var filename = fileNames[i];
    var id = filename;
    $('#list').append("<li class=\"files\" id=\"" + id + "\"> <a href=\"#\">"+filename+"</a></li>");
  }

  /*******************************************************************
  * The list of files need to created before the users can select it *
  * to view the content of that file therefore we nest the function  *
  * that handles opening files inside of this function.              *
  *******************************************************************/
  $(".files").on('click', function(){
    var elementId = $(this).attr('id');

    var a = document.getElementById(elementId).childNodes;  //to get the <a>
    a[1].style.color = 'blue';

    for(var i = 0; i < FILE_CONTENT.length; i++)
    {
      filecontent = FILE_CONTENT[i];
      name_to_match = filecontent.substring(0,filecontent.indexOf(' '));

      if(name_to_match == elementId)
      {
        var content = filecontent.substring(filecontent.indexOf(' '));
        createTextBox(elementId, content);
      }
    }
  });
}

function createTextBox(id, fillText)
{
  //link if pressed, the div will close
  var createCloser = "<a href=\'#\'class=\'textContainerClose\' id=\'textContainerClose_" + id + "\'><i class = \'fa fa-close\'></i></a>";

  $('#content').append("<div class = \'textContainer\' id = \'rect" + id + "\'>" + createCloser + "<p>" +fillText+ "</p> </div>");
  var selector = 'rect' + id;
  dragElement(document.getElementById(selector));

  $('.textContainerClose').on('click', function(){
    //close the textContainer
    var elementId = $(this).attr('id');
    var indexOf_ = elementId.indexOf('_');
    var filename = elementId.substring(indexOf_+1, elementId.length);
    var containerId = 'rect' + filename;

    var container_element = document.getElementById(containerId);
    container_element.parentNode.removeChild(container_element);

    var a = document.getElementById(filename).childNodes;   //to get the <a>
    a[1].style.color = 'white';
  });
}


//credits: w3schools.com
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
