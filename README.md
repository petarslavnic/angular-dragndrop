#HTML5 Drag and Drop AngularJS module
=================

It use service to expose events to controller.

##Usage

* `npm install angular-dragndrop`
* Reference `angular-dragndrop.min.js` in your application as:

```
<script src="components/angular-dragdrop/src/angular-dragndrop.min.js"></script>
```
* Resolve the dependency in the main module of your application as:
```
angular.module('myApp', ['angDragNDrop'])
```
* Drag anything as:

```
<span ang-drag="true" ang-drag-data="{object}">Drag me to your place :)</span>
```

##Draggable directive
* **ang-drag** – A custom angular attribute to make any element draggable. Value can be true or false.
* **ang-drag-data** – Object, or some other value.

##Draggable handle directive
* **ang-drag-handle** – A custom attribute for element who represent draggable handler inside element who need to be dragged.

##Droppable directive
* **ang-drop** - A custom attribute to make any element a area for dopping draggable elements.
