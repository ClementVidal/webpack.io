var path = require('path');
var prevnextPlugin = require('antwar-prevnext-plugin');
var markdown = require('./utilities/markdown');
var highlight = require('./utilities/highlight');

module.exports = {
  template: {
    title: 'webpack'
  },
  assets: [
    {
      from: './fonts',
      to: 'assets'
    }
  ],
  output: 'build',
  title: 'webpack',
  keywords: ['webpack', 'javascript', 'web development', 'programming'],
  pageTitle: function(config, pageTitle) {
    var siteName = config.name;

    if (pageTitle === 'index') {
      return siteName;
    }

    return siteName + ' - ' + pageTitle;
  },
  plugins: [
    prevnextPlugin()
  ],
  layout: function() {
    return require('./components/Body.jsx').default
  },
  paths: {
    '/': root(
      function() {
        return require.context(
          'json!yaml-frontmatter!./content',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),
    concepts: section(
      'Concepts',
      function() {
        return require.context(
          'json!yaml-frontmatter!./content/concepts',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),
    configuration: section(
      'Configuration',
      function() {
        return require.context(
          'json!yaml-frontmatter!./content/configuration',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),
    'how-to': section(
      'How to',
      function() {
        return require.context(
          'json!yaml-frontmatter!./content/how-to',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),
    api: section(
      'API',
      function() {
        return require.context(
          'json!yaml-frontmatter!./content/api',
          false,
          /^\.\/.*\.md$/
        );
      }
    )
  }
}

function root(contentCb) {
  return {
    title: 'Webpack',
    path: function() { // Load path content
      return contentCb();
    },
    processPage: processPage(), // Process individual page (url, content)
    layouts: { // Layouts (page/section)
      page: function() {
        return require('./components/Splash.jsx').default
      }
    },
    redirects: {} // Redirects <from>: <to>
  };
}

function section(title, contentCb) {
  return {
    title: title,
    path: function() {
      return contentCb();
    },
    processPage: processPage(),
    layouts: {
      index: function() {
        return require('./components/Page.jsx').default
      },
      page: function() {
        return require('./components/Page.jsx').default
      }
    },
    redirects: {} // <from>: <to>
  };
}

function processPage() {
  return {
    url: function(o) {
      return o.sectionName + '/' + o.fileName.split('.')[0]
    },
    content: function(o) {
      return markdown().process(o.file.__content, highlight);
    },
    contributors: function(o) {
      return Array.isArray(o.file.contributors) && o.file.contributors.length && o.file.contributors.slice().sort();
    }
  };
}
