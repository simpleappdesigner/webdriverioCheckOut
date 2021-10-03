const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ShopPage extends Page {
     /*
     * define selectors using getter methods
     */
    linkProductName (linkname) { return $('='+linkname) }

}

module.exports = new ShopPage();
