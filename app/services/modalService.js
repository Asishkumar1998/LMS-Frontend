angular.module("myApp")
.factory("ModalService", function($q, $rootScope, $compile, $timeout) {

  // function showMessage(type, message, duration = 2000) {
  //   // Toast-style modal
  //   var deferred = $q.defer();

  //   var modalEl = angular.element(`
  //     <div class="modal fade" tabindex="-1" style="position:fixed; top:60px;left:50%;transform:translateX(-50%);width:auto;pointer-events:none;z-index:2000;">
  //       <div class="modal-dialog" style="margin:0;">
  //         <div class="modal-content border-0 shadow rounded-3">
  //           <div class="modal-body text-center  p-3 ${type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}">
  //             <p class="fs-6 mb-0">${message}</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   $compile(modalEl)($rootScope);
  //   angular.element(document.body).append(modalEl);

  //   var modal = new bootstrap.Modal(modalEl[0], { backdrop: false, keyboard: false });
  //   modal.show();

  //   $timeout(() => {
  //     modal.hide();
  //   }, duration);

  //   modalEl[0].addEventListener("hidden.bs.modal", function() {
  //     modalEl.remove();
  //     deferred.resolve();
  //   });

  //   return deferred.promise;
  // }

  function showMessage(type, message, duration = 2000) {
  var deferred = $q.defer();

  // Create toast-style floating message
  var modalEl = angular.element(`
    <div class="modal fade" tabindex="-1"
         style="position:fixed; top:80px; left:50%; transform:translateX(-50%);
                width:auto; pointer-events:none; z-index:2000;">
      <div class="modal-dialog" style="margin:0;">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-body text-center p-3 ${type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}">
            <p class="mb-0">${message}</p>
          </div>
        </div>
      </div>
    </div>
  `);

  $compile(modalEl)($rootScope);
  angular.element(document.body).append(modalEl);

  
  $timeout(function() {
    var modal = new bootstrap.Modal(modalEl[0], {
      backdrop: false,
      keyboard: false
    });
    modal.show();

    
    $timeout(function() {
      modal.hide();
    }, duration);

    modalEl[0].addEventListener("hidden.bs.modal", function() {
      modalEl.remove();
      deferred.resolve();
    });
  }, 10); 

  return deferred.promise;
}


  function confirm(message, title = "Confirm") {
    var deferred = $q.defer();

    var modalEl = angular.element(`
      <div class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow rounded-3">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title">${title}</h5>
              
            </div>
            <div class="modal-body">
              <p>${message}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" id="okBtn">OK</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `);

    $compile(modalEl)($rootScope);
    angular.element(document.body).append(modalEl);

    var modal = new bootstrap.Modal(modalEl[0], { backdrop: 'static', keyboard: false });
    modal.show();

    modalEl[0].querySelector("#okBtn").addEventListener("click", function() {
      deferred.resolve(true);
      modal.hide();
    });

    modalEl[0].addEventListener("hidden.bs.modal", function() {
      modalEl.remove();
      deferred.resolve(false); // canceled or closed
    });

    return deferred.promise;
  }

  function confirmOrder(message, title = "Confirm Order") {
    var deferred = $q.defer();

    var modalEl = angular.element(`
      <div class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow rounded-3">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title">${title}</h5>
            </div>
            <div class="modal-body text-center">
              <p class="fs-6">${message}</p>
            </div>
            <div class="modal-footer justify-content-center">
              <button type="button" class="btn btn-success text-white fw-semibold" id="okBtn">Yes, Confirm</button>
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `);

    $compile(modalEl)($rootScope);
    angular.element(document.body).append(modalEl);

    var modal = new bootstrap.Modal(modalEl[0], { backdrop: 'static', keyboard: false });
    modal.show();

    modalEl[0].querySelector("#okBtn").addEventListener("click", function() {
      deferred.resolve(true);
      modal.hide();
    });

    modalEl[0].addEventListener("hidden.bs.modal", function() {
      modalEl.remove();
      deferred.resolve(false);
    });

    return deferred.promise;
  }

  return {
    showMessage: showMessage,
    confirm: confirm,
    confirmOrder: confirmOrder
  };
});
