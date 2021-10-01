const Page = require('./page');
const CartPage=require('../pageobjects/cart.page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ProductPage extends Page {
     /*
     * define selectors using getter methods
     */
     get dropedownPutterLength () { return $('#putter-length') }
     get dropedownColorFill () { return $('#color-fill') }
     get btn_addtocart () { return $('button=Add to cart') }

     get label_in_stock () { return $('p=In stock') }

     get add_plus_one () {return $('a=+')}
     get add_minus_one () {return $('a=-')}

     get get_menucart () {return $('a.wcmenucart')}
   

   async add_a_product_to_cart(putter_len,color_f,how_many){
     //get the price
        var price_tag = await $('p.price');
        var bdi_tag=await price_tag.$('bdi');
        var bdi_html=await bdi_tag.getHTML(false);
        var reg_dollar=/(.*[</span>]+)/ig;
        var bdi_dollar_value= parseFloat(bdi_html.replace(reg_dollar,"")); 

        const putter_length=await this.dropedownPutterLength;
        await putter_length.click();
        await putter_length.selectByVisibleText(putter_len);
        //await browser.keys("\uE006");
        var browser_name=await browser.capabilities['browserName'];
        //if (browser_name.includes('chrome'))
        //  await browser.keys("\uE007");
        

        // select putter color

        const putter_color=await this.dropedownColorFill;
        if (await putter_color.isExisting()){ // only fill if present
          await putter_color.click();
          await putter_color.selectByVisibleText(color_f);
          //browser.keys('enter');
          browser.keys("\uE007");  //fix FF
        }

        var in_stock_label=await this.label_in_stock;
        let product_in_stock = await in_stock_label.isDisplayed();
        var actually_added=1
        if (product_in_stock) { //if instock if displayed
            const plus_one = await this.add_plus_one;
            var plus_one_clickable = await plus_one.isClickable();

            for (let i = 0; i < how_many && product_in_stock && plus_one_clickable; i++) {
              plus_one.click();
              actually_added+=1;
              product_in_stock = await in_stock_label.isDisplayed();
              plus_one_clickable = await plus_one.isClickable();
              browser.pause(2000);

            }
            var add_to_cart = await this.btn_addtocart;
            await add_to_cart.click();
        }
     
        await CartPage.link_continue_shopping.click();

        //return the total cost, i.e. price times actually added
        return bdi_dollar_value * actually_added;

   }
}

module.exports = new ProductPage();