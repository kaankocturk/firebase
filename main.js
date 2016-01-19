'use strict'
var ref = new Firebase('https://redditkaan.firebaseio.com/');
var postsRef = ref.child('posts');
var $rowref;
var commentsRef;
var commentsobj = {};

$(document).ready(init);
var id = 0;
var commentid=0;
var posts = [];

function init() {
  console.log("hello")
  $('.addpost').click(addpost);
  $('tbody').on('click', 'tr', modal);
  $('#myModal').on('click', '.comment',comment);
  $('.close').click(function(){
    $('#myModal').modal('hide');
  });
}

function modal(){
  var $row = $(this);
  $rowref = $row.data('ref');
  $('.comments p').remove();
  commentsobj = {};
  $('.info1').text('Title: '+$row.children('.title').text());
  $('.info2').text('Content: '+$row.children('.content').text());
  $('.info3').text('Email: '+$row.children('.email').text());
  $('.info4').text('Needs answer by: '+$row.children('.date').text());
  $('#myModal').modal('show');
}

function comment(){
  // commentsRef = postsRef.child($rowref).child('comments');
  //   console.log(commentsRef);
  // commentsRef.push($('#comment').val());
  var thiscomment = "comment"+ commentid;
  if(!commentid){
  commentsobj[thiscomment] = $('#comment').val();
  postsRef.child($rowref).update({
      comments: commentsobj
  });
}
else{
  postsRef.child($rowref).child('comments').push($('#comment').val());
}
commentid++;
}


postsRef.on("value", function(snapshot) {
  console.log(snapshot.val());
  $('tbody tr:not(#template)').remove();
  posts = [];
  $('.comments p').remove();
  snapshot.forEach(function(snap){
    var newpost = snap.val();
    console.log(snap.val().comments);
    var $tr = $('#template').clone().attr('id', 'post'+id).data('ref', snap.key());
    $tr.children('.title').text(newpost.title);
    $tr.children('.content').text(newpost.content);
    $tr.children('.email').text(newpost.email);
    $tr.children('.date').text(newpost.date);
    posts.push($tr);
    var comments = newpost.comments;
    for(var comment in comments){
      $('.comments').append($('<p>').text(comments[comment]));
    }
    $('input').val('');
    id++;
});
    console.log(posts);
    $('tbody').append(posts);
});

function addpost(e) {
  e.preventDefault();
  var title = $('#title').val();
  var content = $('#content').val();
  var email = $('#email').val();
  var date = $('#date').val();
  var post = {title:title, content:content, date:date, email:email}
  postsRef.child("post" + Date.now()).set(post);
}
