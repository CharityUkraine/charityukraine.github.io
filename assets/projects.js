(function($, jstz) {
  'use strict';

  class Pagination {
    constructor($table, $pagination) {
      this.$table = $table;
      this.$pagination = $pagination;
    }

    attach() {
      let $self = this;

      this.$pagination.find('a.page-link').on('click', function (e) {
        let $this = $(this);

        $self.goTo( $this.attr('href') );

        e.stopPropagation();
        e.preventDefault();
        return false;
      });
    }

    goTo( url, scroll = true ) {
      let $self = this;

      $.ajax({
        url,
        headers: {
          'X-TZ': jstz.determine().name()
        },
        beforeSend() {
          $self.$table.addClass('ba-loader');
          if (document.documentElement.lang === 'en-US') {
            $self.$table.addClass('en-lang-loader');
          } else {
            $self.$table.removeClass('en-lang-loader');
          }
        },
        success( data ) {
          let $newRows = $('<tbody></tbody>');
          data.items.forEach(( el ) => {
            $newRows.append($(
              `<tr><td><div>${el['date']}</div><div class="d-sm-none">${el['customer_email']}</div></td><td class="d-none d-sm-table-cell">${el['customer_email']}</td><td class="text-end"><span class="fw-bold">${el['formatted_amount']}</span></td></tr>`
            ))
          });

          $self.$table.find('tbody').replaceWith($newRows);
          $self.$pagination.find('.pagination').replaceWith($(data.pagination));

          if ( scroll ) {
            const urlObj = new URL( url );
            if ( urlObj.hash ) {
              const $el = $( urlObj.hash );
              if ( $el.length > 0 ) {
                $('html, body').animate({
                  scrollTop: $el.offset().top - 100
                }, 100);
              }
            }
          }

          $self.attach();
        },
        complete() {
          $self.$table.removeClass('ba-loader');
        }
      });
    }
  }

  let projectDonationsTableEl = $('#project-income');
  let projectDonationsPaginationEl = $('#project-donations-pagination');
  if (projectDonationsTableEl && projectDonationsPaginationEl) {
    const projectDonationsPagination = new Pagination(projectDonationsTableEl, projectDonationsPaginationEl);
    projectDonationsPagination.attach();

    const table = projectDonationsTableEl.find('table');
    if ( table.length > 0 ) {
      const url = $( table.get( 0 ) ).data( 'initial-url' );

      if ( url ) {
        projectDonationsPagination.goTo( url, false );
      }
    }
  }

})(jQuery, jstz);
