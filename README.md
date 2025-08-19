# segments-example
This is an example of code created by me from my last project. It's not ideal code, still need's some refactoring because it was created for the mvp version.
My task was to create a new application section in existing project according to Figma mockups. Project already used bootstrap and element-plus library. I had 1.5 month's deadline to implement all related features.

This project section uses Vue router, Pinia store and REST Api. It consists of a few pages with all CRUD operations and logic that connects all the instances via Pinia store.

Also project has different localizations using i18n. All translations can be found in appropriate vocabularies.

'Segments' page has a grid with all created instances. Each instance has a link to it's own page and calculated information from BE.

'SegmentPage' has an information and shows all components of this instance.

'SegmentBuilder' works in two modes - add and edit. It allows to create new or edit existing instance bu using library of components and drug and drop functionality.
Clicking on each component opens special tab, where each component can be modified. Components are united in groups. Everything can be changed by places by drug and drop, modified, cloned or deleted.
