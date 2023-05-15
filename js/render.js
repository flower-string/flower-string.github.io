document.addEventListener('pjax:end', function() {
  // 重新初始化不蒜子计数器
  var busuanzi = true;
  (function(){
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(script, s);
  })();
});
