/**
 * Drag and drop module
 * Petar Slavnic
 */
(function(window, angular) {

  'use strict';

  angular.module('angDragNDrop', [])

    .controller('DragAndDropCtrl', function DragAndDropCtrl(dragAndDropService) {
      var dragAndDrop = this;

      dragAndDrop.dragAndDropService = dragAndDropService;

      /**
       * Drag handle exist
       *
       * @returns {boolean}
       */
      dragAndDrop.dragHandlerExist = function() {
        return false;
      };

      /**
       * Toggle drag handle events
       *
       * @param value
       */
      dragAndDrop.toggleDragHandleEvents = function(value) {};

      /**
       * Bind drag events
       */
      dragAndDrop.bindDragEvents = function() {};

      dragAndDrop.unbindDragEvents = function() {};
    })

    .directive('angDragHandle', function angDragHandle() {
      return {
        restrict: "A",
        require: '^angDrag',
        bindToController: true,
        controller: 'DragAndDropCtrl as angDragHandle',
        link: function(scope, elem, attrs, ctrl) {
          var dragHandleClass = "ang-drag-handle";

          /**
           * Mouse down event
           *
           * @param event
           */
          function onMouseDown(event) {
            ctrl.bindDragEvents();
          }

          /**
           * Mouse up event
           *
           * @param event
           */
          function onMouseUp(event) {
            ctrl.unbindDragEvents();
          }

          /**
           * Bind drag handle events
           */
          function bindDragHandleEvents() {
            elem.addClass(dragHandleClass);
            elem.bind('mousedown', onMouseDown);
            elem.bind('mouseup', onMouseUp);
          }

          /**
           * Unbind drag handle events
           */
          function unbindDragHandleEvents() {
            elem.removeClass(dragHandleClass);
            elem.unbind('mousedown', onMouseDown);
            elem.unbind('mouseup', onMouseUp);
          }

          /**
           * Registered toggle drag handle events
           *
           * @param value
           * @returns {*}
           */
          ctrl.toggleDragHandleEvents = function(value) {
            return value ? bindDragHandleEvents() : unbindDragHandleEvents();
          };

          /**
           * Return drag handle exist
           *
           * @returns {boolean}
           */
          ctrl.dragHandlerExist = function() {
            return true;
          };
        }
      };
    })

    .directive('angDrag', function angDrag() {
      return {
        restrict: "A",
        bindToController: true,
        controller: 'DragAndDropCtrl as angDrag',
        link: function(scope, elem, attrs, ctrl) {
          var dragData = null;
          var draggingClass = 'ang-dragging';
          var dragHandleClass = "ang-drag-handle";

          /**
           * Drag start event
           *
           * @param event
           */
          function onDragStart(event) {
            elem.addClass(draggingClass);
            ctrl.dragAndDropService.onDragStart(event, dragData);
          }

          /**
           * Drag end event
           *
           * @param event
           */
          function onDragEnd(event) {
            if (ctrl.dragHandlerExist()) {
              unbindDragEvents();
            }
            elem.removeClass(draggingClass);
            ctrl.dragAndDropService.onDragEnd(event, dragData);
          }

          /**
           * Bind drag events
           */
          function bindDragEvents() {
            elem.bind('dragstart', onDragStart);
            elem.bind('dragend', onDragEnd);
            elem.attr('draggable', true);
            elem.addClass(dragHandleClass);
          }

          /**
           * Unbind drag events
           */
          function unbindDragEvents() {
            elem.unbind('dragstart', onDragStart);
            elem.unbind('dragend', onDragEnd);
            elem.attr('draggable', false);
            elem.removeClass(dragHandleClass);
          }

          ctrl.bindDragEvents = bindDragEvents;
          ctrl.unbindDragEvents = unbindDragEvents;

          attrs.$observe('angDragData', function(value) {
            dragData = value.length ? angular.fromJson(value) : null;
          });

          scope.$watch(attrs.angDrag, function(newValue) {
            if (ctrl.dragHandlerExist()) {
              ctrl.toggleDragHandleEvents(newValue);
            } else {
              return newValue ? bindDragEvents() : unbindDragEvents();
            }
          });
        }
      };
    })

    .directive('angDrop', function angDrop() {
      return {
        restrict: 'A',
        bindToController: true,
        controller: "DragAndDropCtrl as angDrop",
        link: function(scope, elem, attrs, ctrl) {
          var dropData = null;
          var dragOverClass = "ang-drag-over";
          var acceptDropClass = "ang-accept-drop";

          /**
           * Drag enter event
           *
           * @param event
           */
          function onDragEnter(event) {
            elem.addClass(dragOverClass);
            ctrl.dragAndDropService.onDragEnter(event, dropData);
          }

          /**
           * Drag over event
           *
           * @param event
           * @returns {boolean}
           */
          function onDragOver(event) {
            if (event.preventDefault) {
              event.preventDefault(); // Necessary. Allows us to drop.
            }

            elem.addClass(dragOverClass);

            event.dataTransfer.dropEffect = 'move';

            ctrl.dragAndDropService.onDragOver(event, dropData);

            return false;
          }

          /**
           * Drag leave event
           *
           * @param event
           */
          function onDragLeave(event) {
            elem.removeClass(dragOverClass);
            ctrl.dragAndDropService.onDragLeave(event, dropData);
          }

          /**
           * Drop event
           *
           * @param event
           * @returns {boolean}
           */
          function onDrop(event) {
            if (event.stopPropagation) {
              event.stopPropagation(); // stops the browser from redirecting.
            }

            elem.removeClass(dragOverClass);

            ctrl.dragAndDropService.onDrop(event, dropData);

            return false;
          }

          /**
           * Bind drop events
           */
          function bindDropEvents() {
            elem.bind('dragenter', onDragEnter);
            elem.bind('dragleave', onDragLeave);
            elem.bind('dragover', onDragOver);
            elem.bind('drop', onDrop);
            elem.addClass(acceptDropClass);
          }

          /**
           * Unbind drop events
           */
          function unbindDropEvents() {
            elem.unbind('dragenter', onDragEnter);
            elem.unbind('dragleave', onDragLeave);
            elem.unbind('dragover', onDragOver);
            elem.unbind('drop', onDrop);
            elem.removeClass(acceptDropClass);
          }

          attrs.$observe('angDropData', function(value) {
            dropData = value.length ? angular.fromJson(value) : null;
          });

          scope.$watch(attrs.angDrop, function(newValue) {
            return newValue ? bindDropEvents() : unbindDropEvents();
          });
        }
      };
    })

    .service('dragAndDropService', function DragAndDropService() {
      var dragAndDropService = this;

      /**
       * Drag start event
       *
       * @param event
       * @param dragData
       */
      dragAndDropService.onDragStart = function(event, dragData) {};

      /**
       * Drag event
       *
       * @param event
       * @param dragData
       */
      dragAndDropService.onDrag = function(event, dragData) {};

      /**
       * Drag enter event
       *
       * @param event
       * @param dropData
       */
      dragAndDropService.onDragEnter = function(event, dropData) {};

      /**
       * Drag over event
       *
       * @param event
       * @param dropData
       */
      dragAndDropService.onDragOver = function(event, dropData) {};

      /**
       * Drag leave event
       *
       * @param event
       * @param dropData
       */
      dragAndDropService.onDragLeave = function(event, dropData) {};

      /**
       * Drop event
       *
       * @param event
       * @param dropData
       */
      dragAndDropService.onDrop = function(event, dropData) {};

      /**
       * Drag end event
       *
       * @param event
       * @param dragData
       */
      dragAndDropService.onDragEnd = function(event, dragData) {};
    });

}(window, angular));
