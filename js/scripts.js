/* eslint-disable no-console */

(function() {
  // #region Respository Functions
  // *****************************
  function createListItem(i, item) {
    return $(`<li><button id=${i} class="list-box_button">${item.breed}</button></li>`);
  }
  function createImage(imageURL) {
    return $(`<div class="card"><img class="card__img" src="${imageURL}"></img></div>`);
  }
  // #endregion Respository Functions

  // Setup dogRepository from API
  const dogRepository = (function() {
    const repository = [];
    const apiURL = 'https://dog.ceo/api/breeds/list/all';
    const apiImageURL = 'https://dog.ceo/api/breed/';

    // #region Respository Functions
    // *****************************

    // Add dog from into repository
    function add(addedBreed) {
      repository.push(addedBreed);
    }

    // load API JSON data
    function loadList() {
      return $.ajax(apiURL, { dataType: 'json' }).then(function(response) {
        $.each(response.message, function(breed, subBreed) {
          const dog = {
            breed,
            subBreed,
          };
          add(dog);
        });
        return response;
      });
    }

    // Load data from repository
    function getAll() {
      return repository;
    }

    function loadImages(item) {
      const breed = repository[item];
      return $.ajax(`${apiImageURL + breed.breed}/images/random/50`).then(function(response) {
        breed.images = [];
        $.each(response.message, function(i, imageURL) {
          breed.images.push(imageURL);
        });
        return response;
      });
    }
    // #endregion Respository Functions

    return {
      loadList,
      add,
      getAll,
      loadImages,
    };
  })();

  // Init Repository
  dogRepository.loadList().then(function() {
    const dogRep = dogRepository.getAll();
    // For each breed create li with button
    $.each(dogRep, function(i, breed) {
      $('#dog-list').append(createListItem(i, breed));
    });
    // Add event listener to button to retrieve imageURLs
    $('body').on('click', '.list-box_button', function() {
      $('.list-select__option').text($(this).text());
      dogRepository.loadImages($(this).attr('id')).then(function(response) {
        $('.card-box').empty();
        $.each(response.message, function(i, imageURL) {
          $('.card-box').append(createImage(imageURL));
        });
      });
    });
  });
  // Select Button Logic
  let listOn = false;
  $('.list-select__arrow').on('click', function() {
    if (listOn) {
      $('#dog-list').animate({ height: '0px', opacity: '0.4' }, 'slow');
      $(this)
        .children()
        .removeClass('r-180')
        .addClass('r-0');
      listOn = false;
    } else {
      if ($(window).width() < 800) {
        $('#dog-list').animate({ height: '300px', opacity: '1' }, 'slow');
      } else {
        $('#dog-list').animate({ height: '100%', opacity: '1' }, 'slow');
      }
      $(this)
        .children()
        .removeClass('r-0')
        .addClass('r-180');
      listOn = true;
    }
  });
})();
