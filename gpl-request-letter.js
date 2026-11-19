(function(){
  var b=document.getElementById('print-letter');
  if(b) b.addEventListener('click', function(){ window.print(); });
  var c=document.getElementById('copy-letter');
  var pre=document.getElementById('gpl-letter-text');
  if(c && pre){
    c.addEventListener('click', function(){
      var t=pre.innerText || pre.textContent;
      var done=function(){ c.textContent='Copied'; setTimeout(function(){ c.textContent='Copy the letter'; }, 2000); };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(t).then(done).catch(function(){ /* ignore */ });
      }
    });
  }
})();
