seajs.config({
    base:'/',
    alias: {
      '$': 'lib/$',
      'event': 'lib/event',
      'router': 'main/router',
      'entry': 'main/entry',
      'pagemanager': 'main/pagemanager',
      'template': 'main/template',
      'apptemplate': 'app/view/compiled/view'
    }
});