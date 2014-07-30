# Changelog

## v1.2 [ API CHANGE! ]
* **Feature**: Added version number to README file
* **Feature**: Added CHANGELOG
* **Feature**: Added alignment support
* **Change**: Removed the possibility to use objects to define options for elements other than popupButton
* **Change**: Added support for option groups in popupButtons, changing the format when defining options as objects
* **Change**: Changed the default value of "display" in the slider params from true to false
* **Change**: Search doesn't change the DOM structure of settings any more
* **Change**: i18n now returns the string you entered instead of undefined if no translation can be found
* **Bug**: Fixed an issue were the search field had the wrong placeholder when "search" had no translation
