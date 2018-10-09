// Generated on 2014-09-17 using generator-angular 0.9.8
'use strict';

var fs = require('fs');


  /*local storage 配置*/
  var localstorageJSPrefix = '/script/',
    localstorageCSSPrefix = '/style/',

    localstoragePriority = [
      {key:'sea',ext:'js',pri:2},
      {key:'app.combo',ext:'js',pri:1}
    ];

  var localStorageRewriteScript=function(contents,filePath,prefix){
    //把源代码转换成一个function
    var filenameArray = filePath.split(/\//).slice(-1)[0].split('.');
    if(filenameArray.length>2){
      //有版本号, 删除版本号
      filenameArray.splice(filenameArray.length-2,1);
    }
    return 'window[\''+prefix+filenameArray.join('.')+'\'] = function(){'+contents+'}';
  };

  var localStorageRewriteIndex=function(contents,prefix){
    var versions = {};
    //javascripts
    var scripts = fs.readdirSync('dist/script'),
        styles = fs.readdirSync('dist/style');

    var assets = scripts.concat(styles);
    //console.log(assets);
    //脚本按照优先级排序
    assets.sort(function(a,b){
      //item.key 和 item.ext 都相同
      var ap = localstoragePriority.filter(function(item){
        if(a.indexOf(item.key)>-1 && (a.split('.').slice(-1)[0] === item.ext)){
          return item;
        }
      });
      var bp = localstoragePriority.filter(function(item){
        if(b.indexOf(item.key)>-1  && (b.split('.').slice(-1)[0] === item.ext)){
          return item;
        }
      });

      if(ap && ap[0]) {
        ap = ap[0].pri;
      }
      else{
        ap = 0;
      }
      if(bp && bp[0]) {
        bp = bp[0].pri;
      }
      else{
        bp = 0;
      }

      return bp-ap;
    });

    for(var i=0;i<assets.length;i++){
      var p = assets[i];
      var filenameArray = p.split('.');
      var ext = filenameArray[filenameArray.length-1],
          version = '',
          filename = '';
      if(filenameArray.length>2){
        //有版本号
        version = filenameArray[filenameArray.length-2];
        filename = filenameArray.slice(0,filenameArray.length-2).join('.')+'.'+ext;
      }
      else{
        filename = p;
      }
      versions[prefix[ext]+filename] = {v:version,cdn:prefix[ext],ext:ext};
    }

    return contents.replace(/\/\*\{\{localstorage\}\}\*\//ig,'window.versions='+JSON.stringify(versions)+';\n'+fs.readFileSync('localstorage.js')).
                    replace(/\/\*\{\{localstorage\-onload\-start\}\}\*\//ig,'window.onlsload=function(){').
                    replace(/\/\*\{\{localstorage\-onload\-end\}\}\*\//ig,'}').
                    replace(/<\!\-\-localstorage\-remove\-start\-\-\>[\s\S]*?<\!\-\-localstorage\-remove\-end\-\-\>/ig,'');
  };

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: 'app',
    dist: 'dist'
  };

  var devhost = 'm.tting.cc';

  var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

  grunt.initConfig({

    yeoman: appConfig,
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/script/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },

      css:{
        files: ['<%= yeoman.app %>/style/**/*.css'],
        tasks: ['newer:jshint:all','rewrite:dist'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      
      view:{
        files: ['<%= yeoman.app %>/view/**/*.html'],
        tasks: ['newer:tmod'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },

      index:{
        files: ['<%= yeoman.app %>/*.html'],
        tasks: ['rewrite:dist'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      
      
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test']
      },
      
      
      gruntfile: {
        files: ['Gruntfile.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },



      autobuildJS: {
        files: ['<%= yeoman.app %>/script/**/*.js'],
        tasks: ['newer:jshint:all','combo'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      autobuildCSS: {
        files: ['<%= yeoman.app %>/style/*.css'],
        tasks: ['useminPrepare','autoprefixer','concat','cssmin','usemin:css'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      autobuildView:{
        files: ['<%= yeoman.app %>/view/**/*.html'],
        tasks: ['newer:tmod','combo'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      autobuildImage: {
        files: ['<%= yeoman.app %>/image/*.{png,jpg,jpeg,gif,webp,svg}'],
        tasks: ['imagemin'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },


      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/image/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 80,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      proxies: [{
        context: '/cgi',
        host: devhost,
        port:8080,
        https: false,
        xforward: false,
        changeOrigion:false
      }],
      rules: [
          // Internal rewrite
          {from: '^/[a-zA-Z0-9/?&=%]*$', to: '/index.html'}
      ],
      livereload: {
        options: {
          open: 'http://localhost/',
          middleware: function (connect) {
            return [
              require('grunt-connect-proxy/lib/utils').proxyRequest,
              rewriteRulesSnippet,
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/spm_modules',
                connect.static('./spm_modules')
              ),
              connect.static(appConfig.app),
              connect.static('.')
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/spm_modules',
                connect.static('./spm_modules')
              ),
              connect.static(appConfig.app),
              connect.static('.')
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '.grunt',
            '<%= yeoman.dist %>/**/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '<%= yeoman.dist %>',
      css:'.tmp/style/*.css'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/style/',
          src: '**/*.css',
          dest: '.tmp/style/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/script/*.js',
          '!**/script/sea.js**',
          '<%= yeoman.dist %>/style/*.css',
          '<%= yeoman.dist %>/image/*.{png,jpg,jpeg,gif,webp,svg}'
          //'<%= yeoman.dist %>/style/font/**/*.{eot,svg,ttf,woff}'
        ]
      }
    },

  // Reads HTML for usemin blocks to enable smart builds that automatically
  // concat, minify and revision files. Creates configurations in memory so
  // additional tasks can operate on them
  // <!-- build:<type>(alternate search path) <path> -->
  // ... HTML Markup, list of script / link tags.
  // <!-- endbuild -->
  //设定处理顺序，html文件
    useminPrepare: {
      html: ['<%= yeoman.app %>/index.html','<%= yeoman.app %>/storage.html'],
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/*.html','<%= yeoman.dist %>/**/*.js'],
      css: ['<%= yeoman.dist %>/**/*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/image','<%= yeoman.dist %>/font']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/style/vendor.css': [
    //         '<%= yeoman.dist %>/style/**/*.css'
    //       ]
    //     }
    //   }
    // },

    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/script/app.combo.js': [
            '<%= yeoman.dist %>/script/app.combo.js'
          ]
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/image',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/image'
        },
        {
          expand: true,
          cwd: '<%= yeoman.app %>/defimage',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/defimage'
        }
        ]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/image',
          src: '**/*.svg',
          dest: '<%= yeoman.dist %>/image'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: false,
          minifyJS:true,
          minifyCSS:true,
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'view/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      part:{
        files: [{
          expand: true,
          //匹配.开头的文件
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            
            '../spm_modules/seajs/2.3.0/dist/sea.js',
            
            '*.js',
            
            //'*.js', //for combo
            'image/**/*.{webp}'
          ]        
        }]
      },
      dist: {
        files: [{
          expand: true,
          //匹配.开头的文件
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.html',            
            '*.js'
          ]        
        }, {//图片
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: ['defimage/*']        
        }, {//图片
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: ['image/*']        
        },{//seajs
          expand:true,
          cwd:'spm_modules/seajs/2.3.0/dist/',
          dest:'<%= yeoman.dist %>/script',
          src:['sea.js']
        },{//字体
          expand:true,
          cwd:'<%= yeoman.app %>/font',
          dest:'<%= yeoman.dist %>/font',
          src:['*.*']
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      server:[],
      dist: {
        tasks:[
        'imagemin',
        'svgmin'
      ]}
    },

    tmod: {
      template: {
        src: '<%= yeoman.app %>/view/**/*.html',
        dest: '<%= yeoman.app %>/view/compiled/view.js',
        options: {
            base: '<%= yeoman.app %>/view',
            minify:false,
            namespace:'apptemplate'
        } 
      }
    },
    
    combo: {
      compress:{
        options: {
          base:'/',
          destPath:'/',
          alias: {
              '$': 'spm_modules/spaseed/1.1.13/lib/$',
              'net': 'spm_modules/spaseed/1.1.13/lib/net',
              'cookie': 'spm_modules/spaseed/1.1.13/lib/cookie',
              'event': 'spm_modules/spaseed/1.1.13/lib/event',
              'querystring':'spm_modules/spaseed/1.1.13/lib/querystring',
              'datamanager': 'spm_modules/spaseed/1.1.13/lib/datamanager',
              'asyncrequest': 'spm_modules/spaseed/1.1.13/lib/asyncrequest',

              'router': 'spm_modules/spaseed/1.1.13/main/router',
              'entry': 'spm_modules/spaseed/1.1.13/main/entry',              

              'config': 'app/script/config',

              'pagemanager': 'app/script/main/pagemanagerwithpageswitcher',
              'pageswitcher': 'spm_modules/spaseed/1.1.13/lib/pageswitcher',
              'manager': 'app/script/model/manager',
              'dialog': 'app/script/module/common/dialog/dialog',
              'util': 'app/script/lib/util',
              // 'clipboard': 'app/script/lib/clipboard',
              'template': 'app/script/main/template',
              'apptemplate': 'app/view/compiled/view',
              'env': 'app/script/main/env'
          },
          dest:'dist/script/app.combo.js'
        },
        files: [{
            expand: true,
            cwd: './',
            src: ['app/script/entry.js','app/script/**/*.js']
        }]
      }
    },
    rewrite: {
      serve:{
        src: '.tmp/*.html',
        editor: function(contents) {
          return contents.replace(/\/\*\{\{userinfo\}\}\*\//ig,'window.userinfo = {};');
        }
      },
      dist: {
        src: 'dist/*.html',
        editor: function(contents) {
          return contents.replace(/<\!\-\-\{\{combo\}\}\-\->/ig,'<script src="/script/app.combo.js"></script>');
        }
      },
      localstorageCDNScript:{
        src:'dist/script/*.js',
        editor:function(contents,filePath){
          return localStorageRewriteScript(contents, filePath, localstorageJSPrefix);
        }
      },
      localstorageCDNIndex:{
          src:'dist/index.html',
          editor:function(contents){
            return localStorageRewriteIndex(contents, {js:localstorageJSPrefix,css:localstorageCSSPrefix});
          }
      }
    },

    'sftp-deploy': {
      'build': {
        auth: {
          host: '119.29.66.228',
          port: 22,
          authKey: 'key2'
        },
        src: 'dist',
        dest: '/usr/local/htdocs/m.tting.cc',
        serverSep: '/',
        exclusions: []
      },
      'build100': {
        auth: {
          host: '192.168.2.100',
          port: 22,
          authKey: 'key1'
        },
        src: 'dist',
        dest: '/usr/local/htdocs/m.fanle.com',
        serverSep: '/',
        exclusions: []
      }
    }
    
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'autoprefixer',
    'useminPrepare',
    'concurrent:dist',
    
    'tmod',
    'jshint',
    
    'copy:dist',
    
    'combo',
    'rewrite:dist',

    'cssmin',

    'usemin',
    'watch'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('ftp', [
    'sftp-deploy:build'
  ]);

  grunt.registerTask('publish', [
    'clean:dist',
    'wiredep',
    'autoprefixer',
    'useminPrepare',
    'concat',
    
    'tmod',
    'jshint',
    
    'copy:dist',
    
    'combo',
    'rewrite:dist',

    'cssmin',
    //混淆
    'uglify',

    //将将静态资源加上随机数，避免浏览器缓存
    'filerev',

    'usemin',

    /*//本地存储
    'rewrite:localstorageCDNScript',
    'rewrite:localstorageCDNIndex',*/

    //压缩
    'htmlmin'
  ]);

  grunt.registerTask('buildjs', [
    'clean:dist',
    'wiredep',
    'autoprefixer',
    'useminPrepare',
    /*'concurrent:dist',*/
    'concat',
    
    'tmod',
    'jshint',
    
    'copy:dist',
    
    'combo',
    'rewrite:dist',

    'cssmin',
    //混淆
    /*'uglify',*/

    //将将静态资源加上随机数，避免浏览器缓存
    'filerev',

    'usemin',

    //本地存储
    /*'rewrite:localstorageCDNScript',
    'rewrite:localstorageCDNIndex',*/

    //压缩
    'htmlmin'
  ]);
};
