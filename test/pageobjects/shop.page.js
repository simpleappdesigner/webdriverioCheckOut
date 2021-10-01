const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ShopPage extends Page {
     /*
     * define selectors using getter methods
     */
    linkProductName (linkname) { return $('='+linkname) }

   //get inputPassword () { return $('#password') }
   //get btnSubmit () { return $('button[type="submit"]') }
}

module.exports = new ShopPage();
