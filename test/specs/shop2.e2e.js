var webdriverio = require('webdriverio');

const ShopPage = require('../pageobjects/shop.page');
const ProductPage = require('../pageobjects/product.page');
const ConfigData =require('../TestData/config_data');
const CartPage = require('../pageobjects/cart.page');
const CheckOut = require('../pageobjects/checkout.page');
const CheckoutData =require('../TestData/check_out_data');

describe('Add products to Cart-shop2', async () => {
    it('Add a product shop2', async function() {
      
        //this.retries(2);
        //await browser.maximizeWindow();
        await browser.url("/shop");

        browser.maximizeWindow();
        
        var cost_to_cart_list=[];
        var browser_name=await browser.capabilities['browserName'];

        // add some other product
        const product_02 = await ShopPage.linkProductName(ConfigData.product_name_3);
        product_02.click();
        //add_a_product_to_cart(putter_len,color_f,how_many)
        cost_to_cart_list.push(
        await ProductPage.add_a_product_to_cart('36"','Red',1));
        //end of adding a product

         // add some other product
         var randomBoolean = Math.random() < 0.5;
         var browser_name=await browser.capabilities['browserName'];
        // if (browser_name.includes('chrome'))
        // {
        //     randomBoolean=true;
        // }
        
         if (randomBoolean) {
            const product_04 = await ShopPage.linkProductName(ConfigData.product_name_4);
            product_04.click();
            //add_a_product_to_cart(putter_len,color_f,how_many)
            cost_to_cart_list.push(
            await ProductPage.add_a_product_to_cart('35"','Oranage',1)
            );
         }
         else
         {
            // add some other product
            const product_01 = await ShopPage.linkProductName(ConfigData.product_name_1);
            product_01.click();
            //add_a_product_to_cart(putter_len,color_f,how_many)
            cost_to_cart_list.push(
            await ProductPage.add_a_product_to_cart('34.5"','Red',1)
            );
         }

         //end of adding a product

         //click on menu cart
         await ProductPage.get_menucart.click();
         // Validate the cart
         // return [ct_subtotal,ct_flat_rate,ct_tax,ct_total,calculated_total];
         var cart_stat=await CartPage.validate_cart();

         //calculate the cost of total items added to cart
         var total_cost_cart=0
        for (let i=0;i<cost_to_cart_list.length;i++)
        {
        total_cost_cart+=cost_to_cart_list[i];
        }
        console.log(`Cost of added items to cart: ${total_cost_cart} , and the cart shows subtotal as ${cart_stat[0]}. These two should match!`);
        expect(total_cost_cart).toHaveValue(cart_stat[0]);

        //browser.pause(8000);
        var proceed_to_checkout= await CartPage.link_proceed_checkout;
        await proceed_to_checkout.waitForClickable({ timeout: 8000 });
        await proceed_to_checkout.click();
        //await CartPage.link_proceed_checkout.click();
        
       
        var check_out_invoice = await CheckOut.review_cart();  //return [ct_subtotal,ct_flat_rate,ct_tax,ct_total,calculated_total];

        // expect subtotal matches between cart and order
        expect(cart_stat[0]).toHaveValue(check_out_invoice[0]);

        // expect total matches
        expect(cart_stat[3]).toHaveValue(check_out_invoice[3]);

        // data feed strategy level - simple/raw
        var billing_data={};
        billing_data['fname']=CheckoutData.fname //"John";
        billing_data['lname']= CheckoutData.lname//"Smith";
        billing_data['country']=CheckoutData.country//"Canada";
        billing_data['line1']=CheckoutData.line1//"Some test address";
        billing_data['city']=CheckoutData.city//"Toronto";
        billing_data['state']=CheckoutData.state//"Ontario";
        billing_data['post']=CheckoutData.post//"M2J 0A3";
        billing_data['phone']=CheckoutData.phone//"123456789";
        billing_data['email']=CheckoutData.email//"simpleappdesigner@gmail.com";
        billing_data['message']=`The value for this order is ${cart_stat[3]}. \n Name : ${billing_data['fname']} ${billing_data['lname']}. Test case# shop2.e2e.js \n Browser: ${browser_name}.`;
        billing_data['cc']=CheckoutData.cc//"4242424242424242";
        billing_data['exp']=CheckoutData.exp//"1231";
        billing_data['cvc']=CheckoutData.cvc//"346";
        billing_data['screen_snap']="xx";
        
        await CheckOut.fill_billing_info(billing_data);

        await browser.pause(5000);
        var browser_name=await browser.capabilities['browserName'];
        await browser.saveScreenshot('./Screensnaps/' +'shop2.e2e.js ' + browser_name + '_screenshot.png');
  
        //uncomment the below lines for submitting the order
        if (ConfigData.process_the_checkout)
            {
                var place_order = await CheckOut.btn_place_order.isClickable();
                await place_order.click();
            }
        //await browser.pause(10000);
        
    });

});