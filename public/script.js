(function () {
  'use strict';

  var GITHUB_USER = 'AndyChanNT';
  var REPOS_URL = 'https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=12';

  var list = document.getElementById('repos-list');
  var status = document.getElementById('repos-status');
  var year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  var THEME_KEY = 'theme';
  var themeToggle = document.getElementById('theme-toggle');

  function syncThemeToggle() {
    var isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }

  if (themeToggle) {
    syncThemeToggle();
    themeToggle.addEventListener('click', function () {
      var isDark = document.body.classList.toggle('dark');
      try {
        sessionStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
      } catch (e) {
        // Storage unavailable: the toggle still works for this page view.
      }
      syncThemeToggle();
    });
  }

  function showStatus(message) {
    status.textContent = message;
    status.hidden = false;
  }

  function repoCard(repo) {
    var item = document.createElement('li');
    item.className = 'card';

    var heading = document.createElement('h3');
    var link = document.createElement('a');
    link.href = repo.html_url;
    link.rel = 'noopener';
    link.textContent = repo.name;
    heading.appendChild(link);

    var description = document.createElement('p');
    description.textContent = repo.description || 'No description provided.';

    var meta = document.createElement('div');
    meta.className = 'card-meta';

    var language = document.createElement('span');
    language.textContent = repo.language || 'Unspecified';

    var stars = document.createElement('span');
    stars.textContent = '★ ' + repo.stargazers_count;
    stars.setAttribute('aria-label', repo.stargazers_count + ' stars');

    meta.appendChild(language);
    meta.appendChild(stars);

    item.appendChild(heading);
    item.appendChild(description);
    item.appendChild(meta);
    return item;
  }

  function loadRepos() {
    if (!list || !status) {
      return;
    }

    fetch(REPOS_URL, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('GitHub API responded with ' + response.status);
        }
        return response.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos) || repos.length === 0) {
          showStatus('No public repositories to show yet.');
          return;
        }
        var fragment = document.createDocumentFragment();
        repos.forEach(function (repo) {
          fragment.appendChild(repoCard(repo));
        });
        list.appendChild(fragment);
        status.hidden = true;
      })
      .catch(function () {
        showStatus('Could not load repositories right now. Please try again later.');
      });
  }

  loadRepos();
})();
