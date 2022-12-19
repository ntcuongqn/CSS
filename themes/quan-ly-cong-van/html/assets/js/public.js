
// click to minimize the sidebar or reverse to normal
if (document.querySelector('.sidenav-toggler')) {
    var sidenavToggler = document.getElementsByClassName('sidenav-toggler')[0];
    var sidenavShow = document.getElementsByClassName('g-sidenav-show')[0];
    var toggleNavbarMinimize = document.getElementById('navbarMinimize');
  
    if (sidenavShow) {
      sidenavToggler.onclick = function() {
        if (!sidenavShow.classList.contains('g-sidenav-hidden')) {
          sidenavShow.classList.remove('g-sidenav-pinned');
          sidenavShow.classList.add('g-sidenav-hidden');
          if (toggleNavbarMinimize) {
            toggleNavbarMinimize.click();
            toggleNavbarMinimize.setAttribute("checked", "true");
          }
        } else {
          sidenavShow.classList.remove('g-sidenav-hidden');
          sidenavShow.classList.add('g-sidenav-pinned');
          if (toggleNavbarMinimize) {
            toggleNavbarMinimize.click();
            toggleNavbarMinimize.removeAttribute("checked");
          }
        }
      }
    }
  }


$(document).ready(function(){
    $('#selectall').click(function () {
        $('.checklist-item').prop('checked', this.checked);
    });

    $('.checklist-item').change(function () {
        var check = ($('.checklist-item').filter(":checked").length == $('.checklist-item').length);
        $('#selectall').prop("checked", check);
    });
})