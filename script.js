var $tabs = $('.tabs > div'), _currhash, $currTab;

function showTab() {
   if($currTab.length>0) {  
     $tabs.removeClass('active');
     $currTab.addClass('active');
   }
}
/* find the tabs and 'unlink' the id to prevent page jump */
$tabs.each(function() {
   var _id = $(this).attr('id');
   $(this).attr('id',_id+'_tab');
   /* eg we have given the tab an id of 'tab1_tab' */
});

/* set up an anchor 'watch' for the panels */
function anchorWatch() {
  if(document.location.hash.length>0) {
    /* only run if 'hash' has changed */
    if(_currhash!==document.location.hash) {
       _currhash = document.location.hash;
       /* we only want to match the 'unlinked' id's */
       $currTab = $(_currhash+'_tab');
       showTab();
   }
  }
} 
setInterval(anchorWatch,300);